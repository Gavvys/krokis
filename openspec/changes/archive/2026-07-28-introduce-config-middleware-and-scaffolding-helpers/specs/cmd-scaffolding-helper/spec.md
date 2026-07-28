# cmd-scaffolding-helper Specification

## Purpose
Define small Rust helpers that remove repeated boilerplate from workspace scaffolding and wiki creation.

## ADDED Requirements

### Requirement: Workspace config resolution helper
The Rust backend SHALL resolve workspace configuration for the active project path before executing IPC commands that need config.

#### Scenario: Config loads successfully
- **WHEN** an IPC command needs config and the config file is present and valid
- **THEN** the helper returns the loaded config and the command continues

#### Scenario: Config load fails
- **WHEN** an IPC command needs config and the config file is missing or invalid
- **THEN** the helper returns an error payload to the webview

### Requirement: Idempotent file scaffolding helper
The Rust backend SHALL expose an idempotent file scaffolding helper that writes content to a path only when the file does not already exist on disk. Wiki templates, agent skills, and OpenAPI sample scaffolding SHALL use the helper.

#### Scenario: File does not exist
- **WHEN** scaffolding is called and the target path does not exist
- **THEN** the helper writes the content and returns success

#### Scenario: File already exists
- **WHEN** scaffolding is called and the target path already exists
- **THEN** the helper does not write and returns success without overwrite
