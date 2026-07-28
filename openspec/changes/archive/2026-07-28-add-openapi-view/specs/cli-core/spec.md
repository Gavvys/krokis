## ADDED Requirements

### Requirement: OpenAPI scaffolding and config validation
The Krokis desktop application MUST support an `openapi` filepath config setting and scaffold a sample `openapi.yaml` on workspace initialization.

#### Scenario: Running init scaffolds openapi
- **WHEN** user executes workspace initialization
- **THEN** system scaffolds `.krokis/config.toml` containing an `openapi` path mapping, and writes a default sample `openapi.yaml` in the workspace root
