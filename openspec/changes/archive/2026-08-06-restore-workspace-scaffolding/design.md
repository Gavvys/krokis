## Context

Krokis is now a Tauri v2 desktop application. [E: `src-tauri/src/lib.rs` registers native IPC commands and `web/components/ProjectSelector.js` owns project selection] The previous Go initializer created `.krokis` defaults, wiki templates, an OpenAPI sample, a wiki index, and the Krokis Agent Skill tree without overwriting existing files. [E: deleted `internal/cmd/init.go`; accepted `openspec/specs/idempotent-init/spec.md`]

## Goals / Non-Goals

**Goals:**
- Make an existing directory Krokis-enabled from the Project Hub.
- Keep initialization safe for repositories with existing files.
- Reuse the checked-in `.agents/skills/krokis/` tree as the source for bundled skill templates.
- Generate a Doctor report after setup.

**Non-Goals:**
- A command-line executable or restoration of the Go CLI.
- Automatic `git init`, commits, pushes, branch changes, or other Git mutations.
- Overwriting or merging existing Markdown, TOML, YAML, or skill files.
- Runtime parsing or customization through `.krokis/config.toml`.

## Decisions

1. **IPC command, not CLI:** Add `scaffold_workspace` beside existing Tauri commands. [I: the product runtime is GUI-only after the Tauri migration; a second CLI would recreate the retired architecture]
2. **Explicit workspace path:** Accept the same optional `project_path` used by Doctor and telemetry, resolve it through existing workspace resolution, and run work in `spawn_blocking`. [E: `resolve_workspace` and existing blocking command pattern in `src-tauri/src/lib.rs`]
3. **Structured result:** Return created paths, skipped paths, and DoctorReport so the frontend can explain exactly what happened without parsing logs.
4. **Template source:** Embed stable templates with `include_str!` for canonical docs and OpenAPI, and copy the repository's `.agents/skills/krokis/` source tree using compile-time `include_dir`-style constants generated manually from the current tree. [I: runtime must work when installed outside the source checkout; no dependency is added for this bounded feature, so the skill files are represented as bundled constants]
5. **No overwrite:** Use create-new semantics (`create_new(true)`) for every file. A race that discovers an existing file is reported as skipped, not treated as destructive failure.
6. **Project Hub action:** Add `Initialize Workspace` near the existing `Open Project...` action. It invokes the command for the active project and emits a normal `projectchange` refresh after success.
7. **Template content:** Canonical documents are useful starter shells with explicit “adapt this file” guidance. Wiki templates use current desktop terminology, not removed `krokis serve`/HTTP commands.

## Risks / Trade-offs

- [Risk] Bundled skill content can drift from `.agents/skills/krokis/` → Mitigation: document the source path and add a test that key template files are present; refresh constants when the skill changes.
- [Risk] A large scaffold creates noisy diffs → Mitigation: create only absent files and show created/skipped lists.
- [Risk] OpenSpec CLI may not be installed on a new machine → Mitigation: scaffold the directory and config, but report CLI availability as Doctor guidance rather than invoking an external command.
- [Trade-off] Compatibility `config.toml` is created but not parsed by Tauri → Keep it for workspace convention compatibility; formally defer runtime configuration redesign.

## Migration Plan

Implement the command and Project Hub action. Existing workspaces can run it safely; only missing files are added. Rollback is user-controlled through Git because Krokis never deletes generated files.
