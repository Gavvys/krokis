package cmd

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"krokis/internal/config"
	"krokis/internal/wiki"

	"github.com/spf13/cobra"
)

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize Krokis project structure and scaffolding",
	Long:  `Creates the .krokis folder, default configurations, wiki templates, and scaffolds workspace Agent Skills. Idempotent: re-running fills missing pieces without overwriting. Auto-invokes 'krokis doctor' after scaffolding unless --skip-doctor is set.`,
	Run: func(cmd *cobra.Command, args []string) {
		failures := runInit(initVerbose, initSkipDoctor)
		if failures > 0 {
			os.Exit(1)
		}
	},
}

// runInit performs the init scaffolding and (optionally) doctor invocation.
// Returns the doctor failure count; the caller decides the exit code.
func runInit(verbose, skipDoctor bool) int {
	// 1. Verify git repo
	if _, err := os.Stat(".git"); os.IsNotExist(err) {
		fmt.Println("Error: No .git directory found. Please run 'git init' first.")
		os.Exit(1)
	}

	fmt.Println("Initializing Krokis project structure...")

	// 2. Write config (skip if already exists)
	cfg := config.Default()
	configPath := filepath.Join(".krokis", "config.toml")
	if _, err := os.Stat(configPath); err == nil {
		fmt.Printf("↻ Skipped %s (already exists)\n", configPath)
	} else {
		if err := config.Save(cfg); err != nil {
			fmt.Printf("Error creating config file: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("✓ Created .krokis/config.toml")
	}

	// 3. Create wiki dir & templates
	wikiDir := cfg.Wiki.Directory
	if _, err := mkdirVerbose(wikiDir, verbose); err != nil {
		fmt.Printf("Error creating wiki directory: %v\n", err)
		os.Exit(1)
	}

	scaffoldWikiTemplates(wikiDir, verbose)

	// 4. Scaffold Agent Skills
	activeAgentDir := getActiveAgentSkillsDir()
	if _, err := mkdirVerbose(activeAgentDir, verbose); err != nil {
		fmt.Printf("Error creating agent skills directory: %v\n", err)
		os.Exit(1)
	}
	if err := scaffoldAgentSkills(activeAgentDir, verbose); err != nil {
		fmt.Printf("Error scaffolding agent skills: %v\n", err)
		os.Exit(1)
	}

	// 5. Scaffold sample openapi.yaml
	openapiPath := cfg.Insights.OpenAPI
	if openapiPath == "" {
		openapiPath = "openapi.yaml"
	}
	if err := scaffoldOpenAPISpec(openapiPath); err != nil {
		fmt.Printf("Error scaffolding openapi.yaml: %v\n", err)
		os.Exit(1)
	}

	// 6. Build initial Wiki Index
	if err := wiki.BuildIndex(cfg.Wiki.Directory); err != nil {
		fmt.Printf("Warning: Failed to create wiki index on init: %v\n", err)
	} else {
		fmt.Println("✓ Scaffolded wiki index WIKI_INDEX.mdx")
	}

	fmt.Println("\nKrokis Initialized Successfully! Run 'krokis serve' to open the dashboard.")

	// 7. Auto-invoke doctor unless suppressed
	if skipDoctor {
		fmt.Println("\nSkipped doctor (--skip-doctor).")
		return 0
	}
	fmt.Println()
	return runDoctorChecks()
}

var (
	initVerbose    bool
	initSkipDoctor bool
)

func init() {
	rootCmd.AddCommand(initCmd)
	initCmd.Flags().BoolVarP(&initVerbose, "verbose", "v", false, "Print every directory created alongside the files")
	initCmd.Flags().BoolVar(&initSkipDoctor, "skip-doctor", false, "Skip the automatic 'krokis doctor' invocation after scaffolding")
}

func scaffoldFile(path, content, label string) error {
	if _, err := os.Stat(path); err == nil {
		fmt.Printf("↻ Skipped %s (already exists)\n", path)
		return nil
	}
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		return err
	}
	fmt.Printf("✓ Created %s\n", label)
	return nil
}

// mkdirVerbose creates dir if missing. When verbose is true, it prints a line
// for any directory it just created. Returns true if the directory was newly
// created, false if it already existed.
func mkdirVerbose(dir string, verbose bool) (bool, error) {
	info, err := os.Stat(dir)
	if err == nil && info.IsDir() {
		return false, nil
	}
	if err := os.MkdirAll(dir, 0755); err != nil {
		return false, err
	}
	if verbose {
		fmt.Printf("+ Created dir %s\n", dir)
	}
	return true, nil
}

func scaffoldWikiTemplates(wikiDir string, verbose bool) {
	templates := map[string]string{
		"DEPENDENCY_MAP.mdx": `---
title: Dependency Map
author: Krokis CLI
---

# System Dependencies

Maintain a clear map of external APIs, microservices, and client boundaries.

<InfoBox type="tip">
  Keep this document up-to-date as dependencies change, so agents remain aware of system limits.
</InfoBox>
`,
		"USER_MANUAL.mdx": `---
title: Krokis User Guide
author: Krokis CLI
---

# Krokis User Manual

Welcome to the interactive project dashboard! Krokis helps agents maintain OpenSpec workflows and humans audit project health.

## Core Commands

You can run these commands directly in your terminal:

- **Scaffold**: <code>krokis init</code> setups folders, configs, and Agent Skills.
- **Insights**: <code>krokis insights</code> scans Git cadence and QA metrics reports.
- **Diagnostics**: <code>krokis doctor</code> audits repository layout and setup health.
- **Validate**: <code>krokis validate</code> verifies configuration file correctness.
- **Serve**: <code>krokis serve</code> launches this local visual dashboard.

## Interactive Widgets Showcase

Here are some custom components you can embed inside any .mdx wiki file in .krokis/wiki/:

### 1. Info Callouts (InfoBox)

Use <code>&lt;InfoBox type="tip" title="..."&gt;Your message&lt;/InfoBox&gt;</code> to document tips:

<InfoBox type="tip" title="Best Practice">
  Always run <code>krokis validate</code> after editing configuration parameters!
</InfoBox>

Support types include: <code>info</code>, <code>tip</code>, <code>warning</code>, and <code>caution</code>.

### 2. Telemetry KPI Cards (MetricsCard)

Use <code>&lt;MetricsCard value="..." label="..." /&gt;</code> to draw focus to a metric:

<MetricsCard value="100%" label="Code Quality Score" />

### 3. Embed Dynamic Reports

You can also embed the complete project health and git cadence widgets directly inside any wiki article:

#### Git Cadence Graph (&lt;TaskCadence /&gt;):
<TaskCadence />

#### Unit Test Summary (&lt;TestResults /&gt;):
<TestResults />
`,
	}

	for filename, content := range templates {
		_ = scaffoldFile(filepath.Join(wikiDir, filename), content, fmt.Sprintf("Scaffolded %s", filename))
	}
}

func getActiveAgentSkillsDir() string {
	// Look for existing .agents or .agent
	if _, err := os.Stat(".agents"); err == nil {
		return ".agents/skills"
	}
	if _, err := os.Stat(".agent"); err == nil {
		return ".agent/skills"
	}
	// Default to standard .agents
	return ".agents/skills"
}

func scaffoldAgentSkills(skillsRoot string, verbose bool) error {
	const rootDir = "skill_template/krokis"
	return fs.WalkDir(krokisSkillFS, rootDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			rel, err := filepath.Rel(rootDir, path)
			if err != nil || rel == "." {
				return nil
			}
			target := filepath.Join(skillsRoot, "krokis", rel)
			if _, err := mkdirVerbose(target, verbose); err != nil {
				return err
			}
			return nil
		}
		data, err := krokisSkillFS.ReadFile(path)
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(rootDir, path)
		if err != nil {
			return err
		}
		target := filepath.Join(skillsRoot, "krokis", rel)
		if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
			return err
		}
		return scaffoldFile(target, string(data), rel)
	})
}

func scaffoldOpenAPISpec(path string) error {
	content := `openapi: 3.0.3
info:
  title: Krokis Sample API
  description: This is a placeholder OpenAPI spec scaffolded by Krokis init.
  version: 1.0.0
paths:
  /api/insights:
    get:
      summary: Retrieve project health metrics
      responses:
        '200':
          description: A telemetry dataset in JSON format
  /api/wiki:
    get:
      summary: Retrieve list of MDX wiki articles
      responses:
        '200':
          description: A list of wiki filename strings
`
	return scaffoldFile(path, content, fmt.Sprintf("Scaffolded sample OpenAPI spec in %s", path))
}
