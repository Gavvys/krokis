# Architecture Overview

Krokis runs as a standalone Go binary compiled from `main.go`. It has zero external execution requirements.

## Component Layout

```
/Users/ksumallo/dev/projects/Krokis/
├── main.go                     # Binary entrypoint
├── go.mod                      # Module metadata
├── internal/
│   ├── cmd/                    # Cobra CLI command subcommands (init, serve, insights, wiki)
│   ├── config/                 # config.toml loading, saving, and validation rules
│   ├── metrics/                # Git log parsing, LOC line counting, test/lint parsing
│   ├── wiki/                   # SNAKE_CASE naming audits and wiki listing logic
│   └── web/                    # Embedded web server API router
└── web/                        # Web dashboard client frontend (embedded in Go binary via go:embed)
```

## System Data Flow

1.  **Telemetry Generation (`krokis insights`)**:
    *   Reads `config.toml` to locate QA report outputs.
    *   Runs shell Git commands (`git log`) to parse commit cadence.
    *   Walks the workspace directory, counting lines of code by extension.
    *   Parses JUnit XML and lint JSON data.
    *   Writes report data to `.krokis/insights/health.json` and `.krokis/insights/INDEX.mdx`.
2.  **Dashboard Serving (`krokis serve`)**:
    *   Spins up an HTTP server.
    *   Serves embedded client assets (`web/`).
    *   Exposes endpoints `/api/insights`, `/api/wiki`, and `/api/openapi`.
    *   Routes all unmapped routes to `index.html` (Single-Page Application client routing).
3.  **Client Compilation**:
    *   `app.js` runs a client-side routing check based on URL hash.
    *   Downloads raw MDX documents from the backend and translates JSX tags (`<MetricsCard />`, `<InfoBox>`) to custom HTML Web Components.
    *   Uses CDNs to load `marked.js` and `prism.js` for lightweight browser markdown compilation.
    *   Loads `RapiDoc` dynamically to render OpenAPI specifications served at `/api/openapi`.
