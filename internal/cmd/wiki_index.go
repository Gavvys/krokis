package cmd

import (
	"fmt"
	"os"
	"krokis/internal/config"
	"krokis/internal/wiki"

	"github.com/spf13/cobra"
)

var wikiIndexCmd = &cobra.Command{
	Use:   "index",
	Short: "Regenerate the WIKI_INDEX.mdx file listing all wiki articles",
	Run: func(cmd *cobra.Command, args []string) {
		cfg, err := config.Load()
		if err != nil {
			fmt.Printf("Error loading config: %v\n", err)
			os.Exit(1)
		}

		err = wiki.BuildIndex(cfg.Wiki.Directory)
		if err != nil {
			fmt.Printf("Error generating index: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("✓ Regenerated wiki index: %s/WIKI_INDEX.mdx\n", cfg.Wiki.Directory)
	},
}

func init() {
	wikiCmd.AddCommand(wikiIndexCmd)
}
