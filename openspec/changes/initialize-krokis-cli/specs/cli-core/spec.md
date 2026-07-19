## ADDED Requirements

### Requirement: Init scaffolding
The Krokis CLI MUST scaffold a `.krokis/` directory when `krokis init` is run in the root of a Git repository.

#### Scenario: Running krokis init for the first time
- **WHEN** user executes `krokis init` in a directory containing `.git/` but no `.krokis/`
- **THEN** system creates `.krokis/` directory, writes default `.krokis/config.toml`, scaffolds `.krokis/wiki/` and `.krokis/skills/` directories, and exits with 0

### Requirement: Configuration loading
The Krokis CLI SHALL parse and load settings from `.krokis/config.toml` for all subcommands.

#### Scenario: Running a subcommand with valid configuration
- **WHEN** user executes `krokis serve` with a valid `.krokis/config.toml` containing a port setting
- **THEN** system successfully starts the server on the configured port
