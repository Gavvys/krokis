## Context

The Krokis dashboard's visual system grew organically as features were added. The current theme in `web/styles.css` uses a small set of hand-picked CSS variables (`--bg-primary`, `--glass-bg`, `--accent`, etc.), Open Sans from Google Fonts, and frosted-glass cards with `backdrop-filter: blur(10px)`. `DESIGN.md` documents the colors but no shape, motion, or state-layer scale; the design system cannot be reasoned about or extended.

The user wants the dashboard to feel like an MUI Material 3 product. Wiring actual MUI/React would require a build pipeline and a rewrite of every Web Component, which is incompatible with the project's zero-build, zero-framework discipline. The pragmatic alternative is to copy MUI's design tokens (the public Material 3 specification values) into a `web/tokens.css` and refactor `web/styles.css` to consume them. This keeps the Web Component architecture and the zero-build pipeline intact while delivering the visual upgrade.

## Goals / Non-Goals

**Goals:**
- Define a single source of truth for design tokens in `web/tokens.css`, using Material 3 values.
- Replace Open Sans with Roboto (the MUI default) for both body and heading text.
- Replace frosted-glass cards with Material 3 surface + elevation, keeping the same class names so no markup or component logic changes.
- Use Material 3 motion curves and durations for every transition.
- Apply Material 3 state layers (8% hover, 12% pressed, 16% focus) to interactive elements.
- Document the new system in `DESIGN.md`.

**Non-Goals:**
- Adding React, MUI, or any other framework.
- Changing Web Component APIs, the router, or any JS logic.
- Adding a build step or a bundler.
- Theme switching (light mode) — the dashboard remains dark-only. A future change can add a `prefers-color-scheme` variant.
- Touching the RapiDoc theming (`bg-color`, `text-color` props on the embedded element) — that is a separate design surface owned by RapiDoc, not Krokis.
- Restructuring `web/styles.css` into multiple files. The header comment already explains the file is intentionally single-file.

## Decisions

**D1. Material 3 (M3) tokens, not Material 2 (M2).**
MUI is currently centered on M3. M3 has clearer role-based color tokens, a 5-level elevation scale, and a defined motion system. Using M2 would be a step backward.
Alternatives considered: Tailwind CSS (introduces a build step and a new framework surface), shadcn/ui (also requires a build step). Both fail the zero-build constraint.

**D2. Roboto via Google Fonts, weights 300/400/500/700.**
Roboto is the canonical MUI body font. The current font request already hits `fonts.googleapis.com`, so there is no new external endpoint. Keep JetBrains Mono for code/commit/identifier surfaces because Roboto Mono is not the MUI default and the existing mono pairing works.
Alternatives considered: Roboto Flex (variable font) — more accurate, but adds bytes and most of the variation isn't visible at body sizes.

**D3. Material 3 dark color scheme only.**
Light mode is a separate theme surface. Adding it would double the token set and split the dashboard's visual identity. The dashboard is dark-only today; keep it that way.
Token values are taken from the Material 3 reference dark theme, with the primary key color shifted to a blue that matches the existing `--accent: #3b82f6` so the brand color survives. Specifically: primary `#82b1ff` (M3 dark primary on blue), secondary `#b4c6ff`, surface `#121316`, on-surface `#e3e2e6`, outline `#8e9099`. The accent gradient is dropped — M3 uses a single primary color, not a gradient.

**D4. Tokens live in `web/tokens.css`, loaded before `web/styles.css`.**
Single file, single load order, single source. Component styles in `web/components/*.js` consume the same custom properties through `var(--md-sys-color-primary, fallback)`. No new preprocessor, no Sass, no PostCSS.
Alternatives considered: inlining tokens into `styles.css` — couples the token list to all consumers, harder to evolve. JS-injected tokens — runs after first paint, causes a flash.

**D5. Keep all existing CSS class names. Only the values they resolve to change.**
`.section-card`, `.nav-link`, `.icon-btn`, `.btn`, `.btn-secondary`, `.markdown-body`, etc., keep their names. Their internal property values are rewritten to reference the new tokens. This means no markup edits and no component-logic edits, only `styles.css` changes.

