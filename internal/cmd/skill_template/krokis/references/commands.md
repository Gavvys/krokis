---
name: commands
description: One-line summary of every krokis CLI command.
---

# Commands

| Command | Purpose |
| --- | --- |
| `krokis init` | Scaffold `.krokis/`, the workspace wiki, the OpenAPI sample, and the consolidated `krokis` skill. Idempotent; auto-runs `krokis doctor`. |
| `krokis doctor` | Validate workspace structure and report missing or misconfigured files. |
| `krokis insights` | Refresh `.krokis/insights/health.json` and start the live dashboard on `:8080`. |
| `krokis serve` | Start the dashboard server without refreshing insights. |
| `krokis wiki create <NAME>` | Create a new SNAKE_CASE `.mdx` wiki article and update `WIKI_INDEX.mdx`. |
| `krokis wiki index` | Rebuild `WIKI_INDEX.mdx` from the current `.mdx` files. |
| `krokis validate` | Validate workspace state and OpenSpec spec consistency. |
| `krokis --help` | Show top-level help and the full command list. |
| `krokis <command> --help` | Show help for a specific command. |

## Flags worth knowing

- `krokis init --verbose` — print every file and directory created.
- `krokis init --skip-doctor` — scaffold without running the doctor check.
- `krokis serve --port 9090` — bind the dashboard to a non-default port.
