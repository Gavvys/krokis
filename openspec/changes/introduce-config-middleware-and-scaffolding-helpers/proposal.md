## Why

The Krokis backend repeats small structural patterns across files. Every API handler in `src-tauri/src/lib.rs` calls `config.Load()` and handles the error inline. Every scaffolding function in workspace scaffolding helpers does the same three-step dance: stat the target, write the content, print success. Every doctor check in workspace health diagnostics follows the same `check → print pass/fail` shape. Every CLI command begins with the same `config.Load()` and exits on error. The repetition is small per site but adds up across the codebase and obscures the actual differences (per-endpoint logic, per-scaffold content, per-check predicate).

## What Changes

- Add a `resolve_workspace` middleware helper in `src-tauri/src/lib.rs` that wraps a `func(cfg, w, r)` handler, calls `config.Load()`, writes a 500 response on error, and otherwise calls the inner handler. Convert the four API handlers (`get_insights` IPC, OpenAPI workspace file load, `list_wiki_files` / `get_wiki_content` IPC, `list_wiki_files / get_wiki_content IPC/`) to use the helper.
- Add a idempotent file scaffolding helper in workspace scaffolding helpers that takes a path, content, and label; checks if the file already exists; writes it; and returns a printable success message. Convert the three existing scaffolding call sites (`scaffoldWikiTemplates`, `scaffoldAgentSkills`, `scaffoldOpenAPISpec`) to use the helper where applicable.
- Convert workspace health diagnostics to a table of `[]Check{{name, ok, message}}` that the runner iterates over. Each check has a label, a status (ok or warning), and a human-readable message. The runner prints the table and tracks failure counts.
- Add a small workspace config resolution helper in a new Rust workspace helpers that returns the loaded `*config.Config` or prints the error and exits 1. Convert the six existing CLI commands (`init`, `insights`, `serve`, `wiki`, `validate`, `doctor`) to use the helper.
- No changes to public CLI surface, API surface, payload, or config schema. The helpers are internal-only.

## Capabilities

### New Capabilities
- `server-config-middleware`: A `resolve_workspace` middleware in `src-tauri/src/lib.rs` that loads the config once per request and passes it to the inner handler. The four existing API handlers SHALL use this helper.
- `cmd-scaffolding-helper`: A idempotent file scaffolding helper in workspace scaffolding helpers plus a `loadConfigOrDie` helper in Rust workspace helpers. Init, doctor, and the four other CLI commands SHALL use the helpers where applicable.

### Modified Capabilities
- `cli-core`: Update the CLI command structure requirement so commands use a shared `loadConfigOrDie` helper instead of repeating the same load-or-die block at the top of each `Run` function.
- `cli-doctor`: Update the doctor command to use a `[]Check` table so adding a new check is a single table entry.

## Impact

- New file: Rust workspace helpers (~20 lines).
- Modified files: `src-tauri/src/lib.rs` (middleware helper, four handlers), workspace scaffolding helpers (scaffold helper), workspace health diagnostics (table), Tauri desktop shell, `get_insights` IPC gathering, `src-tauri/src/wiki.rs`, wiki indexing helpers, config validation helpers (each uses `loadConfigOrDie`).
- No new public types. No new flags. No changes to the embedded frontend.
- No breaking changes for users. Output of workspace health diagnostics and the Krokis desktop app may be byte-identical or very close; the new helpers are internal refactors.
- Documentation updates: `ARCHITECTURE.md` (mention the helpers in the System Data Flow section), `PROJECT_MEMORY.md` decision row.
