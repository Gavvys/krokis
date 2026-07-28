## ADDED Requirements

### Requirement: User manual scaffolding
The Krokis desktop application MUST scaffold a `USER_MANUAL.mdx` page explaining Krokis usages and widgets by default on project initialization.

#### Scenario: Running init scaffolds user manual
- **WHEN** user executes workspace initialization
- **THEN** system creates `.krokis/wiki/USER_MANUAL.mdx` with interactive custom component references
