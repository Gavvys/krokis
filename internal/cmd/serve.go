package cmd

import (
	"fmt"
	"os"
	"krokis/internal/config"
	"krokis/internal/web"

	"github.com/spf13/cobra"
)

var portFlag int

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the local web server to host the Krokis dashboard",
	Long:  `Launches a local embedded web server serving the project wiki and insights visual dashboard.`,
	Run: func(cmd *cobra.Command, args []string) {
		cfg, err := config.Load()
		if err != nil {
			fmt.Printf("Error loading config: %v\n", err)
			os.Exit(1)
		}

		port := cfg.Server.Port
		if portFlag != 0 {
			port = portFlag
		}

		err = web.StartServer(port)
		if err != nil {
			fmt.Printf("Server failed: %v\n", err)
			os.Exit(1)
		}
	},
}

func init() {
	serveCmd.Flags().IntVarP(&portFlag, "port", "p", 0, "Port to run the server on")
	rootCmd.AddCommand(serveCmd)
}
