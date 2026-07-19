## 1. Core Config and API endpoint

- [ ] 1.1 Add `openapi` property mapping to configuration structs in `internal/config/config.go` and validation logic
- [ ] 1.2 Implement the `/api/openapi` HTTP endpoint in `internal/web/server.go` serving the configured file

## 2. Dashboard Interface

- [ ] 2.1 Include RapiDoc script CDN bundle in `web/index.html`
- [ ] 2.2 Add navigation link for API specs in `web/index.html` and implement routing logic in `web/app.js`

## 3. Scaffolding and Diagnostics

- [ ] 3.1 Update scaffolding logic in `internal/cmd/init.go` to write a default sample `openapi.yaml` to the root
- [ ] 3.2 Update `internal/cmd/doctor.go` to check and warn if configured `openapi` file is missing on disk
- [ ] 3.3 Verify project compilation and execution of server, diagnostics, and routing components
