package cmd

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunInitCreatesFilesOnFreshWorkspace(t *testing.T) {
	restore := chdirTemp(t)
	defer restore()

	if err := os.MkdirAll(".git", 0755); err != nil {
		t.Fatal(err)
	}

	if failures := runInit(false, true); failures != 0 {
		t.Fatalf("runInit returned %d, want 0", failures)
	}
	for _, rel := range []string{
		".krokis/config.toml",
		".krokis/wiki/DEPENDENCY_MAP.mdx",
		".krokis/wiki/USER_MANUAL.mdx",
		".agents/skills/krokis/SKILL.md",
		".agents/skills/krokis/references/plan-discipline.md",
		".krokis/wiki/WIKI_INDEX.mdx",
		"openapi.yaml",
	} {
		if _, err := os.Stat(rel); err != nil {
			t.Fatalf("expected %s to exist, got %v", rel, err)
		}
	}
}

func TestRunInitSkipsExistingFiles(t *testing.T) {
	restore := chdirTemp(t)
	defer restore()

	if err := os.MkdirAll(".git", 0755); err != nil {
		t.Fatal(err)
	}

	// Pre-seed the workspace with a custom config and one wiki template.
	if err := os.MkdirAll(".krokis", 0755); err != nil {
		t.Fatal(err)
	}
	customConfig := "# my custom config\n"
	if err := os.WriteFile(".krokis/config.toml", []byte(customConfig), 0644); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(".krokis/wiki", 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(".krokis/wiki/DEPENDENCY_MAP.mdx", []byte("# custom\n"), 0644); err != nil {
		t.Fatal(err)
	}

	if failures := runInit(false, true); failures != 0 {
		t.Fatalf("runInit returned %d, want 0", failures)
	}

	// Pre-existing files must be unchanged.
	got, err := os.ReadFile(".krokis/config.toml")
	if err != nil {
		t.Fatal(err)
	}
	if string(got) != customConfig {
		t.Fatalf("config.toml was overwritten: got %q want %q", string(got), customConfig)
	}
	gotWiki, err := os.ReadFile(".krokis/wiki/DEPENDENCY_MAP.mdx")
	if err != nil {
		t.Fatal(err)
	}
	if string(gotWiki) != "# custom\n" {
		t.Fatalf("DEPENDENCY_MAP.mdx was overwritten: got %q", string(gotWiki))
	}

	// Missing files should now exist.
	if _, err := os.Stat(".krokis/wiki/USER_MANUAL.mdx"); err != nil {
		t.Fatalf("USER_MANUAL.mdx should have been created, got %v", err)
	}
}

func TestRunInitSkipDoctorSuppressesDoctor(t *testing.T) {
	restore := chdirTemp(t)
	defer restore()

	if err := os.MkdirAll(".git", 0755); err != nil {
		t.Fatal(err)
	}

	// Pre-seed config so the "krokis doctor" path would still try to load
	// a valid one. With --skip-doctor we expect zero output from doctor.
	if err := os.MkdirAll(".krokis", 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(".krokis/config.toml", []byte("# custom\n"), 0644); err != nil {
		t.Fatal(err)
	}

	if failures := runInit(false, true); failures != 0 {
		t.Fatalf("runInit returned %d, want 0 with skip-doctor", failures)
	}
}

// chdirTemp changes the working directory to a fresh temp dir and registers
// a cleanup that restores the original cwd. Used by runInit tests because
// runInit resolves paths relative to the workspace root.
func chdirTemp(t *testing.T) func() {
	t.Helper()
	original, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	dir := t.TempDir()
	if err := os.Chdir(dir); err != nil {
		t.Fatal(err)
	}
	return func() {
		if err := os.Chdir(original); err != nil {
			t.Logf("failed to restore cwd: %v", err)
		}
	}
}

// silence unused import if test file shrinks.
var _ = filepath.Join
var _ = strings.Contains