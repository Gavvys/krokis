## ADDED Requirements

### Requirement: Doctor OpenAPI check
The `krokis doctor` command MUST verify that the configured OpenAPI specification file exists on disk.

#### Scenario: Doctor runs with missing OpenAPI file
- **WHEN** user executes `krokis doctor` where the configured `openapi` spec path points to a file that does not exist
- **THEN** system prints a warning warning detailing the missing OpenAPI specification file
