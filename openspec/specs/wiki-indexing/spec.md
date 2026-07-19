# wiki-indexing Specification

## Purpose
TBD - created by archiving change krokis-wiki-indexing. Update Purpose after archive.
## Requirements
### Requirement: Index wiki files
The Krokis CLI MUST parse all valid `SNAKE_CASE` wiki MDX files and generate a unified `WIKI_INDEX.mdx` document.

#### Scenario: Running wiki index command
- **WHEN** user executes `krokis wiki index`
- **THEN** system scans `.krokis/wiki/`, parses metadata titles, writes a Markdown table index list to `.krokis/wiki/WIKI_INDEX.mdx`, and exits with 0

