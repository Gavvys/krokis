## ADDED Requirements

### Requirement: Idempotent workspace initialization through Tauri
The desktop application SHALL expose a `scaffold_workspace` Tauri IPC command that resolves the selected workspace and creates missing Krokis/OpenSpec scaffolding without overwriting existing files. The command SHALL return created paths, skipped paths, and the Doctor report generated after scaffolding.

#### Scenario: Initialize a fresh Git workspace
- **WHEN** the user runs workspace initialization on a Git repository with none of the Krokis files
- **THEN** the command creates the Krokis configuration, canonical document shells, OpenSpec directory/configuration, wiki templates and index, OpenAPI sample, and Krokis Agent Skill files, then returns a Doctor report

#### Scenario: Initialize an existing workspace safely
- **WHEN** the user runs workspace initialization on a repository containing some or all target files
- **THEN** existing files remain byte-for-byte unchanged and only absent targets are created

#### Scenario: Initialization does not mutate Git
- **WHEN** the command finishes successfully
- **THEN** it does not run `git init`, create commits, change branches, stage files, or push

### Requirement: Project Hub initialization action
The Project Hub SHALL provide an `Initialize Workspace` action for the active project. The action SHALL be non-blocking, show progress and failure feedback, and refresh project/wiki/Doctor state after successful completion.

#### Scenario: Initialize from Project Hub
- **WHEN** the user selects `Initialize Workspace`
- **THEN** the desktop invokes `scaffold_workspace` for the active workspace and reports created versus skipped files

#### Scenario: Initialization failure
- **WHEN** scaffolding cannot write a required file
- **THEN** the UI shows a non-blocking error toast and leaves existing files untouched

### Requirement: Portable starter templates
Scaffolding SHALL provide generic canonical document shells, current desktop-oriented wiki templates, a valid OpenAPI 3 sample, and the checked-in consolidated Krokis skill tree. Templates SHALL not contain removed Go server commands as setup instructions.

#### Scenario: New project receives adaptable guidance
- **WHEN** initialization creates `AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, and `PROJECT_MEMORY.md`
- **THEN** each file contains a useful heading, ownership guidance, and an explicit placeholder for project-specific adaptation
