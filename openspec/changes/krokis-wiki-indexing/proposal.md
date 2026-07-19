## Why

As project wiki files grow, developers and agents need an automatically maintained table of contents indexing all articles, reading their frontmatter metadata (titles, descriptions, authors), and displaying them cleanly. Manually writing index files is tedious; auto-indexing ensures the dashboard stays synced.

## What Changes

- Add a `krokis wiki index` command to parse all `SNAKE_CASE` `.mdx` files, extract metadata, and output a structured `WIKI_INDEX.mdx` file.
- Update `krokis serve` and `krokis insights` to auto-trigger the indexing step on execution.
- Update the web dashboard client to load `WIKI_INDEX.mdx` as the default landing guide if it exists.

## Capabilities

### New Capabilities

- `wiki-indexing`: Provides the parsing, compiling, and output scaffolding of `WIKI_INDEX.mdx` from active files.

### Modified Capabilities

- `wiki-management`: Runs index generation automatically on new creations.
- `web-dashboard`: Adjusts routing to prioritize `WIKI_INDEX.mdx` as the homepage if present.

## Impact

Safe, non-breaking addition that automates documentation cataloging.
