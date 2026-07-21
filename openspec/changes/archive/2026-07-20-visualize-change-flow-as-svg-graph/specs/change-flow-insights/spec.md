# change-flow-insights Specification (delta)

## MODIFIED Requirements

### Requirement: Report planning health honestly
Krokis SHALL report each change's required-artifact presence and checked versus unchecked Markdown task counts when `tasks.md` exists. Krokis SHALL label this evidence as planning health and SHALL NOT label it as successful OpenSpec validation. The dashboard change detail view SHALL also expose the same artifact-presence and task-count evidence as nodes and badges inside the change-flow graph, so users can see planning health without leaving the graph view.

#### Scenario: Active change has unfinished tasks
- **WHEN** an active change contains a `tasks.md` file with both checked and unchecked task items
- **THEN** its planning-health data reports both counts and identifies the task artifact as present, and the change-flow graph's tasks node displays a `done/total` badge derived from those counts

#### Scenario: Change lacks a task artifact
- **WHEN** a discovered change has no `tasks.md` file
- **THEN** its planning-health data identifies the task artifact as absent and reports task counts as unavailable, and the change-flow graph's tasks node displays the badge `—`
