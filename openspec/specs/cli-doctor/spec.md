# cli-doctor Specification

## Purpose
Defines workspace health diagnostics for validating Krokis project layout and configuration.

## Requirements
### Requirement: Workspace health validation
The Krokis desktop application MUST provide workspace health diagnostics that validate project directory state and layout for the active workspace.

#### Scenario: Diagnosing a healthy repository
- **WHEN** diagnostics run against a project with a valid config, working git repo, and scaffolded folders
- **THEN** system reports a success summary with no failing checks

#### Scenario: Diagnosing an unhealthy repository
- **WHEN** diagnostics run against a directory that is not a git repository
- **THEN** system reports error details for the failing checks

### Requirement: OpenAPI path check
Workspace diagnostics MUST verify that the configured OpenAPI specification file exists on disk when configured.

#### Scenario: Diagnostics with missing OpenAPI file
- **WHEN** diagnostics run where the configured `openapi` spec path points to a file that does not exist
- **THEN** system reports a warning detailing the missing OpenAPI specification file

### Requirement: Diagnostics structure
Workspace diagnostics SHALL run a list of checks against the workspace. Checks SHALL be defined as a table of entries with name, status, and message so adding a new check is a single table entry.

#### Scenario: All checks pass
- **WHEN** every check in the table has status `ok`
- **THEN** diagnostics report every check as passing

#### Scenario: One check fails
- **WHEN** at least one check has status `fail`
- **THEN** diagnostics report every check and surface the failure
