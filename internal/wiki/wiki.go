package wiki

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var snakeCaseRegex = regexp.MustCompile(`^[A-Z0-9_]+$`)

// IsValidWikiName checks if a name is valid SNAKE_CASE (only uppercase alphanumeric and underscores)
func IsValidWikiName(name string) bool {
	return snakeCaseRegex.MatchString(name)
}

// Create generates a new wiki MDX file with standard metadata/frontmatter
func Create(name string, wikiDir string) (string, error) {
	upperName := strings.ToUpper(strings.ReplaceAll(name, "-", "_"))
	if !IsValidWikiName(upperName) {
		return "", fmt.Errorf("invalid wiki name '%s': must contain only letters, numbers, and underscores (SNAKE_CASE)", name)
	}

	filename := upperName + ".mdx"
	path := filepath.Join(wikiDir, filename)

	// Check if already exists
	if _, err := os.Stat(path); err == nil {
		return "", fmt.Errorf("wiki file '%s' already exists", filename)
	}

	content := fmt.Sprintf(`---
title: %s
author: Krokis CLI
---

# %s

Describe this document here.
`, strings.Title(strings.ToLower(strings.ReplaceAll(upperName, "_", " "))), upperName)

	err := os.WriteFile(path, []byte(content), 0644)
	if err != nil {
		return "", err
	}

	return filename, nil
}

// List returns all valid SNAKE_CASE .mdx wiki files in the wiki directory
func List(wikiDir string) ([]string, error) {
	files, err := os.ReadDir(wikiDir)
	if err != nil {
		return nil, err
	}

	var wikiFiles []string
	for _, f := range files {
		if f.IsDir() {
			continue
		}
		ext := filepath.Ext(f.Name())
		if ext != ".mdx" {
			continue
		}
		base := strings.TrimSuffix(f.Name(), ext)
		if IsValidWikiName(base) {
			wikiFiles = append(wikiFiles, f.Name())
		}
	}
	return wikiFiles, nil
}
