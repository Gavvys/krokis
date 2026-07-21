## Why

`krokis init` is the only entry point for new projects, but it overwrites or refuses to cooperate with projects that already have a `.krokis/` directory, an existing wiki, or already-scaffolded agent skills. The current behavior is binary: fresh project or `krokis doctor` to discover the gap and then manual fixes. Users onboarding an existing project have no single command that fills the missing pieces without overwriting their work. The fix is to make `krokis init` idempotent: detect what already exists, fill the gaps, never overwrite, and then auto-invoke `krokis doctor` so the user sees one confirmation that the install is healthy. One command, two cases, no surprise overwrites.

## What Changes

- Make `krokis init` idempotent. When `.krokis/config.toml` already exists, the command SHALL skip writing it and print a `↻ Skipped .krokis/config.toml (already exists)` line. The same skip rule SHALL apply to every scaffolded wiki template, every agent skill, and the OpenAPI sample. The command SHALL create directories that are missing, but SHALL NOT overwrite any file that already exists.
- Add a `krokis init --verbose` flag that prints every directory that was created alongside the files, so users can see exactly what the command touched.
- After scaffolding (or skipping everything), `krokis init` SHALL automatically invoke `krokis doctor` and stream its output. The `doctor` command SHALL remain available as a standalone command for users who want to re-run diagnostics without re-running init.
- Add a `krokis init --skip-doctor` flag for users who want the scaffolding only and will run doctor later.
- The `krokis doctor` command SHALL keep its current behavior. No changes to its output format, checks, or exit codes.
- No new commands, no new flags on the `krokis` root, no changes to other CLI commands.

## Capabilities

### New Capabilities
- `idempotent-init`: `krokis init` SHALL be safe to run on existing projects, fill missing scaffolding, never overwrite user content, and auto-invoke `krokis doctor` after scaffolding.

### Modified Capabilities
- `cli-core`: Update the init command behavior to require the no-overwrite, gap-filling, post-init doctor invocation. Add `krokis init --verbose` and `krokis init --skip-doctor` flags.

## Impact

- Modified files: `internal/cmd/init.go` (idempotency, doctor invocation, new flags), `internal/cmd/helpers.go` or `internal/cmd/doctor.go` (small helper to invoke doctor from init).
- New tests: extend `internal/cmd/init_test.go` if present, otherwise add a test that asserts the no-overwrite rule on a pre-seeded `.krokis/` workspace.
- No new dependencies. No changes to telemetry. No changes to the embedded frontend.
- No breaking changes for the fresh-project path. Running `krokis init` on a brand new project produces the same output as before plus a `krokis doctor` summary at the end.
- Documentation updates: `ARCHITECTURE.md` (mention the idempotent init and the new flags), `README.md` (usage examples for new and existing projects), `PROJECT_MEMORY.md` decision row.