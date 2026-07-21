# cmd-scaffolding-helper Specification

## Purpose
TBD - created by archiving change introduce-config-middleware-and-scaffolding-helpers. Update Purpose after archive.
## Requirements
### Requirement: loadConfigOrDie helper
The `internal/cmd` package SHALL expose a `loadConfigOrDie()` function that calls `config.Load()` and returns the `*config.Config` on success or prints the error to stderr and calls `os.Exit(1)` on failure. Every CLI command in `internal/cmd/` that needs the config SHALL call this helper at the top of its `Run` function instead of inlining the load-or-die block.

#### Scenario: Config loads successfully
- **WHEN** a CLI command calls `loadConfigOrDie()` and the config file is present and valid
- **THEN** the function returns the loaded `*config.Config` and the command continues

#### Scenario: Config load fails
- **WHEN** a CLI command calls `loadConfigOrDie()` and the config file is missing or invalid
- **THEN** the function prints `Error loading config: <message>` to stderr and exits with status code 1

### Requirement: scaffoldFile helper
The `internal/cmd` package SHALL expose a `scaffoldFile(path, content, label string)` function that writes `content` to `path` only when the file does not already exist on disk, prints a `✓ <label>` success line, and returns any error. The three existing scaffold sites in `init.go` (wiki templates, agent skills, OpenAPI spec) SHALL use the helper.

#### Scenario: File does not exist
- **WHEN** `scaffoldFile` is called and the target path does not exist
- **THEN** the helper writes the content, prints the success line, and returns nil

#### Scenario: File already exists
- **WHEN** `scaffoldFile` is called and the target path already exists
- **THEN** the helper does not write, does not print, and returns nil

#### Scenario: Write fails
- **WHEN** `scaffoldFile` is called and the write fails
- **THEN** the helper returns the underlying error and the caller handles it

