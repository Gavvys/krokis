# project-insights Specification

## Purpose
Defines native Rust telemetry gathering for Git cadence, OpenSpec change flow, and codebase metrics returned to the desktop dashboard via Tauri IPC.

## Requirements
### Requirement: Task cadence telemetry
The Krokis desktop application SHALL analyze local Git commits for the active workspace to calculate task cadence (commits per author, recent commit volume, and daily heatmap data).

#### Scenario: Gathering insights on a Git repo
- **WHEN** the frontend invokes `get_insights` for an active Git workspace
- **THEN** the Rust backend processes git logs and returns a telemetry payload containing git cadence fields

### Requirement: Include change-flow data in insights telemetry
The `get_insights` IPC command SHALL include local OpenSpec change-flow data when an `openspec/changes/` directory is present under the active workspace. The command SHALL continue to generate existing Git and codebase fields.

#### Scenario: Gathering insights in an OpenSpec workspace
- **WHEN** the frontend invokes `get_insights` for a repository with an `openspec/changes/` directory
- **THEN** the returned payload contains existing telemetry fields and a change-flow section

#### Scenario: Gathering insights without OpenSpec changes
- **WHEN** the frontend invokes `get_insights` for a repository without an `openspec/changes/` directory
- **THEN** the command completes successfully and reports no active or completed change-flow items

### Requirement: Include spec coverage data in insights telemetry
The `get_insights` IPC command SHALL include local spec-to-code coverage data when an `openspec/specs/` directory is present under the active workspace. The command SHALL continue to generate existing Git, codebase, and change-flow fields. When `openspec/specs/` is absent or empty, the coverage field SHALL default to `{ capabilities: [] }` and the command SHALL complete successfully.

#### Scenario: Gathering insights with spec coverage data
- **WHEN** the frontend invokes `get_insights` for a repository with an `openspec/specs/` directory containing one or more `spec.md` files
- **THEN** the returned payload contains existing telemetry fields and a `coverage.capabilities` array with one entry per parsed capability

#### Scenario: Gathering insights without OpenSpec specs
- **WHEN** the frontend invokes `get_insights` for a repository without an `openspec/specs/` directory
- **THEN** the command completes successfully and the coverage field defaults to `{ capabilities: [] }`
