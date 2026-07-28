# web-dashboard Specification

## Purpose
Defines the client-side routing, Web Component architecture, rendering pipeline, and Tauri IPC integration for the Krokis desktop application.
## Requirements
### Requirement: Desktop app shell rendering
The Krokis desktop application SHALL render the web dashboard inside a native Tauri webview shell, loading static assets from `web/` and communicating via Tauri IPC commands (`invoke()`).

#### Scenario: Running desktop application
- **WHEN** user launches the Krokis desktop application
- **THEN** system initializes the Tauri IPC bridge and loads the desktop webview interface

### Requirement: Client-side MDX and Web Component rendering
The frontend dashboard SHALL parse MDX documents in the browser and render custom components as Web Components extending `KrokisElement`.

#### Scenario: Loading an MDX file with a custom component
- **WHEN** client-side dashboard loads `ARCHITECTURE.md` or a `.mdx` wiki page containing `<MetricsCard value="98%" label="Test Pass Rate" />`
- **THEN** system parses the MDX, converts `<MetricsCard ... />` into `<metrics-card value="98%" label="Test Pass Rate"></metrics-card>`, and the browser's registered custom element renders the rich animated card

### Requirement: Default landing on WIKI_INDEX
The frontend dashboard routing logic MUST check if `WIKI_INDEX` is available, and load it as the default homepage route if present, falling back to `USER_MANUAL`.

#### Scenario: Routing fallback
- **WHEN** client-side dashboard loads without a specific hash route, and `WIKI_INDEX` is listed in the wiki files
- **THEN** system redirects to `#/wiki/WIKI_INDEX`

### Requirement: Change-flow dashboard route
The dashboard SHALL expose a `#/changes` route that presents local OpenSpec work-in-progress, active-change age, completed-change cycle time, monthly throughput, and planning health from generated insights telemetry. The route SHALL live under the top-level `Changes` sidebar section, not under `Telemetry & Insights`. A per-change detail view SHALL be exposed at `#/changes/<change>`.

#### Scenario: Viewing flow insights
- **WHEN** user visits `#/changes` after telemetry IPC fetching
- **THEN** the dashboard renders the flow measures and each change's planning-health state, and the `Changes` sidebar entry is active

#### Scenario: Viewing unavailable flow data
- **WHEN** a displayed change has unavailable age, cycle-time, or task-count data
- **THEN** the dashboard displays that value as unavailable and does not display zero or a validation-passed claim

### Requirement: Page rendering facade
The dashboard SHALL render content pages through a single `mountPage(container, opts)` facade in `web/app.js`. The facade SHALL accept an options object with `tag` (the custom element tag to mount), `title` (the page heading), `subtitle` (an optional muted line below the title), `mode` (an optional mode value forwarded to the element as `el.mode`), `maxWidth` (an optional CSS max-width for the section card), and `extraMounts` (an optional callback that receives the inner container element for pages that need more than one element). The page renderers for `#/insights/health`, `#/insights/cadence`, `#/changes`, and `#/changes/archived` SHALL be implemented through this facade. Per-change detail (`#/changes/<change>`) and wiki rendering (`#/wiki/<name>`) are out of scope for the facade.

#### Scenario: Rendering a single-element page
- **WHEN** a page route resolves to `mountPage` with a `tag`, `title`, and `subtitle`
- **THEN** the facade writes a `section-card` shell with the given title and subtitle, creates an element of the given tag, assigns `telemetryData` to `el.data`, applies any `mode`, and appends the element to the inner container

#### Scenario: Rendering a multi-element page
- **WHEN** a page route resolves to `mountPage` with an `extraMounts` callback
- **THEN** the facade writes the shell, calls `extraMounts(innerContainer)` after mounting the primary element, and the callback may append additional elements

### Requirement: Table-driven client router
The dashboard SHALL expose its client routes through a single `routes[]` table in `web/app.js` rather than an `if/else` chain in `handleRoute`. Each entry SHALL carry a `match(hash)` predicate, a `title` string for `document.title`, and a `render(container, params)` function. `handleRoute` SHALL resolve the active route by iterating the table in declaration order and SHALL support exact match, prefix match, and parameter capture (for example `#/changes/<name>` capturing the change name).

