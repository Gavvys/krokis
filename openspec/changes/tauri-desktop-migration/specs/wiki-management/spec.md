## MODIFIED Requirements

### Requirement: Wiki listing and management
The system SHALL list, read, create, and index SNAKE_CASE `.mdx` wiki documents for the active project root using native Rust Tauri IPC commands.

#### Scenario: Listing wiki files via IPC
- **WHEN** frontend dashboard invokes the `list_wiki_files` Tauri IPC command for the active project
- **THEN** Rust backend scans `.krokis/wiki/` and returns the list of wiki file names and root master files (`AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, `PROJECT_MEMORY.md`)
