## ADDED Requirements

### Requirement: Validate config values
The Krokis CLI MUST validate that properties in `config.toml` match valid types and structures.

#### Scenario: Running krokis validate on a bad config
- **WHEN** user executes `krokis validate` with a configuration containing an invalid port (e.g. `port = -1`)
- **THEN** system prints validation error details and exits with 1

### Requirement: Validate directory existence
The Krokis CLI SHALL check if configured wiki and insights directories exist when running `krokis validate`.

#### Scenario: Validating missing folders
- **WHEN** user executes `krokis validate` when configured directories do not exist on disk
- **THEN** system prints warnings about missing folders, but exits with 0 if configuration types are correct
