# Tasks: add read order to Krokis skill and a shared plan-discipline reference

- [x] 1.1 Add a "Read order" block at the top of `internal/cmd/skill_template/krokis/SKILL.md` (before the "What it is for" section) that names each workflow and reference file in the order an agent should read them.
- [x] 1.2 Add `internal/cmd/skill_template/krokis/references/plan-discipline.md` with the seven editorial rules. Frontmatter declares `name: plan-discipline` and the description states the file is required reading before authoring any Krokis plan or OpenSpec change artifact.
- [x] 1.3 Add a one-line "Discipline" pointer at the top of each OpenSpec skill `SKILL.md` under `.agents/skills/openspec-{propose,apply-change,archive-change,explore,update-change,sync-specs}/`. The pointer is placed after the frontmatter and before the description, references `krokis/references/plan-discipline.md`, and does not restate the rules.
- [x] 2.1 Run `openspec validate add-read-order-and-plan-discipline-to-krokis-skill --strict` and resolve any failures.
- [x] 2.2 Run `go build ./...` to confirm the embedded template still compiles.
- [x] 2.3 Manually run `krokis init` in a fresh workspace and confirm `references/plan-discipline.md` is scaffolded.
- [x] 2.4 Update `ARCHITECTURE.md` to mention the shared discipline reference.
- [x] 2.5 Add a `PROJECT_MEMORY.md` decision row.
- [ ] 2.6 Archive the change, commit, and push.
