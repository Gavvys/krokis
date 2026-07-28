## ADDED Requirements

### Requirement: Index wiki files
The Krokis desktop application MUST parse all valid `SNAKE_CASE` wiki MDX files and generate a unified `WIKI_INDEX.mdx` document.

#### Scenario: Running wiki index command
- **WHEN** user executes wiki index generation
- **THEN** system scans `.krokis/wiki/`, parses metadata titles, writes a Markdown table index list to `.krokis/wiki/WIKI_INDEX.mdx`, and exits with 0
