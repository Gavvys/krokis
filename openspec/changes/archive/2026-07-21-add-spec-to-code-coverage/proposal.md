## Why

Krokis already derives planning health (artifact presence, checked task counts) from the local OpenSpec workspace, but it stops there. There is no signal for whether any of an spec's requirements are actually echoed by the codebase. Users who open the dashboard cannot tell whether the code drifted away from the specs or whether a freshly added requirement has no implementation footprint at all. A spec-to-code coverage indicator closes that gap without requiring an external linter or AI: each requirement's named identifiers (quoted strings, route paths, custom-element tags, function names) are scanned for in the workspace tree, and coverage is reported as a covered/uncovered count per requirement and per capability.

## What Changes

- Add a `Coverage` report to `internal/metrics` that walks `openspec/specs/**/spec.md`, splits the file into requirements (using the `### Requirement:` header), and extracts named identifiers from each requirement body. Identifiers are: fenced code block content, custom-element tags (`<x-y>`), route hashes (`#/...`), backticked symbols (camelCase, snake_case, kebab-case, PascalCase), and quoted strings. Stopwords (common English words, OpenSpec scaffolding terms) are excluded.
- For each requirement, scan the workspace tree (excluding `openspec/`, `.git`, `tmp/`, `.air/`, `node_modules/`) and count how many of the requirement's identifiers appear in non-spec Go, JS, MDX, HTML, and CSS files. A requirement is `covered` when at least one of its identifiers is referenced outside the spec tree; `uncovered` otherwise.
- Add a new endpoint `/api/insights` payload extension `coverage` with per-capability and per-requirement coverage records, including the matched identifier count and a short list of matched files (capped at 3 per requirement to keep the payload small).
- Add a dashboard route `#/insights/coverage` that renders the coverage report: one card per capability with covered/total counts, plus a per-requirement table with status badges (covered, uncovered, partial when some identifiers match but not all), and an expandable list of matched files. Sidebar entry goes under `Telemetry & Insights` next to Project Health / Task Cadence.
- Add a `CoverageReport` Web Component in `web/components/CoverageReport.js` that extends `KrokisElement` and renders the page body. Use `mountPage` in `app.js` to host it, and add a `routes[]` entry for `#/insights/coverage`.
- No new external dependency. No new backend process. The scan runs as part of `krokis insights` and is stored in `health.json` alongside the rest of the telemetry data.

## Capabilities

### New Capabilities
- `spec-coverage`: A coverage report derived by scanning the local OpenSpec specs and the workspace tree, surfacing per-capability and per-requirement counts of identifiers that have implementation references outside the `openspec/` directory.

### Modified Capabilities
- `project-insights`: Update the insights payload contract to include the new `coverage` section with per-capability and per-requirement records, and document that the scan runs as part of `krokis insights` next to the existing codebase and quality metrics.
- `web-dashboard`: Add a new dashboard route `#/insights/coverage` and a `CoverageReport` Web Component under `web/components/` that presents the report. The route lives under `Telemetry & Insights`.

## Impact

- New files: `internal/metrics/coverage.go` (identifier extraction and scan), `internal/metrics/coverage_test.go`, `web/components/CoverageReport.js`.
- Modified files: `internal/metrics/metrics.go` (call the new gatherer), `web/app.js` (new route + renderer via `mountPage`), `web/index.html` (sidebar entry + script tag), possibly `web/styles.css` for the new status badge styling.
- No new endpoints. The coverage data is included in the existing `/api/insights` payload.
- No breaking changes. Existing telemetry consumers ignore the new `coverage` field.
- Documentation updates: `ARCHITECTURE.md` (mention the new gatherer and route), `README.md` (Dashboard Routes table), `PROJECT_MEMORY.md` decision row.