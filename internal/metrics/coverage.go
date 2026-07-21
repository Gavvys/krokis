package metrics

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"unicode"
)

// CoverageMetrics is the top-level coverage payload emitted by gatherCoverage.
type CoverageMetrics struct {
	Capabilities []CoverageCapability `json:"capabilities"`
}

// CoverageCapability aggregates coverage per local OpenSpec capability.
type CoverageCapability struct {
	Name         string                `json:"name"`
	Requirements int                   `json:"requirements"`
	Covered      int                   `json:"covered"`
	Uncovered    int                   `json:"uncovered"`
	Items        []CoverageRequirement `json:"items"`
}

// CoverageRequirement is the per-requirement coverage record.
type CoverageRequirement struct {
	Name            string   `json:"name"`
	Status          string   `json:"status"` // covered | partial | uncovered
	IdentifierCount int      `json:"identifier_count"`
	MatchedCount    int      `json:"matched_count"`
	MatchedFiles    []string `json:"matched_files"`
}

// maximumMatchedFiles caps the per-requirement matched-files list in the payload.
const maximumMatchedFiles = 3

// stopwords are OpenSpec scaffolding terms and common words we never treat as
// implementation identifiers. Anything that is a single lowercase english word
// shorter than 4 chars, or matches the scaffolding vocabulary, is filtered.
var stopwords = map[string]bool{
	"WHEN": true, "THEN": true, "SHALL": true, "MUST": true, "SHOULD": true,
	"Scenario": true, "Requirement": true, "Requirements": true, "ADDED": true,
	"MODIFIED": true, "REMOVED": true, "RENAMED": true, "Purpose": true,
	"the": true, "and": true, "for": true, "with": true,
	"that": true, "this": true, "from": true, "into": true, "not": true,
	"but": true, "are": true, "has": true, "have": true, "was": true,
	"were": true, "its": true, "all": true, "any": true, "each": true,
	"per": true, "when": true, "then": true, "shall": true, "must": true,
	"should": true, "may": true, "will": true, "case": true, "new": true,
	"one": true, "two": true, "three": true, "list": true, "file": true,
	"files": true, "name": true, "path": true, "dir": true, "data": true,
	"true": true, "false": true, "null": true, "none": true,
	"default": true, "value": true, "field": true, "section": true,
}

var (
	// requirementHeader matches `### Requirement: <name>` lines.
	requirementHeader = regexp.MustCompile(`(?m)^### Requirement:\s*(.+?)\s*$`)
	// fencedCode captures fenced code blocks.
	fencedCode = regexp.MustCompile("(?s)```(?:[^`]|`[^`]|``[^`])*```")
	// customElementTag matches `<kebab-case>` tags (letters/digits/hyphen, must contain a hyphen).
	customElementTag = regexp.MustCompile(`<([a-z][a-z0-9]+(?:-[a-z0-9]+)+)>`)
	// routeHash matches `#/...` paths of length >= 4.
	routeHash = regexp.MustCompile(`#/[a-zA-Z0-9/_\-]+`)
	// backtickSymbol matches `...` content.
	backtickSymbol = regexp.MustCompile("`([^`]+)`")
	// quotedString matches "..." and '...' strings.
	quotedString = regexp.MustCompile(`"([^"]+)"|'([^']+)'`)
	// identifierShape accepts camelCase, PascalCase, snake_case, kebab-case identifiers
	// with at least one letter and overall length >= 3, allowing dots, slashes, hyphens.
	identifierShape = regexp.MustCompile(`^[A-Za-z][A-Za-z0-9._\-/]*$`)
)

