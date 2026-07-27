# Change: Consolidate scaffolded skills into one krokis skill

## Why

Workspace scaffolding under `.agents/skills/` should provide a single, unified `krokis` skill that introduces the project, points to the workflows, and points to a shared reference set (`references/plan-discipline.md` and `references/commands.md`).

The user-facing experience is one Krokis skill that introduces the project, points to the workflows, and points to a shared reference set. Workflow-specific detail lives in `workflows/{insights,wiki,roadmap}.md`.

## What Changes

- Scaffold a single `.agents/skills/krokis/` tree with `SKILL.md` (introduction + Read order), `workflows/{insights,wiki,roadmap}.md`, `references/{commands,plan-discipline}.md`, and a `scripts/` directory.
- The skill content lives under `.agents/skills/krokis/`.
- Update `openspec/specs/agent-skills/spec.md` to assert that scaffolding provides a single `krokis` skill with the documented file layout.

## Capabilities

### Modified Capabilities
- `agent-skills`: assert that scaffolding provides a single `krokis` skill under `.agents/skills/krokis/`.

## Impact

- `.agents/skills/krokis/` template layout.
- `README.md` and `PROJECT_MEMORY.md` documentation updates.
