## 1. Indexing Logic and Command

- [x] 1.1 Implement metadata parsing and index page compilation in `internal/wiki/indexer.go`
- [x] 1.2 Implement the `krokis wiki index` command in `internal/cmd/wiki_index.go`
- [x] 1.3 Trigger automatic indexing in `initCmd`, `serveCmd`, `insightsCmd`, and `wikiCreateCmd` handlers

## 2. Dashboard Integration

- [x] 2.1 Update `web/app.js` default redirect routing to favor `WIKI_INDEX` over `USER_MANUAL` if available
- [x] 2.2 Filter out `WIKI_INDEX` from the dynamic wiki sidebar link list in `web/app.js`
- [x] 2.3 Verify compilation, run `krokis wiki index`, and inspect output layout
