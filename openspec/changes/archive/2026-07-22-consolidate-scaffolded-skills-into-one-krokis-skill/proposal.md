# Change: Consolidate scaffolded skills into one krokis skill

## Why

`krokis init` currently scaffolds three separate skills under `.agents/skills/` — `krokis-insights`, `krokis-wiki`, `roadmap-coordination` — with their `SKILL.md` content inlined as Go string literals in `internal/cmd/init.go`. That approach has three problems:

1. The skills drift from their canonical descriptions in this repo because the Go strings are hand-maintained copies that don't get reviewed against the source of truth.
2. Each skill is described in isolation, so an agent that loads any one of them has no entry point for "how do I work with Krokis overall".
3. There is no shared `references/plan-discipline.md` or `references/commands.md`, so every plan/discipline question gets re-derived from first principles.

The user-facing experience should be one Krokis skill that introduces the project, points to the workflows, and points to a shared reference set. Workflow-specific detail lives in `workflows/{insights,wiki,roadmap}.md`.

## What Changes

- `krokis init` scaffolds a single `.agents/skills/krokis/` tree with `SKILL.md` (introduction + Read order), `workflows/{insights,wiki,roadmap}.md`, `references/{commands,plan-discipline}.md`, and an empty `scripts/` directory.
- The skill content lives in `internal/cmd/skill_template/krokis/` and is embedded into the binary via `//go:embed all:skill_template/krokis` in a new `internal/cmd/skill_template.go`. `scaffoldAgentSkills` now walks the embedded FS instead of writing Go string literals.
- The three legacy per-workflow skill files (`krokis-insights/SKILL.md`, `krokis-wiki/SKILL.md`) are removed from the repo. `roadmap-coordination/SKILL.md` stays in the repo as the dashboard's roadmap skill (separate user-facing concern).
- The `init` unit test in `internal/cmd/init_test.go` is updated to assert the new `krokis/SKILL.md` path and the new `krokis/references/plan-discipline.md` file instead of the legacy skills.
- `.gitignore` is tightened so the bare `krokis` pattern (which currently matches the built binary at the repo root) no longer swallows `internal/cmd/skill_template/krokis/`. The binary rule becomes `/krokis`.

## Capabilities

### New Capabilities
- (none — the consolidated skill is implementation, not a new user-visible capability at the spec level)

### Modified Capabilities
- `agent-skills`: change the assertion that `krokis init` scaffolds `krokis-insights`, `krokis-wiki`, and `roadmap-coordination` to instead assert that it scaffolds a single `krokis` skill with the documented file layout.

## Impact

- `internal/cmd/skill_template.go` (new)
- `internal/cmd/skill_template/krokis/` (new template tree)
- `internal/cmd/init.go` (`scaffoldAgentSkills` rewritten to walk the embedded FS)
- `internal/cmd/init_test.go` (assertions updated)
- `.gitignore` (tighten `krokis` → `/krokis`)
- `.agents/skills/krokis-insights/SKILL.md` (deleted from repo; existing user installs are unaffected)
- `.agents/skills/krokis-wiki/SKILL.md` (deleted from repo)
- `README.md` (update scaffolded-skill description)
- `openspec/specs/agent-skills/spec.md` (delta)
