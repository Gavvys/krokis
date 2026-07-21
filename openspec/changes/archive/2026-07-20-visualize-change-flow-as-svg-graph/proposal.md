## Why

The dashboard surfaces OpenSpec change data as flat lists and counters, but the artifact structure (proposal → tasks → spec deltas) is invisible. Users opening Krokis cannot see at a glance what an active change actually contains, how its parts relate, or where it is in the proposal-to-implementation flow. This makes OpenSpec feel like opaque markdown instead of a structured workflow. Visualizing each active change as an SVG flow graph turns the workflow into something readable at a glance and gives the change page a real purpose.

## What Changes

- Render an SVG change-flow graph on the dashboard change detail view that connects proposal, design, spec deltas, and tasks for the selected change.
- Reuse the existing `change-flow-insights` data path: derive nodes and edges from the same change directory the telemetry already reads.
- Add a Krokis design-system SVG component (`web/components/ChangeFlowGraph.js`) that emits an inline SVG, supports light and dark themes, and honors the glassmorphism palette.
- Extend the change detail view with a tab or section toggle: list (current) ↔ graph (new). The graph becomes the default when the change has a `proposal.md` and at least one of `design.md`, `specs/`, or `tasks.md`.
- Surface artifact presence and task progress inside the graph as node badges (e.g. "12/18 tasks", "3 specs"), reusing the planning-health data already produced by `change-flow-insights`.

## Capabilities

### New Capabilities
- `change-flow-visualization`: SVG graph rendering of the proposal → design → spec-deltas → tasks pipeline for a single active OpenSpec change, plus list/graph view toggle on the change detail page.

### Modified Capabilities
- `change-flow-insights`: add a requirement that the dashboard change detail view exposes a graph representation derived from the same change-flow records, with node badges reflecting planning-health evidence.

## Impact

- New files: `web/components/ChangeFlowGraph.js`, styles in `web/styles.css` (section banner), and an entry on the change detail page.
- Modified files: `web/app.js` (mount the component, wire toggle, default selection), `web/index.html` (graph container), `internal/metrics/...` only if a new endpoint is needed (likely not; reuse existing insights JSON).
- No new Go dependencies. No backend schema changes unless we choose a dedicated `/api/changes/<id>/flow` endpoint; default is to derive in the frontend from the change-flow-insights payload.
- No breaking changes. Pure additive UI.
