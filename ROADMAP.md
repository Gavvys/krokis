# Roadmap

This roadmap orders Krokis directions by commitment, not by date. `PRODUCT.md` defines the vision; OpenSpec changes define bounded execution tasks.

## Now

- (none — no active OpenSpec change; Queued items are candidates for the next proposal)

## Queued

- **Lint violation treemaps**: visualize lint violations by file and severity as a treemap on the dashboard.
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

## Shipped

- **OpenSpec workflow visibility** (2026-07-20): `change-flow-insights`, `visualize-change-flow-as-svg-graph` (`#/changes/<name>` SVG graph), and `add-archived-changes-page` surface local OpenSpec work-in-progress, planning health, and history as first-class dashboard sections.
- **Component reuse foundation** (2026-07-20): `KrokisElement` base class, `mountPage` facade, and table-driven router under `introduce-web-component-base-class-and-route-table`.
- **Backend helpers** (2026-07-21): `withConfig` middleware, `loadConfigOrDie`, `scaffoldFile`, and a doctor check table under `introduce-config-middleware-and-scaffolding-helpers`.
- **Commit activity heatmap** (2026-07-20): trailing 365-day commit activity on the Task Cadence page.
- **Spec-to-code coverage** (2026-07-21): `internal/metrics/coverage.go` scans the workspace for implementation evidence per OpenSpec requirement and classifies each as covered, partial, or uncovered. Dashboard route at `#/insights/coverage`.
- **Idempotent init with auto-doctor** (2026-07-21): `krokis init` fills missing scaffolding without overwriting existing files and auto-invokes `krokis doctor`. `--verbose` and `--skip-doctor` flags. Logic split into `runInit` / `runDoctorChecks`.
- **Consolidated Krokis Agent Skill** (2026-07-22): `krokis init` scaffolds a single `.agents/skills/krokis/` tree with `SKILL.md`, `workflows/`, `references/`, `scripts/`. Template embedded in the binary via `//go:embed`. Legacy per-workflow skills no longer scaffolded.
- **Plan discipline and read order** (2026-07-22): `references/plan-discipline.md` captures the editorial rules every Krokis plan and OpenSpec change artifact follows. Krokis `SKILL.md` opens with a Read order block. OpenSpec skills point at the discipline via a one-line reference so rules are not re-stated per skill.
- **Evidence vs. inference discipline rule** (2026-07-22): plan-discipline now requires every non-trivial claim in `proposal.md`, `design.md`, and `tasks.md` to be tagged as either Evidence (cited pointer) or Inference (agent reasoning).