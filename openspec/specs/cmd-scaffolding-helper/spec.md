# cmd-scaffolding-helper Specification

## Purpose
Defines Rust workspace scaffolding and wiki template helpers.

## Requirements
### Requirement: Rust wiki page generator
The `src-tauri/src/wiki.rs` module SHALL expose `create_wiki_page(workspace_root, name)` validating upper SNAKE_CASE formatting, creating `.krokis/wiki/` directory if absent, and scaffolding `.mdx` files without overwriting existing files.

#### Scenario: Creating a valid wiki page
- **WHEN** user creates a wiki page with name `DESKTOP_MANUAL`
- **THEN** system writes `.krokis/wiki/DESKTOP_MANUAL.mdx` with standard frontmatter metadata and heading