// gatherCoverage walks `specsRoot` and the scanned workspace tree at `workspaceRoot`,
// deriving per-capability and per-requirement coverage records. Returns an empty
// CoverageMetrics when no `spec.md` files are found.
func gatherCoverage(specsRoot, workspaceRoot string) CoverageMetrics {
	coverage := CoverageMetrics{Capabilities: []CoverageCapability{}}
	entries, err := os.ReadDir(specsRoot)
	if err != nil {
		return coverage
	}

	// Collect workspace file paths once.
	workspaceFiles := collectWorkspaceFiles(workspaceRoot)

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		specPath := filepath.Join(specsRoot, entry.Name(), "spec.md")
		data, err := os.ReadFile(specPath)
		if err != nil {
			continue
		}
		cap := buildCapability(entry.Name(), string(data), workspaceFiles, workspaceRoot)
		coverage.Capabilities = append(coverage.Capabilities, cap)
	}

	sort.Slice(coverage.Capabilities, func(i, j int) bool {
		return coverage.Capabilities[i].Name < coverage.Capabilities[j].Name
	})
	return coverage
}

// collectWorkspaceFiles returns workspace-relative file paths under
// workspaceRoot, skipping `openspec/`, `.git/`, `node_modules/`, `vendor/`,
// hidden dirs, `tmp/`, and `.air/`.
func collectWorkspaceFiles(workspaceRoot string) []string {
	var files []string
	_ = filepath.Walk(workspaceRoot, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			name := info.Name()
			if path != workspaceRoot {
				if strings.HasPrefix(name, ".") && name != "." {
					return filepath.SkipDir
				}
				if name == "node_modules" || name == "vendor" || name == "openspec" || name == "tmp" || name == ".air" {
					return filepath.SkipDir
				}
			}
			return nil
		}
		if info.Size() == 0 {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		// Scan source-like text files.
		switch ext {
		case ".go", ".js", ".ts", ".tsx", ".jsx", ".md", ".mdx", ".html", ".css", ".toml", ".json", ".yaml", ".yml":
		default:
			return nil
		}
		rel, relErr := filepath.Rel(workspaceRoot, path)
		if relErr == nil {
			files = append(files, filepath.ToSlash(rel))
		}
		return nil
	})
	return files
}

// buildCapability parses one spec.md file into a CoverageCapability.
func buildCapability(name, content string, workspaceFiles []string, workspaceRoot string) CoverageCapability {
	cap := CoverageCapability{Name: name, Items: []CoverageRequirement{}}
	requirements := splitRequirements(content)
	for _, req := range requirements {
		identifiers := extractIdentifiers(req.body)
		matched := scanIdentifiers(identifiers, workspaceFiles, workspaceRoot)
		status := "uncovered"
		switch {
		case matched.matchedCount == len(identifiers) && len(identifiers) > 0:
			status = "covered"
		case matched.matchedCount > 0:
			status = "partial"
		}
		cap.Items = append(cap.Items, CoverageRequirement{
			Name:            req.name,
			Status:          status,
			IdentifierCount: len(identifiers),
			MatchedCount:    matched.matchedCount,
			MatchedFiles:    matched.files,
		})
	}
	cap.Requirements = len(cap.Items)
	for _, item := range cap.Items {
		if item.Status == "covered" || item.Status == "partial" {
			cap.Covered++
		} else {
			cap.Uncovered++
		}
	}
	return cap
}

type requirementBlock struct {
	name string
	body string
}

// splitRequirements splits a spec file into per-requirement blocks using
// `### Requirement:` headers.
func splitRequirements(content string) []requirementBlock {
	indices := requirementHeader.FindAllStringSubmatchIndex(content, -1)
	if len(indices) == 0 {
		return nil
	}
	blocks := make([]requirementBlock, 0, len(indices))
	for i, idx := range indices {
		nameStart, nameEnd := idx[2], idx[3]
		name := strings.TrimSpace(content[nameStart:nameEnd])
		bodyStart := idx[1]
		bodyEnd := len(content)
		if i+1 < len(indices) {
			bodyEnd = indices[i+1][0]
		}
		body := strings.TrimSpace(content[bodyStart:bodyEnd])
		blocks = append(blocks, requirementBlock{name: name, body: body})
	}
	return blocks
}

