## Why

Krokis reports Git activity and quality checks, but it does not show whether OpenSpec work is flowing predictably. Teams need a local, audit-friendly view of active work, aging changes, completion time, throughput, and validation state without turning Krokis into a task manager.

## What Changes

- Add local OpenSpec change-flow analysis for active and archived changes.
- Report work in progress, active-change age, completed-change cycle time, and completed-change throughput.
- Report each change's current validation state from local OpenSpec artifacts and validation results.
- Add a dashboard route that presents flow insights and flags aging or unhealthy changes.
- Update roadmap and architecture references with the accepted flow-insight boundary.
- Do not add remote integrations, individual performance rankings, deployment metrics, incident metrics, or task-assignment workflows.

## Capabilities

### New Capabilities

- `change-flow-insights`: Local analysis and presentation of OpenSpec change flow and validation health.

### Modified Capabilities

- `project-insights`: Extend locally generated telemetry with change-flow data.
- `web-dashboard`: Add an insights route for change-flow data.

## Impact

- Affects `internal/metrics/`, `internal/cmd/insights.go`, embedded server data endpoints, and dashboard components/routes.
- Adds no runtime service or remote dependency; reads only local OpenSpec data and local validation results.
- Updates `ARCHITECTURE.md` and `ROADMAP.md` after accepted implementation. No conflict with product intent: Krokis remains a local-first OpenSpec overlay, not a task manager.
