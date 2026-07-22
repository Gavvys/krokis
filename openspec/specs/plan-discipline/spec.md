# plan-discipline Specification

## Purpose
TBD - created by archiving change add-read-order-and-plan-discipline-to-krokis-skill. Update Purpose after archive.
## Requirements
### Requirement: Plan discipline reference ships with the Krokis skill
The Krokis skill MUST include a `references/plan-discipline.md` file whose frontmatter declares its name as `plan-discipline` and whose body states the editorial rules every Krokis plan and OpenSpec change artifact follows.

#### Scenario: plan-discipline.md is scaffolded by krokis init
- **WHEN** a user runs `krokis init` in a fresh workspace
- **THEN** the scaffolded `.agents/skills/krokis/references/plan-discipline.md` exists, has frontmatter with `name: plan-discipline`, and lists the editorial rules as numbered sections

#### Scenario: OpenSpec skill points at the discipline
- **WHEN** a reviewer inspects any OpenSpec skill `SKILL.md` under `.agents/skills/openspec-*/`
- **THEN** the skill carries a one-line pointer, placed after the frontmatter and before the description, that references `krokis/references/plan-discipline.md` as the source of truth for plan quality

