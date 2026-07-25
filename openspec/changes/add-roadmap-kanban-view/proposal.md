## Why

`ROADMAP.md` already encodes commitment horizons as Markdown headings and bullets, but the dashboard only shows it as a wiki prose page. [E: `ROADMAP.md` sections Now/Queued/Exploring/Parked/Shipped] A view-only Kanban projection makes those horizons scannable without inventing a second source of truth or write-back editor. [I: agents already reorganize Markdown; the UI should project, not mutate]

## What Changes

- Add a Rust parser that reads workspace-root `ROADMAP.md` and returns structured columns/cards over Tauri IPC.
- Add a dashboard route `#/roadmap` that renders a read-only Kanban board from that payload.
- Add a sidebar entry for Roadmap (distinct from the wiki prose view of `ROADMAP.md`).
- Keep `ROADMAP.md` as the sole writable source; the board never edits the file.
- Update `ARCHITECTURE.md`, `ROADMAP.md` (Now), and `PROJECT_MEMORY.md` to record the view-only board convention.

## Capabilities

### New Capabilities
- `roadmap-kanban-view`: Parse `ROADMAP.md` into commitment-lane columns and render a view-only Kanban board in the desktop dashboard.

### Modified Capabilities
- `web-dashboard`: Add `#/roadmap` route, sidebar link, and `mountPage` usage for the Kanban component.

## Impact

- **Backend**: new module under `src-tauri/src/` (or metrics sibling), new `get_roadmap` IPC command registered in `lib.rs`. [E: `src-tauri/src/lib.rs` invoke handler]
- **Frontend**: new Web Component, route entry, sidebar link in `web/index.html` / `web/app.js`. [E: `web/app.js` `routes[]` and `mountPage`]
- **Docs**: `ARCHITECTURE.md`, `ROADMAP.md`, `PROJECT_MEMORY.md`.
- **Non-goals**: drag-and-drop, Markdown write-back, live filesystem watching beyond existing refresh, nested sub-bullet cards as a hierarchy editor.
