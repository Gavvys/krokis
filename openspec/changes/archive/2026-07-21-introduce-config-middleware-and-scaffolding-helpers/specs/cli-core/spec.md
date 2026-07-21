# cli-core Specification (delta)

## ADDED Requirements

### Requirement: CLI command structure
Every Krokis CLI subcommand SHALL be defined as a `cobra.Command` with a `Run` function. When the command needs the loaded `config.Config`, the `Run` function SHALL call `cmd.loadConfigOrDie()` as its first line. The helper centralizes the load-or-die behavior so each command no longer inlines `config.Load()` plus its own error branch.

#### Scenario: Command uses the helper
- **WHEN** a CLI command needs the config
- **THEN** it calls `loadConfigOrDie()` once at the top of its `Run` function and uses the returned config
