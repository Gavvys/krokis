# web-dashboard Specification

## Purpose
TBD - created by archiving change initialize-krokis-cli. Update Purpose after archive.
## Requirements
### Requirement: Embedded web server
The Krokis CLI SHALL start an HTTP server on a configurable port to serve the web dashboard.

#### Scenario: Running krokis serve
- **WHEN** user executes `krokis serve --port 8080`
- **THEN** system starts an HTTP server listening on port 8080 and serves the embedded SPA assets

### Requirement: Client-side MDX and Web Component rendering
The frontend dashboard SHALL parse MDX documents in the browser and render custom components as Web Components.

#### Scenario: Loading an MDX file with a custom component
- **WHEN** client-side dashboard loads `ARCHITECTURE.mdx` containing `<MetricsCard value="98%" label="Test Pass Rate" />`
- **THEN** system parses the MDX, converts `<MetricsCard ... />` into `<metrics-card value="98%" label="Test Pass Rate"></metrics-card>`, and the browser's registered custom element renders the rich animated card

### Requirement: Default landing on WIKI_INDEX
The frontend dashboard routing logic MUST check if `WIKI_INDEX` is available, and load it as the default homepage route if present, falling back to `USER_MANUAL`.

#### Scenario: Routing fallback
- **WHEN** client-side dashboard loads without a specific hash route, and `WIKI_INDEX` is listed in the wiki files
- **THEN** system redirects to `#/wiki/WIKI_INDEX`

### Requirement: Change-flow dashboard route
The dashboard SHALL expose a `#/insights/flow` route that presents local OpenSpec work-in-progress, active-change age, completed-change cycle time, monthly throughput, and planning health from generated insights telemetry.

#### Scenario: Viewing flow insights
- **WHEN** user visits `#/insights/flow` after `krokis insights` generated flow data
- **THEN** the dashboard renders the flow measures and each change's planning-health state

#### Scenario: Viewing unavailable flow data
- **WHEN** a displayed change has unavailable age, cycle-time, or task-count data
- **THEN** the dashboard displays that value as unavailable and does not display zero or a validation-passed claim

