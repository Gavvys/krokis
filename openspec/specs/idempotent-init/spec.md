# idempotent-init Specification

## Purpose
TBD - created by archiving change make-init-idempotent-and-auto-run-doctor. Update Purpose after archive.
## Requirements
### Requirement: Idempotent scaffolding
The `krokis init` command SHALL be safe to run on a workspace that already contains a `.krokis/` directory, an existing wiki, agent skills, or an OpenAPI spec. The command SHALL NOT overwrite any file that already exists. The command SHALL create directories that are missing and SHALL write files only when the target path is absent. The command SHALL print a `↻ Skipped <path> (already exists)` line for every file it does not write and a `✓ Created <path>` line for every file it does write.

#### Scenario: Re-running init on a fully scaffolded workspace
- **WHEN** the user runs `krokis init` on a workspace that already has `.krokis/config.toml`, every default wiki template, every default agent skill, and the sample OpenAPI spec
- **THEN** the command prints a `↻ Skipped` line for each existing file, makes zero writes, and finishes successfully

#### Scenario: Running init on a partially scaffolded workspace
- **WHEN** the user runs `krokis init` on a workspace that has `.krokis/config.toml` but is missing `DEPENDENCY_MAP.mdx` and one agent skill
- **THEN** the command skips the existing config, writes the missing wiki template and the missing agent skill, and prints a `✓ Created` line for each new file

#### Scenario: Running init with no prior Krokis setup
- **WHEN** the user runs `krokis init` on a fresh workspace
- **THEN** the command behaves as it did before this change: creates `.krokis/`, writes the default config, scaffolds every wiki template, every agent skill, and the sample OpenAPI spec

### Requirement: Auto-invoke krokis doctor after scaffolding
The `krokis init` command SHALL automatically invoke `krokis doctor` after scaffolding completes, regardless of whether scaffolding wrote any new files. The doctor output SHALL be streamed to stdout in the same invocation. The command SHALL exit with the same status code as the doctor invocation (1 if any check failed, 0 otherwise).

#### Scenario: Init followed by clean doctor
- **WHEN** the user runs `krokis init` and the workspace passes every doctor check
- **THEN** the command prints the doctor table with all-green statuses and exits with status code 0

#### Scenario: Init surfaces a doctor failure
- **WHEN** the user runs `krokis init` and the doctor check fails for at least one item
- **THEN** the command prints the doctor table with the failing checks and exits with status code 1

#### Scenario: Skip the doctor invocation
- **WHEN** the user runs `krokis init --skip-doctor`
- **THEN** the command completes the scaffolding step and does not invoke `krokis doctor`

### Requirement: Verbose flag
The `krokis init` command SHALL accept a `--verbose` flag that prints every directory the command created alongside the files it created or skipped. Without the flag, the command SHALL print only the file-level summary to keep output minimal.

#### Scenario: Verbose mode on a partial workspace
- **WHEN** the user runs `krokis init --verbose` on a workspace that is missing one wiki template
- **THEN** the command prints the created wiki template, the directories it created, and the existing files it skipped

### Requirement: Doctor remains standalone
The `krokis doctor` command SHALL remain available as a standalone command. Its behavior, output format, checks, and exit codes SHALL NOT change. Running `krokis doctor` directly SHALL continue to work without `krokis init`.

#### Scenario: Direct doctor invocation
- **WHEN** the user runs `krokis doctor` without first running `krokis init`
- **THEN** the command produces the same output as before this change and exits with the same status code

