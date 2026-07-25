## 1. Core Config and API endpoint

- [x] 1.1 Add `openapi` property mapping to configuration structs in workspace config loading and validation logic
- [x] 1.2 Implement the OpenAPI workspace file load HTTP endpoint in `src-tauri/src/lib.rs` serving the configured file

## 2. Dashboard Interface

- [x] 2.1 Include RapiDoc script CDN bundle in `web/index.html`
- [x] 2.2 Add navigation link for API specs in `web/index.html` and implement routing logic in `web/app.js`

## 3. Scaffolding and Diagnostics

- [x] 3.1 Update scaffolding logic in workspace scaffolding helpers to write a default sample `openapi.yaml` to the root
- [x] 3.2 Update workspace health diagnostics to check and warn if configured `openapi` file is missing on disk
- [x] 3.3 Verify project compilation and execution of server, diagnostics, and routing components
