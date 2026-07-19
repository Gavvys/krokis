## ADDED Requirements

### Requirement: Consolidated architecture decisions
The `krokis init` command SHALL scaffold design-decision guidance as a section of `ARCHITECTURE.mdx` and SHALL NOT scaffold a separate `DESIGN_DECISIONS.mdx` file.

#### Scenario: Initializing a workspace
- **WHEN** user executes `krokis init` in a new workspace
- **THEN** the wiki contains `ARCHITECTURE.mdx` with a Design Decisions section and does not contain `DESIGN_DECISIONS.mdx`
