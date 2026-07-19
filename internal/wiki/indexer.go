package wiki

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type WikiMetadata struct {
	Filename    string
	Title       string
	Description string
	Author      string
}

// BuildIndex scans the wiki directory and creates WIKI_INDEX.mdx
func BuildIndex(wikiDir string) error {
	// First, list files
	files, err := List(wikiDir)
	if err != nil {
		return err
	}

	var metadataList []WikiMetadata

	for _, filename := range files {
		// Skip WIKI_INDEX itself to avoid self-listing
		if filename == "WIKI_INDEX.mdx" {
			continue
		}

		var path string
		if strings.HasSuffix(filename, ".md") {
			path = filename
		} else {
			path = filepath.Join(wikiDir, filename)
		}

		meta, err := parseMetadata(path, filename)
		if err != nil {
			// If parsing fails, fall back to basic metadata
			meta = WikiMetadata{
				Filename:    filename,
				Title:       formatTitle(filename),
				Description: "No description provided.",
			}
		}
		metadataList = append(metadataList, meta)
	}

	// Sort alphabetically by Title
	sort.Slice(metadataList, func(i, j int) bool {
		return metadataList[i].Title < metadataList[j].Title
	})

	// Build index MDX content
	var sb strings.Builder
	sb.WriteString("---\ntitle: Documentation Index\nauthor: Krokis CLI\n---\n\n")
	sb.WriteString("# 📚 Project Documentation\n\n")
	sb.WriteString("<InfoBox type=\"info\">\n  Welcome to the project documentation index. Below is a catalog of all wiki articles available in this workspace.\n</InfoBox>\n\n")

	if len(metadataList) == 0 {
		sb.WriteString("No articles found on disk. Run `krokis wiki create <name>` to add some documentation.\n")
	} else {
		for _, meta := range metadataList {
			baseName := strings.TrimSuffix(meta.Filename, ".mdx")
			baseName = strings.TrimSuffix(baseName, ".md")
			sb.WriteString(fmt.Sprintf("### 📄 [%s](#/wiki/%s)\n", meta.Title, baseName))
			if meta.Description != "" {
				sb.WriteString(fmt.Sprintf("%s\n\n", meta.Description))
			} else {
				sb.WriteString("No description available.\n\n")
			}
			if meta.Author != "" {
				sb.WriteString(fmt.Sprintf("<span style=\"font-size: 0.85em; color: #6b7280;\">✍️ Written by %s</span>\n\n", meta.Author))
			}
			sb.WriteString("---\n\n")
		}
	}

	outputPath := filepath.Join(wikiDir, "WIKI_INDEX.mdx")
	return os.WriteFile(outputPath, []byte(sb.String()), 0644)
}

func parseMetadata(path string, filename string) (WikiMetadata, error) {
	file, err := os.Open(path)
	if err != nil {
		return WikiMetadata{}, err
	}
	defer file.Close()

	meta := WikiMetadata{
		Filename: filename,
		Title:    formatTitle(filename),
	}

	scanner := bufio.NewScanner(file)
	if !scanner.Scan() {
		return meta, nil
	}
	firstLine := strings.TrimSpace(scanner.Text())
	if firstLine != "---" {
		return meta, nil
	}

	inFrontmatter := true
	for scanner.Scan() && inFrontmatter {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)
		if trimmed == "---" {
			inFrontmatter = false
			break
		}

		parts := strings.SplitN(line, ":", 2)
		if len(parts) < 2 {
			continue
		}
		key := strings.ToLower(strings.TrimSpace(parts[0]))
		val := strings.TrimSpace(parts[1])
		// Strip quotes if present
		val = strings.Trim(val, `"'`)

		switch key {
		case "title":
			meta.Title = val
		case "description":
			meta.Description = val
		case "author":
			meta.Author = val
		}
	}

	return meta, nil
}

func formatTitle(filename string) string {
	base := strings.TrimSuffix(filename, filepath.Ext(filename))
	words := strings.Split(base, "_")
	for i, w := range words {
		if len(w) > 0 {
			words[i] = strings.ToUpper(w[0:1]) + strings.ToLower(w[1:])
		}
	}
	return strings.Join(words, " ")
}
