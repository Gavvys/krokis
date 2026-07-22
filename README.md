# Krokis

> Spec-driven project management for humans and AI agents. A single Go binary that scaffolds MDX wikis, captures local telemetry, and serves a dark-mode dashboard — with zero runtime dependencies.

Krokis turns a local OpenSpec workspace into an auditable product surface. It writes telemetry, surfaces it through a glassmorphic dashboard, and lets AI agents propose, implement, and archive changes against the same artifacts the team reads.

## Highlights

- **One binary, zero deps.** `krokis serve` ships its own SPA — no Node, no Python, no DB.
- **Spec-first.** Every feature starts as a bounded OpenSpec change with proposal, design, scenarios, and tasks before any code lands.
- **Local telemetry.** Git cadence, code quality, and OpenSpec change-flow — written to `.krokis/insights/health.json` and surfaced live in the dashboard.
- **Authorable wikis.** SNAKE_CASE `.mdx` files with custom Web Components, parsed client-side.

## Quick Start

```bash
go build -o krokis .
./krokis init
./krokis insights
./krokis serve --port 8080
```

Then open `http://localhost:8080`.

`krokis init` is idempotent. Re-running it on a workspace that already has Krokis artifacts fills the missing pieces without overwriting anything, and finishes by auto-invoking `krokis doctor`. Use `--skip-doctor` to suppress the auto-invocation or `--verbose` to see every directory created.

## Table of Contents

- [Highlights](#highlights)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [Dashboard Routes](#dashboard-routes)
- [Contribution Notes](#contribution-notes)
- [Tips for Sharing the Project](#tips-for-sharing-the-project)

## Commands

| Command | Purpose |
| --- | --- |
| `krokis init` | Scaffold `.krokis/`, wiki templates, the consolidated `krokis` Agent Skill (`.agents/skills/krokis/` with `SKILL.md`, `workflows/`, `references/`), and a sample OpenAPI spec. Idempotent; auto-invokes `krokis doctor`. |
| `krokis insights` | Generate git, quality, and OpenSpec change-flow telemetry. |
| `krokis doctor` | Validate workspace, OpenSpec, and telemetry. |
| `krokis serve` | Run the embedded HTTP dashboard. |
| `krokis wiki list` | List SNAKE_CASE wiki files. |
| `krokis wiki create <name>` | Scaffold a new wiki file and refresh the index. |

## Dashboard Routes

| Route | What it shows |
| --- | --- |
| `#/wiki/<NAME>` | Rendered MDX wiki page. |
| `#/insights/health` | Code quality, tests, and lint summary. |
| `#/insights/cadence` | Author breakdown, recent commits, and a 365-day commit heatmap. |
| `#/changes` | Active OpenSpec work-in-progress, change age, cycle time, and planning health. |
| `#/changes/archived` | Completed OpenSpec changes with completion date, cycle time, and planning health. |
| `#/insights/coverage` | Spec-to-code coverage per OpenSpec requirement, classified as covered, partial, or uncovered. |
| `#/insights/openapi` | Interactive RapiDoc viewer for the configured OpenAPI spec. |

## Contribution Notes

Krokis is a spec-driven project. Every change runs through three stages.

1. **Propose.** Use the `openspec-propose` skill to author a proposal, design, scoped specs, and tasks.
2. **Implement.** Land the work as small, conventional commits (`feat:`, `fix:`, `chore:`, etc.). Keep diffs surgical.
3. **Archive.** Use the `openspec-archive-change` skill to sync the delta specs and move the change into `openspec/changes/archive/`.

Before writing code, read the constitutional references in this order: `AGENTS.md` → `PRODUCT.md` → the relevant `openspec/specs/<capability>/spec.md` → `ARCHITECTURE.md` / `DESIGN.md` → `PROJECT_MEMORY.md` → the active change in `openspec/changes/`.

Keep scope honest. Krokis is local-first audit, not cloud aggregation. Productivity scores, per-person rankings, and DORA metrics are intentionally out of scope — see the 2026-07-20 entry in `PROJECT_MEMORY.md`.

## Tips for Sharing the Project

- **Ship the project with telemetry pre-generated.** A `health.json` produced by `krokis insights` lets recipients run `krokis serve` immediately, with no build step.
- **Pin the toolchain.** Go 1.22+ is required for the current `go:embed` patterns.
- **Keep one Architecture source.** Root `ARCHITECTURE.md` is the only Architecture page the dashboard surfaces. Decisions live there, not in a separate wiki file.
- **Use SNAKE_CASE for wikis.** `krokis wiki create` enforces the convention and keeps `WIKI_INDEX.mdx` in sync; `krokis doctor` flags violations.
- **Document the dashboard, not the binary.** The static SPA in `web/` is embedded in the binary at build time. If you fork and add assets, redeclare them in the embed list before rebuilding.

---

[KROKIS](./) · [PRODUCT.md](./PRODUCT.md) · [ROADMAP.md](./ROADMAP.md) · [AGENTS.md](./AGENTS.md)
