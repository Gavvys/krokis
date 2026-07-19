## Why

To harden the Krokis installation and CLI against configuration drift, we need formal validation of `.krokis/config.toml`. Adding schema checks and a health checker command prevents silent failures during telemetry collection. Furthermore, adding a default `USER_MANUAL.mdx` file provides an immediate visual starting guide for humans auditing the project dashboard.

## What Changes

- Add a JSON Schema configuration layout for `.krokis/config.toml` validation.
- Implement the `krokis validate` command to verify configuration structure.
- Implement the `krokis doctor` command to check repository, configuration, and directory layout health.
- Update `krokis init` to automatically scaffold `USER_MANUAL.mdx` alongside existing wiki templates.

## Capabilities

### New Capabilities

- `config-schema`: Defines the config structure validation schema and provides the `krokis validate` command.
- `cli-doctor`: Implements the `krokis doctor` command for system health auditing.

### Modified Capabilities

- `wiki-management`: Expands scaffolding templates to include the interactive `USER_MANUAL.mdx`.

## Impact

This introduces configuration validation checks and a new template page. It does not break any existing core CLI functions.
