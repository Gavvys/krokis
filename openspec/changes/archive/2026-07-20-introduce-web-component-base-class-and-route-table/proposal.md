## Why

Every Web Component in `web/components/` repeats the same boilerplate: attach a shadow root, define a `set data` setter, hook `connectedCallback` to `render`, redefine an `escape` helper. Seven components, ~140 lines of duplication. The dashboard's page renderers in `web/app.js` also repeat a four-line pattern: write a `section-card` HTML, create an element, assign `data`, append. The router is an 8-arm `if/else` chain in `handleRoute`. None of this is wrong, but the repetition hides the actual differences (per-component render logic, per-page content) and makes adding a new component or route harder than it needs to be.

## What Changes

- Add a `KrokisElement` base class in `web/components/_base.js` that owns the shared Web Component boilerplate: `attachShadow` in the constructor, a `set data` setter that triggers `render`, a `connectedCallback` that triggers `render`, a `themechange` listener, an `escape` helper, and an empty `render()` template method that subclasses override.
- Refactor all seven existing components (`InfoBox`, `MetricsCard`, `TaskCadence`, `TestResults`, `Changes`, `ChangeFlowGraph`, `CommitHeatmap`) to extend `KrokisElement` and drop the duplicated code. Each component keeps its own `render()` and any component-specific helpers.
- Add a `mountPage(container, opts)` facade in `web/app.js` that builds the standard `section-card` shell, mounts a custom element by tag, assigns `data` and optional `mode`, and runs an optional `extraMounts` callback for pages that need more than one element.
- Convert `renderHealthPage`, `renderCadencePage`, `renderChangesPage`, `renderArchivedPage` to use `mountPage`. Keep `renderChangeDetail` and `renderWikiPage` as-is because they have richer structure that the facade does not need to absorb.
- Convert the `if/else` chain in `handleRoute` to a table-driven router: a `routes[]` array of `{pattern, title, render}` entries, plus a single dispatcher that matches and dispatches. Legacy URL redirects stay as a small pre-dispatch table.
- No changes to routes, payload, or backend. No new build step. No new external dependency.

## Capabilities

### New Capabilities
- `krokis-element-base`: A `KrokisElement` Web Component base class that owns shadow DOM setup, the `data` setter, `connectedCallback` to `render`, theme-change subscription, and a shared `escape` helper. Subclasses override `render()` to provide component-specific output.

### Modified Capabilities
- `web-dashboard`: Update the page rendering requirement so each page route dispatches via a single `mountPage` facade and `handleRoute` uses a table-driven router instead of an `if/else` chain.

## Impact

- New file: `web/components/_base.js` (~30 lines).
- Modified files: every file in `web/components/` (drop boilerplate, extend base), `web/index.html` (load `_base.js` first), `web/app.js` (route table, `mountPage` helper, simplified page renderers).
- No backend changes. No new endpoints. No new payload fields.
- No breaking changes for users. All routes, component tags, and payload contracts stay the same.
- Documentation updates: `ARCHITECTURE.md` (System Data Flow bullet), `PROJECT_MEMORY.md` decision row.
