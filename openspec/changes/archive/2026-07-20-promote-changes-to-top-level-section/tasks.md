## 1. Sidebar markup

- [x] 1.1 Add a new top-level `Changes` section in `web/index.html` between `Project Wiki` and `Telemetry & Insights`, with a single link to `#/changes`.
- [x] 1.2 Remove the `Flow Insights` list item from the `Telemetry & Insights` section.
- [x] 1.3 Update the `<script>` tag that loads `FlowInsights.js` if the filename changes.

## 2. Component rename and alias

- [x] 2.1 Rename `web/components/FlowInsights.js` to `web/components/Changes.js` and rename the class to `Changes`.
- [x] 2.2 Register `<changes>` as the primary custom element and keep `<flow-insights>` as a deprecated alias.
- [x] 2.3 Update internal references to the new class name inside the file.

## 3. Router and renderer updates

- [x] 3.1 In `web/app.js`, add a small legacy-URL rewrite at the top of `handleRoute` that maps `#/insights/flow` to `#/changes` and `#/insights/flow/<x>` to `#/changes/<x>`, using `history.replaceState` so the back button is not polluted.
- [x] 3.2 Rename `renderFlowPage` to `renderChangesPage` and dispatch `#/changes` to it.
- [x] 3.3 Rename `renderChangeDetailPage` to `renderChangeDetail` and dispatch `#/changes/<change>` to it. Update the back-link in the rendered HTML to point at `#/changes`.
- [x] 3.4 Update the per-change detail page title to use `Changes · Krokis` instead of `Flow · Krokis`.
- [x] 3.5 Update the `<flow-insights>` element references inside `renderChangesPage` to `<changes>`.
- [x] 3.6 Update change-row links inside the table to point at `#/changes/<name>` instead of `#/insights/flow/<name>`.

## 4. Validation and docs

- [x] 4.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 4.2 Update `ARCHITECTURE.md` to mention `#/changes` instead of `#/insights/flow` in the System Data Flow section.
- [x] 4.3 Update `README.md` Dashboard Routes table to point at `#/changes`.
- [x] 4.4 Add a `PROJECT_MEMORY.md` decision row recording the route promotion and the redirect.
- [x] 4.5 Manually verify: old URL redirects, new URL renders, sidebar shows the new section, per-change detail still works, list/graph toggle still persists.
