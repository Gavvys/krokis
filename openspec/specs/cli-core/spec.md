# cli-core Specification

## Purpose
TBD - created by archiving change initialize-krokis-cli. Update Purpose after archive.
## Requirements
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

### Requirement: OpenAPI scaffolding and config validation
The Krokis CLI MUST support an `openapi` filepath config setting and scaffold a sample `openapi.yaml` on `krokis init`.

#### Scenario: Running init scaffolds openapi
- **WHEN** user executes `krokis init`
- **THEN** system scaffolds `.krokis/config.toml` containing an `openapi` path mapping, and writes a default sample `openapi.yaml` in the workspace root

### Requirement: Plural agents directory priority
The Krokis CLI MUST prioritize reading and writing Agent Skills inside the plural `.agents/skills/` directory, while preserving the singular `.agent/skills/` path as a fallback.

#### Scenario: Running init prioritizing plural
- **WHEN** user executes `krokis init` in a workspace containing both `.agents` and `.agent` or containing neither
- **THEN** system scaffolds skills under `.agents/skills/`

### Requirement: CLI command structure
Every Krokis CLI subcommand SHALL be defined as a `cobra.Command` with a `Run` function. When the command needs the loaded `config.Config`, the `Run` function SHALL call `cmd.loadConfigOrDie()` as its first line. The helper centralizes the load-or-die behavior so each command no longer inlines `config.Load()` plus its own error branch.

#### Scenario: Command uses the helper
- **WHEN** a CLI command needs the config
- **THEN** it calls `loadConfigOrDie()` once at the top of its `Run` function and uses the returned config

