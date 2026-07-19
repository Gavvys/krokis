## ADDED Requirements

### Requirement: Change-flow dashboard route
The dashboard SHALL expose a `#/insights/flow` route that presents local OpenSpec work-in-progress, active-change age, completed-change cycle time, monthly throughput, and planning health from generated insights telemetry.

#### Scenario: Viewing flow insights
- **WHEN** user visits `#/insights/flow` after `krokis insights` generated flow data
- **THEN** the dashboard renders the flow measures and each change's planning-health state

#### Scenario: Viewing unavailable flow data
- **WHEN** a displayed change has unavailable age, cycle-time, or task-count data
- **THEN** the dashboard displays that value as unavailable and does not display zero or a validation-passed claim
