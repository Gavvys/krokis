# spec-coverage Specification

## Purpose
TBD - created by archiving change add-spec-to-code-coverage. Update Purpose after archive.
## Requirements
### Requirement: Derive per-requirement coverage from local OpenSpec specs
Krokis SHALL derive a coverage report from `openspec/specs/**/spec.md`. For each requirement (text between `### Requirement:` headers), Krokis SHALL extract named identifiers from the body: fenced code block content, custom-element tags of the form `<kebab-case>`, route hashes of the form `#/...`, backticked symbols (camelCase, snake_case, kebab-case, PascalCase), and quoted strings. Krokis SHALL exclude common stopwords and OpenSpec scaffolding terms (for example `WHEN`, `THEN`, `SHALL`, `Scenario`). A requirement is `covered` when at least one of its identifiers appears in a non-spec workspace file; `uncovered` when none appear. The identifier scan SHALL skip `openspec/`, `.git/`, `tmp/`, `.air/`, and `node_modules/`.

#### Scenario: Requirement with identifiers present in code
- **WHEN** a `spec.md` requirement mentions `<change-list>` and `#/changes` and both strings appear in `web/app.js` or another non-spec workspace file
- **THEN** the requirement is reported as `covered` and the report includes the count of matched identifiers and a short list of matched files

#### Scenario: Requirement with no code reference
- **WHEN** a `spec.md` requirement's identifiers do not appear in any non-spec workspace file
- **THEN** the requirement is reported as `uncovered` with zero matched identifiers and an empty matched-files list

#### Scenario: Spec file is unparseable
- **WHEN** a `spec.md` file under `openspec/specs/` is missing or malformed
- **THEN** the gatherer skips that capability and emits an empty coverage record with zero requirements and zero covered, rather than aborting the entire telemetry run

### Requirement: Per-capability coverage aggregate
Krokis SHALL aggregate the per-requirement records into a per-capability summary with the capability name, the total number of requirements, the number covered, and the number uncovered. The aggregate SHALL be included in the `coverage` section of the `krokis insights` output.

#### Scenario: Capability with mixed coverage
- **WHEN** a capability's spec has 4 requirements and 3 of them have matched identifiers
- **THEN** the aggregate entry has `requirements: 4`, `covered: 3`, `uncovered: 1`

#### Scenario: Capability with no spec file
- **WHEN** a capability directory exists but contains no parseable `spec.md`
- **THEN** the aggregate entry has `requirements: 0`, `covered: 0`, `uncovered: 0`

### Requirement: Coverage page on the dashboard
The dashboard SHALL expose a `#/insights/coverage` route under the `Telemetry & Insights` sidebar section. The page SHALL render one summary card per capability with covered/total counts, followed by a per-requirement table containing the requirement name, status badge (`covered`, `uncovered`, or `partial` when some but not all identifiers matched), and an expandable list of up to three matched files. The page SHALL NOT claim that low coverage is a failure of OpenSpec validation; it is implementation evidence, not spec compliance.

#### Scenario: Visiting the Coverage page with data
- **WHEN** the user visits `#/insights/coverage` after `krokis insights` populated coverage data
- **THEN** the dashboard renders a summary card per capability and a per-requirement table with status badges

#### Scenario: Visiting the Coverage page with no data
- **WHEN** the user visits `#/insights/coverage` and `krokis insights` has not yet run
- **THEN** the dashboard shows an unavailable message and does not display zero coverage

### Requirement: Coverage data in the insights payload
The `/api/insights` endpoint SHALL include a `coverage` field with a `capabilities` array. Each entry SHALL carry the capability name, total requirement count, covered count, uncovered count, and a `requirements` array. Each requirement entry SHALL carry the requirement name, status, identifier count, matched identifier count, and a capped list of up to three matched file paths relative to the workspace root. The payload SHALL default to empty arrays when `krokis insights` has not produced coverage data.

#### Scenario: Payload includes coverage after running insights
- **WHEN** `krokis insights` has run and the dashboard fetches `/api/insights`
- **THEN** the JSON response has a `coverage.capabilities` array with one entry per local OpenSpec capability

#### Scenario: Payload defaults to empty before insights runs
- **WHEN** the dashboard fetches `/api/insights` and no coverage data was produced
- **THEN** the JSON response has `coverage: { capabilities: [] }` and the dashboard treats it as unavailable

