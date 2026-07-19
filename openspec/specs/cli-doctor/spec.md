# cli-doctor Specification

## Purpose
TBD - created by archiving change krokis-config-schema. Update Purpose after archive.
## Requirements
### Requirement: Doctor validation
The Krokis CLI MUST provide a `krokis doctor` command that runs a complete validation of the project directory state and layout.

#### Scenario: Running krokis doctor in a healthy repository
- **WHEN** user executes `krokis doctor` in a project with a valid config, working git repo, and scaffolded folders
- **THEN** system prints a success summary and exits with 0

#### Scenario: Running krokis doctor in an unhealthy repository
- **WHEN** user executes `krokis doctor` in a directory that is not a git repository
- **THEN** system prints error details and exits with 1

### Requirement: Doctor OpenAPI check
The `krokis doctor` command MUST verify that the configured OpenAPI specification file exists on disk.

#### Scenario: Doctor runs with missing OpenAPI file
- **WHEN** user executes `krokis doctor` where the configured `openapi` spec path points to a file that does not exist
- **THEN** system prints a warning warning detailing the missing OpenAPI specification file

