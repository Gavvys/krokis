---
name: roadmap-workflow
description: How to maintain ROADMAP.md using the Now, Queued, Exploring, and Parked horizons.
---

# Roadmap workflow

Use this workflow when the user wants to record a future product direction, re-prioritise work, or refresh the roadmap.

## Horizons

Krokis uses a commitment-based roadmap, not a calendar. The horizons are:

- **Now** — the current focus. Normally tied to an active OpenSpec change. Exactly one Now item at a time, or a small cluster when the work is in flight.
- **Queued** — committed next work. The outcome is understood, the dependencies are acceptable, and a reasonable agent could pick it up next.
- **Exploring** — plausible direction that still needs discovery, user check-in, or technical validation. Not yet a commitment.
- **Parked** — passive idea bank. No commitment, no tasks. A place to record things the user mentioned once and never re-prioritised.

## When to update

- An active OpenSpec change moves from proposal to implementation → set the change as Now.
- A change archives → move it out of Now and either retire it from the roadmap or move it to a Shipped section.
- A new idea surfaces → drop it in Exploring or Parked and check back later.
- The user says "let's commit to X next" → promote X from Exploring to Queued.

## How to update

Edit `ROADMAP.md` directly. Each horizon is a top-level heading (`## Now`, `## Queued`, `## Exploring`, `## Parked`). Items under a horizon are bullet points or short sub-bullets, each linking to a spec, change, or wiki article.

## Common pitfalls

- Do not put a "Now" item without a matching active OpenSpec change; readers will look for the proposal and find nothing.
- Do not let Exploring become a dumping ground. Move ideas to Queued once they have a clear outcome, or to Parked if they are not actionable soon.
- Do not use a timeline ("Q3 2026", "next sprint") as the primary ordering. Use horizons and let the user re-order them.
