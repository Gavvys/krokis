## Context

Krokis already captures codebase, quality, git, and change-flow telemetry into `.krokis/insights/health.json`, and the dashboard surfaces those on `#/insights/health`, `#/insights/cadence`, and `#/changes`. The next natural planning-health signal is spec-to-code coverage: for each OpenSpec requirement, evidence that the codebase actually references the identifiers the spec calls out. This change adds a coverage gatherer, a coverage section in the telemetry payload, and a `#/insights/coverage` route.

## Goals / Non-Goals

**Goals:**
- Extract named identifiers from each `openspec/specs/**/spec.md` requirement body.
- Scan the workspace tree (excluding `openspec/`, `.git`, `tmp/`, `.air/`, `node_modules/`) for matches and classify each requirement as `covered`, `partial`, or `uncovered`.
- Include the coverage report in the `/api/insights` payload as a new `coverage` field.
- Add a `#/insights/coverage` route and a `CoverageReport` Web Component that extends `KrokisElement` and is mounted via `mountPage`.
- Add a Sidebar entry between `Task Cadence` and `API Specification`.

**Non-Goals:**
- No AI-based semantic matching. Coverage is a literal identifier scan.
- No claims about spec compliance. Coverage is evidence, not validation pass/fail.
- No new external dependency. No new backend process. The scan runs as part of `krokis insights`.
- No per-line coverage. Per-requirement granularity is enough.

## Decisions

- **Identifier extraction, not natural-language parsing.** Identify named tokens by syntactic shape: fenced code blocks, `<kebab-case>` tags, `#/...` route hashes, backticked symbols, and quoted strings. Stopwords filter out scaffolding (`WHEN`, `THEN`, `SHALL`, `Scenario`, etc.). The result is a per-requirement set of distinct, machine-testable strings.
- **Coverage criteria: at least one identifier match.** A requirement is `covered` when at least one distinct identifier is found in a non-spec workspace file. `partial` when only some identifiers matched (lower than the set size). `uncovered` when zero matched. This keeps the matcher simple (substring search per scanned file) while leaving room for nuance in the UI.
- **Scan scope.** Walk the workspace root, skipping the same directories that `gatherCodeMetrics` already skips (`openspec/`, `.git/`, `node_modules/`, `vendor/`, hidden dirs). Also skip `tmp/` and `.air/`. Matched files are stored as workspace-relative paths so the dashboard can show them directly.
- **Payload shape.** `coverage.capabilities[]` entries with `name`, `requirements`, `covered`, `uncovered`, and a `requirements[]` sub-array. Each requirement entry has `name`, `status`, `identifier_count`, `matched_count`, and `matched_files` capped at three. Default to empty arrays when no coverage data exists, matching the existing default-empty convention used by the rest of the payload.
- **`CoverageReport` extends `KrokisElement`.** Uses the `data` setter and `render()` template method already established. The page renderer in `app.js` calls `mountPage({ tag: 'coverage-report', title: 'Spec Coverage', subtitle: '...' })` so no per-page section-card duplication.
- **Sidebar position.** `Coverage` between `Task Cadence` and `API Specification` keeps the planning-health signals grouped before the API surface.
- **Scan cost.** Identifier count is in the low hundreds, workspace file count is small, so a single-pass substring scan is fast enough for `krokis insights` without indexing. No caching needed.

## Risks / Trade-offs

- **Substring matches produce false positives** (an identifier like `path` matching wherever the word appears) → Mitigation: filter generic stopwords and require identifiers to be at least 3 chars long, camelCase/snake_case/kebab-case/PascalCase, or quoted with length > 3. Tuning the stopword list is acceptable iteration.
- **Matched-files list could grow large** → Mitigation: cap at 3 per requirement in the payload; show more only when the dashboard expands a row (refetch from `/api/insights` would still return 3; if users want more we cap higher later).
- **Coverage implies a false "spec is implemented" claim when matched** → Mitigation: copy must explicitly say "implementation evidence", not "validation passed" or "spec compliant". The dashboard scenario asserts this label.
- **Perf subtlety:** walking every spec.md and every workspace file on every `krokis insights` is OK for a local tool but slow at very large repo scale → Mitigation: sensible directory skips; revisit if a future user reports a slow workspace.

## Migration Plan

1. Implement `internal/metrics/coverage.go` with `gatherCoverage(specsRoot, workspaceRoot string) CoverageMetrics`.
2. Add unit tests in `internal/metrics/coverage_test.go` covering extraction, scanning, and the default-empty cases.
3. Wire `gatherCoverage` into `internal/metrics/metrics.go`; add `Coverage CoverageMetrics \`json:"coverage"\`` to `TelemetryData`.
4. Add `web/components/CoverageReport.js` extending `KrokisElement`. Use `escape`, the `data` setter, and the `themechange` subscription from the base class.
5. Add a `routes[]` entry to `web/app.js` for `#/insights/coverage` and a `renderCoveragePage` function that calls `mountPage`.
6. Add the `Coverage` link to `web/index.html` under `Telemetry & Insights` between `Task Cadence` and `API Specification`, and load the new component script.
7. Add minimal styles to `web/styles.css` under a new section banner for the coverage status badges if needed (likely reuse the existing `.completed` / `.active` tokens).
8. Update `ARCHITECTURE.md`, `README.md`, `PROJECT_MEMORY.md`.
9. Run `openspec validate --all --strict`, `go build`, `go test`, and verify via `playwright-cli` that `#/insights/coverage` renders with zero console errors.

## Open Questions

- Should the matched-files list include the spec file paths themselves? Default: no, the scan skips `openspec/` so it cannot include spec files anyway.
- Should `partial` be shown distinctly from `covered`? Default: yes, three states (`covered`, `partial`, `uncovered`) so users can see "all matched" vs "some matched".
- Should the `/api/insights` payload include a per-identifier list of matched files for richer drilldown? Default: no for v1; cap at three files per requirement and revisit when a user asks.