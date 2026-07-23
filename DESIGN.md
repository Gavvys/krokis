# Design System & UX Conventions

Krokis visual dashboard adopts the Material 3 dark theme using design tokens defined in `web/tokens.css`. Roboto is the body and heading font; JetBrains Mono is reserved for code, commit hashes, and identifiers. Surfaces rely on solid M3 surface colors and elevation; the dashboard does not use glassmorphism, radial gradients, or `backdrop-filter` blur.

## Token source

`web/tokens.css` is the single source of truth. It defines seven categories:

- **Color** (`--md-sys-color-*`): primary, on-primary, primary-container, on-primary-container; secondary, on-secondary, secondary-container, on-secondary-container; tertiary, on-tertiary, tertiary-container, on-tertiary-container; error, on-error, error-container, on-error-container; background, on-background; surface, on-surface; surface-variant, on-surface-variant; surface-container-lowest, surface-container-low, surface-container, surface-container-high, surface-container-highest; outline, outline-variant; scrim, shadow; inverse-surface, inverse-on-surface, inverse-primary.
- **Typography** (`--md-sys-typescale-*`): font families (Roboto + JetBrains Mono), display/headline/title/body/label sizes for large/medium/small.
- **Shape** (`--md-sys-shape-corner-*`): none, extra-small (4px), small (8px), medium (12px), large (16px), extra-large (28px), full (9999px).
- **Elevation** (`--md-sys-elevation-1` through `-5`): M3 5-level box-shadow tokens.
- **Motion** (`--md-sys-motion-easing-*`, `--md-sys-motion-duration-*`): standard/emphasized/decelerate/accelerate easing curves; short1/short2/short3/short4/medium1/medium2/long1/long2 durations.
- **State layers** (`--md-sys-state-*`): hover 0.08, focus 0.10, pressed 0.12, dragged 0.16. Applied via a `::before` overlay at `z-index: -1` on interactive elements.
- **Spacing** (`--md-sys-spacing-*`): 4dp grid (1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 7=28, 8=32, 10=40, 12=48, 16=64).

`web/styles.css` and the shadow-DOM styles inside `web/components/*.js` consume these tokens directly. Because CSS custom properties pierce shadow DOM boundaries, the same tokens are reachable from inside Web Components.

## Visual Palette

- **Backgrounds**:
    *   Surface: `#121316` (M3 dark surface, used by the main content area).
    *   Surface container low: `#1a1c1f` (M3 nav-rail surface, used by the sidebar).
    *   Surface container: `#1e2024` (M3 card surface, used by `.section-card` and component panels).
- **Accents**:
    *   Primary: `#82b1ff` (M3 dark primary on blue). Used for interactive accents, links, active states, and the brand color.
    *   Primary container: `#00468f` (used as the background of active nav links and badges).
- **Status Indicators**:
    *   Tertiary (tip / attention): `#c8b8ff`.
    *   Error (caution / danger): `#ffb4ab` (text) on `#93000a` (container).
    *   Secondary (covered / success): `#b4c6ff` (text) on `#324a82` (container).
- **Borders**:
    *   Outline variant: `#44474f` (standard separator).
    *   Outline: `#8e9099` (interactive element border, e.g. outlined button).

## Typography

- **Body and headings**: `Roboto` from Google Fonts (weights 300, 400, 500, 700).
- **Code and identifiers**: `JetBrains Mono` from Google Fonts (weights 400, 500).
- **Type scale**: M3 `body-medium` (14px / 20px) for default body, `title-medium` (16px / 24px / 600) for card headings, `title-large` (22px / 28px / 500) for the sidebar logo, `label-small` (11px / 16px / 600 / 0.5px tracking) for nav section headers.

## Layout & Components

- **Sidebar**: Width `280px`, sits on `--md-sys-color-surface-container-low` (darker than the main content). The M3 navigation-rail pattern.
- **Main content**: Sits on `--md-sys-color-surface`. No radial gradients.
- **Cards**: `.section-card` and component panels use `--md-sys-color-surface-container` with `box-shadow: var(--md-sys-elevation-1)`. Hovering raises them to `--md-sys-elevation-2`.
- **Buttons**: Pill shape (`--md-sys-shape-corner-full`) on `.btn` and `.btn-secondary`. M3 state layers (8% / 12% / 16% primary overlay) are applied via `::before` for hover, focus, and pressed.
- **Nav links**: M3 list-item shape (`--md-sys-shape-corner-full`), label-large text, state-layer overlay. The active state uses `--md-sys-color-primary-container` as the background and `--md-sys-color-on-primary-container` as the text.
- **Icon button**: M3 icon-button size (40x40), fully-rounded shape, state-layer overlay. The refresh icon's 400ms spin rotation is the only animation that does not bind to a motion token.
- **Markdown body**: Headings use the M3 title scale, paragraphs use `body-large` (16px / 24px) at `var(--md-sys-color-on-surface-variant)`. Inline `code` uses `var(--md-sys-color-surface-container-high)` as background and `var(--md-sys-color-primary)` as text. Tables use M3 surface-container and outline-variant borders.
- **RapiDoc OpenAPI Spec Panel**: `bg-color="#121316"`, `text-color="#e3e2e6"`, `primary-color="#82b1ff"` to match the M3 dark theme. Wrapped in `.api-spec-frame` (M3 surface-container + elevation-2).

## Motion

- **Standard easing**: `cubic-bezier(0.2, 0, 0, 1)` (M3 standard curve).
- **Default durations**: 150ms (hover, focus), 200ms (color, background, shadow), 250-300ms (medium transitions).
- **The only non-token motion**: the refresh icon's 400ms spin (brand animation, not a state transition).

## Light mode

Out of scope. The dashboard is dark-mode only. Adding a light theme is a follow-up change that would require a parallel set of light-mode color tokens and a toggle or `prefers-color-scheme` handler.
