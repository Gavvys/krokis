# web-dashboard Specification (delta)

## ADDED Requirements

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
