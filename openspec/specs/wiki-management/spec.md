# wiki-management Specification

## Purpose
Defines SNAKE_CASE wiki listing, reading, and creation for the active workspace via native Rust Tauri IPC commands.

## Requirements
### Requirement: SNAKE_CASE wiki constraint
The Krokis desktop application SHALL require all wiki master files under `.krokis/wiki/` to be named in SNAKE_CASE with `.mdx` extension.

#### Scenario: User attempts to create a non-SNAKE_CASE wiki file
- **WHEN** user requests wiki creation with name `New-Design` via `create_wiki_page`
- **THEN** system rejects the creation with a name-format error explaining that it must be SNAKE_CASE

### Requirement: Create wiki file
The Krokis desktop application SHALL provide an IPC command to scaffold a new SNAKE_CASE MDX wiki file with default frontmatter.

#### Scenario: Creating a valid wiki file
- **WHEN** frontend invokes `create_wiki_page` with name `system_architecture`
- **THEN** system creates `.krokis/wiki/SYSTEM_ARCHITECTURE.mdx` with default frontmatter (`title`, `author`) and returns the filename

### Requirement: User manual scaffolding
Workspace initialization MUST scaffold a `USER_MANUAL.mdx` page explaining Krokis usages and widgets by default.

#### Scenario: Initializing a workspace scaffolds user manual
- **WHEN** user initializes a Krokis workspace
- **THEN** system creates `.krokis/wiki/USER_MANUAL.mdx` with interactive custom component references

### Requirement: Wiki listing via IPC
The system SHALL list SNAKE_CASE `.mdx` wiki documents and root canonical reference files for the active project via `list_wiki_files`.

#### Scenario: Listing wiki files via IPC
- **WHEN** frontend invokes `list_wiki_files` for the active project
- **THEN** Rust backend scans `.krokis/wiki/` and returns wiki file names plus root master files (`AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, `PROJECT_MEMORY.md`) when present

### Requirement: Root Architecture source precedence
Workspace scaffolding SHALL NOT create `ARCHITECTURE.mdx` in the wiki directory. The dashboard's root `ARCHITECTURE.md` mapping SHALL remain the sole Architecture source.

#### Scenario: Initializing a workspace
- **WHEN** user initializes a Krokis workspace
- **THEN** the wiki directory does not contain `ARCHITECTURE.mdx` and the Architecture dashboard page resolves from root `ARCHITECTURE.md`
