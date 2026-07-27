## ADDED Requirements

### Requirement: Validate config values
The Krokis desktop application MUST validate that properties in `config.toml` match valid types and structures.

#### Scenario: Running config validation on a bad config
- **WHEN** user executes config validation with a configuration containing an invalid port (e.g. `port = -1`)
- **THEN** system prints validation error details and exits with 1

### Requirement: Validate directory existence
The Krokis desktop application SHALL check if configured wiki and insights directories exist when running config validation.

#### Scenario: Validating missing folders
- **WHEN** user executes config validation when configured directories do not exist on disk
- **THEN** system prints warnings about missing folders, but exits with 0 if configuration types are correct
