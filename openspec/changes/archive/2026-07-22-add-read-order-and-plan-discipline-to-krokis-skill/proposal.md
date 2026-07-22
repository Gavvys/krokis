# Change: Add read order to Krokis skill and a shared plan-discipline reference

## Why

The Krokis skill is the entry point for every agent that touches this project. Today its `SKILL.md` is just an introduction — there is no declared order for which workflow or reference to read first, and there is no shared editorial document that lays out the rules every Krokis plan and OpenSpec change artifact must follow. Two consequences:

1. Agents skim the top of the skill, jump straight to the workflows, and miss the references that govern them. Plans fail `openspec validate` for reasons that would have been obvious if the discipline reference had been read.
2. Each skill (Krokis and the six OpenSpec skills) ends up restating the same rules in its own words, with its own drift. There is no single source of truth for "what does a good plan look like".

The fix is small: declare a read order in the Krokis `SKILL.md`, ship a `references/plan-discipline.md`, and have every OpenSpec skill `SKILL.md` point at the discipline reference rather than re-stating the rules.

## What Changes

- `internal/cmd/skill_template/krokis/SKILL.md` (and its scaffolded copy at `.agents/skills/krokis/SKILL.md` after a fresh `krokis init`) opens with a "Read order" block that names `workflows/insights.md`, `workflows/wiki.md`, `workflows/roadmap.md`, `references/commands.md`, and `references/plan-discipline.md` in the order an agent should read them.
- A new `internal/cmd/skill_template/krokis/references/plan-discipline.md` is added. It captures seven editorial rules every Krokis plan and OpenSpec change artifact follows: gate thoughtfully, research before drafting, decide hard-to-reverse bets first, keep the plan self-contained, plan-read-only until approved, single bottom Open Questions block, clarify vs. assume. The file has its own frontmatter so other skills and agents can find it.
- Every OpenSpec skill `SKILL.md` under `.agents/skills/openspec-{propose,apply-change,archive-change,explore,update-change,sync-specs}/` grows a single line at the top, immediately after the frontmatter, that reads:

  > **Discipline**: read `krokis/references/plan-discipline.md` (in this repo's `.agents/skills/`) before authoring any Krokis plan or OpenSpec change artifact. The discipline is the single source of truth for plan quality.

  The pointer does not restate the rules. The discipline file is the source of truth.

## Capabilities

### New Capabilities
- `plan-discipline`: define the plan-discipline reference as a first-class capability. New requirements assert that the file ships with the Krokis skill and that its content is referenced by the OpenSpec skill pointers.

### Modified Capabilities
- `krokis-skill-layout`: require the `SKILL.md` to open with a "Read order" block that names the workflow files and references in the order an agent should read them.

## Impact

- `internal/cmd/skill_template/krokis/SKILL.md` (add Read order block)
- `internal/cmd/skill_template/krokis/references/plan-discipline.md` (new)
- `.agents/skills/openspec-*/SKILL.md` (6 files gain a one-line Discipline pointer)
- `ARCHITECTURE.md` (one bullet on the shared discipline reference)
- `PROJECT_MEMORY.md` (one decision row)
- `openspec/specs/krokis-skill-layout/spec.md` (delta)
- `openspec/specs/plan-discipline/spec.md` (new)
