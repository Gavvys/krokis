## ADDED Requirements

### Requirement: Default landing on WIKI_INDEX
The frontend dashboard routing logic MUST check if `WIKI_INDEX` is available, and load it as the default homepage route if present, falling back to `USER_MANUAL`.

#### Scenario: Routing fallback
- **WHEN** client-side dashboard loads without a specific hash route, and `WIKI_INDEX` is listed in the wiki files
- **THEN** system redirects to `#/wiki/WIKI_INDEX`
