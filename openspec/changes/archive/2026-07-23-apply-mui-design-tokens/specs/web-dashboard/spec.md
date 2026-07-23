## ADDED Requirements

### Requirement: Material 3 design tokens
The web dashboard SHALL consume the design token set defined by the `mui-design-tokens` capability. The dashboard SHALL load `web/tokens.css` before any other Krokis stylesheet, SHALL use Roboto for body and heading text, SHALL apply Material 3 surface colors (no glassmorphism), Material 3 elevation (1-5) on cards and panels, Material 3 motion curves and durations on every transition, and Material 3 state layers on every interactive element. Existing CSS class names (`.section-card`, `.btn`, `.btn-secondary`, `.icon-btn`, `.nav-link`, `.wiki-nav-link`, `.api-spec-badge-link`, `.markdown-body`, `.change-detail-*`, `.view-toggle-btn`, etc.) SHALL preserve their names; only the property values they resolve to change. No Web Component, router, or JavaScript logic SHALL be modified to satisfy this requirement.

#### Scenario: Dashboard applies the Material 3 theme
- **WHEN** a user loads any dashboard route after `krokis insights` has run
- **THEN** the visible surfaces, typography, motion, and state-layer behavior all come from `web/tokens.css` rather than the legacy ad-hoc theme

#### Scenario: No glassmorphism remains
- **WHEN** a developer searches `web/` for `backdrop-filter` or `--glass-bg`
- **THEN** no Krokis stylesheet or HTML file contains either token
