# changes-section Specification

## Purpose
Define the dedicated top-level Changes section in the dashboard sidebar and the `#/changes` route that lists every local OpenSpec change alongside the team-level flow metrics.

## ADDED Requirements

### Requirement: Top-level Changes sidebar section
The dashboard sidebar SHALL expose a top-level section titled `Changes` that is parallel to the `Project Wiki` section and not nested under `Telemetry & Insights`. The section SHALL contain a single navigation link to `#/changes` and SHALL NOT contain any other entries.

#### Scenario: Sidebar shows the Changes section
- **WHEN** the dashboard renders the sidebar
- **THEN** a `Changes` section is visible at the top level, contains exactly one link to `#/changes`, and is not nested under `Telemetry & Insights`

#### Scenario: Flow Insights removed from Telemetry & Insights
- **WHEN** the dashboard renders the sidebar
- **THEN** the `Telemetry & Insights` section does not contain a `Flow Insights` link

### Requirement: Changes page lists every change and the team-level flow metrics
The dashboard SHALL expose a `#/changes` route. The page SHALL render the team-level WIP, average cycle time, and monthly throughput cards above a table that lists every local OpenSpec change with its name (linked to `#/changes/<change>`), status, age or cycle time, and planning health. Planning health SHALL still be labeled as planning health, not as OpenSpec validation success.

#### Scenario: Visiting the Changes page with flow data
- **WHEN** user visits `#/changes` after `krokis insights` generated flow data
- **THEN** the dashboard renders the WIP, average cycle time, and monthly throughput cards, and a change table with one row per change that links each change name to `#/changes/<change>`

#### Scenario: Visiting the Changes page with no changes
- **WHEN** user visits `#/changes` and the local workspace has no `openspec/changes/`
- **THEN** the dashboard renders the metric cards as unavailable and shows a `No OpenSpec changes found.` message in the table

### Requirement: Per-change detail route under the Changes section
The dashboard SHALL expose a `#/changes/<change>` route. The page SHALL render the same per-change detail content (change-flow graph component, list view, and list/graph toggle) that the previous `#/insights/flow/<change>` route rendered, and SHALL keep the toggle preference under `krokis.changeViewMode` in `localStorage`.

#### Scenario: Opening a change from the Changes table
- **WHEN** the user clicks a change name on the Changes page
- **THEN** the browser navigates to `#/changes/<change>` and the per-change detail view renders

### Requirement: Legacy Flow Insights URLs redirect
The dashboard SHALL permanently redirect `#/insights/flow` to `#/changes` and `#/insights/flow/<change>` to `#/changes/<change>` using a client-side hash redirect, so existing bookmarks and external links continue to resolve.

#### Scenario: Old flow route redirects
- **WHEN** the user navigates to `#/insights/flow` or `#/insights/flow/<change>`
- **THEN** the dashboard rewrites the URL hash to the new canonical form and renders the corresponding new page
