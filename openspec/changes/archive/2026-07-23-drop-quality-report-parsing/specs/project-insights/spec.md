# Delta Spec: project-insights

## REMOVED Requirements

### Requirement: Codebase metrics and check parsing
The Krokis CLI SHALL read code metrics (LOC) and parse configured lint and test results to generate a unified project health report.

**Reason**: Maintaining a cross-linter parsing layer for arbitrary tools across user projects is unbounded maintenance and outside Krokis's local-first scope. The quality signal for codebase health is already captured by spec-to-code coverage (which shows implementation evidence) and change-flow (which shows planning health). The removed lint treemaps Queued item depended on this broken foundation.

**Migration**: The `Quality` field is removed from `health.json`. Existing consumers that read `data.quality.lint_issues` or `data.quality.tests` will no longer find those keys. Use spec-to-code coverage at `#/insights/coverage` as the project health indicator instead.

## MODIFIED Requirements

### Requirement: Include change-flow data in insights telemetry
The `krokis insights` command SHALL write local OpenSpec change-flow data with its existing health telemetry to `.krokis/insights/health.json` when an `openspec/changes/` directory is present. The command SHALL continue to generate existing Git and codebase fields.

#### Scenario: Generating insights in an OpenSpec workspace
- **WHEN** user executes `krokis insights` in a repository with an `openspec/changes/` directory
- **THEN** `.krokis/insights/health.json` contains existing telemetry fields and a change-flow section

#### Scenario: Generating insights without OpenSpec changes
- **WHEN** user executes `krokis insights` in a repository without an `openspec/changes/` directory
- **THEN** the command completes successfully and reports no active or completed change-flow items

### Requirement: Include spec coverage data in insights telemetry
The `krokis insights` command SHALL write local spec-to-code coverage data with its existing health telemetry to `.krokis/insights/health.json` when an `openspec/specs/` directory is present. The command SHALL continue to generate existing Git, codebase, and change-flow fields. When `openspec/specs/` is absent or empty, the coverage field SHALL default to `{ capabilities: [] }` and the command SHALL complete successfully.

#### Scenario: Generating insights with spec coverage data
- **WHEN** user executes `krokis insights` in a repository with an `openspec/specs/` directory containing one or more `spec.md` files
- **THEN** `.krokis/insights/health.json` contains existing telemetry fields and a `coverage.capabilities` array with one entry per parsed capability

#### Scenario: Generating insights without OpenSpec specs
- **WHEN** user executes `krokis insights` in a repository without an `openspec/specs/` directory
- **THEN** the command completes successfully and the coverage field defaults to `{ capabilities: [] }`
