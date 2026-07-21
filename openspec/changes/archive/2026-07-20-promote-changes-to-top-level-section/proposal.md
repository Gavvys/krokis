## Why

OpenSpec changes are first-class workflow artifacts, not insights. The dashboard currently buries them under the `Telemetry & Insights` section, which makes them feel like secondary metrics. Users opening Krokis should see Changes as a dedicated top-level section, parallel to Project Wiki, so the workflow is the primary navigation surface and insights are read alongside it.

## What Changes

- Add a new top-level sidebar section **Changes** with a single entry pointing to `#/changes`.
- Move the existing change-flow table, WIP card, average cycle time, and monthly throughput panel from `#/insights/flow` to `#/changes`. The page now shows both the change list and the flow metrics.
- Remove the `Flow Insights` entry from the `Telemetry & Insights` sidebar section.
- Move the per-change detail route from `#/insights/flow/<change>` to `#/changes/<change>`.
- Keep a permanent redirect from the old `#/insights/flow` and `#/insights/flow/<change>` URLs to their new `#/changes` and `#/changes/<change>` equivalents so existing bookmarks and any external links still resolve.
- Rename the `FlowInsights` Web Component to `Changes` so the component name matches the section; keep an internal alias so any leftover references still work.

## Capabilities

### New Capabilities
- `changes-section`: A dedicated top-level dashboard sidebar section plus the `#/changes` route that lists every local OpenSpec change (active and completed) with status, age, cycle time, planning health, and links to the per-change detail view, and shows the team-level WIP, average cycle time, and monthly throughput cards above the list.

### Modified Capabilities
- `web-dashboard`: Update the change-flow dashboard route requirement to use `#/changes` instead of `#/insights/flow`, and update the per-change detail route to `#/changes/<change>`.

## Impact

- Modified files: `web/index.html` (sidebar markup), `web/app.js` (router, redirect handler, page renderer), `web/components/FlowInsights.js` (rename + alias), `web/styles.css` if any new layout is needed.
- No backend changes. No new endpoints. No new payload fields.
- **BREAKING**: URLs `#/insights/flow` and `#/insights/flow/<change>` are deprecated. Redirects preserve the old paths, so the change is non-breaking in practice but the canonical URLs are new.
- Documentation updates: `ARCHITECTURE.md` (System Data Flow bullet that mentions `#/insights/flow`); `README.md` (Dashboard Routes table if it lists the old URL); `PROJECT_MEMORY.md` decision row.
