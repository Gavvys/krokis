# wiki-indexing Specification

## Purpose
Defines generation of a unified wiki index document from SNAKE_CASE wiki MDX files.

## Requirements
### Requirement: Index wiki files
The Krokis desktop application MUST be able to parse all valid `SNAKE_CASE` wiki MDX files and generate a unified `WIKI_INDEX.mdx` document for the active workspace.

#### Scenario: Generating wiki index
- **WHEN** wiki index generation runs for a workspace with valid SNAKE_CASE `.mdx` files
- **THEN** system scans `.krokis/wiki/`, parses metadata titles, and writes a Markdown table index to `.krokis/wiki/WIKI_INDEX.mdx`
