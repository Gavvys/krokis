## Why

Sidebar page titles do not reveal which local file supplies each page. Showing the source filename makes dashboard navigation easier to audit without changing the canonical file layout.

## What Changes

- Display each wiki item's source filename as a muted subtitle below its title in the dashboard sidebar.
- Preserve existing page titles, routes, and root master-file behavior.
- Do not move, rename, or duplicate source files.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `web-dashboard`: Show sidebar source filenames for wiki pages.

## Impact

- Affects dashboard sidebar rendering and styling only.
- No conflict with product intent, architecture, or root master-file ownership.
