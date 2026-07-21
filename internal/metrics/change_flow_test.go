package metrics

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestGatherChangeFlowCollectsActiveAndArchivedChanges(t *testing.T) {
	root := t.TempDir()
	writeChangeFixture(t, filepath.Join(root, "active-change"), "2026-07-10", true)
	writeChangeFixture(t, filepath.Join(root, "archive", "2026-07-15-finished-change"), "2026-07-01", false)

	flow := gatherChangeFlow(root, time.Date(2026, time.July, 20, 12, 0, 0, 0, time.UTC))

	if flow.ActiveWIP != 1 {
		t.Fatalf("active WIP = %d, want 1", flow.ActiveWIP)
	}
	if len(flow.Changes) != 2 {
		t.Fatalf("change count = %d, want 2", len(flow.Changes))
	}
	active := flow.Changes[0]
	if active.Name != "active-change" || active.Status != "active" {
		t.Fatalf("active record = %+v", active)
	}
	if active.AgeDays == nil || *active.AgeDays != 10 {
		t.Fatalf("active age = %v, want 10", active.AgeDays)
	}
	if active.PlanningHealth.CompletedTasks == nil || *active.PlanningHealth.CompletedTasks != 1 {
		t.Fatalf("completed tasks = %v, want 1", active.PlanningHealth.CompletedTasks)
	}
	if active.PlanningHealth.RemainingTasks == nil || *active.PlanningHealth.RemainingTasks != 1 {
		t.Fatalf("remaining tasks = %v, want 1", active.PlanningHealth.RemainingTasks)
	}

	completed := flow.Changes[1]
	if completed.Name != "finished-change" || completed.CompletedDate != "2026-07-15" {
		t.Fatalf("completed record = %+v", completed)
	}
	if completed.CycleTimeDays == nil || *completed.CycleTimeDays != 14 {
		t.Fatalf("cycle time = %v, want 14", completed.CycleTimeDays)
	}
	if len(flow.MonthlyThroughput) != 1 || flow.MonthlyThroughput[0].Month != "2026-07" || flow.MonthlyThroughput[0].Completed != 1 {
		t.Fatalf("monthly throughput = %+v", flow.MonthlyThroughput)
	}
}

func TestGatherChangeFlowPreservesUnavailableData(t *testing.T) {
	root := t.TempDir()
	changePath := filepath.Join(root, "missing-data")
	mustMkdir(t, changePath)
	mustWriteFile(t, filepath.Join(changePath, ".openspec.yaml"), "schema: spec-driven\ncreated: not-a-date\n")

	flow := gatherChangeFlow(root, time.Date(2026, time.July, 20, 0, 0, 0, 0, time.UTC))
	if len(flow.Changes) != 1 {
		t.Fatalf("change count = %d, want 1", len(flow.Changes))
	}
	record := flow.Changes[0]
	if record.AgeDays != nil || record.CreatedDate != "" {
		t.Fatalf("invalid created date must be unavailable: %+v", record)
	}
	if record.PlanningHealth.TasksPresent || record.PlanningHealth.CompletedTasks != nil || record.PlanningHealth.RemainingTasks != nil {
		t.Fatalf("missing task data must be unavailable: %+v", record.PlanningHealth)
	}
}

func TestGatherChangeFlowHandlesEmptyWorkspace(t *testing.T) {
	flow := gatherChangeFlow(filepath.Join(t.TempDir(), "missing"), time.Now())
	if flow.ActiveWIP != 0 || len(flow.Changes) != 0 || len(flow.MonthlyThroughput) != 0 {
		t.Fatalf("empty flow = %+v", flow)
	}
}

func TestGatherChangeFlowPopulatesArtifactMap(t *testing.T) {
	root := t.TempDir()
	writeChangeFixture(t, filepath.Join(root, "populated"), "2026-07-10", true)
	writeChangeFixture(t, filepath.Join(root, "sparse", ".openspec.yaml"), "2026-07-12", false)
	// overwrite the sparse change to drop everything except .openspec.yaml
	sparse := filepath.Join(root, "sparse")
	mustWriteFile(t, filepath.Join(sparse, "proposal.md"), "only proposal\n")
	// remove the design/tasks/specs that the fixture wrote
	for _, name := range []string{"design.md", "tasks.md", "specs"} {
		_ = os.RemoveAll(filepath.Join(sparse, name))
	}

	flow := gatherChangeFlow(root, time.Date(2026, time.July, 20, 12, 0, 0, 0, time.UTC))

	populated, ok := flow.ArtifactMap["populated"]
	if !ok {
		t.Fatalf("populated change missing from artifact map: %+v", flow.ArtifactMap)
	}
	want := []string{"design.md", "proposal.md", "specs/flow/spec.md", "tasks.md"}
	if !equalSlices(populated, want) {
		t.Fatalf("populated artifacts = %v, want %v", populated, want)
	}

	sparseArtifacts, ok := flow.ArtifactMap["sparse"]
	if !ok {
		t.Fatalf("sparse change missing from artifact map: %+v", flow.ArtifactMap)
	}
	wantSparse := []string{"proposal.md"}
	if !equalSlices(sparseArtifacts, wantSparse) {
		t.Fatalf("sparse artifacts = %v, want %v", sparseArtifacts, wantSparse)
	}
}

func equalSlices(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func TestGatherChangeFlowIgnoresMalformedArchiveDirectory(t *testing.T) {
	root := t.TempDir()
	writeChangeFixture(t, filepath.Join(root, "archive", "bad-finished-change"), "2026-07-01", false)

	flow := gatherChangeFlow(root, time.Now())
	if len(flow.Changes) != 0 || len(flow.MonthlyThroughput) != 0 {
		t.Fatalf("malformed archive must not be counted: %+v", flow)
	}
}

func writeChangeFixture(t *testing.T, path, created string, includeSpecs bool) {
	t.Helper()
	mustMkdir(t, path)
	mustWriteFile(t, filepath.Join(path, ".openspec.yaml"), "schema: spec-driven\ncreated: "+created+"\n")
	mustWriteFile(t, filepath.Join(path, "proposal.md"), "proposal\n")
	mustWriteFile(t, filepath.Join(path, "design.md"), "design\n")
	mustWriteFile(t, filepath.Join(path, "tasks.md"), "- [x] done\n- [ ] remaining\n")
	if includeSpecs {
		mustWriteFile(t, filepath.Join(path, "specs", "flow", "spec.md"), "spec\n")
	}
}

func mustMkdir(t *testing.T, path string) {
	t.Helper()
	if err := os.MkdirAll(path, 0o755); err != nil {
		t.Fatal(err)
	}
}

func mustWriteFile(t *testing.T, path, contents string) {
	t.Helper()
	mustMkdir(t, filepath.Dir(path))
	if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
		t.Fatal(err)
	}
}
