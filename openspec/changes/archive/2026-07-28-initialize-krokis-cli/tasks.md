## 1. Desktop Application Scaffold

- [x] 1.1 Create `src-tauri/Cargo.toml` and setup Tauri v2 dependencies
- [x] 1.2 Implement Tauri IPC command handlers in `src-tauri/src/`
- [x] 1.3 Implement Project Hub workspace selection and persistence

## 2. Wiki & Telemetry

- [x] 2.1 Implement SNAKE_CASE wiki listing and creation in `src-tauri/src/wiki.rs`
- [x] 2.2 Implement Rust telemetry gatherers under `src-tauri/src/metrics/`
- [x] 2.3 Expose `get_insights`, `list_wiki_files`, `get_wiki_content`, and `create_wiki_page` IPC commands

## 3. Frontend Dashboard

- [x] 3.1 Build Material 3 Web Component SPA under `web/`
- [x] 3.2 Wire frontend `invoke()` calls to Rust IPC commands
- [x] 3.3 Mount Project Hub selector and theme toggle in sidebar

## 4. Agent Skills

- [x] 4.1 Scaffold consolidated `.agents/skills/krokis/` skill layout
- [x] 4.2 Document desktop actions and IPC commands in `references/commands.md`
