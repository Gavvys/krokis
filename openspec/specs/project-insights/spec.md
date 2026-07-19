# project-insights Specification

## Purpose
TBD - created by archiving change initialize-krokis-cli. Update Purpose after archive.
## Requirements
### Requirement: Task cadence telemetry
The Krokis CLI SHALL analyze local Git commits to calculate task cadence (velocity, commits per author, cycle times).

#### Scenario: Running insights on a Git repo
- **WHEN** user executes `krokis insights` in a Git repository
- **THEN** system processes the git logs and outputs a telemetry dataset to `.krokis/insights/cadence.json`

### Requirement: Codebase metrics and check parsing
The Krokis CLI SHALL read code metrics (LOC) and parse configured lint and test results to generate a unified project health report.

#### Scenario: Parsing test and lint logs
- **WHEN** user executes `krokis insights` when a test report XML and lint JSON are present and configured in `config.toml`
- **THEN** system parses those files and writes a unified quality report to `.krokis/insights/health.json`

### Requirement: Include change-flow data in insights telemetry
The `krokis insights` command SHALL write local OpenSpec change-flow data with its existing health telemetry to `.krokis/insights/health.json` when an `openspec/changes/` directory is present. The command SHALL continue to generate existing Git, codebase, and quality fields.

#### Scenario: Generating insights in an OpenSpec workspace
- **WHEN** user executes `krokis insights` in a repository with an `openspec/changes/` directory
- **THEN** `.krokis/insights/health.json` contains existing telemetry fields and a change-flow section

#### Scenario: Generating insights without OpenSpec changes
- **WHEN** user executes `krokis insights` in a repository without an `openspec/changes/` directory
- **THEN** the command completes successfully and reports no active or completed change-flow items

