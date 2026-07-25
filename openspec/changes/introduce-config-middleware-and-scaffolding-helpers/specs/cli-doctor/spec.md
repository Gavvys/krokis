# cli-doctor Specification (delta)

## ADDED Requirements

### Requirement: Diagnostics structure
Workspace health diagnostics SHALL run a list of checks against the workspace. Checks SHALL be defined as a table of name/status/message entries so adding a new check is a single table entry.

#### Scenario: All checks pass
- **WHEN** every check in the table has status `ok`
- **THEN** diagnostics report every check as passing

#### Scenario: One check fails
- **WHEN** at least one check has status `fail`
- **THEN** diagnostics report every check and surface the failure
