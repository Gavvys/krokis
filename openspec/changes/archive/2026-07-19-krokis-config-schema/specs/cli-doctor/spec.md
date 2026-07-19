## ADDED Requirements

### Requirement: Doctor validation
The Krokis CLI MUST provide a `krokis doctor` command that runs a complete validation of the project directory state and layout.

#### Scenario: Running krokis doctor in a healthy repository
- **WHEN** user executes `krokis doctor` in a project with a valid config, working git repo, and scaffolded folders
- **THEN** system prints a success summary and exits with 0

#### Scenario: Running krokis doctor in an unhealthy repository
- **WHEN** user executes `krokis doctor` in a directory that is not a git repository
- **THEN** system prints error details and exits with 1
