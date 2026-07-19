package web

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"krokis/internal/config"
	"krokis/internal/wiki"
)

// Global reference to embedded frontend files (assigned from main/cmd)
var EmbeddedFiles embed.FS

// StartServer spins up the HTTP server serving the dashboard and APIs
func StartServer(port int) error {
	// Subtree standard fs
	publicFS, err := fs.Sub(EmbeddedFiles, "web")
	if err != nil {
		return fmt.Errorf("failed to locate embedded web directory: %w", err)
	}

	mux := http.NewServeMux()

	// 1. API - Get project insights JSON
	mux.HandleFunc("/api/insights", func(w http.ResponseWriter, r *http.Request) {
		cfg, err := config.Load()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		path := filepath.Join(cfg.Insights.Directory, "health.json")
		data, err := os.ReadFile(path)
		if err != nil {
			if os.IsNotExist(err) {
				// return empty data format rather than error
				w.Header().Set("Content-Type", "application/json")
				_, _ = w.Write([]byte(`{}`))
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write(data)
	})

	// 1.5. API - Get OpenAPI Spec
	mux.HandleFunc("/api/openapi", func(w http.ResponseWriter, r *http.Request) {
		cfg, err := config.Load()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if cfg.Insights.OpenAPI == "" {
			http.Error(w, "openapi spec not configured", http.StatusBadRequest)
			return
		}
		data, err := os.ReadFile(cfg.Insights.OpenAPI)
		if err != nil {
			if os.IsNotExist(err) {
				http.Error(w, fmt.Sprintf("openapi spec file '%s' not found", cfg.Insights.OpenAPI), http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		contentType := "text/plain; charset=utf-8"
		if strings.HasSuffix(cfg.Insights.OpenAPI, ".json") {
			contentType = "application/json"
		} else if strings.HasSuffix(cfg.Insights.OpenAPI, ".yaml") || strings.HasSuffix(cfg.Insights.OpenAPI, ".yml") {
			contentType = "text/yaml"
		}
		w.Header().Set("Content-Type", contentType)
		_, _ = w.Write(data)
	})

	// 2. API - Get wiki list
	mux.HandleFunc("/api/wiki", func(w http.ResponseWriter, r *http.Request) {
		cfg, err := config.Load()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		files, err := wiki.List(cfg.Wiki.Directory)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(files)
	})

	// 3. API - Get raw wiki content
	mux.HandleFunc("/api/wiki/", func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(r.URL.Path, "/api/wiki/")
		if name == "" {
			http.Error(w, "missing wiki name", http.StatusBadRequest)
			return
		}
		cfg, err := config.Load()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		path := filepath.Join(cfg.Wiki.Directory, strings.ToUpper(name)+".mdx")
		data, err := os.ReadFile(path)
		if err != nil {
			if os.IsNotExist(err) {
				http.Error(w, "wiki page not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = w.Write(data)
	})

	// 4. Static files handler (SPA fallback for index.html)
	fileServer := http.FileServer(http.FS(publicFS))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If path doesn't have file extension, serve index.html (SPA Router)
		if !strings.Contains(r.URL.Path, ".") {
			r.URL.Path = "/"
		}
		fileServer.ServeHTTP(w, r)
	})

	fmt.Printf("Starting Krokis Server on http://localhost:%d ...\n", port)
	return http.ListenAndServe(fmt.Sprintf(":%d", port), mux)
}
