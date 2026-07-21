## Context

The Krokis backend has accumulated repeated small patterns: every API handler in `internal/web/server.go` calls `config.Load()` and writes a 500 on error; every scaffold in `internal/cmd/init.go` does a stat-write-print dance; every CLI command begins with the same `config.Load()` and `os.Exit(1)`; every doctor check is a stat-and-print block. The repetition is per-site small but it hides the actual differences and makes the code feel longer than it is. This change introduces three small helpers (one middleware, two CLI helpers) and a table for the doctor checks.

## Goals / Non-Goals

**Goals:**
- Add `withConfig` middleware in `internal/web/server.go` and convert the four API handlers to use it.
- Add `scaffoldFile` helper in `internal/cmd/init.go` and convert the three existing scaffold call sites.
- Add `loadConfigOrDie` helper in a new `internal/cmd/helpers.go` and convert the six CLI commands.
- Convert `internal/cmd/doctor.go` to a `[]Check` table.
- No public API change, no CLI flag change, no payload change.

**Non-Goals:**
- No new public types. Helpers are package-private.
- No refactor of the config validation rules themselves.
- No refactor of the embedding or the embedded assets.

## Decisions

- **`withConfig` signature.** The helper takes `func(cfg *config.Config, w http.ResponseWriter, r *http.Request)` and returns `http.HandlerFunc`. This is the smallest signature change that still lets each handler do its own response shape and request parsing.
- **`scaffoldFile` returns error.** The helper returns any write error so callers can decide whether to exit or warn. The current init flow already wraps a warning vs. fail decision; the helper just removes the stat-then-write dance.
- **`loadConfigOrDie` lives in `helpers.go`.** A new file in `internal/cmd/` keeps the helper discoverable and avoids touching `root.go` to host it. The file has one function plus the imports it needs.
- **Doctor table is `[]Check`.** A small struct with `Name`, `Status` (`ok` / `warn` / `fail`), and `Message` is enough. The runner prints one line per check with an icon and tracks the failure count.

## Risks / Trade-offs

- **Middleware hides the config-load error from the handler** → Mitigation: the middleware writes the error message to the response so handlers can still see the error indirectly; the existing 500 path is preserved.
- **Doctor table loses inline `failed = true` mutation** → Mitigation: the runner returns the failure count and the command's `Run` function still does the same `os.Exit(1)` if the count is positive.
- **More files to navigate** → Mitigation: `helpers.go` is one small file with one function; the trade is small and matches Go convention.

## Migration Plan

1. Add `withConfig` in `server.go`; convert the four API handlers.
2. Add `scaffoldFile` in `init.go`; convert the three call sites.
3. Add `helpers.go` with `loadConfigOrDie`; convert the six commands (`init`, `insights`, `serve`, `wiki`, `wiki_index`, `validate`, `doctor`).
4. Convert `doctor.go` to a `[]Check` table.
5. Run `go build`, `go test`, `openspec validate --all --strict`.
6. Manually run `krokis doctor` and `krokis init` to confirm output is functionally equivalent.
7. Update `ARCHITECTURE.md` and `PROJECT_MEMORY.md`.

## Open Questions

- Should the doctor table also capture the failure type (`fail` vs `warn`) so the runner can choose between `❌` and `⚠️` icons? Default: yes, three states (`ok`, `warn`, `fail`) with their existing emoji.
- Should the helpers file be split into `helpers.go` and `scaffolding.go`? Default: keep one file with both helpers; the package is small.
