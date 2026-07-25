## ADDED Requirements

### Requirement: Auto-index on wiki create
The Krokis desktop application MUST automatically regenerate the `WIKI_INDEX.mdx` file after creating any new wiki document.

#### Scenario: Creating a wiki file triggers indexing
- **WHEN** user executes `create_wiki_page` for "testing_indexing"`
- **THEN** system scaffolds the new file and executes the index generator to update `WIKI_INDEX.mdx` automatically
