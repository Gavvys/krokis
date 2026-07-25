# web-dashboard Specification (delta)

## ADDED Requirements

### Requirement: Coverage dashboard route and component
The dashboard SHALL expose a `#/insights/coverage` route under the `Telemetry & Insights` sidebar section, with a `Coverage` link listed between `Task Cadence` and `API Specification`. The route SHALL render a `CoverageReport` Web Component (`web/components/CoverageReport.js`) that extends `KrokisElement` and is mounted via `mountPage`. The page SHALL be page title `Coverage · Krokis`.

#### Scenario: Sidebar shows the Coverage link
- **WHEN** the dashboard renders the sidebar
- **THEN** the `Telemetry & Insights` section contains a `Coverage` link to `#/insights/coverage`, positioned after `Task Cadence` and before `API Specification`

#### Scenario: Visiting the Coverage route
- **WHEN** the user navigates to `#/insights/coverage`
- **THEN** the dashboard renders the `CoverageReport` component with the page title `Coverage · Krokis`

#### Scenario: Coverage link not highlighted on unrelated routes
- **WHEN** the active route is `#/changes` or `#/insights/cadence`
- **THEN** the `Coverage` sidebar link is not marked active