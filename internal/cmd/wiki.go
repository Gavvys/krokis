package cmd

import (
	"fmt"
	"os"
	"krokis/internal/wiki"

	"github.com/spf13/cobra"
)

var wikiCmd = &cobra.Command{
	Use:   "wiki",
	Short: "Manage SNAKE_CASE wiki MDX files",
	Long:  `Allows listing, creating, and validating wiki master files under .krokis/wiki/`,
}

var wikiListCmd = &cobra.Command{
	Use:   "list",
	Short: "List all wiki files",
	Run: func(cmd *cobra.Command, args []string) {
		cfg := loadConfigOrDie()

		files, err := wiki.List(cfg.Wiki.Directory)
		if err != nil {
			fmt.Printf("Error listing wiki files: %v\n", err)
			os.Exit(1)
		}

		if len(files) == 0 {
			fmt.Println("No wiki files found.")
			return
		}

		fmt.Println("Wiki Files:")
		for _, f := range files {
			fmt.Printf("- %s\n", f)
		}
	},
}

var wikiCreateCmd = &cobra.Command{
	Use:   "create [name]",
	Short: "Create a new wiki file",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		cfg := loadConfigOrDie()

		filename, err := wiki.Create(args[0], cfg.Wiki.Directory)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("✓ Created wiki file: %s/%s\n", cfg.Wiki.Directory, filename)

		// Auto-rebuild the WIKI_INDEX.mdx
		if err := wiki.BuildIndex(cfg.Wiki.Directory); err != nil {
			fmt.Printf("Warning: Failed to rebuild wiki index: %v\n", err)
		} else {
			fmt.Println("✓ Regenerated wiki index WIKI_INDEX.mdx")
		}
	},
}

func init() {
	wikiCmd.AddCommand(wikiListCmd)
	wikiCmd.AddCommand(wikiCreateCmd)
	rootCmd.AddCommand(wikiCmd)
}
