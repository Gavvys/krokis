## 1. Setup and CLI Core

- [ ] 1.1 Create `go.mod` and setup dependencies
- [ ] 1.2 Implement CLI argument parsing and Cobra-style commands in `internal/cmd/`
- [ ] 1.3 Implement `krokis init` to bootstrap configuration and generate `.krokis/config.toml`

## 2. Wiki Management System

- [ ] 2.1 Write logic to list, read, and create SNAKE_CASE wiki MDX files under `.krokis/wiki/`
- [ ] 2.2 Add name validator checking that all wiki files are in SNAKE_CASE and have the `.mdx` extension

## 3. Project Insights & Telemetry Scanner

- [ ] 3.1 Implement git history parser calculating commit velocity and author statistics
- [ ] 3.2 Add metrics collector to calculate codebase LOC and scan configured unit test/lint results
- [ ] 3.3 Write telemetry data to JSON files in `.krokis/insights/`

## 4. Web Server and Client-side Dashboard

- [ ] 4.1 Set up embedded file server in Go using `go:embed` to serve the dashboard SPA
- [ ] 4.2 Build `index.html` structure and layout with high-end dark mode and glassmorphism styling in `styles.css`
- [ ] 4.3 Develop client-side router and compiler in `app.js` to dynamically load MDX files and fetch insights JSONs
- [ ] 4.4 Implement native Web Components (`MetricsCard.js`, `InfoBox.js`, `TaskCadence.js`, `TestResults.js`) representing interactive widgets in the dashboard

## 5. Agent Skills Scaffolding & Verification

- [ ] 5.1 Scaffold the `.krokis/skills/` directory with `SKILL.md` documents and run script templates
- [ ] 5.2 Manually verify end-to-end integration by initializing, running insights, and serving the dashboard
