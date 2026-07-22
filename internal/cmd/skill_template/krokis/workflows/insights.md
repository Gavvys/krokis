---
name: insights-workflow
description: When to run krokis insights and how to read the dashboard.
---

# Insights workflow

Use this workflow when you need a current snapshot of workspace health or want to look at the dashboard before making a change.

## When to run

- After implementing one or more OpenSpec changes and before archiving, to confirm the change graph, spec coverage, and lint signals look right.
- When the user asks "how is the project doing?" or asks for a status update.
- Before proposing a new change, to confirm the new work is not already represented by an active change.

## How to run

```bash
krokis insights
```

This writes `.krokis/insights/health.json` with telemetry for the dashboard, and starts (or refreshes) the live server at `http://localhost:8080/`.

## What the dashboard shows

- **Task cadence** — git activity heatmap.
- **OpenSpec** — active changes, the change-flow graph, and a coverage indicator showing which spec requirements are matched by code.
- **Workspace** — wiki articles, configuration status, and the doctor check list.

## Common pitfalls

- Do not call `krokis insights` from a CI runner that has no `.git` directory. The cadence heatmap will silently degrade.
- The dashboard is read-only. Edit wiki articles on disk, then call `krokis wiki index` to refresh the index.
