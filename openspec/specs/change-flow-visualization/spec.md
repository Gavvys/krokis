# change-flow-visualization Specification

## Purpose
TBD - created by archiving change visualize-change-flow-as-svg-graph. Update Purpose after archive.
## Requirements
### Requirement: Render change-flow graph on change detail view
The dashboard SHALL render an SVG change-flow graph on the change detail view when an active change is selected. The graph SHALL display one node per present artifact (proposal, design, spec deltas, tasks) and SHALL connect them with directional edges following the order proposal → design → specs → tasks. Each node SHALL show the artifact name and a presence badge derived from planning-health evidence.

#### Scenario: Change has all four artifacts
- **WHEN** the selected active change contains `proposal.md`, `design.md`, at least one file under `specs/`, and `tasks.md`
- **THEN** the graph renders four nodes connected proposal → design → specs → tasks and each node shows a presence badge with artifact-specific detail

#### Scenario: Change has proposal and tasks only
- **WHEN** the selected active change contains `proposal.md` and `tasks.md` but no `design.md` or `specs/`
- **THEN** the graph renders two nodes connected proposal → tasks and the design and specs nodes are not drawn

#### Scenario: Change has no proposal.md
- **WHEN** the selected change does not contain `proposal.md`
- **THEN** the graph view is not offered and the change detail view falls back to the list view

### Requirement: Toggle between list and graph view
The change detail view SHALL expose a list/graph toggle. The graph view SHALL be the default when the change has a `proposal.md` and at least one other artifact. The selected mode SHALL persist for the session in `localStorage` under `krokis.changeViewMode` and SHALL revert to default on a new selection.

#### Scenario: Default to graph on a populated change
- **WHEN** the user opens a change with `proposal.md` and at least one other artifact and no prior preference is stored
- **THEN** the change detail view opens in graph mode

#### Scenario: Switching back to list view
- **WHEN** the user clicks the list toggle while in graph mode
- **THEN** the graph is hidden, the list is shown, and the preference is stored as `list`

#### Scenario: Reopening a change honors the stored preference
- **WHEN** the user previously selected list mode for a change and reopens that change in the same session
- **THEN** the change detail view opens in list mode

### Requirement: Task progress badge inside the graph
The tasks node SHALL display a badge of the form `done/total` (for example `12/18`) reflecting the planning-health task counts. The badge SHALL show `—` when the tasks artifact is absent.

#### Scenario: Tasks artifact present with mixed state
- **WHEN** the change contains `tasks.md` with 12 checked and 6 unchecked items
- **THEN** the tasks node shows the badge `12/18`

#### Scenario: Tasks artifact absent
- **WHEN** the change has no `tasks.md`
- **THEN** the tasks node shows the badge `—`

### Requirement: Honor Krokis design tokens
The SVG SHALL use the Krokis design tokens (colors, radii, type) defined in `web/styles.css` and SHALL adapt to the active light or dark theme. The component SHALL be a custom element in `web/components/ChangeFlowGraph.js` and SHALL render inline SVG with no external runtime dependencies.

#### Scenario: Theme switch updates graph colors
- **WHEN** the user toggles between light and dark mode while the graph is visible
- **THEN** the graph re-renders with the new theme's tokens

