## Why

The Tauri migration preserved Krokis inspection features but dropped the old Go `krokis init` setup path. [E: `src-tauri/src/lib.rs` exposes telemetry, wiki, project, and doctor commands but no scaffolding command; deleted `internal/cmd/init.go` created the previous setup] A new or existing repository therefore cannot become Krokis-enabled from the desktop app in one operation. [I: one-command setup is required for practical solo use and agent onboarding]

## What Changes

- Add an idempotent Rust workspace scaffolder exposed through Tauri IPC.
- Add a Project Hub action to initialize the active workspace.
- Create missing canonical reference documents with adaptable placeholders, without overwriting existing files.
- Create missing `.krokis` configuration, wiki templates, OpenAPI sample, wiki index, and consolidated Krokis skill files.
- Run Doctor after scaffolding and show a report/result toast.
- Preserve user-owned files and keep Git commits entirely user-driven.
- Do not restore the retired local HTTP server or a separate CLI binary.
- Do not revive `config.toml` as a runtime configuration API; scaffold the compatibility file because Doctor and existing workspaces expect it.

## Capabilities

### New Capabilities
- `workspace-scaffolding`: Idempotent Tauri workspace initialization, templates, and Project Hub action.

### Modified Capabilities
- None. Existing `idempotent-init` behavior is implemented by the new Tauri command; no requirement semantics change.

## Impact

- **Backend**: new `src-tauri/src/scaffold.rs`, `scaffold_workspace` IPC command, and bundled template constants.
- **Frontend**: Project Hub action and non-blocking progress/result feedback.
- **Workspace files**: new files may be created under the selected repository root, `.krokis/`, and `.agents/skills/krokis/`.
- **Canonical references**: update architecture, README, project memory, and roadmap after implementation.
