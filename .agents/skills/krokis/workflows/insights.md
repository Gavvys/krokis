---
name: insights-workflow
description: When to refresh telemetry and how to read the dashboard.
---

# Insights workflow

Use this workflow when you need a current snapshot of workspace health or want to look at the dashboard before making a change.

## When to refresh

- After implementing one or more OpenSpec changes and before archiving, to confirm the change graph and spec coverage look right.
- When the user asks "how is the project doing?" or asks for a status update.
- Before proposing a new change, to confirm the new work is not already represented by an active change.

## How to refresh

In the Krokis desktop app, click the refresh button or switch the active project in the Project Hub. The frontend invokes:

```text
invoke('get_insights')
```

The Rust backend scans the active workspace and returns Git cadence, codebase LOC, OpenSpec change flow, and spec coverage.

## What the dashboard shows

- **Task cadence** — git activity heatmap and author breakdown.
- **OpenSpec** — active changes, the change-flow graph, and a coverage indicator showing which spec requirements are matched by code.
- **Wiki** — SNAKE_CASE wiki articles and root canonical docs.

## Common pitfalls

- Do not expect telemetry from a workspace with no `.git` directory. The cadence heatmap will silently degrade.
- The dashboard is read-only for Git. Edit wiki articles on disk; Krokis never auto-commits.
