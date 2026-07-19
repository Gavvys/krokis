# Product Intent

Krokis is a lightweight, portable project management CLI tool built on top of OpenSpec. It serves as an orchestrator and telemetry layer, making it easier for AI agents to run spec-driven workflows and for humans to audit codebase health, metrics, and documentation through a visual interface.

## Core Philosophy

- **Lightweight & Portable**: Small footprint Go binary, zero local runtime dependencies (no npm/Node required at runtime).
- **Agent-Friendly**: Discoverable skills, standard folder conventions, non-interactive execution modes, and packed context logs.
- **Human-Auditable**: A stunning, premium visual dashboard displaying active specs, development cadence, code quality, and API specs.
- **Git/Jujutsu Tracked**: Fully tracked via standard Git metadata, fitting seamlessly into colocated git/jj workspaces.

## Scope & Features

- **Wiki Management**: Scaffolding and listing SNAKE_CASE master wiki documents in MDX.
- **Project Telemetry**: Git log analytics (cadence, commit volumes, authors) and QA report parsing (JUnit tests, lint JSON).
- **Visual Dashboard**: Embedded web server hosting a dark-mode glassmorphic client, compiler client for MDX, and interactive OpenAPI spec visualizer (RapiDoc).
- **Agent Integration**: Standard `.agents/skills/` folder containing metadata-driven task wrappers.

## Non-Goals

- Replacing OpenSpec (Krokis sits on top of OpenSpec).
- Complex task managers, database servers, or cloud-hosted telemetry aggregators (Krokis is local-first and directory-based).