#### Scenario: Adding a new page route
- **WHEN** a developer wants to add a new dashboard page
- **THEN** they add one entry to the `routes[]` table with a `match`, `title`, and `render` function, and no other code in `handleRoute` needs to change

#### Scenario: Legacy URL redirects stay table-driven
- **WHEN** a deprecated URL is loaded
- **THEN** a small `legacyRedirects[]` table rewrites the hash via `history.replaceState` before the main router runs

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

### Requirement: Material 3 design tokens
The web dashboard SHALL consume the design token set defined by the `mui-design-tokens` capability. The dashboard SHALL load `web/tokens.css` before any other Krokis stylesheet, SHALL use PT Sans for body and JetBrains Mono for monospace text, SHALL apply Material 3 surface colors (no glassmorphism), Material 3 elevation (1-5) on cards and panels, Material 3 motion curves and durations on every transition, and Material 3 state layers on every interactive element. Existing CSS class names (`.section-card`, `.btn`, `.btn-secondary`, `.icon-btn`, `.nav-link`, `.wiki-nav-link`, `.api-spec-badge-link`, `.markdown-body`, `.change-detail-*`, `.view-toggle-btn`, etc.) SHALL preserve their names; only the property values they resolve to change. No Web Component, router, or JavaScript logic SHALL be modified to satisfy this requirement.

#### Scenario: Dashboard applies the Material 3 theme
- **WHEN** a user loads any dashboard route
- **THEN** the visible surfaces, typography, motion, and state-layer behavior all come from `web/tokens.css` rather than the legacy ad-hoc theme

#### Scenario: No glassmorphism remains
- **WHEN** a developer searches `web/` for `backdrop-filter` or `--glass-bg`
- **THEN** no Krokis stylesheet or HTML file contains either token

### Requirement: Dark and light theme toggle
The web dashboard SHALL expose a manual dark/light theme toggle as defined by the `theme-management` capability. The dashboard SHALL default to dark, SHALL persist the user's choice to `localStorage.krokis.theme`, and SHALL set the `data-theme` attribute on `<html>` before any stylesheet loads to prevent a flash of wrong theme on first paint.

#### Scenario: Default dark
- **WHEN** a user visits the dashboard for the first time with no `localStorage.krokis.theme` value
- **THEN** the dashboard renders with the M3 dark token set

#### Scenario: Toggle is reachable
- **WHEN** the dashboard renders any route
- **THEN** the sidebar header contains the theme toggle button defined by the `theme-management` capability

#### Scenario: Light theme applies
- **WHEN** a user clicks the toggle while the dashboard is in dark mode
- **THEN** the M3 light token set takes effect, the user's choice is persisted, and the next reload restores the light theme

### Requirement: Roadmap Kanban dashboard route
The dashboard SHALL expose a `#/roadmap` route that renders a `RoadmapBoard` Web Component (`web/components/RoadmapBoard.js`) extending `KrokisElement`, mounted via `mountPage`. The page title SHALL be `Roadmap · Krokis`. The route SHALL fetch board data from the `get_roadmap` IPC command rather than from `telemetryData` alone.

#### Scenario: Rendering the Roadmap page
- **WHEN** the user navigates to `#/roadmap`
- **THEN** the router matches `#/roadmap`, sets document title `Roadmap · Krokis`, and mounts `roadmap-board` inside a `section-card` via `mountPage`

#### Scenario: Roadmap link activation
- **WHEN** the active hash is `#/roadmap`
- **THEN** the sidebar `Roadmap` link has the `active` class and Telemetry insight links do not

### Requirement: Wiki sidebar title transformation
The dashboard SHALL display each Project Wiki sidebar page using a human-readable Sentence Case title derived from its SNAKE_CASE filename, without displaying the source filename separately.

#### Scenario: Displaying a root master file
- **WHEN** the wiki IPC returns `ARCHITECTURE.md`
- **THEN** the sidebar displays `Architecture` without a separate filename subtitle

#### Scenario: Displaying a wiki MDX file
- **WHEN** the wiki IPC returns `USER_MANUAL.mdx`
- **THEN** the sidebar displays `User Manual` without a separate filename subtitle

