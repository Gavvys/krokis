## Why

The dashboard is dark-only today. The `apply-mui-design-tokens` change explicitly listed light mode as out of scope, and `DESIGN.md` calls that out as a follow-up. Users want the option to switch, especially during daytime reading or when sharing a screenshot. Adding a manual toggle is the smallest bounded change that gives them the option without inheriting the complexity of `prefers-color-scheme` auto-detection.

## What Changes

- Add a parallel Material 3 light token set in `web/tokens.css` under `:root[data-theme="light"]`. Same token names, light values from the M3 reference light scheme, primary key color stays blue (`#0b57d0` is M3 light primary on blue).
- Add a theme toggle button in the sidebar header next to the refresh button. Sun icon when in dark mode, moon icon when in light mode.
- On click, the toggle writes `data-theme="light"` or `data-theme="dark"` to `<html>`, dispatches a `themechange` event on `document`, and persists the choice to `localStorage` under `krokis.theme`.
- On first visit, the dashboard reads `localStorage.krokis.theme`. If unset, default to dark. No `prefers-color-scheme` detection.
- A small inline script in `web/index.html` reads `localStorage.krokis.theme` and sets `data-theme` on `<html>` before any stylesheet loads, preventing a flash of wrong theme (FOUT). The script runs synchronously in `<head>`.
- All M3 surface containers, state layers, elevation tokens, and motion tokens continue to apply in both themes. No new token categories introduced.
- `KrokisElement` already has a `themechange` listener that re-runs `render()` — the existing components do not need any change to redraw on theme switch. CSS custom properties in the shadow DOM update automatically.

## Capabilities

### New Capabilities

- `theme-management`: defines the dark/light theme switch. Covers (1) the storage key (`krokis.theme` in `localStorage`), (2) the attribute on `<html>` (`data-theme="dark" | "light"`, default dark), (3) the `themechange` event dispatched on `document` after a switch, and (4) the toggle button in the sidebar header. The toggle is a plain `<button>`, not a Web Component.

### Modified Capabilities

- `mui-design-tokens`: a new requirement is added to the spec mandating a Material 3 light token set under `:root[data-theme="light"]` with the same token names as dark. Existing requirements are unchanged.
- `web-dashboard`: a new requirement is added to the spec mandating the dashboard expose a theme toggle button in the sidebar header. Existing requirements are unchanged.

## Impact

- `web/tokens.css` — add a `:root[data-theme="light"]` block with light M3 values
- `web/index.html` — add the toggle button next to the refresh button; add a small inline script in `<head>` to set `data-theme` from `localStorage` before stylesheets load
- `web/app.js` — wire the toggle button to write `data-theme`, dispatch `themechange`, persist to `localStorage`, and swap the icon
- `web/styles.css` — add CSS for the `.theme-toggle` button (M3 icon-button pattern, same as `.icon-btn`); the toggle reuses the existing `.icon-btn` styling so the change is small
- `DESIGN.md` — remove the "Light mode is out of scope" line; document the token set parity, the toggle behavior, and the no-FOUT inline script
- `PROJECT_MEMORY.md` — add a decision row
- `openspec/specs/theme-management/spec.md` (new)
- `openspec/specs/mui-design-tokens/spec.md` (delta: add light token requirement)
- `openspec/specs/web-dashboard/spec.md` (delta: add toggle requirement)
- No Go code, CLI commands, or HTTP behavior change.
- No new runtime dependencies. The `themechange` event is a `new CustomEvent('themechange')` on `document` — no library needed.
