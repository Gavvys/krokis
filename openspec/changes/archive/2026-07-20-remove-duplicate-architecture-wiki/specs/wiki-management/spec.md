## ADDED Requirements

### Requirement: Root Architecture source precedence
The `krokis init` command SHALL NOT scaffold `ARCHITECTURE.mdx` in the wiki directory. The dashboard's root `ARCHITECTURE.md` mapping SHALL remain the sole Architecture source.

#### Scenario: Initializing a workspace
- **WHEN** user executes `krokis init`
- **THEN** the wiki directory does not contain `ARCHITECTURE.mdx` and the Architecture dashboard page resolves from root `ARCHITECTURE.md`
