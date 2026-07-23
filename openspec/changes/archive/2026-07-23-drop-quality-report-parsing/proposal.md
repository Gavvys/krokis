# Change: Drop quality report parsing (JUnit XML and lint JSON)

## Why

Krokis currently parses JUnit XML and lint JSON, aggregates results into a `TestResults` dashboard component, and exposes quality fields in `health.json`. This was a reasonable early-scope bet, but it creates an unsustainable maintenance commitment:

- Each linter and test runner produces a different output format. The code handles a single JUnit XML variant and a generic JSON array of lint issues. Supporting eslint, stylelint, golangci-lint, ruff, and their versioned schemas for every user is unbounded work.
- The quality signal is already captured by spec-to-code coverage (which shows implementation gaps) and the change flow (which shows planning health). Adding a per-file lint treemap was Queued, but building it on a fragile parsing layer is worse than not building it.
- The value-per-line-of-maintenance is low. A flat `LintIssues` integer and a pass/fail test bar don't help a team decide what to fix. A real solution would be a coverage-and-quality service, which is outside Krokis's local-first scope.

Dropping the feature now removes ~200 lines of parsing code, a full Web Component, a dashboard route, two config fields, and the Queued "lint violation treemaps" item. The dashboard gets simpler, the binary gets smaller, and the maintenance surface shrinks.

## What Changes

- Remove JUnit XML parsing (`jUnitTestSuite`, `jUnitTestSuites` structs, `xml.Unmarshal`, `encoding/xml` import) from `internal/metrics/metrics.go`.
- Remove lint JSON parsing (`json.Unmarshal`, `encoding/json` import) from the same file.
- Remove `QualityMetrics` and `TestReport` structs. Remove the `Quality` field from `TelemetryData`.
- Change `Gather()` to drop the `testFile`, `lintFile` parameters.
- Remove the Quality section from `generateMDXSummary()` in `internal/cmd/insights.go`.
- Update `internal/cmd/insights.go` to call `Gather()` with no arguments.
- Remove `Tests` and `Lints` entries from `checkQAReports` in `internal/cmd/doctor.go`. Keep the OpenAPI check.
- Remove `Tests` and `Lints` fields from `InsightsConfig` in `internal/config/config.go`.
- Remove `<TestResults />` from the scaffolded `USER_MANUAL.mdx` template in `init.go`.
- Delete `web/components/TestResults.js`.
- Remove the `#/insights/health` route from `web/app.js` routes table. Remove the TestResults MDX component handler.
- Remove the "Project Health" sidebar link and the TestResults.js `<script>` tag from `web/index.html`.
- Update `openspec/specs/project-insights/spec.md` to drop the parsing-test-and-lint-logs requirement and the `quality` references from cross-requirement text.
- Update `internal/cmd/skill_template/krokis/workflows/insights.md` to remove the "lint signals" mention.
- Remove "Lint violation treemaps" from the Queued section of `ROADMAP.md` (blocked on quality parsing, which is now dropped).

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `project-insights`: drop the requirement that the insights pipeline parses lint and test result files. The telemetry payload no longer carries a `quality` section.

## Impact

- `internal/metrics/metrics.go` — remove imports, structs, function, field
- `internal/cmd/insights.go` — remove quality section from MDX summary; update Gather call
- `internal/cmd/doctor.go` — remove Tests/Lints QA check entries
- `internal/cmd/init.go` — remove TestResults from scaffolded USER_MANUAL
- `internal/config/config.go` — remove Tests and Lints fields from InsightsConfig
- `web/components/TestResults.js` — delete file
- `web/app.js` — remove health page route + TestResults MDX handler
- `web/index.html` — remove sidebar link + TestResults script tag
- `openspec/specs/project-insights/spec.md` — delta
- `internal/cmd/skill_template/krokis/workflows/insights.md` — soften lint mention
- `ROADMAP.md` — drop lint treemaps from Queued
- `PROJECT_MEMORY.md` — decision row
