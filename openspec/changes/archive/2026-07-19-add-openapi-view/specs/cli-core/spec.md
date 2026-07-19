## ADDED Requirements

### Requirement: OpenAPI scaffolding and config validation
The Krokis CLI MUST support an `openapi` filepath config setting and scaffold a sample `openapi.yaml` on `krokis init`.

#### Scenario: Running init scaffolds openapi
- **WHEN** user executes `krokis init`
- **THEN** system scaffolds `.krokis/config.toml` containing an `openapi` path mapping, and writes a default sample `openapi.yaml` in the workspace root
