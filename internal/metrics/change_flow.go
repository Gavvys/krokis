package metrics

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

const dateLayout = "2006-01-02"

var taskCheckboxPattern = regexp.MustCompile(`(?m)^\s*- \[([ xX])\]`)

type ChangeFlowMetrics struct {
	ActiveWIP         int                 `json:"active_wip"`
	Changes           []ChangeFlowRecord  `json:"changes"`
	MonthlyThroughput []MonthlyThroughput `json:"monthly_throughput"`
}

type ChangeFlowRecord struct {
	Name           string         `json:"name"`
	Status         string         `json:"status"`
	CreatedDate    string         `json:"created_date,omitempty"`
	CompletedDate  string         `json:"completed_date,omitempty"`
	AgeDays        *int           `json:"age_days,omitempty"`
	CycleTimeDays  *int           `json:"cycle_time_days,omitempty"`
	PlanningHealth PlanningHealth `json:"planning_health"`
}

type PlanningHealth struct {
	ProposalPresent bool `json:"proposal_present"`
	SpecsPresent    bool `json:"specs_present"`
	DesignPresent   bool `json:"design_present"`
	TasksPresent    bool `json:"tasks_present"`
	CompletedTasks  *int `json:"completed_tasks,omitempty"`
	RemainingTasks  *int `json:"remaining_tasks,omitempty"`
}

type MonthlyThroughput struct {
	Month     string `json:"month"`
	Completed int    `json:"completed"`
}

func gatherChangeFlow(changeRoot string, now time.Time) ChangeFlowMetrics {
	flow := ChangeFlowMetrics{Changes: []ChangeFlowRecord{}, MonthlyThroughput: []MonthlyThroughput{}}
	entries, err := os.ReadDir(changeRoot)
	if err != nil {
		return flow
	}

	monthly := make(map[string]int)
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		if entry.Name() == "archive" {
			archiveEntries, archiveErr := os.ReadDir(filepath.Join(changeRoot, entry.Name()))
			if archiveErr != nil {
				continue
			}
			for _, archived := range archiveEntries {
				if !archived.IsDir() {
					continue
				}
				if record, month, ok := archivedChangeRecord(filepath.Join(changeRoot, entry.Name(), archived.Name()), archived.Name()); ok {
					flow.Changes = append(flow.Changes, record)
					monthly[month]++
				}
			}
			continue
		}

		record := changeRecord(filepath.Join(changeRoot, entry.Name()), entry.Name(), "active", now)
		flow.Changes = append(flow.Changes, record)
		flow.ActiveWIP++
	}

	for month, completed := range monthly {
		flow.MonthlyThroughput = append(flow.MonthlyThroughput, MonthlyThroughput{Month: month, Completed: completed})
	}
	sort.Slice(flow.MonthlyThroughput, func(i, j int) bool {
		return flow.MonthlyThroughput[i].Month < flow.MonthlyThroughput[j].Month
	})
	sort.Slice(flow.Changes, func(i, j int) bool {
		if flow.Changes[i].Status != flow.Changes[j].Status {
			return flow.Changes[i].Status == "active"
		}
		return flow.Changes[i].Name < flow.Changes[j].Name
	})
	return flow
}

func archivedChangeRecord(path, directory string) (ChangeFlowRecord, string, bool) {
	if len(directory) < len("2006-01-02-") {
		return ChangeFlowRecord{}, "", false
	}
	completedAt, err := time.Parse(dateLayout, directory[:len(dateLayout)])
	if err != nil || directory[len(dateLayout)] != '-' {
		return ChangeFlowRecord{}, "", false
	}

	record := changeRecord(path, directory[len(dateLayout)+1:], "completed", completedAt)
	record.CompletedDate = completedAt.Format(dateLayout)
	if createdAt, ok := readCreatedDate(path); ok && !completedAt.Before(createdAt) {
		cycleDays := wholeDaysBetween(createdAt, completedAt)
		record.CycleTimeDays = &cycleDays
	}
	return record, completedAt.Format("2006-01"), true
}

func changeRecord(path, name, status string, now time.Time) ChangeFlowRecord {
	record := ChangeFlowRecord{Name: name, Status: status, PlanningHealth: readPlanningHealth(path)}
	if createdAt, ok := readCreatedDate(path); ok {
		record.CreatedDate = createdAt.Format(dateLayout)
		if status == "active" && !now.Before(createdAt) {
			ageDays := wholeDaysBetween(createdAt, now)
			record.AgeDays = &ageDays
		}
	}
	return record
}

func readCreatedDate(changePath string) (time.Time, bool) {
	data, err := os.ReadFile(filepath.Join(changePath, ".openspec.yaml"))
	if err != nil {
		return time.Time{}, false
	}
	for _, line := range strings.Split(string(data), "\n") {
		key, value, found := strings.Cut(line, ":")
		if !found || strings.TrimSpace(key) != "created" {
			continue
		}
		createdAt, parseErr := time.Parse(dateLayout, strings.Trim(strings.TrimSpace(value), "\"'"))
		return createdAt, parseErr == nil
	}
	return time.Time{}, false
}

func readPlanningHealth(changePath string) PlanningHealth {
	health := PlanningHealth{
		ProposalPresent: fileExists(filepath.Join(changePath, "proposal.md")),
		SpecsPresent:    hasSpecFile(filepath.Join(changePath, "specs")),
		DesignPresent:   fileExists(filepath.Join(changePath, "design.md")),
		TasksPresent:    fileExists(filepath.Join(changePath, "tasks.md")),
	}
	if !health.TasksPresent {
		return health
	}
	data, err := os.ReadFile(filepath.Join(changePath, "tasks.md"))
	if err != nil {
		return health
	}
	completed, remaining := 0, 0
	for _, match := range taskCheckboxPattern.FindAllStringSubmatch(string(data), -1) {
		if strings.EqualFold(match[1], "x") {
			completed++
		} else {
			remaining++
		}
	}
	health.CompletedTasks = &completed
	health.RemainingTasks = &remaining
	return health
}

func hasSpecFile(specRoot string) bool {
	found := false
	_ = filepath.Walk(specRoot, func(path string, info os.FileInfo, err error) error {
		if err == nil && !info.IsDir() && filepath.Ext(path) == ".md" {
			found = true
			return filepath.SkipDir
		}
		return nil
	})
	return found
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func wholeDaysBetween(start, end time.Time) int {
	startDay := time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0, time.UTC)
	endDay := time.Date(end.Year(), end.Month(), end.Day(), 0, 0, 0, 0, time.UTC)
	return int(endDay.Sub(startDay).Hours() / 24)
}
