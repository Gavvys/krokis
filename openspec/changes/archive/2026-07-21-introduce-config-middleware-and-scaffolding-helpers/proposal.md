## Why

The Krokis backend repeats small structural patterns across files. Every API handler in `internal/web/server.go` calls `config.Load()` and handles the error inline. Every scaffolding function in `internal/cmd/init.go` does the same three-step dance: stat the target, write the content, print success. Every doctor check in `internal/cmd/doctor.go` follows the same `check → print pass/fail` shape. Every CLI command begins with the same `config.Load()` and exits on error. The repetition is small per site but adds up across the codebase and obscures the actual differences (per-endpoint logic, per-scaffold content, per-check predicate).

## What Changes

- Add a `withConfig` middleware helper in `internal/web/server.go` that wraps a `func(cfg, w, r)` handler, calls `config.Load()`, writes a 500 response on error, and otherwise calls the inner handler. Convert the four API handlers (`/api/insights`, `/api/openapi`, `/api/wiki`, `/api/wiki/`) to use the helper.
- Add a `scaffoldFile` helper in `internal/cmd/init.go` that takes a path, content, and label; checks if the file already exists; writes it; and returns a printable success message. Convert the three existing scaffolding call sites (`scaffoldWikiTemplates`, `scaffoldAgentSkills`, `scaffoldOpenAPISpec`) to use the helper where applicable.
- Convert `internal/cmd/doctor.go` to a table of `[]Check{{name, ok, message}}` that the runner iterates over. Each check has a label, a status (ok or warning), and a human-readable message. The runner prints the table and tracks failure counts.
- Add a small `loadConfigOrDie()` helper in a new `internal/cmd/helpers.go` that returns the loaded `*config.Config` or prints the error and exits 1. Convert the six existing CLI commands (`init`, `insights`, `serve`, `wiki`, `validate`, `doctor`) to use the helper.
- No changes to public CLI surface, API surface, payload, or config schema. The helpers are internal-only.

## Capabilities

### New Capabilities
- `server-config-middleware`: A `withConfig` middleware in `internal/web/server.go` that loads the config once per request and passes it to the inner handler. The four existing API handlers SHALL use this helper.
- `cmd-scaffolding-helper`: A `scaffoldFile` helper in `internal/cmd/init.go` plus a `loadConfigOrDie` helper in `internal/cmd/helpers.go`. Init, doctor, and the four other CLI commands SHALL use the helpers where applicable.

### Modified Capabilities
- `cli-core`: Update the CLI command structure requirement so commands use a shared `loadConfigOrDie` helper instead of repeating the same load-or-die block at the top of each `Run` function.
- `cli-doctor`: Update the doctor command to use a `[]Check` table so adding a new check is a single table entry.

## Impact

- New file: `internal/cmd/helpers.go` (~20 lines).
- Modified files: `internal/web/server.go` (middleware helper, four handlers), `internal/cmd/init.go` (scaffold helper), `internal/cmd/doctor.go` (table), `internal/cmd/serve.go`, `internal/cmd/insights.go`, `internal/cmd/wiki.go`, `internal/cmd/wiki_index.go`, `internal/cmd/validate.go` (each uses `loadConfigOrDie`).
- No new public types. No new flags. No changes to the embedded frontend.
- No breaking changes for users. Output of `krokis doctor` and `krokis serve` may be byte-identical or very close; the new helpers are internal refactors.
- Documentation updates: `ARCHITECTURE.md` (mention the helpers in the System Data Flow section), `PROJECT_MEMORY.md` decision row.
