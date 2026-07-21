# krokis-element-base Specification

## Purpose
TBD - created by archiving change introduce-web-component-base-class-and-route-table. Update Purpose after archive.
## Requirements
### Requirement: KrokisElement base class
The dashboard SHALL ship a `KrokisElement` base class in `web/components/_base.js`. The base class SHALL attach an open shadow root in the constructor, expose a `set data(value)` setter that stores the value on a private field and calls `render()`, register a `connectedCallback` that calls `render()` and subscribes to the document `themechange` event (and unsubscribes in `disconnectedCallback`), expose a `themeColor(name, fallback)` helper, expose a `set mode(value)` setter that stores the mode on a private field and calls `render()` so subclasses can opt into mode-driven rendering, expose an `escape(value)` HTML-entity helper, and define an empty `render()` template method that subclasses override.

#### Scenario: Subclass extends KrokisElement
- **WHEN** a component class extends `KrokisElement` and defines a `render()` method
- **THEN** instantiating the element automatically attaches a shadow root, and calling `set data` or `set mode` triggers `render()`

#### Scenario: Subclass omits render
- **WHEN** a subclass extends `KrokisElement` and does not define `render()`
- **THEN** the base class's no-op `render()` runs and the element renders nothing, but no error is thrown

#### Scenario: Theme change triggers re-render
- **WHEN** a `themechange` event is dispatched on `document` while an element derived from `KrokisElement` is in the DOM
- **THEN** the element's `render()` is invoked again with the same data and mode

### Requirement: Existing components extend KrokisElement
The dashboard SHALL refactor every existing Web Component under `web/components/` to extend `KrokisElement` instead of `HTMLElement` directly. The refactor SHALL preserve the visible output and the existing custom-element tag names. The class names inside each file SHALL keep their existing identity (for example `InfoBox`, `MetricsCard`, `Changes`) so the file diff is a clean class-declaration and constructor change.

#### Scenario: Component tags are unchanged
- **WHEN** the dashboard mounts a `<info-box>`, `<metrics-card>`, `<task-cadence>`, `<test-results>`, `<change-list>`, `<change-flow-graph>`, or `<commit-heatmap>` element
- **THEN** the element registers, renders the same output it rendered before the refactor, and exposes the same public properties

#### Scenario: Constructor and shadow DOM are inherited
- **WHEN** a class extends `KrokisElement`
- **THEN** the subclass no longer needs to call `attachShadow` in its own constructor and no longer needs to redeclare the `data` setter, `connectedCallback`, `disconnectedCallback`, or `escape` helper

