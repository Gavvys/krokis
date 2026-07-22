# Change: Add evidence-vs-inference discipline rule

## Why

Today the plan discipline says "research before drafting" but does not ask the agent to *label* what it found. Plans blend two kinds of content: claims grounded in a real artifact (a spec section, a code symbol, a documented convention) and claims the agent inferred or assumed. Reviewers cannot tell them apart, so they re-derive the evidence themselves or accept inferred claims as fact. The discipline needs an explicit rule: tag every non-trivial claim as **evidence** or **inference**.

## What Changes

- Add a new rule to `internal/cmd/skill_template/krokis/references/plan-discipline.md` titled **"Evidence vs. inference"** stating:
  - Every non-trivial claim in `proposal.md`, `design.md`, and `tasks.md` must be tagged as either **Evidence** (cited local artifact, file path, online reference, or established convention) or **Inference** (the agent's own reasoning, prediction, or assumption).
  - Use an inline marker such as `[E: <pointer>]` or `[I: <reasoning>]` next to the claim, or group claims under explicit `## Evidence` and `## Inferences` subsections per artifact. Pick one style and use it consistently within an artifact.
  - **Evidence** must include a concrete pointer — a file path with line number, a spec section, a documentation URL, or a named convention. A bare statement with no pointer is **inference**, not evidence.
  - **Inference** is allowed and welcome for predictions, trade-off judgements, and design choices. It just has to be marked so the reviewer can challenge it.
- Update the `plan-discipline` OpenSpec spec to require this tagging as a new requirement, with a scenario asserting that `krokis init`-scaffolded `plan-discipline.md` contains the rule and that the rule is referenced by the OpenSpec skill pointers.
- No code change to `krokis init`; the template file is the source of truth and is embedded via `//go:embed`.

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `plan-discipline`: add a requirement that every non-trivial claim in plan artifacts must be tagged as Evidence or Inference, and the scaffolded discipline file must state this rule.

## Impact

- `internal/cmd/skill_template/krokis/references/plan-discipline.md` (add rule #8)
- `openspec/specs/plan-discipline/spec.md` (delta)
- `PROJECT_MEMORY.md` (one decision row)
