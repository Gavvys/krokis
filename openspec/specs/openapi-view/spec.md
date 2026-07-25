# openapi-view Specification

## Purpose
Defines interactive OpenAPI viewing inside the Krokis desktop dashboard using RapiDoc.

## Requirements
### Requirement: Load OpenAPI file for the active workspace
The Krokis desktop application MUST load the configured OpenAPI specification file from the active workspace for the OpenAPI dashboard route.

#### Scenario: Loading API Spec from workspace
- **WHEN** user opens `#/insights/openapi` and a configured OpenAPI file exists
- **THEN** system reads the configured file and supplies it to the RapiDoc viewer

### Requirement: RapiDoc integration
The dashboard client MUST load and render the OpenAPI specification file using RapiDoc from the offline vendor bundle.

#### Scenario: Landing on API Spec dashboard route
- **WHEN** user visits `#/insights/openapi` on the dashboard
- **THEN** system renders a `<rapi-doc>` Web Component displaying the interactive endpoints
