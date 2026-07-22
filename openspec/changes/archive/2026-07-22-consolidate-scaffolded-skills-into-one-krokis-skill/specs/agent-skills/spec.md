# Delta Spec: agent-skills

## MODIFIED Requirements

### Requirement: Agent Skills scaffolding
The Krokis CLI MUST populate the workspace's active agent skills directory (preferring `.agents/skills/` and falling back to `.agent/skills/`) with a single Krokis skill directory and the documented file layout, instead of the legacy per-workflow skills.

#### Scenario: Running init scaffolding
- **WHEN** user executes `krokis init` in a fresh workspace
- **THEN** system populates `.agents/skills/krokis/` with a `SKILL.md`, a `workflows/` directory containing `insights.md`, `wiki.md`, and `roadmap.md`, a `references/` directory containing `commands.md` and `plan-discipline.md`, and an empty `scripts/` directory

#### Scenario: Re-running init is idempotent
- **WHEN** user executes `krokis init` in a workspace that already has `.agents/skills/krokis/`
- **THEN** the existing files are left untouched and the command reports them as skipped

## REMOVED Requirements

### Requirement: Skill execution contract
**Reason**: Replaced by the consolidated Krokis skill. Workflow-specific scripts (if any) live under `.agents/skills/krokis/scripts/` and are documented there; the standardized `run.sh` per-skill interface is no longer required.
**Migration**: Use the consolidated `krokis` skill and follow the workflow files (`workflows/insights.md`, `workflows/wiki.md`, `workflows/roadmap.md`) for step-by-step guidance.
