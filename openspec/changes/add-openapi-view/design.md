## Context

This design implements the integration of an interactive OpenAPI specification visualizer in the Krokis web dashboard, using a client-side Web Component (RapiDoc) served from a CDN.

## Goals / Non-Goals

**Goals:**
- Add `openapi` configuration property.
- Serve the OpenAPI file at `/api/openapi`.
- Integrate RapiDoc Web Component into the dashboard UI.
- Scaffold a default `openapi.yaml` template file.

**Non-Goals:**
- OpenAPI syntax validation (handled by standard Swagger/OpenAPI linter tools).

## Decisions

### 1. OpenAPI Visualizer Framework
- **Option A**: Swagger UI (requires heavy stylesheet and complex iframe/asset setup).
- **Option B**: Redoc (highly readable, but less interactive for making API test calls).
- **Option C (Chosen)**: **RapiDoc** (native Web Component, outstanding performance, highly customizable aesthetics matching dark mode/glassmorphism, fully interactive test client, zero NPM build dependencies).

### 2. Configuration Settings
- We'll add `OpenAPI string `toml:"openapi"`` to `InsightsConfig` struct.
- Default path: `"openapi.yaml"`.
- `initCmd` will write a sample `openapi.yaml` to the root directory if it does not exist.

### 3. Dashboard Integration
- We'll add a link to the sidebar: `<a href="#/insights/openapi" ...>API Specifications</a>`.
- Add RapiDoc script to `index.html`.
- In `app.js` routing logic:
  - If `hash === '#/insights/openapi'`, empty container and insert:
    ```html
    <rapi-doc 
      spec-url="/api/openapi" 
      theme="dark" 
      bg-color="#0b0f19" 
      text-color="#f3f4f6"
      primary-color="#3b82f6"
      render-style="read"
      show-header="false"
    ></rapi-doc>
    ```
