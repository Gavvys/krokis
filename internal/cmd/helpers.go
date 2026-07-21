package cmd

import (
	"fmt"
	"os"

	"krokis/internal/config"
)

// loadConfigOrDie loads the Krokis config and returns it, or prints the error
// to stderr and exits with status 1.
func loadConfigOrDie() *config.Config {
	cfg, err := config.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading config: %v\n", err)
		os.Exit(1)
	}
	return cfg
}
