# changes-section Specification (delta)

## MODIFIED Requirements

### Requirement: Changes page lists every change and the team-level flow metrics
The dashboard SHALL expose a `#/changes` route. The page SHALL render the team-level WIP, average cycle time, and monthly throughput cards above a table that lists every active OpenSpec change with its name (linked to `#/changes/<change>`), status, age, and planning health. The table SHALL contain only active changes; completed changes are surfaced separately on `#/changes/archived`. Planning health SHALL still be labeled as planning health, not as OpenSpec validation success.

#### Scenario: Visiting the Changes page with flow data
- **WHEN** user visits `#/changes` after `krokis insights` generated flow data
- **THEN** the dashboard renders the WIP, average cycle time, and monthly throughput cards, and a change table with one row per active change that links each change name to `#/changes/<change>`

#### Scenario: Visiting the Changes page with no changes
- **WHEN** user visits `#/changes` and the local workspace has no `openspec/changes/`
- **THEN** the dashboard renders the metric cards as unavailable and shows a `No active changes found.` message in the table
