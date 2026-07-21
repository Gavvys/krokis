## Context

Krokis already produces change-flow telemetry from `openspec/changes/` via `internal/metrics`, and the dashboard surfaces active changes, planning health, and cycle times as lists and counters. The user expects the dashboard to visualize OpenSpec artifacts as a structured workflow, not as flat markdown. This change adds a single-component SVG graph on the change detail view that maps proposal → design → spec deltas → tasks using nodes, edges, and badges derived from the existing change-flow-insights data.

## Goals / Non-Goals

**Goals:**
- Add `web/components/ChangeFlowGraph.js` as a self-contained custom element that renders an inline SVG.
- Derive nodes and edges on the frontend from data already exposed by `change-flow-insights`; no new backend endpoint required.
- Place a list/graph toggle on the change detail view, default to graph when the change has a proposal plus at least one other artifact, persist the choice in `localStorage`.
- Apply Krokis design tokens, light/dark theming, and the existing glassmorphism palette.

**Non-Goals:**
- New Go endpoints, new metrics, or new schemas.
- Drag-and-drop editing of the graph; the graph is read-only.
- Animated auto-layout; the layout is hand-tuned to keep the markup small and the visual stable across changes.
- Cross-change graphs; this is single-change only.

## Decisions

- **Custom element, no library.** The graph is small (≤ 4 nodes, ≤ 3 edges), so a hand-written inline SVG inside a Web Component is cheaper and on-brand. D3 or Mermaid would add bytes and visual drift from the rest of the dashboard. The component reads `:host` CSS variables for theme and re-renders on a `themechange` event.
- **Frontend derivation from existing payload.** Reuse the `change-flow-insights` JSON to build nodes; do not add `/api/changes/<id>/flow`. The frontend already knows the selected change name and can walk its directory contents via a small new read-only endpoint, or via the existing `/api/insights` payload extended with per-change artifact map.
- **Decision: extend `/api/insights` with `ArtifactMap map[string][]string`.** Each key is a change name; values are artifact paths relative to the change root. This avoids a new endpoint and keeps the frontend pure. The map is built by `internal/metrics` while it already walks the change directories.
- **Layout: horizontal flow, fixed column per stage.** Columns: `proposal`, `design`, `specs`, `tasks`. Each column gets equal width. Nodes are 160 × 64 with rounded corners (radius from `--radius-md`). Edges are cubic Bézier curves drawn from right-mid of source to left-mid of target. Empty stages are skipped without leaving gaps in the column count.
- **Badge content from planning health.** Tasks node reads `done`/`total` from the existing task count. Specs node shows the count of delta files. Design and proposal nodes show a check mark when present and `—` when absent.
- **Toggle as two-segment pill.** Matches the existing design language used by route tabs in the sidebar. Active segment uses the surface-elevated token; inactive uses transparent.

## Risks / Trade-offs

- **Long change names overflow node width** → Mitigation: truncate at 18 chars and add a `<title>` tooltip with the full name.
- **Theme switch mid-render desyncs colors** → Mitigation: subscribe to a `themechange` `CustomEvent` on `document` and re-render.
- **Adding `ArtifactMap` to insights changes the existing public payload** → Mitigation: additive field; existing consumers ignore unknown keys. Document in `ARCHITECTURE.md` after implementation.

## Migration Plan

1. Implement `internal/metrics` extension to populate `ArtifactMap`.
2. Implement `web/components/ChangeFlowGraph.js` and add styles in `web/styles.css` under a new section banner.
3. Wire the component into the change detail view in `web/app.js` and `web/index.html`; add the list/graph toggle.
4. Run `go build`, `go test`, and `openspec validate --all --strict`.
5. Archive change.

## Open Questions

- Should the graph also include the change's `.openspec.yaml` `created` date as a footer on the proposal node? Default: yes, low cost.
- Should the `Krokis design tokens` reference live in a shared `tokens.css` rather than `web/styles.css`? Default: keep in `styles.css` for now to avoid scope creep.
