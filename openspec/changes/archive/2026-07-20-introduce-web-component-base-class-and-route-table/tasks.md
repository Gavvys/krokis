## 1. Base class

- [x] 1.1 Create `web/components/_base.js` exporting `class KrokisElement extends HTMLElement` with `attachShadow` in the constructor, `set data`, `set mode`, `connectedCallback`, `disconnectedCallback`, `themechange` listener, `escape`, `themeColor`, and an empty `render()` template method.
- [x] 1.2 Add a `<script src="/components/_base.js"></script>` tag in `web/index.html` immediately before the other component scripts.

## 2. Refactor components to extend KrokisElement

- [x] 2.1 `web/components/InfoBox.js`: extend `KrokisElement`; drop constructor, attachShadow, escape.
- [x] 2.2 `web/components/MetricsCard.js`: extend `KrokisElement`; drop constructor, attachShadow.
- [x] 2.3 `web/components/TaskCadence.js`: extend `KrokisElement`; drop constructor, attachShadow, set data, connectedCallback, escape.
- [x] 2.4 `web/components/TestResults.js`: extend `KrokisElement`; drop constructor, attachShadow, set data, connectedCallback.
- [x] 2.5 `web/components/Changes.js`: extend `KrokisElement`; drop constructor, attachShadow, set data, set mode, connectedCallback, escape.
- [x] 2.6 `web/components/ChangeFlowGraph.js`: extend `KrokisElement`; drop constructor, attachShadow, set change, connectedCallback, theme listener, escape.
- [x] 2.7 `web/components/CommitHeatmap.js`: extend `KrokisElement`; drop constructor, attachShadow, set data, connectedCallback, theme listener.

## 3. Page facade and route table in app.js

- [x] 3.1 Add `mountPage(container, opts)` facade in `web/app.js` that writes a `section-card` shell and mounts a custom element with `data` (and optional `mode`).
- [x] 3.2 Rewrite `renderHealthPage` to use `mountPage`.
- [x] 3.3 Rewrite `renderCadencePage` to use `mountPage` with an `extraMounts` callback that appends the `commit-heatmap` element after the primary `task-cadence`.
- [x] 3.4 Rewrite `renderChangesPage` to use `mountPage`.
- [x] 3.5 Rewrite `renderArchivedPage` to use `mountPage` with `mode: 'archived'`.
- [x] 3.6 Define a `routes[]` table with entries for `#/wiki/<name>`, `#/insights/health`, `#/insights/cadence`, `#/changes`, `#/changes/archived`, `#/changes/<name>`, and `#/insights/openapi`. Each entry has `match(hash)`, `title`, `render(container, params)`.
- [x] 3.7 Replace the `if/else` chain in `handleRoute` with a single dispatcher that iterates the table.
- [x] 3.8 Keep the legacy URL rewrite (`#/insights/flow` → `#/changes`, `#/insights/flow/<x>` → `#/changes/<x>`) as a small pre-dispatch table inside `handleRoute`.

## 4. Validation and docs

- [x] 4.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 4.2 Run `go build ./...` and `go test ./...`.
- [x] 4.3 Use `playwright-cli` to load `/`, `#/changes`, `#/changes/archived`, `#/insights/cadence`, `#/insights/health`, `#/changes/<name>`, and `#/wiki/USER_MANUAL`; confirm zero console errors and the same visible output as before the refactor.
- [x] 4.4 Update `ARCHITECTURE.md` to mention the `KrokisElement` base class and the route table.
- [x] 4.5 Add a `PROJECT_MEMORY.md` decision row.