// extractIdentifiers returns the deduplicated set of identifiers mentioned in a
// requirement body. Identifiers come from fenced code blocks, custom-element
// tags, route hashes, backticked symbols, and quoted strings. Each identifier
// must satisfy the identifier shape regex and must not be a stopword.
func extractIdentifiers(body string) []string {
	raw := map[string]struct{}{}

	// Fenced code blocks: include every whitespace-delimited token.
	for _, block := range fencedCode.FindAllString(body, -1) {
		// Strip the leading and trailing triple backticks.
		inner := strings.TrimPrefix(block, "```")
		inner = strings.TrimSuffix(inner, "```")
		// Drop an optional language tag on the opening fence.
		if newlineIdx := strings.IndexByte(inner, '\n'); newlineIdx >= 0 {
			inner = inner[newlineIdx+1:]
		}
		for _, token := range strings.FieldsFunc(inner, func(r rune) bool {
			return unicode.IsSpace(r) || r == '(' || r == ')' || r == ',' || r == ';' || r == '='
		}) {
			raw[token] = struct{}{}
		}
	}

	// Custom element tags.
	for _, m := range customElementTag.FindAllStringSubmatch(body, -1) {
		raw[m[1]] = struct{}{}
	}

	// Route hashes.
	for _, m := range routeHash.FindAllString(body, -1) {
		raw[m] = struct{}{}
	}

	// Backticked symbols.
	for _, m := range backtickSymbol.FindAllStringSubmatch(body, -1) {
		raw[m[1]] = struct{}{}
	}

	// Quoted strings.
	for _, m := range quotedString.FindAllStringSubmatch(body, -1) {
		if m[1] != "" {
			raw[m[1]] = struct{}{}
		}
		if m[2] != "" {
			raw[m[2]] = struct{}{}
		}
	}

	var identifiers []string
	for token := range raw {
		if !isIdentifier(token) {
			continue
		}
		raw[token] = struct{}{}
		identifiers = append(identifiers, token)
	}
	sort.Strings(identifiers)
	return identifiers
}

// isIdentifier returns true when token is shaped like camelCase, PascalCase,
// snake_case, kebab-case, a route hash, or a file path, is at least 3 chars,
// and is not a stopword. Pure-lowercase english short words are filtered by
// the stopword map.
func isIdentifier(token string) bool {
	if len(token) < 3 {
		return false
	}
	if stopwords[token] {
		return false
	}
	if strings.HasPrefix(token, "#/") {
		return true
	}
	if !identifierShape.MatchString(token) {
		return false
	}
	// Require at least one non-all-lowercase ascii letter, or a structural
	// separator (dot, slash, hyphen, underscore), to avoid treating common
	// english words as identifiers.
	hasSeparator := strings.ContainsAny(token, "./_-")
	hasCase := false
	for _, r := range token {
		if unicode.IsUpper(r) {
			hasCase = true
			break
		}
	}
	if !hasSeparator && !hasCase {
		// all-lowercase, no separators: only allow if it is unusual (len >= 6).
		if len(token) < 6 {
			return false
		}
	}
	return true
}

// scanIdentifiers returns the number of identifiers that appear in any
// workspace file plus the deduplicated, capped list of matched files. Up to
// maximumMatchedFiles workspace-relative paths are returned, chosen in
// lexicographic order over the set of files that contain any identifier.
func scanIdentifiers(identifiers []string, workspaceFiles []string, workspaceRoot string) struct {
	matchedCount int
	files        []string
} {
	matched := map[string]struct{}{}
	matchedFiles := map[string]struct{}{}
	for _, id := range identifiers {
		for _, relPath := range workspaceFiles {
			abs := filepath.Join(workspaceRoot, relPath)
			data, err := os.ReadFile(abs)
			if err != nil {
				continue
			}
			if strings.Contains(string(data), id) {
				matched[id] = struct{}{}
				matchedFiles[relPath] = struct{}{}
			}
		}
	}
	out := struct {
		matchedCount int
		files        []string
	}{matchedCount: len(matched)}
	for f := range matchedFiles {
		out.files = append(out.files, f)
	}
	sort.Strings(out.files)
	if len(out.files) > maximumMatchedFiles {
		out.files = out.files[:maximumMatchedFiles]
	}
	return out
}