## Context

This design hardens Krokis layout structure verification and configuration correctness by introducing schema validation and system health diagnostics commands. It also scaffolds a visual user manual file.

## Goals / Non-Goals

**Goals:**
- Provide config validation to verify config.toml values.
- Provide workspace health diagnostics to check repository environment health.
- Scaffold `USER_MANUAL.mdx` inside `.krokis/wiki/` during workspace initialization.

**Non-Goals:**
- Validating external tool installations (we only check files/layouts in this project).

## Decisions

### 1. Configuration Validation Logic
- **Chosen implementation**: Implement a simple Go structural validator inside `src-tauri/src/validation.go`.
- **Rules**:
  - `Server.Port` must be between `1` and `65535`.
  - `Wiki.Directory` must not be empty.
  - `Insights.Directory` must not be empty.

### 2. Krokis Doctor Logic
- **Chosen implementation**: Add workspace health diagnostics running sequential checks:
  1. Git repository presence check.
  2. Config parsing and correctness check.
  3. Mapped directories existence check.
  4. Test and lint reports presence check (warns if missing).
- Exit codes:
  - Exit code `0` if all required directories and settings are correct.
  - Exit code `1` if critical components (git, config parsing) fail.

### 3. Scaffolding USER_MANUAL.mdx
- We'll append `USER_MANUAL.mdx` to the scaffold mapping in workspace scaffolding helpers. It will contain code blocks showing `<MetricsCard />` and `<InfoBox>` components.
