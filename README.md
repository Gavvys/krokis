# Krokis Desktop

> Spec-driven project management for humans and AI agents. A native desktop application and Project Hub built with Tauri v2 and Rust — with zero runtime server dependencies.

Krokis turns local OpenSpec repositories into a visual, auditable desktop surface. It features a top-level **Project Hub** selector for instant workspace switching, native Rust telemetry scanning, SNAKE_CASE wiki rendering, and spec-to-code coverage views.

## Highlights

- **Native Tauri v2 Desktop & Project Hub.** Select and switch local Git repositories instantly with recent workspace memory and native OS directory dialogs.
- **Pure Rust Telemetry Engine.** Native Rust scanning for Git commit cadence, 365-day heatmaps, lines of code (LOC), OpenSpec proposal flow, and requirement coverage.
- **100% Offline-First.** Bundled minified vendor dependencies (`web/vendor/`), zero CDN network dependencies, running entirely via local IPC.
- **Non-Intrusive & Git-Aligned.** Rides Git passively at user discretion — zero automated commits or working tree mutations.

## Quick Start

### Prerequisites

- Rust toolchain (`rustup`)
- Tauri CLI v2:

```bash
cargo install tauri-cli --version "^2" --locked
```

On macOS you also need Xcode Command Line Tools (`xcode-select --install`).

### Development Mode

Run the Tauri v2 desktop application in live development mode:

```bash
make dev
# or
cargo tauri dev
```

### Initialize an Existing Project

Open an existing directory in the Project Hub, then choose **Initialize Workspace**. Krokis creates missing canonical documents, OpenSpec and wiki scaffolding, Agent Skills, and an OpenAPI starter without overwriting existing files. It runs Doctor afterward and leaves Git actions to you.

### Production Build

Build a standalone, native desktop application bundle for your operating system:

```bash
make build
# or
cargo tauri build
```

### Checks

```bash
make check      # cargo check in src-tauri
make validate   # openspec validate --all --strict
```
## Dashboard Routes

| Route | What it shows |
| --- | --- |
| `#/wiki/<NAME>` | Rendered MDX wiki page or canonical document (`PRODUCT.md`, `ARCHITECTURE.md`, etc.). |
| `#/insights/cadence` | Author commit breakdown, recent commits, and a 365-day commit heatmap. |
| `#/changes` | Active OpenSpec work-in-progress, change age, cycle time, and planning health. |
| `#/changes/archived` | Completed OpenSpec changes with completion date, cycle time, and planning health. |
| `#/roadmap` | Read-only Kanban projection of `ROADMAP.md` commitment horizons. |
| `#/insights/coverage` | Spec-to-code coverage per OpenSpec requirement, classified as covered, partial, or uncovered. |
| `#/insights/openapi` | Interactive RapiDoc viewer for OpenAPI specifications. |

## Contribution Notes

Krokis is a spec-driven project. Every change runs through three stages.

1. **Propose.** Use the `openspec-propose` skill to author a proposal, design, scoped specs, and tasks.
2. **Implement.** Land the work as small, conventional commits (`feat:`, `fix:`, `chore:`, etc.). Keep diffs surgical.
3. **Archive.** Use the `openspec-archive-change` skill to sync the delta specs and move the change into `openspec/changes/archive/`.

Before writing code, read the constitutional references in this order: `AGENTS.md` → `PRODUCT.md` → the relevant `openspec/specs/<capability>/spec.md` → `ARCHITECTURE.md` / `DESIGN.md` → `PROJECT_MEMORY.md` → the active change in `openspec/changes/`.

---

[KROKIS](./) · [PRODUCT.md](./PRODUCT.md) · [ROADMAP.md](./ROADMAP.md) · [AGENTS.md](./AGENTS.md)
