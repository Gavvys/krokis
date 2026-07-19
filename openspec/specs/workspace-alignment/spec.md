# workspace-alignment Specification

## Purpose
TBD - created by archiving change align-openspec-workspace-structure. Update Purpose after archive.
## Requirements
### Requirement: Constitutional references presence
The workspace root MUST contain the uppercase global references: `AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, and `PROJECT_MEMORY.md`.

#### Scenario: Running structural audit
- **WHEN** user checks workspace files
- **THEN** all six uppercase project constitution documents exist and follow the standard structure

### Requirement: OpenSpec configuration context
The `openspec/config.yaml` file MUST configure context and custom rules matching the root-level references.

#### Scenario: Checking openspec config rules
- **WHEN** user reads `openspec/config.yaml`
- **THEN** it states the relationship between change-level artifacts and root-level references

