# server-config-middleware Specification

## Purpose
Defines workspace context resolution and config handling for Tauri IPC commands.

## Requirements
### Requirement: Workspace context resolution middleware
The `src-tauri/src/lib.rs` module SHALL expose a `resolve_workspace` helper function that resolves an optional target workspace path string against active Project Hub state and validates directory existence before executing IPC commands.

#### Scenario: Active workspace resolved
- **WHEN** an IPC command receives a workspace path parameter or defaults to active Project Hub state
- **THEN** the IPC handler receives a validated absolute `PathBuf` workspace root
