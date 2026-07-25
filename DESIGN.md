# Design System & UX Conventions

Krokis visual dashboard adopts classic **MUI v5 (Material 2)** aesthetics using design tokens defined in `web/tokens.css`. PT Sans is the body, heading, and button font; JetBrains Mono is reserved for code, commit hashes, and identifiers. Surfaces rely on classic elevated Paper cards with crisp drop shadows and 4px corner radiuses.

## Token source

`web/tokens.css` is the single source of truth. It defines seven categories:

- **Color** (`--md-sys-color-*`): MUI dark/light primary (`#90caf9` / `#1976d2`), secondary (`#ce93d8` / `#9c27b0`), background (`#121212` / `#f5f5f5`), surface/paper elevations (`#121212`, `#1e1e1e`, `#232323`, `#2c2c2c`, `#383838`), outline borders (`rgba(255,255,255,0.23)` / `rgba(0,0,0,0.23)`).
- **Typography** (`--md-sys-typescale-*`): PT Sans family + JetBrains Mono, MUI v5 type scale (h1-h6, subtitle1/2, body1/2, button, caption).
- **Shape** (`--md-sys-shape-corner-*`): none (0px), extra-small (2px), small (4px - MUI Paper standard), medium (6px), large (8px), full (9999px).
- **Elevation** (`--md-sys-elevation-1` through `-5`): Classic MUI 24-step elevation box-shadow tokens.
- **Motion** (`--md-sys-motion-easing-*`, `--md-sys-motion-duration-*`): MUI standard easing (`cubic-bezier(0.4, 0, 0.2, 1)`); short (150ms-250ms) and medium (250ms-300ms) durations.
- **State layers** (`--md-sys-state-*`): hover 0.08, focus 0.12, pressed 0.16.
- **Spacing** (`--md-sys-spacing-*`): 8dp grid scale.

`web/styles.css` and component shadow-DOM styles consume these tokens directly.

## Visual Palette

Dark theme is the default; light theme values match MUI v5 light palette.

- **Backgrounds**:
    *   Base background: dark `#121212` / light `#f5f5f5`.
    *   Paper 1dp (sidebar / surface-container-low): dark `#1e1e1e` / light `#fafafa`.
    *   Paper 2dp (card surface / section-card): dark `#232323` / light `#ffffff`.
    *   Paper 4dp (active container / dropdown menu): dark `#2c2c2c` / light `#f5f5f5`.
- **Accents**:
    *   Primary: dark `#90caf9` (MUI blue 200) / light `#1976d2` (MUI blue 700).
    *   Primary container: dark `#1976d2` / light `#e3f2fd`.
- **Borders**:
    *   Outline / Paper border: `rgba(255, 255, 255, 0.23)` in dark mode / `rgba(0, 0, 0, 0.23)` in light mode.

## Typography & Components

- **Font**: PT Sans (headings & body) + JetBrains Mono (monospace).
- **Buttons**: Uppercase button text (`text-transform: uppercase`), 4px corner radius (`--md-sys-shape-corner-small`), raised paper shadow (`--md-sys-elevation-1`).
- **Cards & Papers**: `.section-card`, `<project-selector>`, and dialog panels use 4px corner radius with classic MUI elevation box-shadows.
- **Tables**: MUI Basic Table pattern — Paper shell (`border` + 4px radius + elevation-1), horizontal dividers only, no vertical grid, no zebra striping, 16px cell padding, header weight 500 / body weight 400, numeric columns right-aligned when applicable.
- **Nav Links**: 4px corner radius, PT Sans medium typography, hover state layer.
