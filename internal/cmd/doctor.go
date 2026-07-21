package cmd

import (
	"fmt"
	"krokis/internal/config"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
)

const (
	checkStatusOK   = "ok"
	checkStatusWarn = "warn"
	checkStatusFail = "fail"
)

type check struct {
	name    string
	status  string
	message string
}

var doctorCmd = &cobra.Command{
	Use:   "doctor",
	Short: "Check the health of the Krokis repository, configuration, and layout",
	Long:  `Performs diagnostic checks on Git, OpenSpec, Krokis config, directories, and telemetry QA files.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("🏥 Running Krokis Doctor Diagnostics...")
		fmt.Println()

		checks := buildDoctorChecks()
		failed := false
		for _, c := range checks {
			fmt.Println(formatCheck(c))
			if c.status == checkStatusFail {
				failed = true
			}
		}

		fmt.Println()
		if failed {
			fmt.Println("❌ Krokis Doctor found critical issues. Please resolve them above.")
			os.Exit(1)
		} else {
			fmt.Println("🎉 Krokis diagnostics complete! Everything looks healthy.")
		}
	},
}

func init() {
	rootCmd.AddCommand(doctorCmd)
}

func buildDoctorChecks() []check {
	checks := []check{
		checkGitPresence(),
		checkOpenSpecPresence(),
	}

	cfg, err := config.Load()
	if err != nil {
		checks = append(checks, check{
			name:    "Config",
			status:  checkStatusFail,
			message: fmt.Sprintf("Failed to parse config.toml: %v", err),
		})
		return checks
	}
	checks = append(checks, check{
		name:    "Config",
		status:  checkStatusOK,
		message: "config.toml parsed successfully.",
	})

	if errs := cfg.Validate(); len(errs) > 0 {
		checks = append(checks, check{
			name:    "Config fields",
			status:  checkStatusFail,
			message: fmt.Sprintf("%d validation error(s): %v", len(errs), errs),
		})
	} else {
		checks = append(checks, check{
			name:    "Config fields",
			status:  checkStatusOK,
			message: "Fields structure is correct.",
		})
	}

	if warnings := cfg.CheckFolders(); len(warnings) > 0 {
		checks = append(checks, check{
			name:    "Layout",
			status:  checkStatusWarn,
			message: fmt.Sprintf("Missing directories: %v", warnings),
		})
	} else {
		checks = append(checks, check{
			name:    "Layout",
			status:  checkStatusOK,
			message: "Configured directories exist.",
		})
	}

	checks = append(checks, checkQAReports(cfg)...)
	return checks
}

func checkGitPresence() check {
	if _, err := os.Stat(".git"); err != nil {
		return check{name: "Git", status: checkStatusFail, message: "No .git directory found. Krokis requires a Git-tracked workspace."}
	}
	return check{name: "Git", status: checkStatusOK, message: "Repository found."}
}

func checkOpenSpecPresence() check {
	if _, err := os.Stat("openspec"); err != nil {
		return check{name: "OpenSpec", status: checkStatusWarn, message: "'openspec' directory not found. Please run 'openspec init'."}
	}
	return check{name: "OpenSpec", status: checkStatusOK, message: "Directory structure found."}
}

func checkQAReports(cfg *config.Config) []check {
	entries := []struct {
		label string
		path  string
		hint  string
	}{
		{"Tests", cfg.Insights.Tests, "Run tests to generate it."},
		{"Lints", cfg.Insights.Lints, "Run linting to generate it."},
		{"OpenAPI", cfg.Insights.OpenAPI, "Run 'krokis init' to scaffold."},
	}
	checks := make([]check, 0, len(entries))
	for _, e := range entries {
		if e.path == "" {
			continue
		}
		if _, err := os.Stat(e.path); err != nil {
			checks = append(checks, check{
				name:    "QA " + e.label,
				status:  checkStatusWarn,
				message: fmt.Sprintf("Configured %s file '%s' not found on disk. %s", strings.ToLower(e.label), e.path, e.hint),
			})
		} else {
			checks = append(checks, check{
				name:    "QA " + e.label,
				status:  checkStatusOK,
				message: fmt.Sprintf("Mapped %s found: %s", strings.ToLower(e.label), filepath.Base(e.path)),
			})
		}
	}
	return checks
}

func formatCheck(c check) string {
	switch c.status {
	case checkStatusOK:
		return fmt.Sprintf("✅ [%s] %s", c.name, c.message)
	case checkStatusWarn:
		return fmt.Sprintf("⚠️  [%s] %s", c.name, c.message)
	case checkStatusFail:
		return fmt.Sprintf("❌ [%s] %s", c.name, c.message)
	}
	return fmt.Sprintf("   [%s] %s", c.name, c.message)
}
