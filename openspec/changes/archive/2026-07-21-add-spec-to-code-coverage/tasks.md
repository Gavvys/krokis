## 1. Backend: coverage gatherer

- [x] 1.1 Create `internal/metrics/coverage.go` with `CoverageMetrics`, `CoverageCapability`, and `CoverageRequirement` structs and a `gatherCoverage(specsRoot, workspaceRoot string) CoverageMetrics` function.
- [x] 1.2 Implement requirement splitting: walk `specsRoot/**/spec.md`, split each file into requirements using `### Requirement:` headers.
- [x] 1.3 Implement identifier extraction per requirement: fenced code blocks, `<kebab-case>` tags, `#/...` route hashes, backticked symbols, and quoted strings; dedupe; filter stopwords and short tokens.
- [x] 1.4 Implement workspace scan: walk the workspace root, skip `openspec/`, `.git/`, `node_modules/`, `vendor/`, hidden dirs, `tmp/`, `.air/`. For each identifier, record the first three workspace-relative file paths that contain it.
- [x] 1.5 Classify each requirement as `covered` (all identifiers matched), `partial` (some matched), or `uncovered` (none matched). Aggregate per capability with `requirements`, `covered`, `uncovered` counts.
- [x] 1.6 Wire `gatherCoverage` into `internal/metrics/metrics.go`: add `Coverage CoverageMetrics \`json:"coverage"\`` to `TelemetryData` and call the gatherer after `gatherChangeFlow`.

## 2. Backend: tests

- [x] 2.1 Add `internal/metrics/coverage_test.go` with a fixture that exercises covered, partial, and uncovered requirements.
- [x] 2.2 Add a test that asserts the default-empty case when `openspec/specs/` is missing.
- [x] 2.3 Add a test that asserts the matched-files list is capped at three entries.
- [x] 2.4 Run `go test ./...` and `go build ./...`.

## 3. Frontend: coverage component

- [x] 3.1 Create `web/components/CoverageReport.js` extending `KrokisElement`. The `render()` method reads `this._data.coverage` and renders the summary cards and per-requirement table.
- [x] 3.2 Render one summary card per capability with `covered / total` counts and a colored status token.
- [x] 3.3 Render a per-requirement table with columns: requirement name, capability, status badge (`covered`, `partial`, `uncovered`), and an expandable matched-files list.
- [x] 3.4 Apply Krokis design tokens via `var(--…)` and `escape()` from the base class; reuse the existing `.completed` / `.active` color family for status badges.
- [x] 3.5 Add a numbered section banner to `web/styles.css` for the coverage component if shared styles are needed (likely reuse only existing tokens).

## 4. Frontend: route, renderer, sidebar

- [x] 4.1 Add a `<script src="/components/CoverageReport.js"></script>` tag to `web/index.html` after the other component scripts.
- [x] 4.2 Add a `Coverage` link to the `Telemetry & Insights` sidebar section in `web/index.html`, between `Task Cadence` and `API Specification`.
- [x] 4.3 Define `renderCoveragePage(container)` in `web/app.js` using `mountPage` with `tag: 'coverage-report'`, `title: 'Spec Coverage'`, and an explanatory subtitle noting coverage is implementation evidence, not validation pass.
- [x] 4.4 Add a `routes[]` entry for `#/insights/coverage` with `match`, `title` returning `Coverage · Krokis`, and `render` calling `renderCoveragePage`.

## 5. Validation and docs

- [x] 5.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 5.2 Run `go build ./...` and `go test ./...`.
- [x] 5.3 Run `krokis insights` and confirm `.krokis/insights/health.json` includes the `coverage.capabilities` array with at least one capability.
- [x] 5.4 Use `playwright-cli` to load `#/insights/coverage` and confirm zero console errors plus visible summary cards and a per-requirement table.
- [x] 5.5 Update `ARCHITECTURE.md` to mention `gatherCoverage` and the new `#/insights/coverage` route.
- [x] 5.6 Update `README.md` Dashboard Routes table with `#/insights/coverage`.
- [x] 5.7 Add a `PROJECT_MEMORY.md` decision row.