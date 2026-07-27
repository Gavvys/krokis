## ADDED Requirements

### Requirement: Doctor validation
The Krokis desktop application MUST provide a workspace health diagnostics command that runs a complete validation of the project directory state and layout.

#### Scenario: Running workspace health diagnostics in a healthy repository
- **WHEN** user executes workspace health diagnostics in a project with a valid config, working git repo, and scaffolded folders
- **THEN** system prints a success summary and exits with 0

#### Scenario: Running workspace health diagnostics in an unhealthy repository
- **WHEN** user executes workspace health diagnostics in a directory that is not a git repository
- **THEN** system prints error details and exits with 1
