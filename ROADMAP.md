# Roadmap

This roadmap orders Krokis directions by commitment, not by date. `PRODUCT.md` defines the vision; OpenSpec changes define bounded execution tasks.

## Now

- **View-only Roadmap Kanban** (`add-roadmap-kanban-view`): project `ROADMAP.md` horizons as a read-only board at `#/roadmap`; agents keep editing Markdown.

## Queued

- **Wiki content enrichment**: improve documentation discovery and diagram support without making the wiki the canonical home for root master files.

## Exploring

- **Codebase Context Packer (Repomix)**: Compress the workspace tree into a single structured context file `.krokis/context.txt` for fast agent loading.
- **Dependency Knowledge Graph (GitNexus)**: Build call chains and index files into an interactive visual graph on the dashboard.
- **Machine-readable skill registries**: Expose JSON endpoints detailing skills syntax, inputs, and outputs.
- **Agent Lifecycle Hooks & Workflows**: Intercept workspace actions or package onboarding checklists under `.agents/workflows/` (deferred).

## Parked

- Cross-compilation CI pipelines and binary package manager tapes (e.g. Homebrew).
- Multi-store registered OpenSpec environment dashboards.
- CLI Custom Hook Runner: Expose `krokis hook run <event>` mapping events to config.toml executions.
- **Ecosystem doctor plugins**: Optional per-stack health checks (Flutter, Node, Rust, Go, Python, etc.) that only run when a project shows a clear marker (`pubspec.yaml`, `package.json`, `Cargo.toml`, …). Keep the core Doctor focused on OpenSpec/Krokis; treat toolchain probes as plugins so non-matching projects stay quiet.

## Shipped

- **OpenSpec workflow visibility** (2026-07-20): `change-flow-insights`, `visualize-change-flow-as-svg-graph` (`#/changes/<name>` SVG graph), and `add-archived-changes-page` surface local OpenSpec work-in-progress, planning health, and history as first-class dashboard sections.
- **Component reuse foundation** (2026-07-20): `KrokisElement` base class, `mountPage` facade, and table-driven router under `introduce-web-component-base-class-and-route-table`.
- **Backend helpers** (2026-07-21; revised 2026-07-25): workspace resolution helpers, idempotent scaffolding, and health diagnostics table under `introduce-config-middleware-and-scaffolding-helpers` (now Tauri/Rust IPC oriented).
- **Commit activity heatmap** (2026-07-20): trailing 365-day commit activity on the Task Cadence page.
- **Spec-to-code coverage** (2026-07-21; revised 2026-07-25): `src-tauri/src/metrics/coverage.rs` scans the workspace for implementation evidence per OpenSpec requirement and classifies each as covered, partial, or uncovered. Dashboard route at `#/insights/coverage`.
- **Idempotent workspace scaffolding** (2026-07-21; revised 2026-07-25): workspace initialization fills missing scaffolding without overwriting existing files and can run health diagnostics afterward.
- **Consolidated Krokis Agent Skill** (2026-07-22; revised 2026-07-25): scaffolds a single `.agents/skills/krokis/` tree with `SKILL.md`, `workflows/`, `references/`, `scripts/`. Legacy per-workflow skills no longer scaffolded.
- **Tauri desktop migration** (2026-07-25): Pure Tauri v2 Rust desktop app with Project Hub multi-workspace switching, native IPC telemetry/wiki commands, and offline vendor bundles.
- **Plan discipline and read order** (2026-07-22): `references/plan-discipline.md` captures the editorial rules every Krokis plan and OpenSpec change artifact follows. Krokis `SKILL.md` opens with a Read order block. OpenSpec skills point at the discipline via a one-line reference so rules are not re-stated per skill.
- **Evidence vs. inference discipline rule** (2026-07-22): plan-discipline now requires every non-trivial claim in `proposal.md`, `design.md`, and `tasks.md` to be tagged as either Evidence (cited pointer) or Inference (agent reasoning).