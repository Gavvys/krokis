# openapi-view Specification

## Purpose
TBD - created by archiving change add-openapi-view. Update Purpose after archive.
## Requirements
### Requirement: Serve OpenAPI file
The Krokis embedded server MUST expose a `/api/openapi` endpoint that serves the configured OpenAPI specification file.

#### Scenario: Fetching API Spec from server
- **WHEN** user makes an HTTP request to `/api/openapi`
- **THEN** system reads the configured file and returns it as plain text or yaml/json format

### Requirement: RapiDoc integration
The dashboard client MUST load and render the OpenAPI specification file using RapiDoc.

#### Scenario: Landing on API Spec dashboard route
- **WHEN** user visits `#/insights/openapi` on the dashboard
- **THEN** system renders a `<rapi-doc>` Web Component displaying the interactive endpoints

