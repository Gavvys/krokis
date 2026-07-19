## Why

AI coding agents need clear requirements and visual status tools to collaborate effectively with humans, but standard specs do not natively provide project telemetry or high-level wiki indexing. Krokis provides a lightweight project management overlay on top of OpenSpec, offering SNAKE_CASE master wiki documents, project health reports, and an embedded MDX dashboard to make spec workflows easier for agents to run and humans to audit.

## What Changes

- Create a portable, compiled Go CLI `krokis`.
- Support `krokis init` to initialize both `.krokis/` and `openspec/`.
- Provide a `krokis wiki` command to manage SNAKE_CASE master wiki documents in `.krokis/wiki/` (e.g. `ARCHITECTURE.mdx`, `DESIGN_DECISIONS.mdx`).
- Support a `krokis insights` command to collect code metrics, test statuses, lint health, and task cadence into static JSON and MDX.
- Build `krokis serve` to run an embedded web server hosting a zero-dependency, dark-mode visual interface displaying the wiki and telemetry.
- Support `krokis skill` to manage agent instructions and hooks under the active agent skills directory (e.g. `.agents/skills/` or `.agent/skills/`).

## Capabilities

### New Capabilities

- `cli-core`: Scaffolds the CLI framework in Go, handling initial project configuration and layout structure.
- `wiki-management`: Standardizes reading, writing, and listing SNAKE_CASE master wiki artifacts in MDX format.
- `project-insights`: Implements git history parsing for cadence metrics and parsing of lint/test output files.
- `web-dashboard`: Embeds and serves a single-page HTML application that loads MDX files client-side and renders custom Web Components.
- `agent-skills`: Provides a discoverable set of instructions and execution scripts under the active agent skills directory (e.g. `.agents/skills/` or `.agent/skills/`) for AI agents to run hooks.

### Modified Capabilities

None.

## Impact

This is a new standalone tool that has no impact on existing codebases. It is designed to work in standard git repositories with or without an existing OpenSpec setup.
