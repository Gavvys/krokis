package config

import (
	"fmt"
	"os"
)

// Validate checks if the configuration values are correct and warn on disk anomalies
func (c *Config) Validate() []error {
	var errs []error

	if c.Server.Port < 1 || c.Server.Port > 65535 {
		errs = append(errs, fmt.Errorf("server port must be between 1 and 65535, found %d", c.Server.Port))
	}

	if c.Wiki.Directory == "" {
		errs = append(errs, fmt.Errorf("wiki directory must be specified"))
	}

	if c.Insights.Directory == "" {
		errs = append(errs, fmt.Errorf("insights directory must be specified"))
	}

	return errs
}

// CheckFolders returns warnings for directories that do not exist on disk
func (c *Config) CheckFolders() []string {
	var warnings []string

	if _, err := os.Stat(c.Wiki.Directory); os.IsNotExist(err) {
		warnings = append(warnings, fmt.Sprintf("configured wiki directory '%s' does not exist on disk", c.Wiki.Directory))
	}

	if _, err := os.Stat(c.Insights.Directory); os.IsNotExist(err) {
		warnings = append(warnings, fmt.Sprintf("configured insights directory '%s' does not exist on disk", c.Insights.Directory))
	}

	return warnings
}
