## Why

Design decisions are architecture context, not a separate wiki concern. A separate `DESIGN_DECISIONS.mdx` file adds navigation noise and splits related context.

## What Changes

- Consolidate design decisions into an Architecture page section.
- Stop scaffolding `DESIGN_DECISIONS.mdx` on `krokis init`.
- Migrate this workspace's existing ADR content and remove its separate wiki file.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `wiki-management`: Architecture scaffolding includes design decisions; init no longer creates a separate design-decisions page.

## Impact

- Affects wiki templates, this workspace's wiki files, and generated index output. No root master files move or change authority.
