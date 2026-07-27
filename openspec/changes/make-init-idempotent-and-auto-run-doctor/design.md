## Context

workspace initialization is the entry point for new Krokis projects. It currently writes the config, scaffolds wiki templates, agent skills, and a sample OpenAPI spec, then prints a success line. Two problems:

1. Running it on a partially or fully scaffolded workspace either overwrites content (because the scaffold helpers today only check existence) or refuses to cooperate, depending on the path.
2. The user has to remember to run workspace health diagnostics afterwards to verify the install. New users forget.

The fix is to make `init` idempotent, fill gaps, never overwrite, and auto-invoke `doctor` so one command covers both the fresh and existing cases.

## Goals / Non-Goals

**Goals:**
- Make every scaffold step (config, wiki templates, agent skills, OpenAPI spec) skip files that already exist.
- Print a `↻ Skipped` line for skipped files and a `✓ Created` line for created files.
- Add `--verbose` for directory-level output and `--skip-doctor` to suppress the doctor invocation.
- After scaffolding, automatically invoke workspace health diagnostics and stream its output. Exit with the doctor's exit code.
- Keep the workspace health diagnostics command available standalone with no behavior change.

**Non-Goals:**
- No destructive overwrite. No `--force` flag in v1.
- No interactive prompts. Pure skip-or-create semantics.
- No new commands. workspace initialization keeps its name and signature shape.
- No changes to doctor, validate, insights, or serve commands.

## Decisions

- **idempotent file scaffolding already returns `nil` on existing files.** The helper at workspace scaffolding helpers already handles the `os.Stat` check. The change is to make the success print conditional: when the file existed, print `↻ Skipped <path> (already exists)`; when the file was created, print `✓ Created <path>`. The helper's return value (`error`) is unchanged, so the loop structure stays simple.
- **Directories are always created when missing, never removed.** `os.MkdirAll` is idempotent by design. Verbose mode prints each directory created.
- **Doctor invocation reuses the existing `Tauri IPC` command.** Rather than refactoring doctor into a function callable from init, the cleanest move is to invoke the doctor Tauri IPC command's `Run` function from the init `Run` after scaffolding completes. If refactoring doctor's internals into a callable function is too invasive, the alternative is to call `exec.Command("krokis", "doctor").Run()` from the init `Run`, but that loses exit-code propagation unless we wire `Wait()` carefully. Decision: refactor doctor's checks into a `runDoctorChecks()` function in workspace health diagnostics that returns the failure count; both `Tauri IPC command.Run` and the init caller use it.
- **Exit code propagation.** Init's exit code SHALL equal the doctor's failure indicator: 0 if no failures, 1 if any check failed. This is consistent with the existing standalone workspace health diagnostics exit behavior.
- **Flag wiring.** Two new flags on the init Tauri IPC command: `--verbose` (bool) and `--skip-doctor` (bool). Both default to false. Both are zero-cost when omitted.
- **Test surface.** Use the existing `t.TempDir()` pattern from `change_flow_test.go` to seed a pre-existing `.krokis/config.toml` and run init, asserting no overwrite and the right skip line in the output.

## Risks / Trade-offs

- **Doctor invocation could double-print** if the user runs verbose workspace initialization in a TTY. → Mitigation: doctor's own prints are unchanged; the init wrapper just calls into the same code path.
- **Skipped files could be silently wrong** if the user expected a template update. → Mitigation: workspace initialization is the gap-fill command, not the upgrade command. The skipped path is visible in the output and the user can manually pull template updates if they want them. A future `krokis upgrade` (out of scope for this change) would handle template diffing.
- **`--skip-doctor` masks setup issues.** → Mitigation: the flag exists for advanced users; default behavior still surfaces doctor output.
- **Existing scaffolded workspaces can still see fresh content** if the user adds new files to the templates later. Those become "missing" and get filled in on the next run. → Acceptable. The user gets a clear `Created` line for each.

## Migration Plan

1. Update idempotent file scaffolding in workspace scaffolding helpers to print `↻ Skipped` instead of `✓` when the file already exists.
2. Wrap the directory creation in `scaffoldWikiTemplates` with a small helper that records whether it created the dir for verbose output.
3. Add `--verbose` and `--skip-doctor` flags to `initCmd`.
4. Refactor workspace health diagnostics to expose a `runDoctorChecks() (failureCount int)` function. Update the `Tauri IPC command.Run` to call it and exit 1 if the count is positive.
5. In `initCmd.Run`, after the scaffolding steps, call `runDoctorChecks()` and exit with the same code.
6. Add a test that runs init on a pre-seeded workspace and asserts no overwrite plus a skip line.
7. Run `cargo check`, `cargo test`, `openspec validate --all --strict`.
8. Manually run workspace initialization in this repo and confirm the existing files are skipped and the doctor output appears at the end.
9. Update `ARCHITECTURE.md`, `README.md`, `PROJECT_MEMORY.md`.

## Open Questions

- Should `--verbose` also print the doctor check results with timing? Default: no, doctor output is already verbose enough; init's verbose only affects scaffolding output.
- Should the doctor invocation happen before or after the "Krokis Initialized Successfully" line? Default: after, so the user sees the gap-fill summary first and the verification second.
