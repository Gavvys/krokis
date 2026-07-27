# Product Intent

Krokis is a native desktop application and visual workspace hub built on top of OpenSpec. It serves as an orchestrator and telemetry layer, making it easy for humans and AI agents to manage multi-project OpenSpec workflows, audit codebase health, track change flow, and view spec coverage through a unified desktop dashboard.

## Core Philosophy

- **Native Desktop & Multi-Project Hub**: Pure Tauri v2 application written in Rust, featuring a top-level Project Hub dropdown for switching local workspace repositories without managing web servers.
- **Agent-Friendly & Non-Intrusive**: Rides Git without modifying repositories or making automated commits. Discoverable skills and standard OpenSpec folder conventions.
- **Human-Auditable**: A premium Material 3 desktop dashboard displaying active OpenSpec changes, spec-to-code coverage, commit heatmaps, lines of code, and interactive API specs.
- **Local-First & Offline-First**: Zero external CDN runtime dependencies, zero database requirement, running completely on local filesystem IPC.

## Scope & Features

- **Project Hub**: Select and switch local Git repositories instantly with recent workspace memory and native OS folder picking.
- **Wiki Management**: Native Rust listing, loading, and creation of SNAKE_CASE `.mdx` wiki documents and global reference files.
- **Project Telemetry & Change Flow**: Rust-driven Git commit cadence analytics, codebase line counting (LOC), OpenSpec proposal progress tracking, and spec coverage matching.
- **Desktop Dashboard**: Zero-framework Web Component frontend rendering Material 3 dark/light UI, MDX documents, and embedded RapiDoc API specs.
- **Agent Skills**: Standard `.agents/skills/` folder containing OpenSpec and Krokis workflow skills.

## Non-Goals

- Replacing OpenSpec (Krokis sits on top of OpenSpec).
- Automatic Git commits or branch manipulation (OpenSpec and Krokis ride Git passively at the user's discretion).
- Cloud database syncing, SaaS servers, or team tracking servers (Krokis is local-first and desktop-based).
