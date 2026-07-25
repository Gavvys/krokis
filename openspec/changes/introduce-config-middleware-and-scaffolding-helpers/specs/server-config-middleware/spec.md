# server-config-middleware Specification

## Purpose
Define the `resolve_workspace` helper so IPC handlers do not repeat workspace path resolution boilerplate.

## ADDED Requirements

### Requirement: resolve_workspace helper
The `src-tauri/src/lib.rs` module SHALL expose a `resolve_workspace` helper that resolves an optional target workspace path against Project Hub state and validates directory existence before executing IPC commands.

#### Scenario: Active workspace resolved
- **WHEN** an IPC command receives a workspace path parameter or defaults to active Project Hub state
- **THEN** the IPC handler receives a validated absolute workspace root

#### Scenario: Invalid workspace path
- **WHEN** an IPC command receives a missing or non-directory workspace path
- **THEN** the helper falls back to the active Project Hub workspace or returns an error
