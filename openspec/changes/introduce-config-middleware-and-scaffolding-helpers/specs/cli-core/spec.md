# cli-core Specification (delta)

## ADDED Requirements

### Requirement: Desktop IPC command structure
Every Krokis backend capability SHALL be exposed as a Tauri `#[tauri::command]` handler. When a command needs workspace context, it SHALL resolve the active workspace root before performing file or Git operations.

#### Scenario: Command uses workspace resolution
- **WHEN** an IPC command needs the active project path
- **THEN** it calls `resolve_workspace` once and uses the returned path
