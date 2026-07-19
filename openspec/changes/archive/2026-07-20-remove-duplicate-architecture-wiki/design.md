## Context

Root master files are canonical. `.krokis/wiki/ARCHITECTURE.mdx` duplicates the root Architecture page in dashboard navigation.

## Goals / Non-Goals

**Goals:** One Architecture page, sourced from root `ARCHITECTURE.md`.

**Non-Goals:** Change root-file dashboard mapping or move other wiki pages.

## Decisions

Append Design Decisions to root Architecture. Remove the wiki duplicate and its init template. Rebuild the index.

## Risks / Trade-offs

- [Old wiki route no longer resolves] → intended; root Architecture route remains.
