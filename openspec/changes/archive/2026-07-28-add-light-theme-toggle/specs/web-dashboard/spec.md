## ADDED Requirements

### Requirement: Dark and light theme toggle
The web dashboard SHALL expose a manual dark/light theme toggle as defined by the `theme-management` capability. The dashboard SHALL default to dark, SHALL persist the user's choice to `localStorage.krokis.theme`, and SHALL set the `data-theme` attribute on `<html>` before any stylesheet loads to prevent a flash of wrong theme on first paint.

#### Scenario: Default dark
- **WHEN** a user visits the dashboard for the first time with no `localStorage.krokis.theme` value
- **THEN** the dashboard renders with the M3 dark token set

#### Scenario: Toggle is reachable
- **WHEN** the dashboard renders any route
- **THEN** the sidebar header contains the theme toggle button defined by the `theme-management` capability

#### Scenario: Light theme applies
- **WHEN** a user clicks the toggle while the dashboard is in dark mode
- **THEN** the M3 light token set takes effect, the user's choice is persisted, and the next reload restores the light theme
