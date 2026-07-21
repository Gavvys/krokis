package metrics

import (
	"os"
	"path/filepath"
	"testing"
)

func TestGatherCoverageClassifiesRequirements(t *testing.T) {
	root := t.TempDir()
	specsDir := filepath.Join(root, "openspec", "specs")
	mustMkdir(t, filepath.Join(specsDir, "alpha"))
	mustWriteFile(t, filepath.Join(specsDir, "alpha", "spec.md"),
		"# alpha Specification\n\n"+
			"## Purpose\nSample.\n\n"+
			"## Requirements\n\n"+
			"### Requirement: Covered requirement\n"+
			"The dashboard SHALL render `<change-list>` on `#/changes` and expose `gatherChangeFlow`.\n\n"+
			"### Requirement: Partial requirement\n"+
			"The dashboard SHALL reference `<change-list>` and also `<missing-component>`.\n\n"+
			"### Requirement: Uncovered requirement\n"+
			"The dashboard SHALL reference `<only-missing>` and `nonexistentToken`.\n")

	// Create workspace files that mention some identifiers.
	mustWriteFile(t, filepath.Join(root, "web", "app.js"), `const el = document.createElement('change-list'); const route = '#/changes';`)
	mustWriteFile(t, filepath.Join(root, "internal", "metrics", "change_flow.go"), `func gatherChangeFlow() {}`)

	cov := gatherCoverage(specsDir, root)
	if len(cov.Capabilities) != 1 {
		t.Fatalf("capabilities = %d, want 1", len(cov.Capabilities))
	}
	cap := cov.Capabilities[0]
	if cap.Name != "alpha" {
		t.Fatalf("name = %s, want alpha", cap.Name)
	}
	if cap.Requirements != 3 {
		t.Fatalf("requirements = %d, want 3", cap.Requirements)
	}
	if cap.Uncovered != 1 {
		t.Fatalf("uncovered = %d, want 1", cap.Uncovered)
	}
	statusByName := map[string]string{}
	for _, item := range cap.Items {
		statusByName[item.Name] = item.Status
	}
	if statusByName["Covered requirement"] != "covered" {
		t.Fatalf("covered requirement status = %q, want covered", statusByName["Covered requirement"])
	}
	if statusByName["Partial requirement"] != "partial" {
		t.Fatalf("partial requirement status = %q, want partial", statusByName["Partial requirement"])
	}
	if statusByName["Uncovered requirement"] != "uncovered" {
		t.Fatalf("uncovered requirement status = %q, want uncovered", statusByName["Uncovered requirement"])
	}
}

func TestGatherCoverageDefaultsEmptyWhenSpecsMissing(t *testing.T) {
	cov := gatherCoverage(filepath.Join(t.TempDir(), "missing"), t.TempDir())
	if len(cov.Capabilities) != 0 {
		t.Fatalf("capabilities = %d, want 0", len(cov.Capabilities))
	}
}

func TestGatherCoverageCapsMatchedFilesAtThree(t *testing.T) {
	root := t.TempDir()
	specsDir := filepath.Join(root, "openspec", "specs")
	mustMkdir(t, filepath.Join(specsDir, "beta"))
	mustWriteFile(t, filepath.Join(specsDir, "beta", "spec.md"),
		"# beta Specification\n\n"+
			"## Requirements\n\n"+
			"### Requirement: Widespread identifier\n"+
			"The dashboard SHALL reference `scopedIdentifier`.\n")
	// 5 workspace files all mentioning the identifier.
	for i := 0; i < 5; i++ {
		mustWriteFile(t, filepath.Join(root, "pkg"+string(rune('a'+i))+".js"), `scopedIdentifier`)
	}
	cov := gatherCoverage(specsDir, root)
	if len(cov.Capabilities) != 1 || len(cov.Capabilities[0].Items) != 1 {
		t.Fatalf("unexpected coverage shape: %+v", cov)
	}
	item := cov.Capabilities[0].Items[0]
	if len(item.MatchedFiles) > maximumMatchedFiles {
		t.Fatalf("matched files = %d, want <= %d", len(item.MatchedFiles), maximumMatchedFiles)
	}
	if len(item.MatchedFiles) != maximumMatchedFiles {
		t.Fatalf("matched files = %d, want exactly %d when there are more matches than the cap", len(item.MatchedFiles), maximumMatchedFiles)
	}
}

// reuse the existing test fixture helpers from change_flow_test.go via the
// package-shared mustMkdir / mustWriteFile.
func TestGatherCoverageIgnoresMalformedSpec(t *testing.T) {
	root := t.TempDir()
	specsDir := filepath.Join(root, "openspec", "specs")
	mustMkdir(t, filepath.Join(specsDir, "no-requirements"))
	mustWriteFile(t, filepath.Join(specsDir, "no-requirements", "spec.md"), `# no-requirements Specification

## Purpose
Empty spec that has no requirement headers.
`)
	cov := gatherCoverage(specsDir, root)
	if len(cov.Capabilities) != 1 {
		t.Fatalf("capabilities = %d, want 1", len(cov.Capabilities))
	}
	cap := cov.Capabilities[0]
	if cap.Requirements != 0 || cap.Covered != 0 || cap.Uncovered != 0 {
		t.Fatalf("expected zeroed counts, got %+v", cap)
	}
}

// mustMkdir and mustWriteFile are duplicated with change_flow_test.go but live
// in the same package, so they are shared. We redeclare them here only for
// clarity of imports — commented out to avoid duplicate declarations.
//
// (n.b. the helpers defined in change_flow_test.go are already package-scoped.)
var _ = os.Stat