package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var validateCmd = &cobra.Command{
	Use:   "validate",
	Short: "Validate Krokis configuration and workspace directories",
	Long:  `Validates the types and parameters in .krokis/config.toml, checking for any missing folders on disk.`,
	Run: func(cmd *cobra.Command, args []string) {
		cfg := loadConfigOrDie()

		errs := cfg.Validate()
		if len(errs) > 0 {
			fmt.Println("❌ Configuration Validation Failed:")
			for _, e := range errs {
				fmt.Printf("  - %v\n", e)
			}
			os.Exit(1)
		}

		warnings := cfg.CheckFolders()
		if len(warnings) > 0 {
			fmt.Println("⚠️ Configuration Warnings:")
			for _, w := range warnings {
				fmt.Printf("  - %v\n", w)
			}
			fmt.Println("\nConfiguration structure is valid, but some directories are missing. Run 'krokis init' to scaffold.")
			return
		}

		fmt.Println("✓ Krokis configuration is valid and healthy!")
	},
}

func init() {
	rootCmd.AddCommand(validateCmd)
}
