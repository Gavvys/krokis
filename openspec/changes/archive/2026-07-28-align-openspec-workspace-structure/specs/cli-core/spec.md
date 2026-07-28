## ADDED Requirements

### Requirement: Plural agents directory priority
The Krokis desktop application MUST prioritize reading and writing Agent Skills inside the plural `.agents/skills/` directory, while preserving the singular `.agent/skills/` path as a fallback.

#### Scenario: Running init prioritizing plural
- **WHEN** user executes workspace initialization in a workspace containing both `.agents` and `.agent` or containing neither
- **THEN** system scaffolds skills under `.agents/skills/`
