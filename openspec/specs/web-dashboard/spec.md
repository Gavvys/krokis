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
The dashboard SHALL expose a `#/changes` route that presents local OpenSpec work-in-progress, active-change age, completed-change cycle time, monthly throughput, and planning health from generated insights telemetry. The route SHALL live under the top-level `Changes` sidebar section, not under `Telemetry & Insights`. A per-change detail view SHALL be exposed at `#/changes/<change>`.

#### Scenario: Viewing flow insights
- **WHEN** user visits `#/changes` after `krokis insights` generated flow data
- **THEN** the dashboard renders the flow measures and each change's planning-health state, and the `Changes` sidebar entry is active

#### Scenario: Viewing unavailable flow data
- **WHEN** a displayed change has unavailable age, cycle-time, or task-count data
- **THEN** the dashboard displays that value as unavailable and does not display zero or a validation-passed claim

### Requirement: Wiki sidebar source subtitles
The dashboard SHALL display the source filename returned for every Project Wiki sidebar page as a subtitle below its page title. The subtitle SHALL use visually muted styling and SHALL preserve the filename extension.

#### Scenario: Displaying a root master file
- **WHEN** the wiki API returns `ARCHITECTURE.md`
- **THEN** the sidebar shows the page title and `ARCHITECTURE.md` as its muted subtitle

#### Scenario: Displaying a wiki MDX file
- **WHEN** the wiki API returns `USER_MANUAL.mdx`
- **THEN** the sidebar shows the page title and `USER_MANUAL.mdx` as its muted subtitle

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

