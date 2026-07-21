## Context

Krokis ships seven Web Components that all repeat the same Web Component boilerplate (`attachShadow`, `set data`, `connectedCallback → render`, `disconnectedCallback`, `escape`). It also has a long `if/else` chain in `handleRoute` and four page renderers that share a four-line pattern. This change consolidates the duplication into a small base class and a tiny facade, with no behavior change.

## Goals / Non-Goals

**Goals:**
- Add `web/components/_base.js` with a `KrokisElement` base class.
- Refactor all 7 existing components to extend `KrokisElement` and drop the boilerplate. Each component keeps its own `render()` and any component-specific helpers.
- Add a `mountPage(container, opts)` facade in `web/app.js` and convert the four single-element page renderers to use it.
- Convert `handleRoute` to a table-driven router with a `routes[]` array and a single dispatcher. Keep the legacy URL redirect as a small pre-dispatch table.
- No new routes, no new tags, no new payload fields, no behavior change.

**Non-Goals:**
- No new external library. No build step. No bundler.
- No changes to backend, payload, or OpenAPI.
- No changes to per-change detail page or wiki renderer (they are richer than the facade should absorb).

## Decisions

- **Base class as constructor + setters + theme listener, not as a renderer helper.** Each subclass still defines its own `render()` and any component-specific helpers. The base class is a thin Template Method that removes duplication, not a framework. The `mode` setter exists so subclasses like `Changes` can opt into mode-driven rendering without needing to declare their own setter.
- **Base class loaded before every other component.** `web/index.html` adds `<script src="/components/_base.js"></script>` immediately before the other component scripts so `KrokisElement` is defined first. Each subclass script is loaded as a non-module classic script (matching the existing style) and refers to the global `KrokisElement` directly.
- **No `static get observedAttributes()`.** The components do not react to HTML attributes; they react to `data` and `mode` property assignments. Adding observedAttributes would complicate the refactor with no current consumer.
- **`mountPage` shape.** The facade accepts `{tag, title, subtitle, mode, maxWidth, extraMounts}`. `maxWidth` is a string forwarded to the inline `style` of the section card so each page keeps its current width. `extraMounts(container)` is a callback used by the cadence page to append the heatmap after the primary `task-cadence` element.
- **Route table shape.** Each entry has `match(hash)` returning either `null` (no match) or a params object. The dispatcher iterates and uses the first match. The wiki route uses a regex; the change-detail route captures the name. The legacy URL rewrite is a separate small table at the top of `handleRoute` that runs first.
- **No removal of `customElements.define` for the `flow-insights` alias.** It already uses a subclassed `FlowInsightsAlias extends Changes`; this change touches `Changes` only via the base class extension, which preserves the alias as-is.

## Risks / Trade-offs

- **Theme listener subscription leaks if a subclass forgets `disconnectedCallback`** → Mitigation: the base class handles both `connectedCallback` and `disconnectedCallback` so subclasses get the right behavior by default. Subclasses that need their own callbacks must call `super.connectedCallback()` / `super.disconnectedCallback()`.
- **Route table introduces a tiny indirection** → Mitigation: the table is plain JS, no router library, and the dispatcher is ~6 lines. Adding a route stays a one-entry change.
- **`mountPage` may tempt callers to push too much logic into `extraMounts`** → Mitigation: keep `extraMounts` for "append another element to the same inner container". Anything that needs a fully different layout stays its own renderer.

## Migration Plan

1. Create `web/components/_base.js` with `KrokisElement`.
2. Refactor each of the 7 components to extend `KrokisElement` and delete the now-duplicated code.
3. Add `mountPage` to `web/app.js`; rewrite `renderHealthPage`, `renderCadencePage`, `renderChangesPage`, `renderArchivedPage` to call it.
4. Replace the `if/else` chain in `handleRoute` with a `routes[]` table and a dispatcher. Keep the legacy URL rewrite table at the top.
5. Update `web/index.html` to load `_base.js` first.
6. Verify in browser via `playwright-cli` (load `/`, `#/changes`, `#/changes/archived`, `#/insights/cadence`, `#/insights/health`, `#/changes/<name>`, `#/wiki/USER_MANUAL`); confirm zero console errors and the same visible output.
7. Run `openspec validate --all --strict`, `go build`, `go test`.
8. Update `ARCHITECTURE.md` and `PROJECT_MEMORY.md`.

## Open Questions

- Should `mountPage` be a named export or just a top-level function? Default: top-level function, matching the existing `renderXxx` style.
- Should the routes table live in a new `web/routes.js` file? Default: keep it in `app.js` to avoid file sprawl at this scale; split later if it grows past ~15 routes.
