## Context

The `apply-mui-design-tokens` change shipped the Material 3 dark theme and explicitly scoped light mode out. The infrastructure for a future toggle is partially in place: `KrokisElement` listens for a `themechange` event on `document` and re-runs `render()` on dispatch, and `themeColor(name, fallback)` is a helper for reading computed CSS custom properties. There is no actual theme switcher yet, no light token values, and no persistence.

The user wants a dark/light toggle. The chosen trigger is manual (icon button in sidebar header), dark by default, and the choice persists in `localStorage.krokis.theme`. The `prefers-color-scheme` media query is intentionally not used in v1 to keep the change small and the dashboard's identity dark-first.

## Goals / Non-Goals

**Goals:**
- A single button in the sidebar header flips between dark and light.
- A parallel Material 3 light token set is defined in `web/tokens.css` under `:root[data-theme="light"]`. Same token names, M3 light values.
- The choice persists across page reloads via `localStorage.krokis.theme`.
- The theme applies on first paint (no flash of dark theme when the user has chosen light).
- Components that read CSS custom properties inside their shadow DOM update automatically; no component logic change is required because `var(--md-sys-color-*)` resolves against the current `:root` cascade.
- The RapiDoc OpenAPI panel receives the active theme's color attributes when the panel is mounted, so the embedded spec viewer matches the dashboard.

**Non-Goals:**
- Auto-detection via `prefers-color-scheme` media query (deferred to a future change).
- Per-page or per-route theme overrides.
- Theme customisation (users pick from a palette of accent colors).
- Animating the theme switch (cross-fade between palettes). The change is instant; CSS variable resolution does not animate, and a smooth cross-fade would double the token set.
- High-contrast or system color overrides beyond M3.

## Decisions

**D1. Two scopes on `:root` for theme differentiation.**
The standard M3 approach is one `:root` block for light and one `@media (prefers-color-scheme: dark) { :root { ... } }` block for dark. We invert that: `:root` is dark (the current block stays untouched), and `:root[data-theme="light"] { ... }` overrides the same tokens with light values. This keeps the current dark experience as the default for users with no JS, no localStorage, and no JS-disabled environments.
Alternative considered: separate `tokens-dark.css` and `tokens-light.css` and load one based on `data-theme`. More files, more `<link>` tags, no real win — the cascade already does the work.

**D2. `data-theme` on `<html>` (which is `:root`), not on `<body>`.**
The `data-theme` attribute is set on `<html>` so that the inline script in `<head>` can resolve the right theme before `<body>` parses. If the attribute is on `<body>`, the head script cannot set it early enough to prevent a flash.
Alternative considered: a class on `<body>`. Same idea, but the inline script timing is cleaner with a top-level attribute.

**D3. Inline blocking script in `<head>` for the no-flash load.**
A small synchronous script reads `localStorage.krokis.theme` and sets `document.documentElement.setAttribute('data-theme', value)` before the `tokens.css` `<link>` parses. The script is ~5 lines and runs before any rendering. It is the only inline script in the page; everything else loads as deferred.
Alternative considered: a CSS-only approach using `prefers-color-scheme: dark` defaults. We rejected auto-detection in v1, so this is not viable.
Alternative considered: a `<script src="/theme.js">` in `<head>`. Same effect but adds another HTTP request and another file. Inline wins for 5 lines.

**D4. Toggle button is a plain `<button class="icon-btn" id="theme-toggle">`, not a Web Component.**
A Web Component is overkill for a static icon button. The sidebar already uses `<button class="icon-btn">` for the refresh action; the theme toggle reuses that exact class and gets the M3 icon-button state layers for free. Wiring (click handler, icon swap, localStorage write) lives in `web/app.js` next to the existing refresh-button wiring.
Alternative considered: a custom `<theme-toggle>` Web Component. Adds API surface, lifecycle hooks, and a `connectedCallback` for a button that is just a `<button>`.

**D5. Toggle icon is an inline SVG that swaps based on the active theme.**
Dark mode shows a sun icon (clicking will switch to light). Light mode shows a moon icon. The two SVGs are inlined in `web/index.html` next to the button; `web/app.js` toggles a `hidden` attribute (or a class) to show one and hide the other. Inline SVGs match the existing refresh button's pattern.
Alternative considered: a single SVG with both paths and a CSS state. Looks slick but harder to read and harder to animate later.

