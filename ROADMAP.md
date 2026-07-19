# Roadmap

This roadmap orders Krokis directions by commitment, not by date. `PRODUCT.md` defines the vision; OpenSpec changes define bounded execution tasks.

## Now

- Improve decision-ready local project insights, starting with OpenSpec work flow and planning-health visibility.

## Queued

- **Extended visual component library**: Add commit activity heatmaps, spec-to-code coverage indicators, and lint violation treemaps.
- **Wiki content enrichment**: Improve documentation discovery and diagram support without making the wiki the canonical home for root master files.

## Exploring

- **Codebase Context Packer (Repomix)**: Compress the workspace tree into a single structured context file `.krokis/context.txt` for fast agent loading.
- **Dependency Knowledge Graph (GitNexus)**: Build call chains and index files into an interactive visual graph on the dashboard.
- **Machine-readable skill registries**: Expose JSON endpoints detailing skills syntax, inputs, and outputs.
- **Agent Lifecycle Hooks & Workflows**: Intercept workspace actions or package onboarding checklists under `.agents/workflows/` (deferred).

## Parked

- Cross-compilation CI pipelines and binary package manager tapes (e.g. Homebrew).
- Multi-store registered OpenSpec environment dashboards.
- CLI Custom Hook Runner: Expose `krokis hook run <event>` mapping events to config.toml executions.
