# Roadmap

This roadmap orders Krokis directions by commitment, not by date. `PRODUCT.md` defines the vision; OpenSpec changes define bounded execution tasks.

## Now

- **Spec-to-code coverage indicators**: surface which OpenSpec requirements have implementation evidence (file:function references) and which do not, so users can see drift between specs and code at a glance.

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