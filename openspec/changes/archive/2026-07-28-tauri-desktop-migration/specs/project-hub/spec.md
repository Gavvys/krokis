## ADDED Requirements

### Requirement: Active project selection
The system SHALL support selecting an active project directory, updating the active workspace context across all telemetry views and wiki pages.

#### Scenario: Switching active project
- **WHEN** user selects a project from the top-level project dropdown
- **THEN** system updates the active workspace root path in app state and re-fetches telemetry, changes, coverage, and wiki lists for the newly selected project

### Requirement: Recent projects persistence
The system SHALL persist a list of recently opened project paths across app restarts using Tauri persistent app storage.

#### Scenario: App restart restores recent projects
- **WHEN** user restarts the Krokis desktop application
- **THEN** system loads the recent projects list from persistent app storage and populates the project selector dropdown
