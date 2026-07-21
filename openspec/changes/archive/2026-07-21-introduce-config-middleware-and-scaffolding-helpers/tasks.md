## 1. Server middleware

- [x] 1.1 Add `withConfig` helper in `internal/web/server.go` that wraps a `func(cfg *config.Config, w http.ResponseWriter, r *http.Request)`.
- [x] 1.2 Convert `/api/insights` handler to use `withConfig`.
- [x] 1.3 Convert `/api/openapi` handler to use `withConfig`.
- [x] 1.4 Convert `/api/wiki` handler to use `withConfig`.
- [x] 1.5 Convert `/api/wiki/` handler to use `withConfig`.

## 2. Scaffolding helper

- [x] 2.1 Add `scaffoldFile(path, content, label string) error` in `internal/cmd/init.go` that stats-then-writes-then-prints.
- [x] 2.2 Convert the wiki template scaffolding loop in `scaffoldWikiTemplates` to use the helper.
- [x] 2.3 Convert the agent skills scaffolding loop in `scaffoldAgentSkills` to use the helper.
- [x] 2.4 Convert `scaffoldOpenAPISpec` to use the helper.

## 3. CLI config helper

- [x] 3.1 Create `internal/cmd/helpers.go` with `loadConfigOrDie()` that returns `*config.Config` or exits 1.
- [x] 3.2 Convert `internal/cmd/init.go` to use `loadConfigOrDie`.
- [x] 3.3 Convert `internal/cmd/insights.go` to use `loadConfigOrDie`.
- [x] 3.4 Convert `internal/cmd/serve.go` to use `loadConfigOrDie`.
- [x] 3.5 Convert `internal/cmd/wiki.go` to use `loadConfigOrDie`.
- [x] 3.6 Convert `internal/cmd/wiki_index.go` to use `loadConfigOrDie`.
- [x] 3.7 Convert `internal/cmd/validate.go` to use `loadConfigOrDie`.
- [x] 3.8 Convert `internal/cmd/doctor.go` to use `loadConfigOrDie`.

## 4. Doctor table

- [x] 4.1 Define `type Check struct { Name, Status, Message string }` and a `[]Check` table in `internal/cmd/doctor.go`.
- [x] 4.2 Convert the six existing inline checks (git, openspec, config, validation, layout, QA reports) into table entries. The QA report checks become a loop over the three report kinds.
- [x] 4.3 Replace the manual `failed = true` bookkeeping with a runner that counts `fail` status entries and exits 1 if any are present.

## 5. Validation and docs

- [x] 5.1 Run `go build ./...` and `go test ./...`.
- [x] 5.2 Run `openspec validate --all --strict` and resolve any failures.
- [x] 5.3 Run `krokis doctor` against the current workspace and confirm the output is functionally equivalent to the pre-refactor version.
- [x] 5.4 Run `krokis serve --port 0` and confirm each API endpoint returns the same response as before.
- [x] 5.5 Update `ARCHITECTURE.md` to mention the three helpers.
- [x] 5.6 Add a `PROJECT_MEMORY.md` decision row.
