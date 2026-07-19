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

