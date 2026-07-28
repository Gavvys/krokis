## 1. Workspace resolution

- [x] 1.1 Add `resolve_workspace` helper in `src-tauri/src/lib.rs`.
- [x] 1.2 Convert telemetry and wiki IPC handlers to use `resolve_workspace`.

## 2. Idempotent scaffolding

- [x] 2.1 Add idempotent file scaffolding helper that stats-then-writes without overwrite.
- [x] 2.2 Convert wiki template, agent skill, and OpenAPI scaffold call sites.

## 3. Diagnostics table

- [x] 3.1 Convert workspace health diagnostics to a name/status/message check table.
- [x] 3.2 Keep failing checks surfaced clearly to the user.

## 4. Validation

- [x] 4.1 Run `cargo check` and `cargo test`.
- [x] 4.2 Run `openspec validate --all --strict`.
