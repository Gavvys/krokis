## Context

This design outlines the implementation of the Krokis CLI overlay on top of OpenSpec. Krokis acts as an orchestration, wiki, and insights platform for spec-driven workflows.

## Goals / Non-Goals

**Goals:**
- Provide a fast, compiled Go CLI `krokis`.
- Support configuration scaffolding (`krokis init`).
- Standardize a SNAKE_CASE MDX wiki directory (`.krokis/wiki/`).
- Gather Git cadence, test health, and lint telemetry into static JSON and MDX (`krokis insights`).
- Start an embedded local server (`krokis serve`) rendering a highly-polished, dark-mode, glassmorphic visual interface using client-side MDX parsing and native Web Components.
- Scaffold discoverable Agent Skills (`.krokis/skills/`).

**Non-Goals:**
- Cloud databases or user authentication (everything is local, git-backed).
- A rich editing interface (editing is done in standard code editors).
- Dedicated Jujutsu library wrapper (we rely on standard Git compatibility).

## Decisions

### 1. Implementation Language: Go
- **Option A:** Rust (excellent safety, but slower compile times and heavier compile setup).
- **Option B:** Node.js/TypeScript (requires Node runtime to be installed, larger footprint).
- **Option C (Chosen):** Go (fast compilation, native cross-compilation support, simple HTTP server, and built-in filesystem embedding with `go:embed`).

### 2. Frontend Rendering Strategy: Client-Side MDX Parsing via Web Components
- **Option A:** Static Site Generator (Astro/VitePress) (requires Node/npm runtime to compile, violates portable/light footprint goals).
- **Option B (Chosen):** Embedded Single-Page Application (SPA) serving a single HTML/JS/CSS shell. The SPA loads raw `.mdx` files and telemetries via fetch, uses `marked.js` to render standard Markdown, and converts JSX-like tags (e.g., `<MetricsCard ... />`) into registered Custom Elements (Web Components).
  - *Rationale*: Zero runtime dependencies, no build tools, instant startup, fast, and extremely portable.

### 3. Agent Skills Execution Model: Local Shell Scripts + SKILL.md
- **Option A:** Embedded scripting engine (Lua/JS) inside the Go CLI (complex, overkill).
- **Option B (Chosen):** Portable shell scripts under `.krokis/skills/` accompanied by descriptive `SKILL.md` instruction contracts. Agents read the instructions and run the scripts directly using standard tool execution.

## Risks / Trade-offs

### Client-side MDX Parsing Limits
- *Risk*: Client-side rendering may be slower for exceptionally large markdown files.
- *Mitigation*: Wiki files and insights reports are naturally concise and modular. If needed, standard paging/lazy-loading can be added to `app.js`.
