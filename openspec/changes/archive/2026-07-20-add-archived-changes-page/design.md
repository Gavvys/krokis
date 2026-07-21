## Context

The `#/changes` page currently shows every change (active and completed) in a single table, which mixes work-in-progress with history. The user wants completed changes pulled out into a dedicated `Archived` page so the active queue is easier to scan and archived entries have room to show completion metrics. The new page reuses the existing `change-flow-insights` payload, which already provides `status`, `completed_date`, and `cycle_time_days`.

## Goals / Non-Goals

**Goals:**
- Add a new sidebar link `Archived` under the `Changes` section, visible only when completed changes exist.
- Add a new route `#/changes/archived` that lists every completed change with name, completion date, cycle time, and planning health, each name linked to `#/changes/<name>`.
- Filter the existing `#/changes` table to active changes only. Keep the WIP, average cycle time, and monthly throughput cards on `#/changes` because they describe flow, not history.
- Reuse the existing per-change detail renderer at `#/changes/<name>` for both pages.

**Non-Goals:**
- No backend changes. No new payload fields. No new endpoints.
- No new metrics or aggregation for archived changes. Per-row completion date and cycle time are sufficient.
- No filtering UI on the archived page. Sort by completion date descending is enough.

## Decisions

- **Sidebar link visibility.** The `Archived` link is hidden when the local workspace has zero completed changes. Implementation: a small function in `app.js` reads the change-flow payload after fetch and toggles the link element's `hidden` attribute. No CSS-only trick because we already touch the DOM in the same render path.
- **Filter at the renderer.** The existing `Changes` Web Component receives the full `change_flow` payload. Add a `mode` property (`active` or `archived`) that controls the rendered table. Default is `active` so the existing `#/changes` call site does not need to change. The component picks the appropriate filter and the appropriate row schema (active rows show age; archived rows show completion date and cycle time).
- **No new component.** The same `<changes>` element handles both views; this keeps the file count and the embed manifest small. An alternative is a separate `<archived-changes>` element, but the existing component already covers both cases with one more property.
- **Sort by completion date desc.** Archived rows are sorted by `completed_date` descending so the most recent archive shows first.

## Risks / Trade-offs

- **Component property branching** → Mitigation: keep the `mode` property and the filter logic small; add a unit-testable helper that returns the right row schema based on the mode.
- **Sidebar flicker on refresh** → Mitigation: hide the `Archived` link in HTML by default, then show it inside the same `fetchTelemetry` callback that already runs after a refresh, so the visibility decision is data-driven and consistent.

## Migration Plan

1. Add a small filter helper inside `web/components/Changes.js` and a `mode` property.
2. Update `web/app.js` to set the `mode` based on the route, render `#/changes/archived`, and toggle the sidebar link's visibility based on the change-flow payload.
3. Add the `Archived` link to `web/index.html` with `hidden` by default.
4. Update `ARCHITECTURE.md`, `README.md`, and `PROJECT_MEMORY.md`.
5. Run `openspec validate --all --strict`, `go build`, `go test`.

## Open Questions

- Should the archived page title use `Archived Changes` or just `Archived`? Default: `Archived Changes · Krokis` for clarity.
- Should the `All Changes` link itself be renamed to `Active` now that there are two pages? Default: leave it as `All Changes` to avoid an unrelated diff and because the link still goes to the unified change list view (now restricted to active only).
