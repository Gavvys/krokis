---
name: commands
description: One-line summary of Krokis desktop actions and Tauri IPC commands.
---

# Commands

## Desktop app

| Action | Purpose |
| --- | --- |
| `cargo tauri dev` | Run the Krokis desktop app in development mode. |
| `cargo tauri build` | Build a native desktop application bundle. |
| Project Hub → Open Project... | Pick a local workspace folder via the native OS dialog. |
| Project Hub → recent project | Switch the active workspace and reload telemetry/wiki. |
| Refresh button | Re-invoke `get_insights` (and reload the current route, including `#/roadmap`) and wiki links for the active project. |

## Tauri IPC commands

| Command | Purpose |
| --- | --- |
| `get_insights` | Gather Git cadence, codebase LOC, OpenSpec change flow, and spec coverage for the active workspace. |
| `get_roadmap` | Parse workspace-root `ROADMAP.md` into view-only Kanban columns (Now, Queued, Exploring, Parked, Shipped). |
| `scaffold_workspace` | Idempotently create missing canonical docs, `.krokis/`, wiki templates, OpenSpec scaffolding, OpenAPI sample, and Krokis Agent Skill files, then run Doctor. |
| `list_wiki_files` | List SNAKE_CASE wiki `.mdx` files and root canonical docs. |
| `get_wiki_content` | Read a wiki or canonical document from disk. |
| `create_wiki_page` | Scaffold a new SNAKE_CASE `.mdx` wiki page. |
| `get_recent_projects` | Load active project path and recent projects from persistent store. |
| `add_recent_project` | Set the active project and update recent projects memory. |
| `select_project_folder` | Open the native folder picker and activate the selected workspace. |
