# web-dashboard Specification (delta)

## MODIFIED Requirements

### Requirement: Change-flow dashboard route
The dashboard SHALL expose a `#/changes` route that presents local OpenSpec work-in-progress, active-change age, completed-change cycle time, monthly throughput, and planning health from generated insights telemetry. The route SHALL live under the top-level `Changes` sidebar section, not under `Telemetry & Insights`. A per-change detail view SHALL be exposed at `#/changes/<change>`.

#### Scenario: Viewing flow insights
- **WHEN** user visits `#/changes` after `krokis insights` generated flow data
- **THEN** the dashboard renders the flow measures and each change's planning-health state, and the `Changes` sidebar entry is active

#### Scenario: Viewing unavailable flow data
- **WHEN** a displayed change has unavailable age, cycle-time, or task-count data
- **THEN** the dashboard displays that value as unavailable and does not display zero or a validation-passed claim
