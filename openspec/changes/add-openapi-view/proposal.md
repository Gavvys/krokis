## Why

Teams developing APIs need a unified location to review API contracts alongside codebase metrics and markdown documentation. Integrating an interactive OpenAPI visualizer directly into the Krokis dashboard simplifies contract auditing for both humans and agents.

## What Changes

- Add a configuration field `openapi` to `.krokis/config.toml` under `[insights]`.
- Expose the `/api/openapi` HTTP endpoint in the Go backend to serve the mapped spec file.
- Update the dashboard layout and router to display a dedicated "API Spec" page.
- Load the unpkg **RapiDoc** bundle in the dashboard client to render the OpenAPI spec interactively.
- Update `krokis init` to automatically scaffold a basic placeholder `openapi.yaml` file.

## Capabilities

### New Capabilities

- `openapi-view`: Serves the API spec file and renders it interactively in the web dashboard using a client-side Web Component.

### Modified Capabilities

- `cli-core`: Validates the `openapi` path parameter in the configuration.
- `cli-doctor`: Diagnoses and warns if the configured `openapi` file is missing.

## Impact

Adds a new dashboard page and backend endpoint. Safe and backward-compatible.
