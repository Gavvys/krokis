## ADDED Requirements

### Requirement: Consolidated architecture decisions
The workspace initialization command SHALL scaffold design-decision guidance as a section of `ARCHITECTURE.mdx` and SHALL NOT scaffold a separate `DESIGN_DECISIONS.mdx` file.

#### Scenario: Initializing a workspace
- **WHEN** user executes workspace initialization in a new workspace
- **THEN** the wiki contains `ARCHITECTURE.mdx` with a Design Decisions section and does not contain `DESIGN_DECISIONS.mdx`
