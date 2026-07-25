# agent-skills Specification

## Purpose
Defines the consolidated Krokis Agent Skill layout under `.agents/skills/krokis/`.

## Requirements
### Requirement: Agent Skills scaffolding
Workspace initialization MUST populate the workspace's active agent skills directory (preferring `.agents/skills/` and falling back to `.agent/skills/`) with a single Krokis skill directory and the documented file layout, instead of the legacy per-workflow skills.

#### Scenario: Initializing skills scaffolding
- **WHEN** user initializes Krokis in a fresh workspace
- **THEN** system populates `.agents/skills/krokis/` with a `SKILL.md`, a `workflows/` directory containing `insights.md`, `wiki.md`, and `roadmap.md`, a `references/` directory containing `commands.md` and `plan-discipline.md`, and a `scripts/` directory

#### Scenario: Re-initializing is idempotent
- **WHEN** user re-initializes Krokis in a workspace that already has `.agents/skills/krokis/`
- **THEN** the existing files are left untouched
