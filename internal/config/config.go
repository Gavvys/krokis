package config

import (
	"os"
	"path/filepath"

	"github.com/pelletier/go-toml/v2"
)

type Config struct {
	Wiki     WikiConfig     `toml:"wiki"`
	Insights InsightsConfig `toml:"insights"`
	Server   ServerConfig   `toml:"server"`
}

type WikiConfig struct {
	Directory string `toml:"directory"`
}

type InsightsConfig struct {
	Directory string `toml:"directory"`
	Tests     string `toml:"tests"`
	Lints     string `toml:"lints"`
	OpenAPI   string `toml:"openapi"`
}

type ServerConfig struct {
	Port int `toml:"port"`
}

// Default returns a standard default configuration
func Default() *Config {
	return &Config{
		Wiki: WikiConfig{
			Directory: ".krokis/wiki",
		},
		Insights: InsightsConfig{
			Directory: ".krokis/insights",
			OpenAPI:   "openapi.yaml",
		},
		Server: ServerConfig{
			Port: 8080,
		},
	}
}

// Load reads the config file from the workspace root or falls back to defaults
func Load() (*Config, error) {
	cfg := Default()
	data, err := os.ReadFile(".krokis/config.toml")
	if err != nil {
		if os.IsNotExist(err) {
			return cfg, nil // return defaults if config doesn't exist yet
		}
		return nil, err
	}
	err = toml.Unmarshal(data, cfg)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}

// Save writes the config to .krokis/config.toml
func Save(cfg *Config) error {
	err := os.MkdirAll(".krokis", 0755)
	if err != nil {
		return err
	}
	data, err := toml.Marshal(cfg)
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(".krokis", "config.toml"), data, 0644)
}
