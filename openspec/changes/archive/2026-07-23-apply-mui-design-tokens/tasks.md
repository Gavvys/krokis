## 1. Author the token set

- [x] 1.1 Create `web/tokens.css` with the full Material 3 dark token set on `:root` (color, typography, shape, elevation, motion, state-layer, spacing)
- [x] 1.2 Use `md-sys-` prefix on every custom property name and add a header comment listing each token category

## 2. Wire the font and stylesheet load order

- [x] 2.1 In `web/index.html`, replace the `Open Sans` Google Fonts request with a `Roboto` request at weights 300, 400, 500, 700 (keep the existing JetBrains Mono request)
- [x] 2.2 Add `<link rel="stylesheet" href="/tokens.css">` to `web/index.html` and place it before the existing `<link rel="stylesheet" href="/styles.css">`

## 3. Refactor styles.css to consume the tokens

- [x] 3.1 Replace the `:root` design-token block in `web/styles.css` with a comment pointing to `web/tokens.css`; remove `--bg-primary`, `--bg-secondary`, `--glass-bg`, `--glass-border`, `--accent`, `--accent-gradient`, `--card-shadow`
- [x] 3.2 Update `body` to use `var(--md-sys-color-surface)` and `var(--md-sys-typescale-body-medium-font)`
- [x] 3.3 Update `.sidebar` to use `var(--md-sys-color-surface-container-low)` and the M3 nav-rail width token
- [x] 3.4 Update `.sidebar-header` border to `var(--md-sys-color-outline-variant)`; remove the `backdrop-filter` if any
- [x] 3.5 Update `.icon-btn` to use the M3 icon-button state layers (8% / 12% / 16% via `::before`); preserve the refresh-icon spin animation
- [x] 3.6 Update `.logo-icon` to use the M3 primary color, not the legacy `--accent-gradient`
- [x] 3.7 Update `.nav-section h3` to M3 label-small (uppercase, 11px, 0.5px tracking, `var(--md-sys-color-on-surface-variant)`)
- [x] 3.8 Update `.nav-link` to M3 list-item state layers and `var(--md-sys-color-on-surface-variant)` text; the active state becomes primary tint (`color-mix` or a hand-coded 12% primary overlay)
- [x] 3.9 Update `.btn`, `.btn-secondary` to M3 filled / outlined button shapes and M3 state layers
- [x] 3.10 Update `.section-card` to use `var(--md-sys-color-surface-container)` and `box-shadow: var(--md-sys-elevation-1)`; remove `backdrop-filter`
- [x] 3.11 Update `.markdown-body` blockquote to use M3 surface-container-low without the `border-left` override
- [x] 3.12 Update `.markdown-body code` to use `var(--md-sys-color-surface-container-high)` and a primary-tinted text color
- [x] 3.13 Update `.markdown-body table` to M3 surface colors and `var(--md-sys-shape-small)` corners
- [x] 3.14 Update `.api-spec-page` to remove the radial-gradient backgrounds and use the M3 surface color
- [x] 3.15 Update `.api-spec-frame` to use `var(--md-sys-color-surface-container)` and `var(--md-sys-elevation-2)`
- [x] 3.16 Update `.api-spec-badge` to M3 shape-pill (`--md-sys-shape-corner-full`) and surface colors
- [x] 3.17 Update `.api-spec-badge-link` to the M3 state-layer pattern
- [x] 3.18 Update `.view-toggle` and `.view-toggle-btn` to M3 segmented-button shape and motion
- [x] 3.19 Update `.change-detail-table` to M3 surface colors and `var(--md-sys-color-outline-variant)` borders
- [x] 3.20 Search `web/styles.css` for any remaining hand-coded colors, hex values, or `rgba(...)` usages; replace with token references where the value maps to a token, otherwise add a comment
- [x] 3.21 Update `web/components/*.js` shadow-DOM inline styles: replace hard-coded `Open Sans`, `#f3f4f6`, `#9ca3af`, and `rgba(...)` colors with `var(--md-sys-color-*)` references and `var(--md-sys-typescale-*)` font tokens. Components use `var(--md-sys-color-*)` because CSS custom properties pierce shadow DOM.

## 4. Update project-level references

- [x] 4.1 Rewrite `DESIGN.md` to document the new Material 3 token set: link to `web/tokens.css`, list the token categories, and remove the Open Sans and glassmorphism references
- [x] 4.2 Add a decision row to `PROJECT_MEMORY.md` recording the shift to Material 3 dark and the no-light-mode scope

## 5. Verify and ship

- [ ] 5.1 Run `make dev` and visually verify the dashboard: sidebar, sidebar header, refresh icon spin, nav links (hover / focus / active), cards, buttons, view toggle, change-detail table, API spec frame
- [ ] 5.2 Search `web/` for `backdrop-filter`, `Open Sans`, `--glass-bg`, and `--accent-gradient`; confirm zero matches
- [ ] 5.3 Run `make validate` and confirm `openspec validate --all --strict` passes
- [ ] 5.4 Commit per the project's per-change discipline (one commit, descriptive message in the repo style)
- [ ] 5.5 Archive the change via `openspec archive`
