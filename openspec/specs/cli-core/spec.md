# cli-core Specification

## Purpose
Defines desktop application core workspace management, project scaffolding, configuration schemas, and native IPC commands in Krokis.

## Requirements
### Requirement: Workspace directory initialization
The Krokis application MUST scaffold a `.krokis/` directory when initializing a new Git workspace directory.

#### Scenario: Initializing workspace
- **WHEN** user initializes Krokis on a workspace containing `.git/` but no `.krokis/`
- **THEN** system creates `.krokis/` directory, writes default `.krokis/config.toml`, and scaffolds `.krokis/wiki/` directory

### Requirement: Configuration loading
The Krokis application SHALL parse and load settings from `.krokis/config.toml` for telemetry and OpenAPI paths.

#### Scenario: Loading workspace configuration
- **WHEN** system loads a workspace with a valid `.krokis/config.toml`
- **THEN** system successfully parses workspace configuration properties

### Requirement: OpenAPI scaffolding and config validation
The Krokis application MUST support an `openapi` filepath config setting and scaffold a sample `openapi.yaml` on workspace initialization.

#### Scenario: Scaffolding openapi
- **WHEN** user initializes Krokis workspace
- **THEN** system scaffolds `.krokis/config.toml` containing an `openapi` path mapping, and writes a default sample `openapi.yaml` in the workspace root

### Requirement: Plural agents directory priority
The Krokis application MUST prioritize reading and writing Agent Skills inside the plural `.agents/skills/` directory, while preserving the singular `.agent/skills/` path as a fallback.

#### Scenario: Prioritizing plural agents skills
- **WHEN** system checks skills in a workspace containing both `.agents` and `.agent` or containing neither
- **THEN** system scaffolds skills under `.agents/skills/`

### Requirement: Desktop Rust application structure
Every Krokis backend module SHALL be implemented natively in Rust within the `src-tauri/` crate and exposed via Tauri `#[tauri::command]` IPC handlers.

#### Scenario: Executing Tauri IPC handler
- **WHEN** the frontend webview invokes a backend IPC command
- **THEN** the corresponding Rust `#[tauri::command]` handler processes the request against the active workspace root and returns structured JSON
