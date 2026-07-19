# wiki-management Specification

## Purpose
TBD - created by archiving change initialize-krokis-cli. Update Purpose after archive.
## Requirements
### Requirement: SNAKE_CASE wiki constraint
The Krokis CLI SHALL require all wiki master files under `.krokis/wiki/` to be named in SNAKE_CASE with `.mdx` extension.

#### Scenario: User attempts to create a non-SNAKE_CASE wiki file
- **WHEN** user executes `krokis wiki create "New-Design"` or places `New-Design.md` in `.krokis/wiki/`
- **THEN** system rejects the creation or validation with a name-format error, explaining that it must be SNAKE_CASE and end in `.mdx`

### Requirement: Create wiki file
The Krokis CLI SHALL provide a CLI command to scaffold a new SNAKE_CASE MDX wiki file with default frontmatter.

#### Scenario: Creating a valid wiki file
- **WHEN** user executes `krokis wiki create "system_architecture"`
- **THEN** system creates `.krokis/wiki/SYSTEM_ARCHITECTURE.mdx` with default frontmatter (`title`, `author`, `created_at`) and exits with 0

### Requirement: User manual scaffolding
The Krokis CLI MUST scaffold a `USER_MANUAL.mdx` page explaining Krokis usages and widgets by default on project initialization.

#### Scenario: Running init scaffolds user manual
- **WHEN** user executes `krokis init`
- **THEN** system creates `.krokis/wiki/USER_MANUAL.mdx` with interactive custom component references

