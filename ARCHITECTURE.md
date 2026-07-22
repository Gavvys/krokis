# Architecture Overview

Krokis runs as a standalone Go binary compiled from `main.go`. It has zero external execution requirements.

## Component Layout

```
/Users/ksumallo/dev/projects/Krokis/
├── main.go                     # Binary entrypoint
├── go.mod                      # Module metadata
├── internal/
│   ├── cmd/                    # Cobra CLI command subcommands (init, doctor, serve, insights, wiki, validate)
│   ├── config/                 # config.toml loading, saving, and validation rules
│   ├── metrics/                # Git log parsing, LOC line counting, test/lint parsing
│   ├── wiki/                   # SNAKE_CASE naming audits and wiki listing logic
│   └── web/                    # Embedded web server API router
└── web/                        # Web dashboard client frontend (embedded in Go binary via go:embed)
```

## System Data Flow

1.  **Telemetry Generation (`krokis insights`)**:
    *   Reads `config.toml` to locate QA report outputs.
    *   Runs shell Git commands (`git log`) to parse commit cadence.
    *   Walks the workspace directory, counting lines of code by extension.
    *   Parses JUnit XML and lint JSON data.
	*   Reads local OpenSpec change directories to report active WIP, change age, completed cycle time, monthly throughput, and planning health.
    *   Writes report data to `.krokis/insights/health.json` and `.krokis/insights/INDEX.mdx`.
2.  **Dashboard Serving (`krokis serve`)**:
    *   Spins up an HTTP server.
    *   Serves embedded client assets (`web/`).
    *   Exposes endpoints `/api/insights`, `/api/wiki`, and `/api/openapi`. Change-flow data is included in the existing insights response.
    *   Routes all unmapped routes to `index.html` (Single-Page Application client routing).
3.  **Client Compilation**:
    *   `app.js` runs a client-side routing check based on URL hash.
    *   Downloads raw MDX documents from the backend and translates JSX tags (`<MetricsCard />`, `<InfoBox>`) to custom HTML Web Components.
    *   Uses CDNs to load `marked.js` and `prism.js` for lightweight browser markdown compilation.
    *   Loads `RapiDoc` dynamically to render OpenAPI specifications served at `/api/openapi`.
	*   Renders `#/changes` from local change-flow telemetry under the top-level `Changes` sidebar section. Planning health shows artifact and task evidence; it does not claim OpenSpec validation passed. The table on `#/changes` lists active changes only.
	*   Renders `#/changes/archived` for completed OpenSpec changes with completion date, cycle time, and planning health. The `Archived` sidebar link is hidden when the workspace has no completed changes.
	*   Renders `#/changes/<change>` with a per-change detail view that includes a list/graph toggle. The graph view is a hand-written inline SVG Web Component (`web/components/ChangeFlowGraph.js`) that maps proposal → design → spec deltas → tasks and re-renders on `themechange`. The toggle preference is stored under `krokis.changeViewMode` in `localStorage`. The deprecated routes `#/insights/flow` and `#/insights/flow/<change>` redirect to their new equivalents.
	*   Client-side routing is table-driven: a `routes[]` array in `web/app.js` lists every route with a `match`, `title`, and `render` function, and a single dispatcher in `handleRoute` resolves the active route. Every dashboard Web Component extends `KrokisElement` (`web/components/_base.js`), which owns shadow DOM setup, the `data` and `mode` setters, the `themechange` listener, and the shared `escape` helper. The `mountPage` facade in `web/app.js` writes a `section-card` shell and mounts a custom element, replacing the previous per-page duplication.
	*   The HTTP server uses a `withConfig` middleware in `internal/web/server.go` that loads the `config.Config` once per request and passes it to the inner handler, removing the load-or-respond-with-500 boilerplate from every API handler. The CLI uses a `loadConfigOrDie()` helper in `internal/cmd/helpers.go` for most commands; `doctor` loads config gracefully with `config.Load()` to handle missing-config paths, and `init` creates a fresh `config.Default()` for first-time scaffolding. The `init` command uses a `scaffoldFile(path, content, label)` helper for the stat-write-print dance, and `doctor` runs a `[]check` table that the runner iterates over.
	*   The `krokis init` command is idempotent. It fills missing scaffolding without overwriting existing files, prints `↻ Skipped` for files it leaves alone, and `--verbose` adds directory-level output. After scaffolding, init auto-invokes `krokis doctor` and streams its output. The doctor command stays available standalone. Use `--skip-doctor` to suppress the auto-invocation. The init logic lives in `runInit(verbose, skipDoctor bool) int` and the doctor logic in `runDoctorChecks() int`, so both `cobra.Command.Run` and any future callers can reuse the same code path.
	*   The `/api/insights` payload also includes a `coverage` section produced by `internal/metrics/coverage.go`. The gatherer walks `openspec/specs/**/spec.md`, extracts named identifiers (custom-element tags, route hashes, backticked symbols, quoted strings) per requirement, and scans the workspace tree for matches. Each requirement is classified `covered`, `partial`, or `uncovered`. The dashboard surfaces this at `#/insights/coverage` via the `CoverageReport` Web Component.
	*   The Krokis skill ships a shared `references/plan-discipline.md` that captures the editorial rules every Krokis plan and OpenSpec change artifact follows (gate thoughtfully, research before drafting, decide hard-to-reverse bets first, keep the plan self-contained, plan-read-only until approved, single bottom Open Questions block, clarifying-vs-assume). The OpenSpec skills under `.agents/skills/openspec-*/` reference the discipline document at the top of their `SKILL.md` so the discipline is a single source of truth across the skill set. The Krokis `SKILL.md` opens with a "Read order" block that names the workflow files and references in the order an agent should read them.

### ADR 002: Change-flow artifact map in insights payload

- **Status**: Approved
- **Context**: The change-flow graph component needs to know which planning artifacts each change contains without a second HTTP round-trip.
- **Decision**: Extend `ChangeFlowMetrics` with `ArtifactMap map[string][]string`, populated by `internal/metrics/change_flow.go` while it already walks the change directory. The map is additive: existing consumers that ignore unknown keys stay compatible.
- **Consequences**: One new payload field, no new endpoints, no breaking changes. The component reads `flow.artifact_map[change.name]` and merges it with the per-change `planning_health` record.

## Design Decisions

### ADR 001: Standardized Specs

- **Status**: Approved
- **Context**: Code quality and agent alignment.
- **Decision**: Use OpenSpec for all feature implementations.
- **Consequences**: Structured specification folders and deterministic agent instructions.
