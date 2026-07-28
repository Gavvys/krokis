# Tasks: consolidate scaffolded skills into one krokis skill

- [x] 1.1 Create `src-tauri/src/skill_template.go` with `desktop skill template assets
- [x] 1.2 Create the template tree under `.agents/skills/krokis/` with `SKILL.md`, `workflows/{insights,wiki,roadmap}.md`, `references/{commands,plan-discipline}.md`, and an empty `scripts/` directory.
- [x] 1.3 Rewrite `scaffoldAgentSkills` in workspace scaffolding helpers to walk `krokisSkillFS` and write each file via idempotent file scaffolding.
- [x] 1.4 Delete the three Go-string skill blocks from `scaffoldAgentSkills` so the function is template-driven only.
- [x] 1.5 Update workspace scaffolding tests to assert the new `krokis/SKILL.md` and `krokis/references/plan-discipline.md` paths instead of the legacy skills.
- [x] 1.6 Tighten `.gitignore`: change `krokis` to `/krokis` so the bare-name pattern no longer swallows `.agents/skills/krokis/`.
- [x] 1.7 Delete `.agents/skills/krokis-insights/SKILL.md` and `.agents/skills/krokis-wiki/SKILL.md` from the repo. `roadmap-coordination/SKILL.md` stays.
- [x] 1.8 Update `README.md` to mention the single `krokis` skill and its file layout.
- [x] 2.1 Run `openspec validate consolidate-scaffolded-skills-into-one-krokis-skill --strict`.
- [x] 2.2 Run `cargo check` and `cargo test` and resolve any failures.
- [x] 2.3 Manually run workspace initialization in a fresh temp workspace and confirm `.agents/skills/krokis/{SKILL.md,workflows/*.md,references/*.md}` are scaffolded.
- [x] 2.4 Re-run workspace initialization against the same workspace and confirm files are reported as skipped (idempotent).
- [x] 2.5 Update `PROJECT_MEMORY.md` with a decision row summarising the consolidation.
- [x] 2.6 Archive the change, commit, and push.
