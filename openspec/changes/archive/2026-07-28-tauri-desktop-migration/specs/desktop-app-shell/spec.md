## ADDED Requirements

### Requirement: Desktop window shell
The system SHALL execute as a native Tauri v2 desktop application rendering the dashboard inside a native webview window.

#### Scenario: App launch
- **WHEN** user launches the Krokis desktop application
- **THEN** system opens a desktop application window, loads the local dashboard web app, and initializes the Tauri IPC backend bridge

### Requirement: Native system file integration
The system SHALL provide native OS dialog integration for workspace folder selection via Tauri dialog plugins.

#### Scenario: Native directory picker
- **WHEN** user clicks "+ Open Project..." in the project selector
- **THEN** system opens a native OS folder selection dialog and returns the selected absolute directory path
