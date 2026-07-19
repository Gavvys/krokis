## Why

To establish consistent coordination guidelines and long-term spec durability, we must align the Krokis workspace with the global constitutional artifact structure. Separating global references from change-level details ensures stable execution and prevents drift across tasks.

## What Changes

- Modify `openspec/config.yaml` to define root-level reference context and custom artifact rules.
- Create global, uppercase root references:
  - `AGENTS.md`: Outlines agent role boundaries, instructions, and order of precedence.
  - `PRODUCT.md`: Outlines product intent, core philosophy, and feature scope.
  - `ARCHITECTURE.md`: Logs high-level architecture bounds, embedding layout, and routing.
  - `DESIGN.md`: Logs styling guides, Open Sans rules, and glassmorphic colors.
  - `ROADMAP.md`: Declares commitment-based horizons (Now, Queued, Exploring, Parked).
  - `PROJECT_MEMORY.md`: Logs established decisions with dates.
- Rename `.agent/` to `.agents/` to conform to standard plural formatting.
- Scaffold the `roadmap-coordination` agent skill under `.agents/skills/`.

## Capabilities

### New Capabilities

- `workspace-alignment`: Establishes the constitutional file structures and updates OpenSpec configurations.
- `roadmap-coordination`: Adds the roadmap agent coordination skill to `.agents/skills/`.

### Modified Capabilities

- `cli-core`: Ensures the `krokis init` command prioritizes `.agents/` and checks `.agent/` fallback.

## Impact

Standardizes the project structure and updates skill directories. The Go CLI will read/write skills in the correct standard path.
