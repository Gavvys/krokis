## ADDED Requirements

### Requirement: Auto-index on wiki create
The Krokis CLI MUST automatically regenerate the `WIKI_INDEX.mdx` file after creating any new wiki document.

#### Scenario: Creating a wiki file triggers indexing
- **WHEN** user executes `krokis wiki create "testing_indexing"`
- **THEN** system scaffolds the new file and executes the index generator to update `WIKI_INDEX.mdx` automatically
