# Design System & UX Conventions

Krokis visual dashboard adopts a high-end, responsive dark-mode theme utilizing glassmorphism styling and clean typography to ensure professional audits.

## Visual Palette

-   **Backgrounds**:
    *   Primary Surface: `#0b0f19` (Deep, authority dark blue-gray).
    *   Secondary Surface: `#131b2e` (Sidebar and card backdrop).
-   **Accents**:
    *   Primary Accent: `#3b82f6` (Vibrant blue).
    *   Accent Gradient: `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`.
-   **Status Indicators**:
    *   Success (Passed): `#10b981` (Emerald green).
    *   Warning: `#f59e0b` (Amber yellow).
    *   Danger (Failed): `#ef4444` (Vibrant red).
-   **Borders**:
    *   Glass Border: `rgba(255, 255, 255, 0.05)`.
    *   Standard Border: `rgba(255, 255, 255, 0.08)`.

## Typography

-   **Primary Interface Font**: **`Open Sans`** (loaded from Google Fonts). Used for headers, menus, labels, and widget values.
-   **Code/Terminal Font**: **`JetBrains Mono`** (loaded from Google Fonts). Used for inline code, markdown pre-blocks, and commit hashes.

## Layout & Components

-   **Sidebar**: Width `280px`, contains Krokis logo, project wiki list, and insights/spec links.
-   **Glassmorphic Cards**: `background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05);`.
-   **RapiDoc OpenAPI Spec Panel**: Styled to match theme (`bg-color="#0b0f19"`, `text-color="#f3f4f6"`, `primary-color="#3b82f6"`). Loaded full-pane with padding `0` to optimize API route scrolling.
