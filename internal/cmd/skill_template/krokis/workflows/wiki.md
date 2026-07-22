---
name: wiki-workflow
description: How to create and update wiki articles with krokis wiki.
---

# Wiki workflow

Use this workflow when the user asks for a new MDX wiki article or wants the existing articles reindexed.

## When to create

- A new concept, dependency map, or runbook needs a permanent home in the workspace wiki.
- The `Krokis/wiki` view of the dashboard should reflect a doc the team can link to.

## How to create

```bash
krokis wiki create USER_MANUAL
```

This creates `.krokis/wiki/USER_MANUAL.mdx` with a frontmatter stub, a placeholder title, and a `WIKI_INDEX.mdx` entry. The file name is SNAKE_CASE.

## How to refresh the index

```bash
krokis wiki index
```

Use this after adding or deleting an `.mdx` file by hand, or after `krokis wiki create` from an older version of the CLI.

## Conventions

- Wiki articles live in `.krokis/wiki/` and use the `.mdx` extension.
- Filenames are SNAKE_CASE. The dashboard shows them in title case.
- Frontmatter is required: every file starts with `---` ... `---` and includes a `title` field.
- Do not embed raw `<script>` tags; the renderer sanitises content.

## Common pitfalls

- Do not rename a wiki file's slug without updating `WIKI_INDEX.mdx`. The dashboard reads the index to build the sidebar.
- Do not put non-MDX files (e.g., `.txt`, `.json`) in `.krokis/wiki/`. The renderer will skip them silently and the file will look missing.
