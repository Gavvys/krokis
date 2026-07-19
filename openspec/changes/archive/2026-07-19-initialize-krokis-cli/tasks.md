## 1. Setup and CLI Core

- [x] 1.1 Create `go.mod` and setup dependencies
- [x] 1.2 Implement CLI argument parsing and Cobra-style commands in `internal/cmd/`
- [x] 1.3 Implement `krokis init` to bootstrap configuration and generate `.krokis/config.toml`

## 2. Wiki Management System

- [x] 2.1 Write logic to list, read, and create SNAKE_CASE wiki MDX files under `.krokis/wiki/`
- [x] 2.2 Add name validator checking that all wiki files are in SNAKE_CASE and have the `.mdx` extension

## 3. Project Insights & Telemetry Scanner

- [x] 3.1 Implement git history parser calculating commit velocity and author statistics
- [x] 3.2 Add metrics collector to calculate codebase LOC and scan configured unit test/lint results
- [x] 3.3 Write telemetry data to JSON files in `.krokis/insights/`

## 4. Web Server and Client-side Dashboard

- [x] 4.1 Set up embedded file server in Go using `go:embed` to serve the dashboard SPA
- [x] 4.2 Build `index.html` structure and layout with high-end dark mode and glassmorphism styling in `styles.css`
- [x] 4.3 Develop client-side router and compiler in `app.js` to dynamically load MDX files and fetch insights JSONs
- [x] 4.4 Implement native Web Components (`MetricsCard.js`, `InfoBox.js`, `TaskCadence.js`, `TestResults.js`) representing interactive widgets in the dashboard

## 5. Agent Skills Scaffolding & Verification

- [x] 5.1 Scaffold Krokis agent skills into the active agent skills folder (`.agents/skills/` or `.agent/skills/`) with `SKILL.md` documents and run script templates
- [x] 5.2 Manually verify end-to-end integration by initializing, running insights, and serving the dashboard

