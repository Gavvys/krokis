## Context

This design outlines the implementation of the Krokis desktop application overlay on top of OpenSpec. Krokis acts as an orchestration, multi-project hub, wiki, and insights desktop application for spec-driven workflows.

## Goals / Non-Goals

**Goals:**
- Provide a native desktop application using Tauri v2 and Rust (`src-tauri/`).
- Support Project Hub workspace selection and initialization.
- Standardize a SNAKE_CASE MDX wiki directory (`.krokis/wiki/`).
- Gather Git cadence, lines of code, OpenSpec change flow, and requirement coverage into native Rust IPC commands (`get_insights`).
- Render a highly-polished Material 3 dark/light desktop interface using client-side MDX parsing and Web Components.
- Scaffold discoverable Agent Skills (`.agents/skills/`).

**Non-Goals:**
- Cloud databases or user authentication (everything is local, git-backed).
- A background Go HTTP daemon or sidecar server.
- Automatic Git commits or branch manipulation.

## Decisions

### 1. Implementation Language: Tauri v2 with Native Rust Backend
- **Chosen:** Tauri v2 with Rust backend IPC handlers (`#[tauri::command]`).
- *Rationale*: Native OS window management, direct file-system and dialog integration, multi-project hub persistence (`tauri-plugin-store`), and zero local HTTP web server requirements.

### 2. Frontend Rendering Strategy: Client-Side MDX Parsing via Web Components
- **Chosen:** Embedded Single-Page Application (SPA) inside the Tauri webview shell. The SPA loads raw `.mdx` files and telemetries via `@tauri-apps/api` IPC `invoke()`, uses minified local vendor libraries (`web/vendor/marked.min.js`), and converts JSX-like tags into registered Web Components extending `KrokisElement`.
- *Rationale*: Zero external CDN network dependencies, 100% offline desktop execution posture.

### 3. Agent Skills Execution Model: SKILL.md Instructions
- **Chosen:** Portable instruction contracts under `.agents/skills/krokis/`. Agents read the instructions and follow the workflow guidance directly.

## Risks / Trade-offs

### Cross-platform Compilation
- *Risk*: Rust toolchain required for building native desktop binaries.
- *Mitigation*: Standard Tauri v2 GitHub Actions CI workflow for automated macOS, Windows, and Linux builds.
