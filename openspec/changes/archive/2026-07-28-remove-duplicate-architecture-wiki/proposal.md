## Why

The dashboard exposes both root `ARCHITECTURE.md` and wiki `ARCHITECTURE.mdx`, creating duplicate Architecture navigation and unclear authority.

## What Changes

- Keep root `ARCHITECTURE.md` as sole Architecture source.
- Move current design-decision content into root Architecture.
- Remove wiki Architecture scaffolding and current duplicate page.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `wiki-management`: Do not scaffold a duplicate Architecture wiki page.

## Impact

- Affects init templates, local wiki index, and Architecture source ownership.
