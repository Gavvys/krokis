# config-schema Specification

## Purpose
Defines validation of `.krokis/config.toml` structure and configured paths for the active workspace.

## Requirements
### Requirement: Validate config values
The Krokis desktop application MUST validate that properties in `config.toml` match valid types and structures when loading workspace configuration.

#### Scenario: Loading a bad config
- **WHEN** the active workspace config contains an invalid value (for example a negative or non-numeric setting where a positive integer is required)
- **THEN** system reports validation error details and does not treat the config as valid

### Requirement: Validate directory existence
The Krokis desktop application SHALL check if configured wiki and insights directories exist when validating workspace configuration.

#### Scenario: Validating missing folders
- **WHEN** validation runs and configured directories do not exist on disk
- **THEN** system reports warnings about missing folders, but treats type-valid configuration as structurally acceptable
