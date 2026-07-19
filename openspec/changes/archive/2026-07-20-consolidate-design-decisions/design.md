## Context

`krokis init` creates both `ARCHITECTURE.mdx` and `DESIGN_DECISIONS.mdx`. The latter only contains architectural decisions and duplicates navigation.

## Goals / Non-Goals

**Goals:** Merge existing decisions into `ARCHITECTURE.mdx`; scaffold one architecture source for both concerns.

**Non-Goals:** Change root `ARCHITECTURE.md`, introduce ADR tooling, or merge unrelated Design System guidance.

## Decisions

Add a `## Design Decisions` section to `ARCHITECTURE.mdx`. Move existing ADR content there. Remove `DESIGN_DECISIONS.mdx`, then rebuild `WIKI_INDEX.mdx` from remaining files.

## Risks / Trade-offs

- [Old deep links break] → intended removal; users navigate through Architecture instead.