**D6. State layers via `::before` overlay, not `background-color` swap.**
Material 3 state layers are 8% (hover) / 12% (pressed) / 16% (focus) on the *primary* color, drawn over the existing surface. Implementing them with a `::before { content: ''; position: absolute; inset: 0; background: var(--md-sys-color-primary); opacity: 0; transition: opacity 150ms; }` overlay lets us reuse the same token for hover/press/focus by changing the opacity. Buttons and nav links become `position: relative; overflow: hidden;` and the overlay is the only thing that changes on `:hover` / `:active` / `:focus-visible`.
Alternatives considered: per-state class variants (`.btn:hover`, `.btn--pressed`) — more code, less Material-y, and the user can't get state layers on focus without a separate rule.

**D7. Motion tokens use Material 3's "standard" easing.**
`--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1)` (M3's revised standard curve). Durations: `--md-sys-motion-duration-short1: 150ms`, `--md-sys-motion-duration-short2: 200ms`, `--md-sys-motion-duration-medium1: 250ms`, `--md-sys-motion-duration-medium2: 300ms`. Used for: hover (150ms), focus ring (150ms), nav-link background (200ms), button color (150ms), card shadow (200ms), view-toggle pill (200ms). The refresh icon's 400ms spin rotation is preserved (not a state-layer motion).

**D8. Drop the `backdrop-filter` blur and the radial-gradient backgrounds on `.main-content` and `.api-spec-page`.**
Material 3 dark surfaces are flat with subtle elevation. The radial gradients were a glassmorphism signature. M3 uses a solid `surface` color and a small `surface-container` tint for layered surfaces. Card backgrounds become `var(--md-sys-color-surface-container)` with elevation 1 (`box-shadow: var(--md-sys-elevation-1)`).

**D9. Sidebar uses a darker surface tint (`surface-container-low`), main content uses `surface`.**
This mirrors the M3 "navigation rail" / "app bar" pattern: the rail sits on a slightly darker shade than the content area. The Krokis sidebar currently uses `--bg-secondary: #131b2e` (lighter than `--bg-primary: #0b0f19`); we invert that so the sidebar is the *darker* surface and the content is the lighter one, which is the M3 norm.

**D10. No em-dash and no Tailwind in any committed code.**
Aesthetic constraint, no-op for the implementation.

## Risks / Trade-offs

- [R: Roboto has wider letterforms than Open Sans, so existing one-line code/identifier labels may wrap where they didn't before] → Mitigation: spot-check `.change-detail-head h2`, `.wiki-nav-source`, `.api-spec-name` and the `view-toggle-btn` labels. If anything wraps badly, allow `text-overflow: ellipsis` (already used for `.api-spec-name`) or `white-space: nowrap`.
- [R: Material 3 primary blue is brighter than the current `--accent: #3b82f6`; some links and badges that depended on the deeper blue may look "louder"] → Mitigation: keep `--md-sys-color-primary` set to `#82b1ff` (M3 dark primary on blue) and re-test the active nav link, the API spec badge link, and the back-link. If anything is over-bright, drop the opacity on the surface tint rather than the color itself.
- [R: Dropping `backdrop-filter` reduces visual flair and may feel "flatter"] → Mitigation: use the elevation 1-3 shadow tokens and the `surface-container` tint to create a sense of depth. The dashboard already uses subtle drop shadows; this just makes them proper Material elevation instead of a single hardcoded value.
- [R: State layers via `::before` require `position: relative; overflow: hidden;` on interactive elements, which can clip rounded corners if not careful] → Mitigation: only apply the overlay pattern to elements that already have explicit `border-radius`; the overlay is the same shape, so the rounded corners survive.
- [R: No light theme — if the user wants one later, the entire token set needs to be revisited] → Mitigation: leave a comment in `web/tokens.css` and `DESIGN.md` that light mode is a follow-up. The current design explicitly scopes to dark mode.
- [R: Google Fonts becomes a hard runtime dependency; offline use shows fallback font] → Mitigation: this is already true today (Open Sans, JetBrains Mono). No change in posture.

## Migration Plan

Single deploy: the change is purely CSS + one HTML link. No data migration, no rollback data, no schema change.

Steps:
1. Add `web/tokens.css` with the Material 3 token set.
2. Edit `web/index.html` to load `web/tokens.css` and to swap Open Sans for Roboto in the Google Fonts request.
3. Refactor `web/styles.css` to consume the new tokens. Class names are preserved.
4. Update `DESIGN.md` to document the new system.
5. Run `make dev` and visually verify: sidebar, cards, buttons, nav links, code blocks, tables, blockquotes, API spec chrome, view toggle.
6. Run `make validate` to confirm no spec drift.
7. Commit per the project's per-change commit discipline.

Rollback: revert the commit. No data is touched.

## Open Questions

(none)
