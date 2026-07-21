# project-insights Specification (delta)

## ADDED Requirements

### Requirement: Include spec coverage data in insights telemetry
The `krokis insights` command SHALL write local spec-to-code coverage data with its existing health telemetry to `.krokis/insights/health.json` when an `openspec/specs/` directory is present. The command SHALL continue to generate existing Git, codebase, quality, and change-flow fields. When `openspec/specs/` is absent or empty, the coverage field SHALL default to `{ capabilities: [] }` and the command SHALL complete successfully.

#### Scenario: Generating insights with spec coverage data
- **WHEN** user executes `krokis insights` in a repository with an `openspec/specs/` directory containing one or more `spec.md` files
- **THEN** `.krokis/insights/health.json` contains existing telemetry fields and a `coverage.capabilities` array with one entry per parsed capability

#### Scenario: Generating insights without OpenSpec specs
- **WHEN** user executes `krokis insights` in a repository without an `openspec/specs/` directory
- **THEN** the command completes successfully and the coverage field defaults to `{ capabilities: [] }`