## ADDED Requirements

### Requirement: Embedded web server
The Krokis desktop application SHALL start an desktop webview on a configurable port to serve the web dashboard.

#### Scenario: Running the Krokis desktop app
- **WHEN** user executes `cargo tauri dev`
- **THEN** system starts an desktop webview listening on port 8080 and serves the embedded SPA assets

### Requirement: Client-side MDX and Web Component rendering
The frontend dashboard SHALL parse MDX documents in the browser and render custom components as Web Components.

#### Scenario: Loading an MDX file with a custom component
- **WHEN** client-side dashboard loads `ARCHITECTURE.mdx` containing `<MetricsCard value="98%" label="Test Pass Rate" />`
- **THEN** system parses the MDX, converts `<MetricsCard ... />` into `<metrics-card value="98%" label="Test Pass Rate"></metrics-card>`, and the browser's registered custom element renders the rich animated card
