# server-config-middleware Specification

## Purpose
TBD - created by archiving change introduce-config-middleware-and-scaffolding-helpers. Update Purpose after archive.
## Requirements
### Requirement: withConfig handler middleware
The `internal/web/server.go` package SHALL expose a `withConfig` function that takes a handler of shape `func(cfg *config.Config, w http.ResponseWriter, r *http.Request)` and returns an `http.HandlerFunc`. The middleware SHALL call `config.Load()`, write a 500 response with the error message on failure, and SHALL otherwise invoke the inner handler with the loaded config. Every API handler under `/api/` in `server.go` SHALL use this middleware.

#### Scenario: Config loads successfully
- **WHEN** a request hits an API endpoint and `config.Load()` returns no error
- **THEN** the inner handler runs with the loaded `*config.Config` as its first argument

#### Scenario: Config load fails
- **WHEN** a request hits an API endpoint and `config.Load()` returns an error
- **THEN** the middleware writes a 500 response with the error message and the inner handler is not invoked

