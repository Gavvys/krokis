---
name: krokis
description: Krokis is a Tauri v2 Rust desktop application and Project Hub for OpenSpec-driven projects. Use this skill to learn how to scaffold, audit, and surface local OpenSpec work in a native desktop dashboard.
---

# Krokis

Krokis turns local OpenSpec workspaces into an auditable desktop product surface. It gathers telemetry in Rust, surfaces it through a Material 3 dashboard, and lets AI agents propose, implement, and archive changes against the same artifacts the team reads.

## Read order

If you are new to this skill, read the files in this order before doing anything:

1. `workflows/insights.md` — when to refresh telemetry and what the dashboard shows.
2. `workflows/wiki.md` — when and how to create SNAKE_CASE wiki pages.
3. `workflows/roadmap.md` — when and how to update `ROADMAP.md`.
4. `references/commands.md` — one-line summary of desktop actions and Tauri IPC commands.
5. `references/plan-discipline.md` — required reading before authoring any Krokis plan or OpenSpec change artifact.

## What it is for

- A native Tauri v2 desktop app with a Project Hub for switching local OpenSpec repositories.
- Local-first telemetry gathered by Rust IPC (`get_insights`) and rendered in the desktop webview.
- An Agent Skills layout that teaches other agents how to work with Krokis.

## What it is not for

- A remote or hosted service. Everything runs against local workspace directories.
- A linter, formatter, or test runner. Krokis surfaces signals; it does not enforce.
- Automatic Git commits or branch mutations. OpenSpec rides Git at the user's discretion.
- A general OpenSpec authoring tool. Use the OpenSpec CLI (`openspec ...`) for change lifecycle; use Krokis to audit and view what already exists.
