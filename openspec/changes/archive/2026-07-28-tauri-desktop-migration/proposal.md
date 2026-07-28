## Why

[E: PRODUCT.md / ARCHITECTURE.md pre-migration state] Krokis previously operated as a Go CLI with an embedded HTTP server serving a single workspace over a browser tab.
[I: User feedback and Agents Window UX paradigm] Users want a native desktop application with a multi-project selector hub (similar to Cursor's Agents Window), eliminating manual server management and allowing instant switching between local OpenSpec repositories.
[E: PRODUCT.md / ARCHITECTURE.md post-migration] Rewriting the telemetry and project engine into pure Rust with Tauri v2 provides a native desktop shell, direct OS file-system and dialog integration, and desktop state persistence without running a local web server or sidecar process.

## What Changes

- **Desktop Shell**: Replaces the Go CLI and HTTP server runtime with a Tauri v2 desktop application written in Rust and HTML/JS/CSS.
- **Multi-Project Hub**: Adds a top-level project selector dropdown with recent workspace memory, native folder picking, and quick workspace registration.
- **Pure Tauri-Rust Engine**: Translates telemetry scanning (Git activity, lines of code, change flow, and spec coverage) and SNAKE_CASE wiki indexing into native Rust Tauri IPC commands (`invoke`).
- **BREAKING**: Replaces the Go binary (`krokis`) and HTTP endpoints (`/api/insights`, `/api/wiki`, `/api/openapi`) with Tauri native commands. `krokis serve` and local HTTP listening are removed.
- **Dashboard Refactor**: Refactors the frontend SPA (`web/`) to communicate via Tauri `@tauri-apps/api` IPC invocations instead of HTTP `fetch()`, preserving the Material 3 design system and Web Component architecture.

## Capabilities

### New Capabilities
- `desktop-app-shell`: Defines the Tauri v2 desktop application shell, window management, and native system integration.
- `project-hub`: Manages multi-project registration, project switching, workspace path validation, and recent projects persistence.

### Modified Capabilities
- `project-insights`: Replaces HTTP JSON responses with native Tauri IPC telemetry commands for Git metrics, lines of code, change flow, and spec coverage.
- `wiki-management`: Replaces HTTP wiki endpoints with native Tauri IPC commands for SNAKE_CASE wiki listing, loading, and creation across active workspace roots.
- `web-dashboard`: Replaces HTTP `fetch()` data fetching with Tauri IPC calls and binds project selector state to the top-level navigation layout.

## Impact

- **Backend Architecture**: Go codebase (`main.go`, `internal/`) is replaced by a Tauri v2 Rust crate (`src-tauri/`) and pure Rust file-system / Git telemetry logic.
- **Frontend SPA**: `web/` assets adapt from HTTP REST calls (`fetch('/api/...')`) to `@tauri-apps/api` `invoke(...)` calls.
- **Dependencies**: Adds Rust toolchain, Tauri v2, `serde`, `git2` (or Rust `std::process::Command`), and `tauri-plugin-dialog` / `tauri-plugin-store`. Removes Go module dependencies (`spf13/cobra`, `go-toml/v2`).
- **Canonical Docs**: Requires major updates to `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `README.md`, and `PROJECT_MEMORY.md`.
