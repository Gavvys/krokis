## 1. Tauri v2 Desktop Scaffold & Setup

- [x] 1.1 Scaffold `src-tauri/` crate with `Cargo.toml`, `tauri.conf.json`, `tauri-plugin-dialog`, and `tauri-plugin-store`.
- [x] 1.2 Configure frontend static build output directory in `tauri.conf.json` targeting `web/`.
- [x] 1.3 Add Tauri build script and native window configurations (minimum dimensions 1024x720, dark title bar).

## 2. Rust Telemetry & IPC Core

- [x] 2.1 Implement `src-tauri/src/metrics/git.rs` for Git log parsing and commit cadence gathering.
- [x] 2.2 Implement `src-tauri/src/metrics/codebase.rs` for lines of code (LOC) and file count breakdowns.
- [x] 2.3 Implement `src-tauri/src/metrics/change_flow.rs` for active and archived OpenSpec change scanning.
- [x] 2.4 Implement `src-tauri/src/metrics/coverage.rs` for spec-to-code requirement identifier scanning.
- [x] 2.5 Implement `src-tauri/src/wiki.rs` for SNAKE_CASE wiki listing, loading, indexing, and template creation.
- [x] 2.6 Expose Rust Tauri `#[tauri::command]` handlers (`get_insights`, `list_wiki_files`, `get_wiki_content`, `create_wiki_page`).

## 3. Project Hub & Multi-Project Management

- [x] 3.1 Implement `src-tauri/src/projects.rs` managing active project path state and recent projects store.
- [x] 3.2 Expose Project Hub IPC commands (`get_recent_projects`, `add_recent_project`, `select_project_folder`).
- [x] 3.3 Create `<project-selector>` Web Component in `web/components/ProjectSelector.js` with dropdown UI and native folder picker trigger.
- [x] 3.4 Mount `<project-selector>` in the sidebar header inside `web/index.html`.

## 4. Frontend SPA IPC Integration

- [x] 4.1 Refactor `web/app.js` to replace HTTP `fetch('/api/...')` calls with `@tauri-apps/api` `invoke()` calls.
- [x] 4.2 Bind project change events to reload telemetry, changes, coverage, and wiki links when switching workspace contexts.
- [x] 4.3 Bundle local offline copies of Marked, Prism, and RapiDoc into `web/vendor/` to remove external CDN runtime dependencies.

## 5. Canonical Reference & Documentation Updates

- [x] 5.1 Update `PRODUCT.md` to reflect the Tauri desktop app, Project Hub multi-workspace vision, and local desktop execution.
- [x] 5.2 Update `ARCHITECTURE.md` to document the Tauri v2 Rust backend architecture, IPC commands, and frontend integration.
- [x] 5.3 Update `README.md` with desktop setup, build instructions (`cargo tauri dev`), and desktop feature overview.
- [x] 5.4 Update `PROJECT_MEMORY.md` with settled decision entries for the Tauri v2 Rust migration and Project Hub.
