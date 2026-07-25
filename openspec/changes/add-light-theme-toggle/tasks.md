## 1. Add the light token set

- [x] 1.1 Append a `:root[data-theme="light"]` block to `web/tokens.css` with the same token names and a Material 3 light value for every color, surface, outline, and inverse token
- [x] 1.2 Light primary SHALL be `#0b57d0` (M3 light primary on blue) and on-primary-container SHALL be the M3 light value; the rest SHALL follow the M3 reference light scheme
- [x] 1.3 Leave typography, shape, elevation, motion, state-layer, and spacing tokens identical to dark; the switch is color-only

## 2. Wire the no-flash inline script

- [x] 2.1 In `web/index.html`, add a synchronous `<script>` in `<head>` (before the `tokens.css` link) that reads `localStorage.krokis.theme`, defaults to `dark`, and sets `document.documentElement.setAttribute('data-theme', value)`
- [x] 2.2 Wrap the `localStorage` read and write in `try { ... } catch { ... }` so private-browsing failures fall back to dark

## 3. Add the toggle button

- [x] 3.1 In `web/index.html`, add a `<button class="icon-btn" id="theme-toggle">` next to `#refresh-btn` in the sidebar header
- [x] 3.2 Inline two SVGs inside the button: a sun (visible in dark) and a moon (visible in light); the visible one is selected by toggling a `hidden` attribute
- [x] 3.3 Set `aria-label` on the button to `Switch to light theme` initially; the JS will swap to `Switch to dark theme` when the active theme is light

## 4. Wire the toggle behavior in app.js

- [x] 4.1 Add a `getTheme()` helper that reads `data-theme` on `<html>` and falls back to `dark`
- [x] 4.2 Add a `setTheme(theme)` helper that writes `data-theme`, persists to `localStorage.krokis.theme`, and dispatches a `themechange` event on `document`
- [x] 4.3 Add a `syncToggleUI()` helper that swaps the sun/moon icon visibility and the `aria-label` based on the active theme
- [x] 4.4 On `DOMContentLoaded`, call `syncToggleUI()` once and attach a click handler to `#theme-toggle` that flips the theme, calls `setTheme`, and calls `syncToggleUI`
- [x] 4.5 Add a `themechange` listener on `document` (debounced via `requestAnimationFrame`) that re-applies RapiDoc attributes when `#/insights/openapi` is the active route, and that calls `syncToggleUI` for any other listeners

## 5. RapiDoc attributes for both themes

- [x] 5.1 In `web/app.js`, extract the RapiDoc attribute object into a `rapiDocAttributes(theme)` helper that returns the dark or light color set
- [x] 5.2 Replace the hardcoded attribute block in the OpenAPI route render with a template that interpolates the helper result
- [x] 5.3 Confirm the existing `themechange` listener re-applies the attributes when the user toggles while on the OpenAPI page

## 6. Update project references

- [x] 6.1 Update `DESIGN.md`: drop the "Light mode is out of scope" line, document the light token set, the toggle behavior, and the no-FOUT inline script
- [x] 6.2 Add a decision row to `PROJECT_MEMORY.md` for the light-mode toggle and the manual default

## 7. Verify and ship

- [x] 7.1 Run `make dev` and visually verify both themes: sidebar, cards, buttons, nav links (hover/focus/active), markdown body, code blocks, view toggle, change detail, API spec panel
- [x] 7.2 Toggle while on the OpenAPI page and confirm the RapiDoc colors update without a hard reload
- [x] 7.3 Reload the page in both themes and confirm there is no flash of wrong theme on first paint
- [x] 7.4 Search `web/` for `backdrop-filter`, `Open Sans`, `--glass-bg`, and `--accent-gradient`; confirm zero matches (carry-over from M3 audit)
- [x] 7.5 Run `make validate` and confirm `openspec validate --all --strict` passes
- [x] 7.6 Commit per the project's per-change discipline (one commit, descriptive message)
- [x] 7.7 Archive the change via `openspec archive add-light-theme-toggle`
