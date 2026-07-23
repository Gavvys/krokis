## ADDED Requirements

### Requirement: Material 3 light token set
The `web/tokens.css` file SHALL define a parallel Material 3 light token set under the `:root[data-theme="light"]` selector. Every token defined for dark SHALL have a light counterpart under that selector with the same name. The light values SHALL be taken from the Material 3 reference light scheme, with the primary key color set to the M3 light primary on blue (`#0b57d0`). The dark token set SHALL remain the default (`:root` selector) so users without JavaScript or with no `localStorage.krokis.theme` value see the dark theme.

#### Scenario: Light theme resolves all tokens
- **WHEN** `data-theme="light"` is set on `<html>`
- **THEN** every `var(--md-sys-*)` reference in `web/styles.css` and in any Web Component's shadow-DOM style resolves to a light value, and no token falls back to its dark-mode default

#### Scenario: Dark theme unchanged
- **WHEN** `data-theme` is absent or set to `dark`
- **THEN** the dark token set under `:root` is applied and the dashboard renders exactly as it did before this change

#### Scenario: No light tokens on dark scope
- **WHEN** `data-theme` is `dark` or absent
- **THEN** `:root[data-theme="light"]` rules do not apply, so the light values do not leak into the dark theme
