## 1. Backend: extend change-flow-insights with artifact map

- [x] 1.1 Add `ArtifactMap map[string][]string` to the insights payload struct in `internal/metrics`.
- [x] 1.2 Populate `ArtifactMap` while walking `openspec/changes/<change>/`; include `proposal.md`, `design.md`, `tasks.md`, and every file under `specs/` when present.
- [x] 1.3 Add a unit test that asserts a known fixture change produces the expected artifact list and that an absent artifact is omitted.
- [x] 1.4 Run `go test ./...` and `go build ./...`.

## 2. Frontend: build ChangeFlowGraph component

- [x] 2.1 Create `web/components/ChangeFlowGraph.js` exporting a custom element that renders an inline SVG of the four-stage flow.
- [x] 2.2 Read nodes from a `change` property; derive the column list from artifact presence (skip empty stages).
- [x] 2.3 Read task progress from the existing planning-health payload; show `done/total` or `—` on the tasks node.
- [x] 2.4 Apply Krokis design tokens via `var(--…)` and re-render on `themechange` events.
- [x] 2.5 Add a new numbered section in `web/styles.css` for the graph with a banner comment.

## 3. Frontend: wire component into change detail view

- [x] 3.1 Add a graph container element to the change detail template in `web/index.html` (or render it from `web/app.js`).
- [x] 3.2 In `web/app.js`, mount `<change-flow-graph>` when a change is selected and the artifact set has a proposal plus at least one other artifact.
- [x] 3.3 Add a list/graph toggle as a two-segment pill in the change detail header; default to graph per the spec.
- [x] 3.4 Persist the selected mode under `krokis.changeViewMode` in `localStorage`; restore on subsequent selections in the same session.

## 4. Validation and docs

- [x] 4.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 4.2 Update `ARCHITECTURE.md` to mention the change-flow graph component and the new `ArtifactMap` payload field.
- [x] 4.3 Update `PROJECT_MEMORY.md` with a one-line decision entry for the graph component location and the artifact-map payload extension.
- [x] 4.4 Manually verify light and dark themes, list/graph toggle persistence, and the absence fallback (`—` badge).
