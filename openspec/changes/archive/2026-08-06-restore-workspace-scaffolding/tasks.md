## 1. Backend scaffolder

- [x] 1.1 Add `src-tauri/src/scaffold.rs` with create-new file semantics, canonical document templates, `.krokis`/OpenSpec/wiki/OpenAPI targets, and bundled Krokis skill files
- [x] 1.2 Return structured created/skipped paths and run Doctor after scaffolding
- [x] 1.3 Register async `scaffold_workspace` IPC using existing workspace resolution and blocking-work pattern
- [x] 1.4 Add Rust tests for fresh setup, idempotent rerun, and preservation of existing content

## 2. Project Hub integration

- [x] 2.1 Add `Initialize Workspace` action to `ProjectSelector`
- [x] 2.2 Add frontend invocation, progress toast, created/skipped summary, and project/wiki/Doctor refresh
- [x] 2.3 Remove stale setup wording that tells users to run the retired `krokis init` CLI

## 3. Documentation and validation

- [x] 3.1 Update `ARCHITECTURE.md`, `README.md`, `.agents/skills/krokis/references/commands.md`, `PROJECT_MEMORY.md`, and `ROADMAP.md`
- [x] 3.2 Run `cargo fmt`, `cargo test`, `cargo check`, frontend build, and `openspec validate`
- [x] 3.3 Archive the completed change after validation
