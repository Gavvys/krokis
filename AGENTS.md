# Project guidance

## Reference artifacts

Read the relevant project-level references before planning, designing, or implementing work. These files are durable project context, not substitutes for OpenSpec artifacts.

| File | Owns |
| --- | --- |
| `PRODUCT.md` | Product vision, philosophy, users, value, scope, and non-goals. |
| `ARCHITECTURE.md` | Current technical architecture, CLI modules, and durable decisions. |
| `DESIGN.md` | Design system, styles (Open Sans, glassmorphism, RapiDoc). |
| `PROJECT_MEMORY.md` | Plain-language record of settled decisions, layouts, and conventions. |
| `ROADMAP.md` | Current strategic horizon: Now, Queued, Exploring, and Parked. |

## OpenSpec

`openspec/config.yaml` configures the local OpenSpec workflow. Follow its rules whenever creating or revising an OpenSpec change.

OpenSpec has a different purpose from the project-level references:

- `openspec/specs/` defines accepted, testable product behavior.
- `openspec/changes/<change>/` defines a bounded proposed change.
- `openspec/changes/archive/` preserves accepted-change history.

## Scope and conflict resolution

Apply this order when sources overlap:

1. Explicit user instructions and this file govern contribution process.
2. `PRODUCT.md` governs product intent and scope.
3. Accepted OpenSpec specs govern current functional behavior.
4. `ARCHITECTURE.md` and `DESIGN.md` govern enduring technical and UX conventions.
5. `PROJECT_MEMORY.md` provides orientation and logs.
6. An active OpenSpec change proposes a revision.

## Roadmap horizons

Use `ROADMAP.md` to organize potential work by commitment, not merely by time:

- **Now**: current focus, normally tied to an active OpenSpec change.
- **Queued**: committed next work with an understood outcome and acceptable dependencies.
- **Exploring**: plausible direction that still needs discovery or evidence.
- **Parked**: idea bank only; has no commitment or task list.

## Shared workflow skills

OpenSpec workflow skills are stored in `.agents/skills/`. `.agent/skills/` is supported as a legacy compatibility fallback.
