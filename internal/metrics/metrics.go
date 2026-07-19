package metrics

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

type TelemetryData struct {
	Git      GitMetrics    `json:"git"`
	Codebase CodeMetrics   `json:"codebase"`
	Quality  QualityMetrics `json:"quality"`
}

type GitMetrics struct {
	TotalCommits  int          `json:"total_commits"`
	RecentCommits int          `json:"recent_commits"` // past 14 days
	Authors       []AuthorStat `json:"authors"`
	History       []CommitInfo `json:"history"`
}

type AuthorStat struct {
	Name    string `json:"name"`
	Commits int    `json:"commits"`
}

type CommitInfo struct {
	Hash    string `json:"hash"`
	Date    string `json:"date"`
	Author  string `json:"author"`
	Message string `json:"message"`
}

type CodeMetrics struct {
	TotalFiles int        `json:"total_files"`
	TotalLines int        `json:"total_lines"`
	Breakdown  []LangStat `json:"breakdown"`
}

type LangStat struct {
	Extension string `json:"extension"`
	Files     int    `json:"files"`
	Lines     int    `json:"lines"`
}

type QualityMetrics struct {
	LintIssues int          `json:"lint_issues"`
	Tests      TestReport   `json:"tests"`
}

type TestReport struct {
	Total    int `json:"total"`
	Passed   int `json:"passed"`
	Failed   int `json:"failed"`
	Skipped  int `json:"skipped"`
}

// Gather Git, Codebase, and Quality telemetry
func Gather(testFile, lintFile string) (*TelemetryData, error) {
	data := &TelemetryData{}

	// Gather git metrics
	if err := gatherGitMetrics(&data.Git); err != nil {
		// Log but do not fail if git fails (e.g. no commits yet)
		fmt.Printf("Warning: Failed to gather Git metrics: %v\n", err)
	}

	// Gather code metrics
	if err := gatherCodeMetrics(&data.Codebase); err != nil {
		return nil, fmt.Errorf("failed to gather codebase metrics: %w", err)
	}

	// Gather quality metrics
	gatherQualityMetrics(&data.Quality, testFile, lintFile)

	return data, nil
}

func gatherGitMetrics(git *GitMetrics) error {
	// 1. Get recent commit history
	cmd := exec.Command("git", "log", `--pretty=format:%h|%aI|%an|%s`, "-n", "100")
	out, err := cmd.Output()
	if err != nil {
		return err
	}

	lines := strings.Split(string(out), "\n")
	if len(lines) == 1 && lines[0] == "" {
		return nil // empty history
	}

	now := time.Now()
	authorMap := make(map[string]int)

	for _, line := range lines {
		parts := strings.SplitN(line, "|", 4)
		if len(parts) < 4 {
			continue
		}
		info := CommitInfo{
			Hash:    parts[0],
			Date:    parts[1],
			Author:  parts[2],
			Message: parts[3],
		}
		git.History = append(git.History, info)

		// Author commit counts
		authorMap[info.Author]++

		// Check if recent (within 14 days)
		if parsedDate, err := time.Parse(time.RFC3339, info.Date); err == nil {
			if now.Sub(parsedDate) < 14*24*time.Hour {
				git.RecentCommits++
			}
		}
	}

	git.TotalCommits = len(lines)

	// Populate authors array
	for name, count := range authorMap {
		git.Authors = append(git.Authors, AuthorStat{Name: name, Commits: count})
	}

	return nil
}

func gatherCodeMetrics(code *CodeMetrics) error {
	langMap := make(map[string]*LangStat)

	err := filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			// Skip hidden dirs, node_modules, openspec, etc.
			name := info.Name()
			if strings.HasPrefix(name, ".") && name != "." {
				return filepath.SkipDir
			}
			if name == "node_modules" || name == "vendor" || name == "openspec" {
				return filepath.SkipDir
			}
			return nil
		}

		ext := strings.ToLower(filepath.Ext(path))
		if ext == "" {
			return nil
		}

		// Count files and lines
		code.TotalFiles++
		lines, err := countLines(path)
		if err != nil {
			return nil // skip unreadable files
		}
		code.TotalLines += lines

		stat, ok := langMap[ext]
		if !ok {
			stat = &LangStat{Extension: ext}
			langMap[ext] = stat
		}
		stat.Files++
		stat.Lines += lines

		return nil
	})

	if err != nil {
		return err
	}

	for _, stat := range langMap {
		code.Breakdown = append(code.Breakdown, *stat)
	}

	return nil
}

func countLines(path string) (int, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, err
	}
	return strings.Count(string(data), "\n") + 1, nil
}

// Simple parser for standard reports
type jUnitTestSuite struct {
	Tests    int `xml:"tests,attr"`
	Failures int `xml:"failures,attr"`
	Errors   int `xml:"errors,attr"`
	Skipped  int `xml:"skipped,attr"`
}

type jUnitTestSuites struct {
	XMLName  xml.Name         `xml:"testsuites"`
	Suites   []jUnitTestSuite `xml:"testsuite"`
	Tests    int              `xml:"tests,attr"`
	Failures int              `xml:"failures,attr"`
	Errors   int              `xml:"errors,attr"`
	Skipped  int              `xml:"skipped,attr"`
}

func gatherQualityMetrics(q *QualityMetrics, testFile, lintFile string) {
	// Parse Lints (naive check: count entries if JSON list, or scan for "violations" or just count lines in simple outputs)
	if lintFile != "" {
		if data, err := os.ReadFile(lintFile); err == nil {
			// If it's an eslint / golangci-lint array
			var items []interface{}
			if err := json.Unmarshal(data, &items); err == nil {
				q.LintIssues = len(items)
			} else {
				// Fallback: count occurrences of "error" or lines
				q.LintIssues = strings.Count(string(data), "\n")
			}
		}
	}

	// Parse JUnit XML Tests
	if testFile != "" {
		if data, err := os.ReadFile(testFile); err == nil {
			var suites jUnitTestSuites
			if err := xml.Unmarshal(data, &suites); err == nil {
				// Parse testsuites root
				q.Tests.Total = suites.Tests
				q.Tests.Failed = suites.Failures + suites.Errors
				q.Tests.Skipped = suites.Skipped
				q.Tests.Passed = q.Tests.Total - q.Tests.Failed - q.Tests.Skipped
			} else {
				// Fallback: single testsuite root
				var suite jUnitTestSuite
				if err := xml.Unmarshal(data, &suite); err == nil {
					q.Tests.Total = suite.Tests
					q.Tests.Failed = suite.Failures + suite.Errors
					q.Tests.Skipped = suite.Skipped
					q.Tests.Passed = q.Tests.Total - q.Tests.Failed - q.Tests.Skipped
				}
			}
		}
	}
}
