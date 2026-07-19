## Context

This change aligns the Krokis workspace with the constitutional OpenSpec usage revision found in `/Users/ksumallo/dev/clinkit/ai-ats`. It introduces global references, updates OpenSpec configurations, renames singular agent paths to plural, and adds the roadmap-coordination skill.

## Goals / Non-Goals

**Goals:**
- Create root-level global reference files (`AGENTS.md`, `PRODUCT.md`, `ARCHITECTURE.md`, `DESIGN.md`, `ROADMAP.md`, `PROJECT_MEMORY.md`).
- Update `openspec/config.yaml` to reflect these global references and add validation rules.
- Rename `.agent/` folder to `.agents/`.
- Scaffold `roadmap-coordination` skill on `krokis init`.

## Decisions

### 1. Global Uppercase References
We will populate the root directory with the following constitution files:
- **`AGENTS.md`**: Defines rules of engagement, durable references, and order of precedence.
- **`PRODUCT.md`**: Logs Krokis core vision, target users, and capabilities.
- **`ARCHITECTURE.md`**: Outlines Go CLI modules, embedded web structure, and API schema paths.
- **`DESIGN.md`**: Outlines design standards (Open Sans, glassmorphism CSS palette, RapiDoc properties).
- **`ROADMAP.md`**: Declares commitment-based horizons (Now, Queued, Exploring, Parked).
- **`PROJECT_MEMORY.md`**: Logs dates and choices made (choosing Go, browser-based compile, etc.).

### 2. OpenSpec Config Update
We will replace the default `openspec/config.yaml` with:
```yaml
schema: spec-driven
context: |
  This project is Krokis, a project management overlay CLI on top of OpenSpec.
  Root-level reference artifacts define durable context:
  AGENTS.md governs contribution process; PRODUCT.md governs product intent;
  ARCHITECTURE.md governs technical architecture; DESIGN.md governs UX;
  PROJECT_MEMORY.md records settled context and decisions.
rules:
  proposal:
    - State the bounded outcome, non-goals, and affected project-level references.
    - Identify conflicts with accepted specs, architecture, design, or product intent.
  specs:
    - Write testable requirements that reflect accepted product intent.
  design:
    - Explain changes to architecture, data flow, or UX conventions and link to the relevant root-level reference.
  tasks:
    - Include updates to affected canonical references when the change is accepted.
```

### 3. Agent Pluralization and Fallback
- We will rename `.agent/` to `.agents/` using git mv.
- The `krokis init` scaffolding command in Go checks for existing directories. If `.agents/` exists or if neither exists, it scaffolds skills in `.agents/skills/`. If only `.agent/` exists, it uses `.agent/skills/`.