**D6. RapiDoc receives the active theme on every visit.**
The OpenAPI spec panel is rendered when `#/insights/openapi` is visited. The current code bakes hardcoded dark colors into the RapiDoc HTML attributes. After the toggle ships, those attributes resolve from the active theme: `data-theme="light"` swaps the attributes to light values, `data-theme="dark"` (or absent) keeps the dark values. Implemented as a small helper `rapiDocAttributes(theme)` in `web/app.js` that returns the right attribute set. No RapiDoc re-init is needed because RapiDoc reads the attributes on element upgrade.
Alternative considered: dispatch a `themechange` handler that rebuilds the `<rapi-doc>` element. RapiDoc rebuild is heavy; re-applying attributes to the existing element is enough.

**D7. No animation on theme switch.**
The token values change instantly. Adding a `transition: background-color 200ms` on `body` would animate the change but would also bleed into every state transition the M3 design uses, and would cause a perceptible lag on every hover. The instant switch is the M3 norm; skip the animation.
Alternative considered: a 150ms cross-fade on `body` only. Adds complexity for a small win. Defer.

**D8. `localStorage` key is `krokis.theme`, value is `"dark"` or `"light"`.**
A string, not an object, because the dashboard only needs a single bit. The key is namespaced under `krokis.` to match the existing `krokis.changeViewMode` key in `web/app.js`. Persisting is fail-safe: if `localStorage` is unavailable (private mode in some browsers, file:// protocol), the toggle still works for the session; only persistence is lost.
Alternative considered: cookies. Cookies are sent on every request to the dashboard, which is unnecessary.

**D9. No RapiDoc flash mitigation beyond attribute swap.**
The dashboard's default route is not the OpenAPI panel, so the RapiDoc element is not in the DOM on first paint. The attribute swap happens when the user navigates to `#/insights/openapi` for the first time, and the swap is idempotent (dark stays dark, light becomes light). No FOUT concern.

## Risks / Trade-offs

- [R: Some M3 dark values (especially the high-saturation primary `#82b1ff`) read as harsh on a light surface] → Mitigation: the light primary is M3 standard `#0b57d0`, a deeper blue. The design system does not mix.
- [R: The inline script in `<head>` runs before `localStorage` may be available in some private-browsing modes, throwing a silent error] → Mitigation: wrap the read in `try { ... } catch { ... }` and fall back to the dark default. ~3 extra lines.
- [R: The M3 elevation 1-2 box-shadow tokens are tuned for a dark surface and may look heavy on a light surface] → Mitigation: keep the same elevation tokens in light mode; M3's spec defines them for both. If they read heavy, a follow-up can introduce light-specific elevation overrides.
- [R: The RapiDoc HTML attribute swap depends on the panel not being mounted yet] → Mitigation: when the toggle is clicked while on `#/insights/openapi`, a `themechange` handler re-applies the attributes. RapiDoc picks up the new colors on the next `attributeChangedCallback`.
- [R: The inline script adds an untracked asset; if someone later moves tokens.css to a different location the order still works because both run from `<head>`] → Mitigation: the script only reads `localStorage` and sets an attribute, not the URL of `tokens.css`. No coupling.
- [R: The same primary blue is used in both modes, but the brightness contrast differs] → Mitigation: by design. M3 uses the same key color across light and dark; only the surface and on-surface values change.

## Migration Plan

Single deploy: CSS + HTML + JS, no data migration, no schema change.

Steps:
1. Add the `:root[data-theme="light"]` block to `web/tokens.css` with M3 light values.
2. Add the inline `<script>` in `web/index.html` `<head>` that reads `localStorage.krokis.theme` and sets `data-theme` on `<html>`. Add the toggle button HTML next to the refresh button.
3. Update `web/app.js` to wire the toggle: read/write `localStorage`, set `data-theme`, dispatch `themechange`, swap the icon. Re-apply RapiDoc attributes when on `#/insights/openapi`.
4. Update `DESIGN.md` to document the light mode and the toggle.
5. Add a decision row to `PROJECT_MEMORY.md`.
6. Run `make dev`, verify the toggle, verify the dashboard in both themes, verify the RapiDoc panel matches.
7. Run `make validate`.
8. Commit per the project's per-change discipline.
9. Archive the change.

Rollback: revert the commit. No data is touched; `localStorage.krokis.theme` becomes a harmless orphan key.

## Open Questions

(none)
