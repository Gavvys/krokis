package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "krokis",
	Short: "Krokis is a project management CLI overlay on top of OpenSpec",
	Long: `Krokis provides project telemetry, structured SNAKE_CASE wiki management, 
and an embedded MDX dashboard to make spec-driven workflows auditable and agent-friendly.`,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func init() {
	// Root level flags can go here if needed.
}
