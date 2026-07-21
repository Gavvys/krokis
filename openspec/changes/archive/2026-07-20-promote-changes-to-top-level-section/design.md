## Context

Krokis surfaces OpenSpec changes through the `#/insights/flow` route, which lives under the `Telemetry & Insights` sidebar group alongside Project Health, Task Cadence, and API Specification. OpenSpec changes are the heart of the spec-driven workflow, not just another insight, so they deserve a top-level sidebar section parallel to `Project Wiki`. This change moves the change list and flow metrics into a new `Changes` section at `#/changes` and migrates the per-change detail view to `#/changes/<change>`, with a backward-compatible redirect for the old URLs.

## Goals / Non-Goals

**Goals:**
- Add a new top-level `Changes` sidebar section with a single link to `#/changes`.
- Move the existing change list, WIP card, average cycle time, and monthly throughput panel to `#/changes`.
- Move the per-change detail view to `#/changes/<change>` and keep the list/graph toggle, localStorage persistence, and SVG component unchanged.
- Redirect the legacy `#/insights/flow` and `#/insights/flow/<change>` URLs to the new paths via a hash rewrite at the start of `handleRoute`.
- Keep the `FlowInsights` Web Component as the renderer so the implementation stays small; expose it under the new canonical name `Changes` while keeping the old tag as an internal alias for safety.

**Non-Goals:**
- Backend changes. No new endpoints, no payload changes.
- New visual treatment. Same look as the current `Flow Insights` page; the only change is the route and the sidebar group.
- Renaming the `change_flow` payload field or the `change-flow-insights` OpenSpec capability.

## Decisions

- **Client-side hash redirect.** `handleRoute` in `web/app.js` runs a small rewrite table at the top: if the hash is `#/insights/flow`, replace with `#/changes`; if it matches `#/insights/flow/<x>`, replace with `#/changes/<x>`. The browser's history entry updates via `history.replaceState` so the back button is not polluted. Alternatives: HTTP 301 from a Go handler (rejected: this is a single-page app with no server-side routing for hash paths).
- **Component rename with alias.** Rename `FlowInsights.js` to `Changes.js` and define `<changes>` as the new custom element. Keep `<flow-insights>` as a deprecated alias by calling `customElements.define` for both names with the same class. This keeps any third-party embed or saved bookmark working even if it references the old tag.
- **Sidebar markup edit.** Move the existing `Flow Insights` list item out of the `Telemetry & Insights` section and into a new `Changes` section above it. No styling change required; the existing `nav-section` styles already cover top-level sections.
- **Renderer reuse.** `renderFlowPage` becomes `renderChangesPage` and is wired to `#/changes`. The redirect handles the old URL by rewriting before dispatch. `renderChangeDetailPage` is renamed `renderChangeDetail` and dispatches on `#/changes/<change>` (with the same `decodeURIComponent` it already uses).

## Risks / Trade-offs

- **Component class name vs. file name drift** → Mitigation: keep the file named `Changes.js` and the class `Changes extends HTMLElement`; the old `FlowInsights` class and tag become aliases.
- **Bookmark collision during redirect** → Mitigation: use `history.replaceState` to overwrite the bad URL silently, not `location.hash =` (which fires a second `hashchange`).
- **External doc links that say `#/insights/flow`** → Mitigation: update `ARCHITECTURE.md`, `README.md`, and `PROJECT_MEMORY.md` in the same change.

## Migration Plan

1. Edit sidebar HTML to add the `Changes` section and remove the `Flow Insights` item from `Telemetry & Insights`.
2. Rename `FlowInsights.js` to `Changes.js`, define `<changes>` as the primary tag, and keep `<flow-insights>` as a deprecated alias.
3. Update `app.js`: add the legacy-URL redirect table, rename `renderFlowPage` to `renderChangesPage`, dispatch `#/changes` to it, rename `renderChangeDetailPage` to `renderChangeDetail`, and dispatch `#/changes/<change>` to it.
4. Update `ARCHITECTURE.md`, `README.md`, and `PROJECT_MEMORY.md` to reference the new routes.
5. Run `openspec validate --all --strict`, `go build`, and `go test`.

## Open Questions

- Should the `Changes` page title in the browser tab use the word `Changes` or `OpenSpec Changes`? Default: `Changes · Krokis` for brevity.
- Should the `Telemetry & Insights` section header text change to `Insights` now that `Flow Insights` is gone? Default: leave the section text untouched to avoid unrelated diffs.
