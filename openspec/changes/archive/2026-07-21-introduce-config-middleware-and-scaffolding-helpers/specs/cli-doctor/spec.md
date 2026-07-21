# cli-doctor Specification (delta)

## ADDED Requirements

### Requirement: Doctor diagnostics structure
The `krokis doctor` command SHALL run a list of diagnostic checks against the workspace. The command SHALL define its checks as a table of `[]Check{{name, status, message}}` entries so adding a new check is a single table entry. The runner iterates the table, prints each check with the appropriate pass or warning icon, and exits with status 1 if any check has `status: "fail"`.

#### Scenario: All checks pass
- **WHEN** every check in the table has `status: "ok"`
- **THEN** the runner prints every check and exits with status 0

#### Scenario: One check fails
- **WHEN** at least one check has `status: "fail"`
- **THEN** the runner prints every check and exits with status 1
