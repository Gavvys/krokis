# idempotent-init Specification

## Purpose
Defines safe, non-destructive workspace scaffolding for Krokis desktop projects.

## Requirements
### Requirement: Idempotent scaffolding
Workspace initialization SHALL be safe to run on a workspace that already contains a `.krokis/` directory, an existing wiki, agent skills, or an OpenAPI spec. Scaffolding SHALL NOT overwrite any file that already exists. It SHALL create directories that are missing and SHALL write files only when the target path is absent.

#### Scenario: Re-running init on a fully scaffolded workspace
- **WHEN** the user initializes Krokis on a workspace that already has `.krokis/config.toml`, every default wiki template, every default agent skill, and the sample OpenAPI spec
- **THEN** existing files are left untouched and no overwrites occur

#### Scenario: Running init on a partially scaffolded workspace
- **WHEN** the user initializes Krokis on a workspace that has `.krokis/config.toml` but is missing `DEPENDENCY_MAP.mdx` and one agent skill
- **THEN** the existing config is skipped and only the missing wiki template and agent skill are written

#### Scenario: Running init with no prior Krokis setup
- **WHEN** the user initializes Krokis on a fresh workspace
- **THEN** the system creates `.krokis/`, writes the default config, scaffolds every wiki template, every agent skill, and the sample OpenAPI spec
