## Why

Workspace initialization is the entry point for new projects, but it must be safe to run on projects that already have a `.krokis/` directory or an existing wiki. The requirement is for workspace setup to be idempotent: detect what already exists, fill the gaps, and never overwrite existing user files.

## What Changes

- Make workspace scaffolding idempotent in the desktop application setup. When `.krokis/config.toml` already exists, skip writing it. The same skip rule applies to every scaffolded wiki template and OpenAPI sample. Create directories that are missing, but never overwrite existing files.

## Capabilities

### New Capabilities
- `idempotent-init`: Workspace scaffolding is safe to run on existing projects, fills missing scaffolding, and never overwrites user content.

### Modified Capabilities
- `cli-core`: Update workspace initialization behavior to require no-overwrite, gap-filling guarantees.

## Impact

- Safe workspace scaffolding behavior across all workspace directories.
