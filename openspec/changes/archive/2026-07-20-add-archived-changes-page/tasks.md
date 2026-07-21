## 1. Component: filter and mode

- [x] 1.1 Add a `mode` setter to `web/components/Changes.js` that accepts `active` or `archived` and re-renders.
- [x] 1.2 Inside the renderer, filter `flow.changes` by `status` based on the mode and pick the matching row schema (active rows show age; archived rows show completion date and cycle time).
- [x] 1.3 Sort archived rows by `completed_date` descending.
- [x] 1.4 Update the empty-state message to match the mode (`No active changes found.` for active, `No archived changes yet.` for archived).

## 2. Router and sidebar

- [x] 2.1 Add a new dispatch arm in `handleRoute` for `#/changes/archived` that calls `renderArchivedPage` and sets `document.title` to `Archived Changes · Krokis`.
- [x] 2.2 Add a new `renderArchivedPage` in `web/app.js` that mounts a `<changes>` element with `mode="archived"`.
- [x] 2.3 Add an `Archived` link to the `Changes` section in `web/index.html`, hidden by default.
- [x] 2.4 In `fetchTelemetry` (or after a successful fetch), toggle the `Archived` link's `hidden` attribute based on whether any change has `status === "completed"`.

## 3. Validation and docs

- [x] 3.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 3.2 Update `ARCHITECTURE.md` to mention `#/changes/archived`.
- [x] 3.3 Update `README.md` Dashboard Routes table.
- [x] 3.4 Add a `PROJECT_MEMORY.md` decision row.
- [x] 3.5 Manually verify: sidebar link hides/shows correctly, `#/changes` shows active only, `#/changes/archived` shows completed only, detail route works for both.
