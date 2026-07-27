## 1. Workspace health diagnostics

- [x] 1.1 Extract workspace health check logic into a reusable diagnostics runner.
- [x] 1.2 Keep diagnostics output structured as a table of name/status/message checks.
- [x] 1.3 Keep diagnostics available after workspace initialization.

## 2. Idempotent workspace scaffolding

- [x] 2.1 Ensure file scaffolding skips existing files and never overwrites user content.
- [x] 2.2 Apply idempotent scaffolding to wiki templates, agent skills, and OpenAPI sample files.
- [x] 2.3 Create missing directories without failing when directories already exist.

## 3. Initialization behavior

- [x] 3.1 Make workspace initialization safe to re-run on partially scaffolded projects.
- [x] 3.2 Optionally run workspace health diagnostics after scaffolding.
- [x] 3.3 Surface a clear success message pointing users to the Krokis desktop app.

## 4. Tests

- [x] 4.1 Add a test that seeds a temp workspace with existing config/wiki files and asserts no overwrites.
- [x] 4.2 Add a test that initializes a fresh temp workspace and asserts required files are created.
- [x] 4.3 Run `cargo test` and `cargo check`.

## 5. Validation and docs

- [x] 5.1 Run `openspec validate --all --strict` and resolve any failures.
- [x] 5.2 Manually initialize this repo twice and confirm the second run is a no-op.
- [x] 5.3 Update `ARCHITECTURE.md` to mention idempotent workspace scaffolding.
- [x] 5.4 Update `README.md` with usage examples for new and existing projects.
- [x] 5.5 Add a `PROJECT_MEMORY.md` decision row.
