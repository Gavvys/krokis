## 1. Local change-flow collection

- [x] 1.1 Define serializable change-flow, change record, planning-health, and unavailable-value structures.
- [x] 1.2 Discover active change directories and parse `.openspec.yaml` creation dates without writing to OpenSpec files.
- [x] 1.3 Discover archived change directories, parse archive completion dates, and calculate whole-day cycle times.
- [x] 1.4 Parse `tasks.md` checkboxes and required-artifact presence into planning-health evidence.
- [x] 1.5 Aggregate active WIP and monthly archived throughput, preserving unavailable dates and task counts.

## 2. Insights telemetry integration

- [x] 2.1 Add change-flow data to the generated `.krokis/insights/health.json` payload without removing existing fields.
- [x] 2.2 Ensure `krokis insights` succeeds when no OpenSpec changes directory exists and emits an empty flow result.
- [x] 2.3 Update generated MDX insight summary only if it can distinguish unavailable flow values from zero.

## 3. Dashboard flow view

- [x] 3.1 Add Flow Insights sidebar navigation and the `#/insights/flow` client route.
- [x] 3.2 Render WIP, monthly throughput, active-change age, completed cycle time, and planning health using existing dashboard conventions.
- [x] 3.3 Render missing or malformed source data as unavailable and never as validation success.

## 4. Verification and canonical references

- [x] 4.1 Add focused tests for active discovery, archived discovery, malformed dates, task parsing, aggregation, and empty-workspace behavior.
- [x] 4.2 Run focused tests, `go test ./...`, `go build ./...`, and strict OpenSpec validation for this change.
- [x] 4.3 Manually verify the generated Flow Insights dashboard route with representative local change data.
- [x] 4.4 Update `ARCHITECTURE.md`, `ROADMAP.md`, and `PROJECT_MEMORY.md` with accepted flow-insight boundaries and decisions.
