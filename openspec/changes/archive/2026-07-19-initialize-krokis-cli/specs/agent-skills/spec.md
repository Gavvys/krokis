## ADDED Requirements

### Requirement: Agent Skills scaffolding
The Krokis CLI MUST populate the workspace's active agent skills directory (preferring `.agents/skills/` and falling back to `.agent/skills/`) with pre-defined skill directories, each containing a `SKILL.md` file and execution scripts.

#### Scenario: Running init scaffolding
- **WHEN** user executes `krokis init`
- **THEN** system populates the active agent skills directory with subfolders (e.g., `krokis-wiki`, `krokis-insights`) containing markdown instructions (`SKILL.md`) and run scripts

### Requirement: Skill execution contract
Each Krokis skill SHALL define a standardized interface using environment variables or CLI flags so that AI agents can run them non-interactively.

#### Scenario: Agent runs skill script
- **WHEN** agent executes `.agents/skills/krokis-wiki/run.sh` or `.agent/skills/krokis-wiki/run.sh` with target file path
- **THEN** script processes the file, updates index lists, and returns exit code 0

