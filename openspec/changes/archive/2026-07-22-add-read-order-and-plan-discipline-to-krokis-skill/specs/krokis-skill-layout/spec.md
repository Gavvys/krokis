# Delta Spec: krokis-skill-layout

## ADDED Requirements

### Requirement: SKILL.md opens with a read order
The Krokis skill `SKILL.md` MUST open with a "Read order" block that names each workflow file in `workflows/` and each reference file in `references/`, in the order an agent should read them, before any other prose. The read order MUST come immediately after the document's first heading and before the "What it is for" section.

#### Scenario: Read order names every workflow and reference
- **WHEN** a reviewer inspects `.agents/skills/krokis/SKILL.md` after `krokis init`
- **THEN** the file contains a "Read order" section that lists every `workflows/*.md` and every `references/*.md` file shipped by the template, in a single ordered list
