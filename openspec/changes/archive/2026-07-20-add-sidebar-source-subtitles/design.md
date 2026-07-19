## Context

The dashboard sidebar lists wiki page titles but hides source filenames. Root master files and `.krokis/wiki/*.mdx` files already remain canonical in their own locations.

## Goals / Non-Goals

**Goals:**

- Show each wiki page's returned filename below its title.
- Keep the title, route, and source file unchanged.

**Non-Goals:**

- Show subtitles for generated telemetry routes.
- Move or rename wiki or root master files.

## Decisions

Use the filename already returned by `/api/wiki` as subtitle text. Render title and subtitle inside one link so both navigate to the existing page. Apply a muted, lower-opacity style consistent with `DESIGN.md` secondary text.

Alternative: infer filenames from route names. Rejected because root `.md` files and wiki `.mdx` files have different extensions.

## Risks / Trade-offs

- [Long filenames crowd narrow sidebars] → allow subtitle wrapping and preserve readable title text.
