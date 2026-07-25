## ADDED Requirements

### Requirement: Theme attribute on document root
The dashboard SHALL set a `data-theme` attribute on the `<html>` element. The attribute SHALL be either `"dark"` or `"light"`. When the attribute is absent the dashboard SHALL behave as if `data-theme="dark"` is set. The inline script in `<head>` SHALL set the attribute before any stylesheet loads, so the resolved theme is correct on first paint.

#### Scenario: Default theme is dark
- **WHEN** a user visits the dashboard for the first time with no `krokis.theme` value in `localStorage`
- **THEN** `data-theme="dark"` is set on `<html>` before the dashboard renders and the M3 dark token set is applied

#### Scenario: Persisted light theme is restored
- **WHEN** a user returns with `localStorage.krokis.theme === "light"`
- **THEN** `data-theme="light"` is set on `<html>` before the dashboard renders and the M3 light token set is applied with no flash of dark theme

#### Scenario: Missing attribute behaves as dark
- **WHEN** a script removes the `data-theme` attribute at runtime
- **THEN** the dashboard continues to render with the M3 dark token set

### Requirement: Theme toggle button
The dashboard SHALL render a theme toggle button in the sidebar header, next to the existing refresh button. The button SHALL be a plain `<button class="icon-btn" id="theme-toggle">`. In dark mode the button SHALL show a sun icon and its `aria-label` SHALL be `Switch to light theme`. In light mode the button SHALL show a moon icon and its `aria-label` SHALL be `Switch to dark theme`.

#### Scenario: Toggle visible in sidebar
- **WHEN** the dashboard renders any route
- **THEN** the sidebar header contains a `#theme-toggle` button alongside the existing `#refresh-btn`

#### Scenario: Dark mode shows sun icon
- **WHEN** `data-theme` is `dark` or absent
- **THEN** the toggle button's sun icon is visible and the moon icon is hidden

#### Scenario: Light mode shows moon icon
- **WHEN** `data-theme` is `light`
- **THEN** the toggle button's moon icon is visible and the sun icon is hidden

### Requirement: Theme toggle behavior
Clicking the toggle button SHALL write the new theme to `localStorage.krokis.theme`, set `data-theme` on `<html>`, and dispatch a `themechange` event on `document`. The new theme SHALL be the opposite of the current theme. If `localStorage` is unavailable, the in-memory change SHALL still apply for the current session.

#### Scenario: Click in dark mode
- **WHEN** the dashboard is in dark mode and the user clicks the toggle
- **THEN** `data-theme` becomes `light`, `localStorage.krokis.theme` is set to `"light"`, and a `themechange` event is dispatched on `document`

#### Scenario: Click in light mode
- **WHEN** the dashboard is in light mode and the user clicks the toggle
- **THEN** `data-theme` becomes `dark`, `localStorage.krokis.theme` is set to `"dark"`, and a `themechange` event is dispatched on `document`

#### Scenario: localStorage unavailable
- **WHEN** the dashboard is in dark mode, the user clicks the toggle, and `localStorage.setItem` throws
- **THEN** `data-theme` becomes `light` for the current session, the icon swaps, and no exception is logged

### Requirement: Components re-render on theme change
Every `KrokisElement` Web Component SHALL re-run its `render()` method when a `themechange` event is dispatched on `document`. The base class `KrokisElement` already wires this listener; new components SHALL NOT need to do anything extra to participate. CSS custom properties inside the shadow DOM SHALL update automatically because the cascade re-resolves `var(--md-sys-color-*)` references when `:root` changes.

#### Scenario: Theme change updates the heatmap
- **WHEN** a `<commit-heatmap>` is visible and the user switches from dark to light
- **THEN** the heatmap re-renders with the light M3 surface colors and the `themechange` event triggers the existing `_onThemeChange` listener

#### Scenario: Theme change updates RapiDoc
- **WHEN** the user is on `#/insights/openapi` and switches theme
- **THEN** the `<rapi-doc>` element's `bg-color`, `text-color`, `primary-color`, `nav-bg-color`, `nav-text-color`, `nav-hover-bg-color`, and `nav-hover-text-color` attributes are updated to the active theme's values
