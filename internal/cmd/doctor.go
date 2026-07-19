package cmd

import (
	"fmt"
	"krokis/internal/config"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var doctorCmd = &cobra.Command{
	Use:   "doctor",
	Short: "Check the health of the Krokis repository, configuration, and layout",
	Long:  `Performs diagnostic checks on Git, OpenSpec, Krokis config, directories, and telemetry QA files.`,
	Run: func(cmd *cobra.Command, args []string) {
		failed := false
		fmt.Println("🏥 Running Krokis Doctor Diagnostics...")
		fmt.Println()

		// 1. Check Git
		if _, err := os.Stat(".git"); err != nil {
			fmt.Println("❌ [Git] No .git directory found. Krokis requires a Git-tracked workspace.")
			failed = true
		} else {
			fmt.Println("✅ [Git] Repository found.")
		}

		// 2. Check OpenSpec
		if _, err := os.Stat("openspec"); err != nil {
			fmt.Println("⚠️  [OpenSpec] 'openspec' directory not found. Please run 'openspec init'.")
		} else {
			fmt.Println("✅ [OpenSpec] Directory structure found.")
		}

		// 3. Load Config
		cfg, err := config.Load()
		if err != nil {
			fmt.Printf("❌ [Config] Failed to parse config.toml: %v\n", err)
			failed = true
		} else {
			fmt.Println("✅ [Config] config.toml parsed successfully.")

			// 4. Validate fields
			errs := cfg.Validate()
			if len(errs) > 0 {
				fmt.Println("❌ [Config] Validation errors found:")
				for _, e := range errs {
					fmt.Printf("   - %v\n", e)
				}
				failed = true
			} else {
				fmt.Println("✅ [Config] Fields structure is correct.")
			}

			// 5. Check workspace folders
			warnings := cfg.CheckFolders()
			if len(warnings) > 0 {
				fmt.Println("⚠️  [Layout] Missing directories:")
				for _, w := range warnings {
					fmt.Printf("   - %v\n", w)
				}
			} else {
				fmt.Println("✅ [Layout] Configured directories exist.")
			}

			// 6. Check QA reports
			checkQAReports(cfg)
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

func checkQAReports(cfg *config.Config) {
	if cfg.Insights.Tests != "" {
		if _, err := os.Stat(cfg.Insights.Tests); err != nil {
			fmt.Printf("⚠️  [QA] Configured test file '%s' not found on disk. Run tests to generate it.\n", cfg.Insights.Tests)
		} else {
			fmt.Printf("✅ [QA] Mapped test results found: %s\n", filepath.Base(cfg.Insights.Tests))
		}
	}
	if cfg.Insights.Lints != "" {
		if _, err := os.Stat(cfg.Insights.Lints); err != nil {
			fmt.Printf("⚠️  [QA] Configured lint file '%s' not found on disk. Run linting to generate it.\n", cfg.Insights.Lints)
		} else {
			fmt.Printf("✅ [QA] Mapped lint results found: %s\n", filepath.Base(cfg.Insights.Lints))
		}
	}
	if cfg.Insights.OpenAPI != "" {
		if _, err := os.Stat(cfg.Insights.OpenAPI); err != nil {
			fmt.Printf("⚠️  [QA] Configured OpenAPI spec file '%s' not found on disk. Run 'krokis init' to scaffold.\n", cfg.Insights.OpenAPI)
		} else {
			fmt.Printf("✅ [QA] Mapped OpenAPI spec found: %s\n", filepath.Base(cfg.Insights.OpenAPI))
		}
	}
}
