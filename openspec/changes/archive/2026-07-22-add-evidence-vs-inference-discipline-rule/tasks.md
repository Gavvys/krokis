# Tasks: add evidence-vs-inference discipline rule

- [x] 1.1 Add a "## Evidence vs. inference" section to `internal/cmd/skill_template/krokis/references/plan-discipline.md` (source of truth; the repo's `.agents/skills/krokis` is a symlink to the template).
- [x] 1.2 Re-number the existing seven rules so the new rule sits in a logical position.
- [x] 2.1 Run `openspec validate add-evidence-vs-inference-discipline-rule --strict` and resolve any failures.
- [x] 2.2 Run `go build ./...` to confirm the embedded template still compiles.
- [x] 2.3 Manually run `krokis init` in a fresh workspace and confirm the new section is scaffolded.
- [x] 2.4 Update `PROJECT_MEMORY.md` with a one-line decision row.
- [ ] 2.5 Archive the change, commit, and push.
