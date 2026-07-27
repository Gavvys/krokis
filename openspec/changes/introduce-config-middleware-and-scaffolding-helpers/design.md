## Context

The Krokis backend had accumulated repeated small patterns around config loading, scaffolding, and diagnostics. This change introduces workspace resolution, idempotent scaffolding helpers, and a table-driven health diagnostics runner for the Tauri/Rust architecture.

## Goals / Non-Goals

**Goals:**
- Add `resolve_workspace` helper in `src-tauri/src/lib.rs` and use it from IPC handlers.
- Add idempotent file scaffolding helpers and convert wiki/skill/OpenAPI scaffold sites.
- Convert workspace health diagnostics to a check table.

**Non-Goals:**
- Changing telemetry payload shape.
- Rewriting the frontend SPA.

## Decisions

- **`resolve_workspace` lives next to IPC handlers.** Keeps path resolution discoverable before telemetry/wiki commands run.
- **Scaffolding never overwrites.** Existing files are skipped.
- **Diagnostics stay table-driven.** Adding a check is one table entry.

## Risks / Trade-offs

- More helper modules → Mitigation: keep helpers small and focused.

## Migration Plan

1. Add `resolve_workspace` and convert IPC handlers.
2. Add idempotent scaffolding helpers; convert scaffold call sites.
3. Convert diagnostics to a check table.
4. Run `cargo check`, `cargo test`, `openspec validate --all --strict`.
