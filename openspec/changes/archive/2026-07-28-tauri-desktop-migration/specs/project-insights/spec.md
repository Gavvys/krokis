## MODIFIED Requirements

### Requirement: Telemetry generation
The system SHALL gather local Git cadence, codebase metrics (LOC), local OpenSpec change flow, and spec-to-code coverage for the currently selected workspace path, returning structured telemetry data via Tauri IPC commands.

#### Scenario: Gathering telemetry via IPC
- **WHEN** frontend dashboard invokes the `get_insights` Tauri IPC command with the active project path
- **THEN** Rust backend scans the target project directory, calculates Git cadence, codebase metrics, change flow, and spec coverage, and returns the telemetry payload to the webview
