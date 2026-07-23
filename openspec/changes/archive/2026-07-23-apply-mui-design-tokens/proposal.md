## Why

The Krokis dashboard currently uses an ad-hoc dark theme built on Open Sans and frosted glassmorphism. The visual system has no documented tokens, drifts easily, and does not feel like a polished material product. The user wants the dashboard to adopt Material UI's design language (Roboto, Material 3 surfaces, motion, and elevation) to give Krokis a recognizable, professional look. Wiring in actual MUI/React would require a build step and a rewrite of every Web Component off the `KrokisElement` base class, which violates the project's zero-build, zero-framework discipline. The bounded outcome is to copy MUI's design tokens (colors, type scale, shape, elevation, motion, state layers) into a `web/tokens.css` and refactor `web/styles.css` to consume them, leaving the Web Component architecture untouched.

## What Changes

- Add `web/tokens.css` containing Material 3 design tokens as CSS custom properties (color, typography, shape, elevation, motion, state layers, spacing).
- Refactor `web/styles.css` to consume the new tokens. Remove the Open Sans / glassmorphism style and replace it with Material 3 surfaces, elevation, and motion. No CSS class names change, so no markup or Web Component logic is touched.
- Update `web/index.html` to load `web/tokens.css` before `web/styles.css` and to swap the Open Sans Google Fonts request for Roboto.
- Update `DESIGN.md` to document the new Material 3 token set, removing the glassmorphism and Open Sans references.
- Add a `theme` choice (MUI Material 3 by default) to the project-level design so future pages inherit the same tokens.

No breaking changes for users. All visual; the CLI and HTTP behavior are unchanged.

## Capabilities

### New Capabilities

- `mui-design-tokens`: defines the Material 3 design tokens applied across the web dashboard. Covers color (primary/secondary/surface/on-surface/outline/error roles in dark mode), typography (Roboto family with display/headline/title/body/label scale), shape (4/8/12/16/20 corner radii), elevation (1-5 shadow tokens), motion (standard easing + 150/200/250/300ms durations), state layers (8/12/16 percent on interactive surfaces), and 8dp spacing scale.

### Modified Capabilities

- `web-dashboard`: a new requirement is added to the spec mandating that the dashboard consume the Material 3 design tokens defined in the new `mui-design-tokens` capability, including the Roboto family for body/heading text. No existing requirements change. The `web-dashboard` spec captures the *contract that the dashboard uses Material 3*; the *tokens themselves* live in the new `mui-design-tokens` spec to keep the design system independently versioned.

## Impact

- `web/tokens.css` (new)
- `web/styles.css` (refactor to consume tokens)
- `web/index.html` (font request + new stylesheet link)
- `DESIGN.md` (rewrite to document the new system)
- `openspec/specs/mui-design-tokens/spec.md` (new)
- `openspec/specs/web-dashboard/spec.md` (delta: add Material 3 requirement)
- No Go code, CLI commands, or HTTP behavior change.
- No new runtime dependencies; the only network asset added is Roboto from Google Fonts (already loaded for the Open Sans request).
