package cmd

import (
	"fmt"
	"os"
	"krokis/internal/web"
	"krokis/internal/wiki"

	"github.com/spf13/cobra"
)

var portFlag int
var hostFlag string

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the local web server to host the Krokis dashboard",
	Long:  `Launches a local embedded web server serving the project wiki and insights visual dashboard.`,
	Run: func(cmd *cobra.Command, args []string) {
		cfg := loadConfigOrDie()

		// Rebuild wiki index on server start
		if err := wiki.BuildIndex(cfg.Wiki.Directory); err != nil {
			fmt.Printf("Warning: Failed to rebuild wiki index on serve: %v\n", err)
		}

		port := cfg.Server.Port
		if portFlag != 0 {
			port = portFlag
		}

		host := "0.0.0.0"
		if hostFlag != "" {
			host = hostFlag
		}

		if err := web.StartServer(port, host); err != nil {
			fmt.Printf("Server failed: %v\n", err)
			os.Exit(1)
		}
	},
}

func init() {
	serveCmd.Flags().IntVarP(&portFlag, "port", "p", 0, "Port to run the server on")
	serveCmd.Flags().StringVarP(&hostFlag, "host", "H", "0.0.0.0", "Host address to bind to (use 0.0.0.0 for LAN)")
	rootCmd.AddCommand(serveCmd)
}
