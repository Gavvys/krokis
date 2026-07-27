## ADDED Requirements

### Requirement: Roadmap Kanban dashboard route
The dashboard SHALL expose a `#/roadmap` route that renders a `RoadmapBoard` Web Component (`web/components/RoadmapBoard.js`) extending `KrokisElement`, mounted via `mountPage`. The page title SHALL be `Roadmap · Krokis`. The route SHALL fetch board data from the `get_roadmap` IPC command rather than from `telemetryData` alone.

#### Scenario: Rendering the Roadmap page
- **WHEN** the user navigates to `#/roadmap`
- **THEN** the router matches `#/roadmap`, sets document title `Roadmap · Krokis`, and mounts `roadmap-board` inside a `section-card` via `mountPage`

#### Scenario: Roadmap link activation
- **WHEN** the active hash is `#/roadmap`
- **THEN** the sidebar `Roadmap` link has the `active` class and Telemetry insight links do not
