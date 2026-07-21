# cli-core Specification (delta)

## ADDED Requirements

### Requirement: Init scaffolding and post-init doctor invocation
The `krokis init` command SHALL scaffold a workspace's Krokis setup and SHALL be safe to run on a workspace that already contains Krokis artifacts. The command SHALL NOT overwrite any existing file. The command SHALL print a `↻ Skipped <path> (already exists)` line for every file it does not write and a `✓ Created <path>` line for every file it does write. After scaffolding completes, the command SHALL automatically invoke `krokis doctor` and stream the doctor output. The command SHALL accept `--verbose` to print directory creations alongside file creations, and `--skip-doctor` to suppress the doctor invocation.

#### Scenario: Fresh project gets full scaffold and doctor
- **WHEN** the user runs `krokis init` on a workspace with no prior `.krokis/` directory
- **THEN** the command writes the default config, scaffolds every wiki template, every agent skill, and the sample OpenAPI spec, then prints the doctor table

#### Scenario: Existing project gets gap fill and doctor
- **WHEN** the user runs `krokis init` on a workspace that already has some Krokis artifacts
- **THEN** the command skips existing files, writes only the missing ones, then prints the doctor table

#### Scenario: Init with skip-doctor
- **WHEN** the user runs `krokis init --skip-doctor`
- **THEN** the command completes scaffolding and does not invoke the doctor

#### Scenario: Init with verbose
- **WHEN** the user runs `krokis init --verbose` on a partially scaffolded workspace
- **THEN** the command prints every directory it created alongside the files it created and skipped
