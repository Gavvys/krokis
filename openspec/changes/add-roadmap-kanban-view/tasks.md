## 1. Backend parser and IPC

- [x] 1.1 Add `src-tauri/src/roadmap.rs` that parses `ROADMAP.md` into ordered columns (Now, Queued, Exploring, Parked, Shipped) and top-level bullet cards with optional `**title**: body` split
- [x] 1.2 Register `get_roadmap` IPC in `lib.rs` (spawn_blocking, resolve workspace like other commands) and export the module
- [x] 1.3 Add unit tests for heading whitelist, title split, missing file, and ignored unknown sections

## 2. Frontend board

- [x] 2.1 Create `web/components/RoadmapBoard.js` (`<roadmap-board>`) rendering five read-only columns and cards using design tokens
- [x] 2.2 Add `#/roadmap` route + `renderRoadmapPage` in `web/app.js` that invokes `get_roadmap` and mounts via `mountPage`
- [x] 2.3 Add sidebar `Roadmap` link in `web/index.html` and load the component script
- [x] 2.4 Wire refresh / project switch so `#/roadmap` reloads board data

## 3. Docs and validation

- [x] 3.1 Update `ARCHITECTURE.md`, set this change as Now in `ROADMAP.md`, and record the view-only decision in `PROJECT_MEMORY.md`
- [x] 3.2 Run `cargo test` / `cargo check` and `openspec validate` for the change
