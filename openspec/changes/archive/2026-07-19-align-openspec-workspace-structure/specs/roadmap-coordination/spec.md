## ADDED Requirements

### Requirement: Roadmap coordination skill scaffolding
The active agent skills directory MUST contain a `roadmap-coordination` skill directory.

#### Scenario: Running init scaffolds roadmap coordination
- **WHEN** user executes `krokis init` or runs setup
- **THEN** system populates `.agents/skills/roadmap-coordination/SKILL.md` (or `.agent/skills/roadmap-coordination/SKILL.md`) with instructions for commitment-based sequencing (Now, Queued, Exploring, Parked)
