---
name: krokis
description: Krokis is a Go CLI and embedded web dashboard for OpenSpec-driven projects. Use this skill to learn how to scaffold, audit, and surface local OpenSpec work in a single binary.
---

# Krokis

Krokis turns a local OpenSpec workspace into an auditable product surface. It writes telemetry, surfaces it through a glassmorphic dashboard, and lets AI agents propose, implement, and archive changes against the same artifacts the team reads.

## Read order

If you are new to this skill, read the files in this order before doing anything:

1. `workflows/insights.md` — when to run `krokis insights` and what the dashboard shows.
2. `workflows/wiki.md` — when and how to use `krokis wiki create`.
3. `workflows/roadmap.md` — when and how to update `ROADMAP.md`.
4. `references/commands.md` — one-line summary of every `krokis` command.
5. `references/plan-discipline.md` — required reading before authoring any Krokis plan or OpenSpec change artifact.

## What it is for

- A single Go binary that serves the workspace wiki, the OpenSpec change graph, and the project health dashboard.
- Local-first telemetry written to `.krokis/insights/health.json` and surfaced live in the browser.
- An Agent Skills layout that teaches other agents how to work with Krokis.

## What it is not for

- A remote or hosted service. Everything runs against the local workspace.
- A linter, formatter, or test runner. Krokis surfaces signals; it does not enforce.
- A general OpenSpec authoring tool. Use the OpenSpec CLI (`openspec ...`) for change lifecycle; use Krokis to audit and view what already exists.
