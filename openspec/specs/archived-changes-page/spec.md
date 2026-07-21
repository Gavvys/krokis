# archived-changes-page Specification

## Purpose
TBD - created by archiving change add-archived-changes-page. Update Purpose after archive.
## Requirements
### Requirement: Archived changes sidebar entry
The dashboard sidebar SHALL expose an `Archived` link inside the `Changes` section, listed after `All Changes`, pointing to `#/changes/archived`. The link SHALL be hidden when the local workspace has zero completed changes, and SHALL appear as soon as at least one completed change is present in the local OpenSpec workspace.

#### Scenario: Archived link visible when changes exist
- **WHEN** the dashboard renders the sidebar and the local workspace has at least one completed change
- **THEN** the `Changes` section shows an `Archived` link to `#/changes/archived`

#### Scenario: Archived link hidden when no archived changes exist
- **WHEN** the dashboard renders the sidebar and the local workspace has zero completed changes
- **THEN** the `Changes` section does not show the `Archived` link

### Requirement: Archived changes page lists every completed change
The dashboard SHALL expose a `#/changes/archived` route. The page SHALL render a table with one row per completed change showing its name (linked to `#/changes/<name>`), completion date, cycle time, and planning health. The page SHALL NOT render the active WIP, average cycle time, or monthly throughput cards; those stay on `#/changes`.

#### Scenario: Visiting the Archived page with completed changes
- **WHEN** user visits `#/changes/archived` and the local workspace has completed changes
- **THEN** the dashboard renders one table row per completed change, each name links to `#/changes/<name>`, and the active WIP, average cycle time, and monthly throughput cards are not shown

#### Scenario: Visiting the Archived page with no completed changes
- **WHEN** user visits `#/changes/archived` and the local workspace has zero completed changes
- **THEN** the dashboard shows a `No archived changes yet.` message in place of the table

#### Scenario: Per-change detail still works for archived changes
- **WHEN** user clicks a name on the Archived page
- **THEN** the browser navigates to `#/changes/<name>` and the per-change detail view renders, including the list/graph toggle and the planning health evidence

