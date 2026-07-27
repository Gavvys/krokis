## ADDED Requirements

### Requirement: Parse ROADMAP.md into commitment columns
The system SHALL expose a Tauri IPC command `get_roadmap` that reads the active workspace root file `ROADMAP.md` and returns a structured board with columns for horizons `Now`, `Queued`, `Exploring`, `Parked`, and `Shipped` in that order. Each column SHALL contain zero or more cards derived from top-level Markdown list items (`- …`) under the matching `##` heading. Nested list items SHALL NOT become separate cards.

#### Scenario: Parsing a standard roadmap
- **WHEN** `get_roadmap` runs against a workspace whose `ROADMAP.md` contains `## Queued` with a bullet `- **Wiki content enrichment**: improve docs`
- **THEN** the Queued column includes a card with title `Wiki content enrichment` and body text beginning with `improve docs`

#### Scenario: Missing roadmap file
- **WHEN** `get_roadmap` runs against a workspace with no `ROADMAP.md`
- **THEN** the command succeeds with all five columns present and empty card lists (or a single empty-state flag), and does not fail the desktop session

#### Scenario: Unknown headings ignored
- **WHEN** `ROADMAP.md` contains an additional `## Notes` section with bullets
- **THEN** those bullets are not included in any Kanban column

### Requirement: View-only roadmap Kanban board
The desktop dashboard SHALL render a read-only Kanban board at `#/roadmap` using a Web Component that extends `KrokisElement`. The board SHALL display the five commitment columns and their cards. The UI SHALL NOT provide drag-and-drop, inline editing, or any control that mutates `ROADMAP.md`.

#### Scenario: Visiting the Roadmap route
- **WHEN** the user navigates to `#/roadmap`
- **THEN** the dashboard loads roadmap data via `get_roadmap` and renders the five columns with page title `Roadmap · Krokis`

#### Scenario: Refresh reloads the board
- **WHEN** the user triggers the existing refresh action while on `#/roadmap`
- **THEN** the board re-fetches `get_roadmap` and re-renders from the current file contents

### Requirement: Roadmap sidebar entry
The dashboard sidebar SHALL include a `Roadmap` link to `#/roadmap`, placed in a planning-adjacent section (alongside Changes, not under Telemetry & Insights). The wiki prose link to `ROADMAP` MAY remain available under Project Wiki.

#### Scenario: Sidebar shows Roadmap
- **WHEN** the dashboard renders the sidebar
- **THEN** a `Roadmap` nav link targets `#/roadmap` and is marked active when that route is selected
