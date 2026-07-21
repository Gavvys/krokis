## 1. Refactor doctor into a callable

- [x] 1.1 In `internal/cmd/doctor.go`, extract the check logic from `doctorCmd.Run` into a `runDoctorChecks() int` function that returns the failure count and prints the same output as today.
- [x] 1.2 Update `doctorCmd.Run` to call `runDoctorChecks()` and call `os.Exit(1)` if the count is positive.
- [x] 1.3 Keep the public command surface (`krokis doctor`) and the output format unchanged.

## 2. Idempotent init

- [x] 2.1 Update `scaffoldFile` in `internal/cmd/init.go` to print `↻ Skipped <path> (already exists)` when the file exists and `✓ Created <path>` when it wrote the file. The function still returns `error`.
- [x] 2.2 Replace the `fmt.Printf("✓ Scaffolded %s", ...)` calls in `scaffoldWikiTemplates`, `scaffoldAgentSkills`, and `scaffoldOpenAPISpec` so they go through `scaffoldFile` and inherit the new print behavior.
- [x] 2.3 Add a small `mkdirVerbose(path, verbose bool)` helper that creates the directory and prints a `+ Created dir <path>` line only when verbose is true and the directory was newly created.
- [x] 2.4 Wire `mkdirVerbose` into the wiki and agent-skill scaffolding paths.

## 3. Flags and doctor invocation

- [x] 3.1 Add `--verbose` and `--skip-doctor` boolean flags to `initCmd`.
- [x] 3.2 In `initCmd.Run`, after the scaffolding steps and the wiki index build, branch on `skip-doctor`. If false, call `runDoctorChecks()` and exit with the same status code (0 on success, 1 on any failure).
- [x] 3.3 Update the closing success line to indicate the new behavior: `Krokis Initialized Successfully! Run 'krokis serve' to open the dashboard.` and follow with the doctor output (or a `Skipped doctor (--skip-doctor)` line when suppressed).

## 4. Tests

- [x] 4.1 Add a test in `internal/cmd/init_test.go` (or extend an existing test file) that seeds a temp workspace with `.krokis/config.toml` and one wiki template, then runs the init scaffolding helpers and asserts no file was overwritten and a `Skipped` line was printed.
- [x] 4.2 Add a test that runs init on a fresh temp workspace and asserts the created files and the doctor invocation path.
- [x] 4.3 Run `go test ./...` and `go build ./...`.

## 5. Validation and docs

- [x] 5.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 5.2 Manually run `krokis init` in this repo and confirm the existing files are skipped and the doctor output appears at the end. Run it again and confirm it is a no-op.
- [x] 5.3 Update `ARCHITECTURE.md` to mention the idempotent init and the new flags.
- [x] 5.4 Update `README.md` with usage examples for new and existing projects.
- [x] 5.5 Add a `PROJECT_MEMORY.md` decision row.