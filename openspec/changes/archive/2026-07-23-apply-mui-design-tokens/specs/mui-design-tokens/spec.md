## ADDED Requirements

### Requirement: Material 3 design token set
The project SHALL ship a `web/tokens.css` file that defines the Material 3 design token set as CSS custom properties on `:root`. The token set SHALL include color (primary, on-primary, primary-container, on-primary-container, secondary, on-secondary, secondary-container, on-secondary-container, surface, on-surface, surface-container, surface-container-low, surface-container-high, surface-container-highest, outline, outline-variant, error, on-error), typography (display/headline/title/body/label large/medium/small sizes, weights, and line heights for both regular and Roboto), shape (corner radii for extra-small/small/medium/large/extra-large: 4/8/12/16/28 dp), elevation (1-5 box-shadow tokens for M3 dark), motion (standard easing curve, plus short1/short2/medium1/medium2/long1/long2 durations), state-layer opacities (hover 0.08, focus 0.10, pressed 0.12, dragged 0.16), and a 4dp spacing scale (1=4, 2=8, 3=12, 4=16, 6=24, 8=32, 12=48). Tokens SHALL be prefixed `md-sys-` to keep them distinct from any future project-level tokens.

#### Scenario: Loading tokens.css
- **WHEN** a browser loads any Krokis dashboard page
- **THEN** `web/tokens.css` is fetched before `web/styles.css` and every custom property named `md-sys-*` is defined on `:root`

#### Scenario: Tokens are dark-mode only
- **WHEN** the dashboard is rendered
- **THEN** the token set uses Material 3 dark color values and no light-mode override is provided

### Requirement: Roboto typography
The dashboard SHALL load the Roboto font family from Google Fonts with weights 300, 400, 500, and 700. Body text SHALL use the Roboto regular weight at 14-15px. Headings SHALL use the Roboto medium (500) or bold (700) weight depending on the Material 3 type scale entry. The mono font for code, commit hashes, and identifiers SHALL remain JetBrains Mono.

#### Scenario: Body text uses Roboto
- **WHEN** a paragraph or label renders in the dashboard
- **THEN** its computed `font-family` starts with `Roboto` and the original `Open Sans` family is no longer requested

#### Scenario: Mono surfaces keep JetBrains Mono
- **WHEN** a code block, inline `code`, or commit-hash-style identifier renders
- **THEN** its computed `font-family` is `JetBrains Mono`

### Requirement: Material 3 motion curves
Every CSS `transition` in `web/styles.css` and in the Web Component inline styles SHALL resolve either `var(--md-sys-motion-easing-standard)` or `var(--md-sys-motion-easing-emphasized)` for the timing function, and SHALL use one of the `md-sys-motion-duration-*` tokens for the duration. Transitions on hover, focus, and pressed state layers SHALL use `--md-sys-motion-duration-short1` (150ms). Transitions on color and background SHALL use `--md-sys-motion-duration-short2` (200ms). The dashboard refresh icon's 400ms spin is the only transition not bound to a motion token, because it is a brand animation rather than a state transition.

#### Scenario: Button hover uses standard easing
- **WHEN** the user hovers a `.btn` or `.nav-link`
- **THEN** the visible property change (background, color, border) animates with `cubic-bezier(0.2, 0, 0, 1)` over 150-200ms

#### Scenario: View toggle pill animates
- **WHEN** the user switches between `List` and `Graph` in a change-detail view
- **THEN** the pill position transition uses a Material 3 motion token, not a hand-coded cubic-bezier

### Requirement: State layers on interactive elements
Buttons (`.btn`, `.btn-secondary`, `.icon-btn`), nav links (`.nav-link`, `.wiki-nav-link`, `.api-spec-badge-link`), and the change-detail back link SHALL render an 8% (hover), 10% (focus-visible), and 12% (active/pressed) `::before` overlay of `var(--md-sys-color-primary)`. The overlay SHALL be positioned absolutely to cover the element, start at `opacity: 0`, and transition opacity with `--md-sys-motion-duration-short1` and `--md-sys-motion-easing-standard`. The interactive element SHALL be `position: relative; overflow: hidden;` so the overlay is clipped to its rounded corners.

#### Scenario: Hover on nav link
- **WHEN** the user hovers a `.nav-link` that is not the active link
- **THEN** the primary-color overlay fades to 8% opacity within 150ms and the link's text color lightens to `var(--md-sys-color-on-surface)`

#### Scenario: Pressed on button
- **WHEN** the user holds the mouse button down on a `.btn-secondary`
- **THEN** the primary-color overlay becomes 12% opacity and remains until the pointer is released

#### Scenario: Focus visible
- **WHEN** a user tabs to a `.btn` or `.nav-link`
- **THEN** a focus ring (2px solid `var(--md-sys-color-primary)`) is drawn around the element and the primary-color overlay fades to 10% opacity

### Requirement: Material 3 elevation tokens
The token set SHALL define five elevation levels as CSS custom properties `--md-sys-elevation-1` through `--md-sys-elevation-5`, each a `box-shadow` value matching the Material 3 specification. Cards (`.section-card`) SHALL use `--md-sys-elevation-1`. The API spec frame (`.api-spec-frame`) SHALL use `--md-sys-elevation-2`. Hovering an interactive card SHALL raise it to `--md-sys-elevation-2`. No element SHALL use a hand-coded `box-shadow` that bypasses the elevation tokens.

#### Scenario: Card renders with elevation 1
- **WHEN** a `.section-card` is rendered
- **THEN** its `box-shadow` resolves to `--md-sys-elevation-1` and no `backdrop-filter` is applied

#### Scenario: Card hover raises elevation
- **WHEN** the user hovers a `.section-card` that has an interactive variant
- **THEN** its `box-shadow` transitions to `--md-sys-elevation-2` within 200ms

### Requirement: Material 3 surface colors instead of glassmorphism
The dashboard SHALL use solid Material 3 surface colors instead of `backdrop-filter: blur(...)` and `rgba(255,255,255,0.03)` overlays. The sidebar SHALL sit on `var(--md-sys-color-surface-container-low)`. The main content area SHALL sit on `var(--md-sys-color-surface)`. Cards SHALL sit on `var(--md-sys-color-surface-container)`. The radial-gradient backgrounds on `.main-content` and `.api-spec-page` SHALL be removed; the new surfaces rely on elevation contrast instead.

#### Scenario: Sidebar is darker than main content
- **WHEN** the dashboard is rendered
- **THEN** the sidebar's computed background is darker than the main content's background, matching the M3 navigation-rail pattern

#### Scenario: No backdrop-filter in styles
- **WHEN** `web/styles.css` is searched for `backdrop-filter`
- **THEN** no matches are returned
