# change-flow-insights Specification

## Purpose
Derive local OpenSpec change-flow records from `openspec/changes/` and report team-level flow metrics and planning-health evidence alongside existing Krokis insights telemetry.

## Requirements
### Requirement: Discover local OpenSpec change flow
Krokis SHALL derive change-flow records from the local `openspec/changes/` directory without modifying its contents. An active change record SHALL use the `created` date from its `.openspec.yaml`; an archived change record SHALL use its `.openspec.yaml` creation date and the `YYYY-MM-DD` archive-directory prefix as completion date.

#### Scenario: Active change is discovered
- **WHEN** `krokis insights` runs in a workspace containing `openspec/changes/<change>/.openspec.yaml` with a valid `created` date
- **THEN** the generated telemetry includes that change as active with its name and age in whole calendar days

#### Scenario: Archived change is discovered
- **WHEN** `krokis insights` runs in a workspace containing `openspec/changes/archive/YYYY-MM-DD-<change>/.openspec.yaml` with a valid `created` date
- **THEN** the generated telemetry includes that change as completed with its completion date and cycle time in whole calendar days

#### Scenario: Change date is unavailable
- **WHEN** a discovered active or archived change has a missing or malformed required date
- **THEN** Krokis includes the change record but marks the affected age or cycle-time value unavailable rather than reporting zero

### Requirement: Report team-level flow metrics
Krokis SHALL report active work-in-progress count, completed-change cycle times, and archived-change throughput grouped by archive month. The report SHALL not include per-person rankings, lines-of-code targets, or a single productivity score.

#### Scenario: Reporting archived monthly throughput
- **WHEN** completed changes exist in two or more archive months
- **THEN** the telemetry contains a count for each archive month represented by those changes

#### Scenario: Reporting active work in progress
- **WHEN** two active OpenSpec changes exist
- **THEN** the telemetry reports active work in progress as two

### Requirement: Report planning health honestly
Krokis SHALL report each change's required-artifact presence and checked versus unchecked Markdown task counts when `tasks.md` exists. Krokis SHALL label this evidence as planning health and SHALL NOT label it as successful OpenSpec validation.

#### Scenario: Active change has unfinished tasks
- **WHEN** an active change contains a `tasks.md` file with both checked and unchecked task items
- **THEN** its planning-health data reports both counts and identifies the task artifact as present

#### Scenario: Change lacks a task artifact
- **WHEN** a discovered change has no `tasks.md` file
- **THEN** its planning-health data identifies the task artifact as absent and reports task counts as unavailable