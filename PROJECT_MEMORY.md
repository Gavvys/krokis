# Project memory

## Durable conventions

- UPPERCASE root artifacts are global, constitutional references. Lowercase OpenSpec artifacts apply only to one proposed change.
- `PRODUCT.md` owns product intent; accepted OpenSpec specs own current, testable behavior; `ARCHITECTURE.md` and `DESIGN.md` own durable technical and experience conventions.
- `PROJECT_MEMORY.md` provides orientation and links. It does not override a canonical source.
- Shared OpenSpec skills live in `.agents/skills/`; `.agent/skills/` is supported as a legacy fallback.
- Use `ROADMAP.md` for commitment-based sequencing: Now, Queued, Exploring, and Parked.

## Established decisions

| Date | Decision |
| --- | --- |
| 2026-07-19 | Use OpenSpec's `spec-driven` workflow to propose and archive changes. |
| 2026-07-19 | Build Krokis CLI in Go with zero runtime dependencies. Serve dashboard via `go:embed`. |
| 2026-07-19 | Parse MDX wiki documents client-side using marked.js and custom native Web Components. |
| 2026-07-19 | Standardize wiki file names as upper-case `SNAKE_CASE` ending in `.mdx`. |
| 2026-07-19 | Standardize Agent Skills folder mapping structure under `.agents/skills/`. |
| 2026-07-19 | Parse quality files (JUnit XML, lint JSON) in the insights checker command. |
| 2026-07-19 | Embed RapiDoc visual web component to render interactive OpenAPI specs. |
| 2026-07-19 | Adopt Open Sans as primary dashboard interface font and JetBrains Mono for monospace. |
| 2026-07-20 | Adopt global constitutional reference artifacts (AGENTS.md, PRODUCT.md, ARCHITECTURE.md, DESIGN.md, ROADMAP.md, PROJECT_MEMORY.md) in repo root. |
| 2026-07-20 | Treat local OpenSpec changes as team-level flow items. Report WIP, age, cycle time, throughput, and planning health; do not infer DORA metrics, rank individuals, or claim planning health proves validation. |
| 2026-07-20 | Design decisions live in root `ARCHITECTURE.md`. The `consolidate-design-decisions` change proposed an `ARCHITECTURE.mdx` section, then was superseded by `remove-duplicate-architecture-wiki`, which keeps root `ARCHITECTURE.md` as the sole Architecture source and drops `ARCHITECTURE.mdx`. `consolidate-design-decisions` archived un-synced. |
