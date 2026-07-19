## Context

`krokis insights` currently derives telemetry from Git history, code files, and optional quality-report files. It does not inspect the local OpenSpec change folders, so the dashboard cannot answer whether work is accumulating, aging, or completing predictably. `PRODUCT.md` calls for human-auditable metrics; `ARCHITECTURE.md` keeps Krokis local-first and free of runtime services.

## Goals / Non-Goals

**Goals:**

- Derive change-flow metrics from the local `openspec/changes/` tree.
- Keep metric definitions explicit and stable.
- Present useful team-level signals without individual rankings.
- Surface incomplete planning artifacts and unfinished tasks without claiming that a change passed strict OpenSpec validation.

**Non-Goals:**

- Implementing a task board, assignment system, or remote tracker integration.
- Inferring DORA deployment or incident metrics from Git history.
- Ranking people, counting agent output, or calculating a single productivity score.
- Rewriting OpenSpec artifacts during insights collection.

## Decisions

### 1. Treat OpenSpec changes as flow items

The collector SHALL scan `openspec/changes/` for active change directories and `openspec/changes/archive/YYYY-MM-DD-<name>/` for completed changes. `.openspec.yaml` supplies the creation date; the archive-directory date supplies the completion date. This uses durable OpenSpec structure already present in a Krokis workspace.

Alternative: infer every date from Git commits. Rejected because active, uncommitted proposals are meaningful work and Git timestamps vary by repository workflow.

### 2. Publish team-level flow measures

The generated telemetry will contain:

- active work in progress: count of active changes;
- active-change age: elapsed calendar days since each change's `created` date;
- completed cycle time: elapsed calendar days from `created` date to archive date;
- monthly throughput: archived-change count grouped by archive month;
- planning health: presence of required artifacts and count of checked versus unchecked tasks.

Missing or invalid dates SHALL be represented as unavailable, not zero. No aggregate score is produced.

Alternative: use commit count, LOC, or per-author output as the primary measure. Rejected because activity volume does not show flow or reliable delivered value.

### 3. Keep validation evidence separate from planning health

Krokis will report only artifact and task completion evidence it can read locally. It SHALL label this `planning health`, not `validation passed`. A strict `openspec validate` result is valid only when explicitly run and captured by that tool or a future integration.

Alternative: run the `openspec` executable from Krokis. Rejected for this change because Krokis must remain a portable binary without an OpenSpec runtime dependency.

### 4. Extend existing telemetry and dashboard routes

Change-flow data joins the existing `.krokis/insights/health.json` payload. The dashboard gets a dedicated `#/insights/flow` route and sidebar entry. It uses existing native Web Component patterns and status colors from `DESIGN.md`.

Alternative: create a separate server process or database. Rejected because local generated JSON and embedded dashboard assets meet the product boundary.

## Risks / Trade-offs

- [Date-only OpenSpec metadata has day-level precision] → Display whole-day values and document that they are not hour-level delivery measurements.
- [Legacy changes may lack a valid `created` date] → Mark age/cycle time unavailable while still counting safely discoverable active or archived items.
- [Checked task lists can be stale] → Present counts as planning health, never proof of implementation or validation.
- [Archived directory names might not follow the date convention] → Ignore malformed archive dates for time metrics and expose unavailable data rather than guessing.

## Migration Plan

1. Add flow data to the existing telemetry payload without removing current fields.
2. Render unavailable values distinctly in the new dashboard route.
3. Update `ARCHITECTURE.md` and `ROADMAP.md` when implementation is accepted.
4. Roll back by removing the additive flow field and route; existing insight data remains compatible.

## Open Questions

- None for the first local-only version. Deployment and incident integration remain future, separate work.
