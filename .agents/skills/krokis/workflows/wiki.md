---
name: wiki-workflow
description: How to create and update wiki articles in the Krokis desktop app.
---

# Wiki workflow

Use this workflow when the user asks for a new MDX wiki article or wants wiki content refreshed in the dashboard.

## When to create

- A new concept, dependency map, or runbook needs a permanent home in the workspace wiki.
- The Project Wiki view of the dashboard should reflect a doc the team can link to.

## How to create

From the desktop app (or via IPC during development):

```text
invoke('create_wiki_page', { name: 'USER_MANUAL' })
```

This creates `.krokis/wiki/USER_MANUAL.mdx` with a frontmatter stub and placeholder title. The file name is SNAKE_CASE.

## Conventions

- Wiki articles live in `.krokis/wiki/` and use the `.mdx` extension.
- Filenames are SNAKE_CASE. The dashboard shows them in title case.
- Frontmatter is required: every file starts with `---` ... `---` and includes a `title` field.
- Root canonical docs (`PRODUCT.md`, `ARCHITECTURE.md`, etc.) are also listed in the wiki sidebar.
- Do not embed raw `<script>` tags; the renderer sanitises content.

## Common pitfalls

- Do not put non-MDX files (e.g., `.txt`, `.json`) in `.krokis/wiki/`. The renderer will skip them silently.
- Krokis writes wiki files to disk only; Git commits remain user-driven.
