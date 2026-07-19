## Context

We need to dynamically index all wiki documents in the workspace. The generated index file `WIKI_INDEX.mdx` will serve as the homepage of the project dashboard, showing all available documents with their metadata descriptions and links.

## Decisions

### 1. `krokis wiki index` Command
We will register a new command `krokis wiki index`. It will trigger `wiki.BuildIndex(wikiDir)`.
- Automatically executes during:
  - `krokis init`
  - `krokis serve`
  - `krokis insights`
  - `krokis wiki create`

### 2. Index Generator Logic (`internal/wiki/indexer.go`)
- Scans `wikiDir` for `.mdx` files.
- Skips `WIKI_INDEX.mdx` itself.
- For each file:
  - Reads content and extracts YAML frontmatter if present:
    - `title`: The descriptive title (falls back to titleized filename).
    - `description`: A brief summary (falls back to a default note).
    - `author`: The document author.
  - Generates `WIKI_INDEX.mdx` containing:
    - A header: `# Project Documentation Index`
    - A rich component: `<InfoBox type="info">Welcome to the Krokis documentation hub. Below is a catalog of all wiki articles.</InfoBox>`
    - A list of articles formatted as markdown links to dashboard routes.

### 3. SPA Landing Routing
- Currently, `web/app.js` redirects empty routes (`#` or empty) to `#/wiki/USER_MANUAL`.
- We will update it:
  - Fetch the wiki list.
  - If `WIKI_INDEX` exists in the list, redirect to `#/wiki/WIKI_INDEX`.
  - Otherwise, redirect to `#/wiki/USER_MANUAL`.
- In the sidebar rendering:
  - Skip rendering `WIKI_INDEX` inside the dynamic sidebar list itself (since it's the home page/index, we don't want it cluttering the sidebar links list, or we can pin it to the top). Let's filter out `WIKI_INDEX` from the dynamic list and instead add a dedicated "Home / Index" link, or just let it render naturally but sorted first. Filtered out is cleaner! Let's filter it out of the side list and keep it as a clean homepage.
