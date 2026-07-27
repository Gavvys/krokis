---
name: plan-discipline
description: The shared discipline every Krokis plan and OpenSpec change artifact follows. Read this before authoring proposal.md, design.md, or tasks.md.
---

# Plan discipline

This document captures the rules every Krokis plan and OpenSpec change artifact follows. Read it before authoring `proposal.md`, `design.md`, `tasks.md`, or any spec. The rules are the same regardless of which skill is producing the artifact.

## 1. Gate thoughtfully

A plan is a richer review surface, not only a tool for giant projects. Use it when the user needs to see, compare, comment on, or approve a direction before code lands. Skip it for truly trivial, unambiguous work — typos, one-line fixes, a single well-specified function, anything whose diff you could describe in one sentence — and just make the change. Never pad a plan with filler and never ship a single-step plan.

## 2. Research before drafting

Read the real files, actions, schema, and patterns first. Name actual files, symbols, and data shapes instead of inventing them. Check existing helpers and components before proposing new ones. Lead with reuse: for each step, name what it reuses — existing functions, schema, components, helpers — before what it adds, so the plan explains the genuinely new delta instead of redescribing what already exists.

## 3. Decide hard-to-reverse bets first

For non-trivial work, sketch where the feature is headed, then call out the decisions that are expensive to undo once data or callers depend on them — wire format, public ids, data-model shape, auth and ownership boundaries, contract names. Get those right in the plan even if most of the feature ships later. Then scope to the smallest first cut that proves the approach without foreclosing it, stating both what is in and what is explicitly deferred.

## 4. Keep the published plan self-contained

A reader who opens the plan from a link with no chat history should understand it. Do not write phrases like "as discussed", "preserve the previous plan", "this revision", "unlike the prior version", or "correction from the earlier plan". Fold the right decisions into the plan as normal objective, architecture, scope, and roadmap prose. Avoid negative framing that only makes sense against absent context; state the positive model directly.

## 5. Plan-read-only until approved

A plan is the approval gate. Make no source edits while building or reviewing the plan. Source edits begin only after the user reviews and approves the direction. Presenting the plan and requesting sign-off is the approval step — do not ask a separate "does this look good?" question.

## 6. Single bottom Open Questions block

Open questions live ONLY at the bottom of the plan as a single `## Open Questions` section. They never appear in the body, never in scattered "decisions" or "tradeoffs" sections, and never duplicated across files. Each question carries a recommended default. Do not include the block if there are no open questions. For a Krokis plan, the proposal and design artifacts may split the questions, but the rule is one block per artifact, never repeated.

## 7. Clarify vs. assume

Do not ask how to build the plan. Explore and present the approach and options in the plan itself. Ask a clarifying question only when an ambiguity would change the design and you cannot resolve it from the code; use the normal ask-user-question flow and batch 2-4 high-leverage questions before finalizing. Otherwise state the assumption explicitly in the plan and proceed, and keep anything unresolved in the single bottom `## Open Questions` block.

## 8. Evidence vs. inference

Every non-trivial claim in `proposal.md`, `design.md`, and `tasks.md` is one of two kinds, and the plan must mark which.

- **Evidence** is a claim grounded in a concrete artifact: a local file path with line number (`web/app.js:142`), a spec section (`openspec/specs/plan-discipline/spec.md`), a code symbol, a documentation URL, or an established convention. A bare statement with no pointer is **not** evidence, even if the agent is "pretty sure" — promote it to inference.
- **Inference** is the agent's own reasoning, prediction, trade-off judgement, or assumption. Inference is allowed and welcome for design choices, predictions, and "I think this is the right call" statements. It just has to be marked so a reviewer can challenge it without having to re-derive the evidence.

Tag inline with `[E: pointer]` or `[I: one-sentence reason]`, OR group claims under `## Evidence` and `## Inferences` subsections per artifact. Pick one style and use it consistently within an artifact. Do not leave high-leverage claims untagged.
