package cmd

import (
	"encoding/json"
	"fmt"
	"krokis/internal/metrics"
	"krokis/internal/wiki"
	"os"
	"path/filepath"
	"time"

	"github.com/spf13/cobra"
)

var insightsCmd = &cobra.Command{
	Use:   "insights",
	Short: "Scan codebase metrics, git cadence, test and lint outputs",
	Long:  `Runs telemetry analysis and writes aggregated datasets to .krokis/insights/`,
	Run: func(cmd *cobra.Command, args []string) {
		cfg := loadConfigOrDie()

		fmt.Println("Gathering project insights...")
		data, err := metrics.Gather(cfg.Insights.Tests, cfg.Insights.Lints)
		if err != nil {
			fmt.Printf("Error gathering insights: %v\n", err)
			os.Exit(1)
		}

		// Ensure output directory exists
		insightsDir := cfg.Insights.Directory
		if err := os.MkdirAll(insightsDir, 0755); err != nil {
			fmt.Printf("Error creating insights directory: %v\n", err)
			os.Exit(1)
		}

		// Save raw JSON report
		reportPath := filepath.Join(insightsDir, "health.json")
		jsonData, err := json.MarshalIndent(data, "", "  ")
		if err != nil {
			fmt.Printf("Error serializing insights: %v\n", err)
			os.Exit(1)
		}

		if err := os.WriteFile(reportPath, jsonData, 0644); err != nil {
			fmt.Printf("Error writing insights report: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("✓ Telemetry dataset saved to %s\n", reportPath)

		// Create MDX summary file
		mdxPath := filepath.Join(insightsDir, "INDEX.mdx")
		mdxContent := generateMDXSummary(data)
		if err := os.WriteFile(mdxPath, []byte(mdxContent), 0644); err != nil {
			fmt.Printf("Error writing MDX summary: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("✓ Created MDX summary report: %s\n", mdxPath)

		// Rebuild wiki index to capture any changes/syncs
		if err := wiki.BuildIndex(cfg.Wiki.Directory); err != nil {
			fmt.Printf("Warning: Failed to rebuild wiki index on insights: %v\n", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(insightsCmd)
}

func generateMDXSummary(data *metrics.TelemetryData) string {
	testPassRate := 0.0
	if data.Quality.Tests.Total > 0 {
		testPassRate = float64(data.Quality.Tests.Passed) / float64(data.Quality.Tests.Total) * 100
	}

	return fmt.Sprintf(`---
title: Project Insights Overview
author: Krokis CLI
---

# Project Insights

Telemetry scan run at %s.

## Codebase Summary

<MetricsCard value="%d" label="Total Lines of Code" />
<MetricsCard value="%d" label="Total Source Files" />

## Git Telemetry

<MetricsCard value="%d" label="Total Commits" />
<MetricsCard value="%d" label="Recent Commits (14d)" />

## Quality & Tests

<MetricsCard value="%.1f%%" label="Test Pass Rate (%d/%d passed)" />
<MetricsCard value="%d" label="Active Lint Violations" />

## OpenSpec Change Flow

<MetricsCard value="%d" label="Active OpenSpec Changes" />

Detailed age, cycle-time, throughput, and planning-health data is available in the Flow Insights dashboard. Unavailable source dates are not reported as zero.

`, timeNowFormatted(), data.Codebase.TotalLines, data.Codebase.TotalFiles,
		data.Git.TotalCommits, data.Git.RecentCommits,
		testPassRate, data.Quality.Tests.Passed, data.Quality.Tests.Total,
		data.Quality.LintIssues, data.ChangeFlow.ActiveWIP)
}

func timeNowFormatted() string {
	return time.Now().Format("2006-01-02 15:04:05 MST")
}
