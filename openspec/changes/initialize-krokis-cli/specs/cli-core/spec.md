## ADDED Requirements

### Requirement: Init scaffolding
The Krokis desktop application MUST scaffold a `.krokis/` directory when workspace initialization is run in the root of a Git repository.

#### Scenario: Running workspace initialization for the first time
- **WHEN** user executes workspace initialization in a directory containing `.git/` but no `.krokis/`
- **THEN** system creates `.krokis/` directory, writes default `.krokis/config.toml`, scaffolds `.krokis/wiki/` and `.krokis/skills/` directories, and exits with 0

### Requirement: Configuration loading
The Krokis desktop application SHALL parse and load settings from `.krokis/config.toml` for all subcommands.

#### Scenario: Running a subcommand with valid configuration
- **WHEN** user executes the Krokis desktop app with a valid `.krokis/config.toml` containing a port setting
- **THEN** system successfully starts the server on the configured port
