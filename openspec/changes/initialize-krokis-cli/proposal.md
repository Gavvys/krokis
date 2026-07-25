## Why

AI coding agents need clear requirements and visual status tools to collaborate effectively with humans, but standard specs do not natively provide project telemetry or high-level wiki indexing. Krokis provides a lightweight project management overlay on top of OpenSpec, offering SNAKE_CASE master wiki documents, project health reports, and a native Tauri v2 desktop application to make spec workflows easier for agents to run and humans to audit.

## What Changes

- Create a desktop application using Tauri v2 and Rust (`src-tauri/`).
- Support Project Hub workspace selection and initialization of `.krokis/` and `openspec/`.
- Provide native Rust IPC commands to manage SNAKE_CASE master wiki documents in `.krokis/wiki/` (e.g. `ARCHITECTURE.md`, `DESIGN_DECISIONS.mdx`).
- Support Rust telemetry IPC commands (`get_insights`) to collect code metrics, git cadence, and OpenSpec proposal flow into structured desktop views.
- Build a native desktop window hosting a zero-dependency, dark-mode visual interface displaying the wiki, change flow, and telemetry.
- Support `agent-skills` managing agent instructions under the active agent skills directory (`.agents/skills/`).

## Capabilities

### New Capabilities

- `cli-core`: Scaffolds the Tauri v2 application framework in Rust, handling workspace directory selection and layout structure.
- `wiki-management`: Standardizes reading, writing, and listing SNAKE_CASE master wiki artifacts in MDX format via Rust IPC.
- `project-insights`: Implements Rust git log parsing for cadence metrics and OpenSpec requirement coverage.
- `web-dashboard`: Native webview interface loading MDX files client-side and rendering Material 3 custom Web Components.
- `agent-skills`: Provides a discoverable set of instructions under `.agents/skills/` for AI agents.

### Modified Capabilities

None.

## Impact

This is a standalone Tauri v2 desktop application that operates on local filesystem repositories via native Rust IPC commands.
