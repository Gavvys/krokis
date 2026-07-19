## ADDED Requirements

### Requirement: Include change-flow data in insights telemetry
The `krokis insights` command SHALL write local OpenSpec change-flow data with its existing health telemetry to `.krokis/insights/health.json` when an `openspec/changes/` directory is present. The command SHALL continue to generate existing Git, codebase, and quality fields.

#### Scenario: Generating insights in an OpenSpec workspace
- **WHEN** user executes `krokis insights` in a repository with an `openspec/changes/` directory
- **THEN** `.krokis/insights/health.json` contains existing telemetry fields and a change-flow section

#### Scenario: Generating insights without OpenSpec changes
- **WHEN** user executes `krokis insights` in a repository without an `openspec/changes/` directory
- **THEN** the command completes successfully and reports no active or completed change-flow items
