# Roadmap

This roadmap orders Krokis directions by commitment, not by date. `PRODUCT.md` defines the vision; OpenSpec changes define bounded execution tasks.

## Now

- None. All active alignment tasks are complete.

## Queued

- **Configuration Schema & Doctor checks**: Validate `config.toml` structure, port mappings, and add environment sanity validation checks. (Archived change `2026-07-19-krokis-config-schema`).
- **Interactive OpenAPI visualizer**: Embed a native RapiDoc viewer in the dashboard client and expose endpoints serving the configured spec file. (Archived change `2026-07-19-add-openapi-view`).
- **Extended visual component library**: Add commit activity heatmaps, spec-to-code coverage indicators, and lint violation treemaps.
- **Wiki indexing & sync rules**: Auto-generate `WIKI_INDEX.mdx` tables of contents and sync diagrams on code archive events.

## Exploring

- **Codebase Context Packer (Repomix)**: Compress the workspace tree into a single structured context file `.krokis/context.txt` for fast agent loading.
- **Dependency Knowledge Graph (GitNexus)**: Build call chains and index files into an interactive visual graph on the dashboard.
- **Machine-readable skill registries**: Expose JSON endpoints detailing skills syntax, inputs, and outputs.
- **Agent Lifecycle Hooks & Workflows**: Intercept workspace actions or package onboarding checklists under `.agents/workflows/` (deferred).

## Parked

- Cross-compilation CI pipelines and binary package manager tapes (e.g. Homebrew).
- Multi-store registered OpenSpec environment dashboards.
- CLI Custom Hook Runner: Expose `krokis hook run <event>` mapping events to config.toml executions.
