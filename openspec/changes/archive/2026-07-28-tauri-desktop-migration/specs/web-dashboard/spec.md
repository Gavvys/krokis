## MODIFIED Requirements

### Requirement: Desktop app client router and IPC bridge
The web dashboard SHALL run inside the Tauri desktop webview and communicate with the Rust backend via Tauri IPC `invoke()` calls instead of HTTP REST endpoints. The dashboard navigation header SHALL render a top-level `<project-selector>` Web Component.

#### Scenario: Dashboard loads via Tauri IPC
- **WHEN** dashboard initializes inside the Tauri webview
- **THEN** app fetches initial project list and telemetry using `invoke('get_insights')` and `invoke('list_wiki_files')`, and mounts the `<project-selector>` component in the sidebar header
