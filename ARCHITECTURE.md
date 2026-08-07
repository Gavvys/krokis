# Architecture Overview

Krokis runs as a native desktop application built with Tauri v2 and Rust, housing a zero-framework Material 3 Web Component frontend SPA.

## Component Layout

```
/Users/ksumallo/dev/projects/Krokis/
├── src-tauri/                 # Tauri v2 Rust Backend Crate
│   ├── Cargo.toml             # Rust package configuration
│   ├── tauri.conf.json        # Tauri v2 app and window configuration
│   ├── capabilities/         # Security permissions (dialog, store)
│   └── src/
│       ├── main.rs            # Desktop application entrypoint
│       ├── lib.rs             # Tauri IPC command definitions
│       ├── projects.rs        # Project Hub active path & store management
│       ├── wiki.rs            # SNAKE_CASE wiki document reader & writer
│       ├── roadmap.rs         # ROADMAP.md → view-only Kanban columns/cards
│       ├── scaffold.rs        # Idempotent workspace initialization and templates
│       └── metrics/           # Rust telemetry engine
│           ├── mod.rs         # Telemetry gatherer orchestrator
│           ├── git.rs         # Git log parsing & commit cadence
│           ├── codebase.rs    # Line counting (LOC) & file breakdowns
│           ├── change_flow.rs # OpenSpec change scanning & cycle time
│           └── coverage.rs    # Spec-to-code requirement identifier scanning
├── web/                       # Web Dashboard Frontend SPA
│   ├── index.html             # Main desktop webview HTML shell
│   ├── app.js                 # Tauri IPC dispatcher & client router
│   ├── vendor/                # Offline minified JS/CSS dependencies
│   └── components/            # Material 3 Web Components (ProjectSelector, etc.)
└── openspec/                  # OpenSpec workflow specifications
```

## System Data Flow

1.  **Desktop Initialization**:
    *   Tauri launches native application window (`src-tauri/src/main.rs`).
    *   `projects::get_project_state` loads active project path and recent projects from persistent store (`tauri-plugin-store`).
    *   Webview loads `web/index.html` and executes `web/app.js`.

2.  **Telemetry & Wiki IPC Commands**:
    *   `invoke('get_insights')`: Triggers Rust metrics gatherer against the active workspace root.
        *   `git.rs`: Runs `git log` commands to parse commit history, recent commits, and author stats.
        *   `codebase.rs`: Walks workspace directory counting lines of code by extension.
        *   `change_flow.rs`: Scans `openspec/changes/` (active & archived) for proposal progress, tasks checkboxes, and cycle times.
        *   `coverage.rs`: Scans `openspec/specs/` for requirement identifiers and performs substring searches across workspace source files.
    *   `invoke('list_wiki_files')`: Scans `.krokis/wiki/*.mdx` and root canonical files (`PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, `PROJECT_MEMORY.md`).
    *   `invoke('get_wiki_content')`: Reads raw markdown content from disk.
    *   `invoke('get_roadmap')`: Parses workspace-root `ROADMAP.md` into Now/Queued/Exploring/Parked/Shipped columns for the view-only Kanban board (`#/roadmap`). Does not write the file.
        *   `invoke('scaffold_workspace')`: Creates missing Krokis/OpenSpec starter files and runs Doctor without overwriting existing files or mutating Git.
    *   `invoke('create_wiki_page')`: Creates new SNAKE_CASE `.mdx` wiki pages.

3.  **Project Hub IPC**:
    *   `<project-selector>` Web Component renders active project name and recent project dropdown in sidebar.
    *   `invoke('select_project_folder')`: Opens native OS directory picker (`tauri-plugin-dialog`).
    *   Switching workspace path updates active project state in Rust and emits a `projectchange` DOM event to reload telemetry and wiki links instantly.

4.  **Client Compilation & Offline Posture**:
    *   `web/vendor/` bundles minified offline copies of `marked.min.js`, `prism.min.js`, and `rapidoc-min.js`, operating with zero external network calls.
    *   `web/mdx/registry.js` defines the MDX-only allowlist, props, child support, and data source for embeddable components.
    *   `web/app.js` translates registered JSX-like tags (`<MetricsCard />`, `<InfoBox>`) to custom Web Components extending `KrokisElement`, then hydrates data-backed elements.

## Design Decisions

### ADR 004: View-only Roadmap Kanban

- **Status**: Approved
- **Context**: Commitment horizons in `ROADMAP.md` are hard to scan as wiki prose; users want a Kanban-shaped overview without a second project-management store.
- **Decision**: Parse `ROADMAP.md` into a read-only board at `#/roadmap`. Agents reorganize Markdown; the UI never writes the file.
- **Consequences**: One source of truth, cheap projection, no drag-and-write complexity.

### ADR 003: Pure Tauri-Rust Native Desktop Architecture

- **Status**: Approved
- **Context**: Users want a native desktop application with a multi-project selector hub (similar to Cursor's Agents Window), eliminating local web servers and background daemons.
- **Decision**: Re-architect Krokis as a Tauri v2 Rust desktop application. Replace Go CLI/HTTP server runtime with native Rust IPC commands (`invoke()`).
- **Consequences**: Zero local web server management, native OS folder picker dialogs, persistent multi-project workspace memory, and true 100% offline desktop posture.

### ADR 002: Change-flow artifact map in insights payload

- **Status**: Approved
- **Context**: The change-flow graph component needs to know which planning artifacts each change contains without extra IPC round-trips.
- **Decision**: Include `artifact_map: HashMap<String, Vec<String>>` in `ChangeFlowMetrics`.

### ADR 001: Standardized Specs

- **Status**: Approved
- **Context**: Code quality and agent alignment.
- **Decision**: Use OpenSpec for all feature implementations.
