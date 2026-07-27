## Context

Krokis already surfaces root canonical files (including `ROADMAP.md`) through the wiki reader. [E: `web/app.js` canonicals list includes `ROADMAP`] Horizons are commitment lanes defined by AGENTS and the roadmap workflow, not sprint columns. [E: `AGENTS.md` Roadmap horizons; `.agents/skills/krokis/workflows/roadmap.md`]

## Goals / Non-Goals

**Goals:**
- Project `ROADMAP.md` into five read-only columns: Now, Queued, Exploring, Parked, Shipped.
- Treat each top-level bullet under those headings as a card.
- Split optional `**Title**: body` into title + body for display.
- Refresh via the existing refresh / project-switch path (re-invoke IPC).

**Non-Goals:**
- Drag-and-drop or any UI that writes Markdown.
- Nested sub-bullets as child cards (ignore or flatten as plain body text only if attached to the parent line; top-level bullets only for card identity).
- Replacing the wiki prose view of `ROADMAP.md`.

## Decisions

1. **Dedicated IPC `get_roadmap`** instead of folding into `get_insights`. [I: roadmap is not telemetry; keeps insights payload focused and allows independent refresh]
2. **Strict heading whitelist** for columns: `Now`, `Queued`, `Exploring`, `Parked`, `Shipped` (case-sensitive `##` headings). Other `##` sections are ignored. [E: current `ROADMAP.md` uses exactly those names]
3. **Card identity = top-level `- ` lines** under a known heading. Empty / placeholder bullets like `(none — …)` still appear as cards so emptiness is visible. [I: clearer than hiding empty Now]
4. **Title extraction**: if a bullet starts with `**…**` optionally followed by `:` and remainder, use the bold span as title and the remainder as body; otherwise the whole bullet text is the title and body is empty.
5. **UI**: `RoadmapBoard` Web Component via `mountPage` at `#/roadmap`, sidebar section near Changes (commitment planning neighbor). [I: not under Telemetry; it is strategy, not metrics]
6. **Optional deep links**: when a card title or body contains a backtick-wrapped kebab-case token that matches an active/archived change name in current telemetry, render that token as a `#/changes/<name>` link. No write path.

## Risks / Trade-offs

- [Risk] Divergent Markdown style breaks parsing → Mitigation: document the expected heading/bullet shape in the skill roadmap workflow; degrade gracefully with empty columns + empty-state message when file missing.
- [Risk] Shipped column grows long → Mitigation: board is horizontally scrollable; no pagination in v1.
- [Trade-off] View-only means users cannot reorder in UI → Acceptable: agents own Markdown edits.

## Migration Plan

Ship behind the new route only; wiki `#/wiki/ROADMAP` remains. No data migration.
