# Change: Drop quality report parsing (JUnit XML and lint JSON)

## Why

Krokis currently parses JUnit XML and lint JSON and exposed quality fields. This was a reasonable early-scope bet, but it created an unsustainable maintenance commitment:

- Each linter and test runner produces a different output format. Supporting eslint, stylelint, golangci-lint, ruff, and their versioned schemas for every user is unbounded work.
- The quality signal is already captured by spec-to-code coverage (which shows implementation gaps) and the change flow (which shows planning health).
- A real solution would be a dedicated coverage-and-quality service, which is outside Krokis's local-first desktop scope.

Dropping the feature simplifies the Rust telemetry metrics engine and frontend components.

## What Changes

- Remove JUnit XML and lint JSON parsing from the Rust telemetry engine (`src-tauri/src/metrics/`).
- Remove `QualityMetrics` and `TestReport` structs. Remove the `Quality` field from `TelemetryData`.
- Delete `web/components/TestResults.js`.
- Remove the `#/insights/health` route from `web/app.js` routes table.
- Remove the "Project Health" sidebar link and the TestResults.js `<script>` tag from `web/index.html`.
- Update `openspec/specs/project-insights/spec.md` to drop the parsing-test-and-lint-logs requirement.

## Capabilities

### Modified Capabilities
- `project-insights`: drop the requirement that the insights pipeline parses lint and test result files. The telemetry payload no longer carries a `quality` section.

## Impact

- `src-tauri/src/metrics/` — simplified Rust telemetry payload
- `web/components/TestResults.js` — deleted file
- `web/app.js` — removed health page route
- `web/index.html` — removed sidebar link
- `openspec/specs/project-insights/spec.md` — spec update
