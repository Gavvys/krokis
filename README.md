# Krokis

> A lightweight, portable project-management CLI and dashboard that sits on top of [OpenSpec](https://github.com/Fission-AI/OpenSpec) — so AI agents can run spec-driven workflows, and humans can audit cadence, code quality, and OpenSpec change-flow in a single dark-mode glassmorphic UI.

Krokis is a single Go binary with zero runtime dependencies. It scaffolds SNAKE_CASE MDX wikis, runs git/QA/flow telemetry against the local repo, and serves an embedded dashboard with a RapiDoc OpenAPI viewer, client-side MDX rendering, and a GitHub-style commit heatmap.

## Why Krokis

- **Local-first, zero deps.** `krokis serve` ships its own SPA — no Node, no Python, no DB.
- **Audit-friendly.** The dashboard surfaces the same artifacts AI agents use: active changes, plan health, code quality, commit cadence, OpenAPI spec.
- **Spec-driven.** Every feature starts as a bounded OpenSpec change with artifacts and tasks before any code lands.

## Table of Contents

- [Why Krokis](#why-krokis)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Dashboard](#dashboard)
- [Authoring Wiki Pages](#authoring-wiki-pages)
- [Project Layout](#project-layout)
- [Contribution Notes](#contribution-notes)
- [Tips for Sharing the Project](#tips-for-sharing-the-project)

## Quick Start

```bash
# Build the binary (Go 1.22+)
go build -o krokis .

# Scaffold a workspace
./krokis init

# Generate telemetry
./krokis insights

# Run diagnostics
./krokis doctor

# Serve the dashboard
./krokis serve --port 8080
# → http://localhost:8080
```

The `init` command scaffolds `.krokis/` (config, wiki dir, telemetry outputs) and a sample `openapi.yaml`. `serve` exposes the embedded SPA at `/` plus JSON APIs at `/api/insights`, `/api/wiki`, and `/api/openapi`.

## Commands

| Command | Purpose |
| --- | --- |
| `krokis init` | Scaffold `.krokis/` and a sample OpenAPI spec. |
| `krokis insights` | Parse git, codebase, quality, and OpenSpec change-flow into `.krokis/insights/health.json` and a generated `INDEX.mdx`. |
| `krokis serve [--port] [--host]` | Run the embedded HTTP dashboard. |
| `krokis doctor` | Validate Git, OpenSpec, Krokis config, directories, and telemetry outputs. |
| `krokis wiki list` | List all SNAKE_CASE wiki files. |
| `krokis wiki create [name]` | Scaffold a new SNAKE_CASE `.mdx` file and refresh the wiki index. |

## Dashboard

Routes:

- `#/wiki/<NAME>` — rendered MDX wiki page (with custom `<InfoBox>`, `<MetricsCard>`, etc.).
- `#/insights/health` — quality + test + lint summary.
- `#/insights/cadence` — author breakdown, recent commits, **commit activity heatmap**.
- `#/insights/flow` — OpenSpec work-in-progress, change age, cycle time, throughput, planning health.
- `#/insights/openapi` — interactive RapiDoc viewer for the configured OpenAPI spec.

The header strip on each page shows a sidebar refresh icon (top right of the logo) that re-runs `krokis insights` live.

## Authoring Wiki Pages

Wiki master files must be `SNAKE_CASE` and end in `.mdx` (e.g. `WIKI_INDEX.mdx`). They live in the directory configured in `.krokis/config.toml` (default `.krokis/wiki/`). Root-level canonical files (`AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, `PROJECT_MEMORY.md`) are also surfaced.

MDX supports a small set of custom Web Components that compile to native custom elements client-side:

| Tag | Purpose |
| --- | --- |
| `<InfoBox type="info|tip|warning|caution">` | Colored callout with icon. |
| `<MetricsCard value="…" label="…" />` | Big-number metric tile. |
| `<TaskCadence />` | Live commit author breakdown + recent activity. |
| `<TestResults />` | Live test pass/fail summary. |
| `<CommitHeatmap />` | Trailing-year commit activity grid. |
| `<FlowInsights />` | OpenSpec change-flow summary. |

## Project Layout

```
.
├── main.go                  # binary entrypoint
├── internal/
│   ├── cmd/                 # cobra subcommands (init, serve, insights, doctor, wiki)
│   ├── config/              # config.toml loading + validation
│   ├── metrics/             # git log, LOC, quality, OpenSpec change-flow
│   ├── wiki/                # SNAKE_CASE naming audits + listing
│   └── web/                 # embedded HTTP server + API routes
├── web/                     # dashboard SPA (embedded via go:embed)
│   ├── components/          # custom Web Components (shadow-DOM, scoped styles)
│   ├── styles.css           # design tokens + layout + markdown + dashboard
│   ├── app.js               # hash router + renderers
│   └── index.html           # shell + CDN deps (marked, prism, rapidoc)
├── openspec/
│   ├── specs/               # accepted, testable product behavior
│   └── changes/             # proposed changes (proposal + design + specs + tasks)
├── openapi.yaml             # Krokis sample API spec (served by /api/openapi)
├── PRODUCT.md               # product intent, scope, non-goals
├── ARCHITECTURE.md          # current architecture + ADRs
├── ROADMAP.md               # Now / Queued / Exploring / Parked horizons
├── PROJECT_MEMORY.md        # settled decisions log
├── DESIGN.md                # design system (palette, fonts, glassmorphism)
└── AGENTS.md                # shared workflow + reference artifact map
```

## Contribution Notes

Krokis follows a strict **spec-driven workflow**. Every change lands in three stages.

1. **Propose.** Run `openspec change <name>` or use the `openspec-propose` skill. Author four artifacts:
   - `proposal.md` — why, what changes, impact.
   - `design.md` — implementation choices.
   - `specs/**/spec.md` — requirements + scenarios in `## ADDED Requirements` form.
   - `tasks.md` — checklist of work items.
2. **Implement.** Tasks become small, atomic commits following the project style (`feat:`, `fix:`, `chore:`, `style:`, `refactor:`, `docs:`, `test:`). Keep diffs surgical. Do not commit unrelated cleanups — split or fold only when the work is logically one.
3. **Archive.** Run `openspec-archive-change`. Delta specs sync to `openspec/specs/`, the change moves to `openspec/changes/archive/YYYY-MM-DD-<name>/`, and the new accepted spec becomes the source of truth.

Authoritative reading order for any change: `AGENTS.md` → `PRODUCT.md` → `openspec/specs/<capability>/spec.md` → `ARCHITECTURE.md` / `DESIGN.md` → `PROJECT_MEMORY.md` → the active change under `openspec/changes/`.

### Scope discipline

- Keep the binary small and the dashboard focused on local audit, not cloud aggregation.
- Do not introduce runtime dependencies (no Node, no DB).
- Per-person rankings, DORA metrics, or productivity scores are explicitly out of scope — see the 2026-07-20 entry in `PROJECT_MEMORY.md`.
- Decide roadmap placement with `ROADMAP.md` horizons (Now, Queued, Exploring, Parked). If a feature is speculative, log it in Parked first; do not let an "Exploring" item grow into a queued commitment without evidence.

### Shared workflow skills

`.agents/skills/` is the canonical location for project skills. `.agent/skills/` is supported as a legacy alias. Use the `Skill` tool to load specialized workflows like `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `frontend-skill`, and `krokis-wiki`.

## Tips for Sharing the Project

- **Embed the dashboard, not the repo.** The dashboard reads everything from the local checkout; ship a tarball/zip of a project *with* its `.krokis/insights/health.json` already generated, and recipients can run `krokis serve` without needing a build environment.
- **Pin a Go version.** Go 1.22+ is required for the current `go:embed` patterns. Note this in any shared release notes.
- **Document the embedded assets.** `web/` is shipped inside the binary via `go:embed`. If you fork and add new static assets, declare them in `internal/web/server.go` (see `EmbeddedFiles`) and rebuild.
- **Re-generate telemetry before demoing.** `krokis insights` writes the JSON the dashboard reads. Run it once on the demo machine so the heatmap, flow, and quality views are populated.
- **Open the dashboard in a tab group, not a window.** The hash router preserves state per tab, so multiple wiki pages can be open side-by-side.
- **Use the canonical `SNAKE_CASE` convention** for any wiki files. `krokis wiki create` enforces it and keeps `WIKI_INDEX.mdx` in sync — non-conformant files will be rejected by `krokis doctor`.
- **Write design decisions into root `ARCHITECTURE.md`**, not a separate `DESIGN_DECISIONS.mdx`. The dashboard surfaces the root file as the single Architecture source of truth.

---

Built with Go, Open Sans, JetBrains Mono, marked.js, prism.js, and RapiDoc.  ·  [PRODUCT.md](./PRODUCT.md) · [ROADMAP.md](./ROADMAP.md) · [AGENTS.md](./AGENTS.md)
