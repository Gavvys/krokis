## Why

`#/changes` currently mixes active and completed changes in one table, so users cannot focus on either alone. Archived changes are historical evidence, not work in progress. Splitting them into a dedicated page makes the active queue easier to scan and gives archived changes room to show completion metrics (cycle time, completion date) without crowding the active view.

## What Changes

- Add a new dashboard route `#/changes/archived` that lists every completed (archived) OpenSpec change with name, completion date, cycle time, and planning health.
- Limit the existing `#/changes` page to active changes only.
- Add a new sidebar link `Archived` inside the `Changes` section, between `All Changes` and the end of the section.
- Reuse the existing per-change detail route `#/changes/<name>` so both pages link into it.
- The new page does not introduce new payload fields. The existing `change-flow-insights` records already include `status`, `completed_date`, and `cycle_time_days`.

## Capabilities

### New Capabilities
- `archived-changes-page`: A dedicated dashboard route `#/changes/archived` plus sidebar entry that lists every completed OpenSpec change with its completion date, cycle time, and planning health.

### Modified Capabilities
- `changes-section`: Update the `Changes page lists every change and the team-level flow metrics` requirement so the list contains active changes only; the WIP, average cycle time, and monthly throughput cards remain on `#/changes` because they are flow metrics, not archived history.

## Impact

- Modified files: `web/index.html` (new sidebar link), `web/app.js` (new route dispatch, new renderer), `web/components/Changes.js` (new `archived` mode that filters to completed changes only, or a new tiny component if it is cleaner).
- No backend changes. No new endpoints. No new payload fields.
- No breaking changes. The existing `#/changes/<name>` detail route continues to work for both active and archived changes.
- Documentation updates: `ARCHITECTURE.md` (System Data Flow bullet), `README.md` (Dashboard Routes table), `PROJECT_MEMORY.md` decision row.
