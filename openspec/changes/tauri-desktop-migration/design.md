## Context

[E: PRODUCT.md / ARCHITECTURE.md pre-migration state] Krokis previously ran as a Go CLI with Cobra commands and an embedded HTTP server (`net/http`) serving a single workspace directory (`.`).
[E: proposal.md:Why] The proposal transitions Krokis from a Go web server to a native Tauri v2 desktop application in Rust, adding a multi-project hub with project selection similar to Cursor's Agents Window.

## Goals / Non-Goals

**Goals:**
- Re-architect Krokis into a Tauri v2 desktop application with Rust backend IPC logic.
- Implement a top-level Project Hub dropdown in the frontend with workspace path switching, recent projects memory, and native OS folder picker.
- Re-implement telemetry gathering (Git log parsing, LOC line counting, OpenSpec change flow, spec coverage) and SNAKE_CASE wiki management natively in Rust.
- Keep the Material 3 design system, Web Component architecture (`KrokisElement`), and client-side MDX rendering untouched while replacing `fetch()` HTTP calls with Tauri IPC `invoke()` calls.

**Non-Goals:**
- Running a background Go HTTP daemon or sidecar binary.
- Cloud database syncing or team collaboration servers; Krokis remains local-first and directory-based.
- Re-writing the frontend UI in React or Vue; the Web Component SPA remains zero-framework.

## Decisions

### Decision 1: Tauri v2 with Native Rust Backend Commands
[E: src-tauri/Cargo.toml] Create a standard Tauri v2 layout under `src-tauri/` using Rust.
[I: Native IPC performance and security] Expose Rust functions annotated with `#[tauri::command]` for telemetry, wiki operations, and project management. The frontend calls these using `@tauri-apps/api/core` `invoke()`.
*Alternatives considered:*
- Go sidecar binary: Keeps Go code but requires managing sidecar process lifecycles, network ports, and local IPC serialization overhead. Tauri Rust native commands are cleaner and more self-contained.

### Decision 2: Project Hub State & Store Persistence
[I: Persistent recent projects] Use `tauri-plugin-store` to persist recent project paths (`recent_projects: string[]`) and active project path (`active_project: string`).
[E: web/app.js] The sidebar top section gains a `<project-selector>` component that displays the current project name, a dropdown of recent projects, and a "+ Open Project..." button backed by `tauri-plugin-dialog`.
*Alternatives considered:*
- `localStorage` in webview: Works, but Tauri store is file-backed in user app data and accessible natively by Rust IPC commands before webview mount.

### Decision 3: Rust Telemetry Gatherer Implementation
[I: Parity with Go metrics] Implement Rust modules under `src-tauri/src/metrics/`:
- `git.rs`: Runs `git log` commands via `std::process::Command` against the active workspace root.
- `codebase.rs`: Walks the workspace directory using `ignore` or `walkdir` crate, counting lines and files by extension.
- `change_flow.rs`: Parses `openspec/changes/` (active and archived) for created dates, tasks checkboxes, and planning artifacts.
- `coverage.rs`: Extracts spec requirements from `openspec/specs/` and performs substring identifier searches across source files.

## Risks / Trade-offs

- [Risk: Cross-platform compilation requirements for Rust] → Mitigation: Standard Tauri v2 CI workflow using GitHub Actions builds native macOS, Windows, and Linux binaries.
- [Risk: IPC payload serialization overhead on large workspaces] → Mitigation: Keep telemetry payloads structured and under 1MB; scan async off the main GUI thread in Rust.
- [Risk: Loss of standalone CLI tool usage (`krokis insights` in terminal)] → Mitigation: Tauri app binary can support headless CLI subcommands in `main.rs` if required in future.

## Open Questions

- Should the desktop app bundle offline web dependencies (Marked, Prism, RapiDoc) into the frontend distribution to enable 100% offline usage?
  *Recommended default:* Yes, bundle local minified scripts in `web/vendor/` to achieve true zero-network offline desktop posture.
