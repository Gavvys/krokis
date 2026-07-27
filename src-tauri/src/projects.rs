use crate::logger;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Wry};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectEntry {
    pub name: String,
    pub path: String,
    pub added_at: String,
    pub last_opened_at: String,
    pub has_openspec: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ProjectRegistry {
    pub active_project: String,
    pub projects: Vec<ProjectEntry>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct ProjectState {
    pub active_project: String,
    pub recent_projects: Vec<String>,
    pub registry: Vec<ProjectEntry>,
}

/// Return global ~/.krokis directory path, ensuring it exists.
pub fn krokis_home_dir() -> Option<PathBuf> {
    let home = std::env::var_os("HOME")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("USERPROFILE").map(PathBuf::from))?;
    let dir = home.join(".krokis");
    if !dir.exists() {
        let _ = fs::create_dir_all(&dir);
    }
    Some(dir)
}

fn registry_file_path() -> Option<PathBuf> {
    krokis_home_dir().map(|d| d.join("projects.json"))
}

fn is_home_directory(path: &Path) -> bool {
    let home = std::env::var_os("HOME")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("USERPROFILE").map(PathBuf::from));
    if let Some(h) = home {
        if let (Ok(p_canon), Ok(h_canon)) = (path.canonicalize(), h.canonicalize()) {
            return p_canon == h_canon;
        }
        return path == h;
    }
    false
}

/// Markers that indicate a Krokis / OpenSpec workspace root.
fn looks_like_workspace(path: &Path) -> bool {
    if is_home_directory(path) {
        return false;
    }
    path.join("PRODUCT.md").is_file()
        || path.join(".krokis").join("wiki").is_dir()
        || path.join(".krokis").join("config.toml").is_file()
        || path.join("openspec").is_dir()
        || path.join("AGENTS.md").is_file()
}

pub fn resolve_workspace_root(candidate: &Path) -> PathBuf {
    let mut path = candidate.to_path_buf();
    if let Ok(canon) = path.canonicalize() {
        path = canon;
    }

    if is_home_directory(&path) {
        return path;
    }

    // If candidate is a `src-tauri` crate subfolder, use its parent
    if path
        .file_name()
        .and_then(|n| n.to_str())
        .map(|n| n == "src-tauri")
        .unwrap_or(false)
    {
        if let Some(parent) = path.parent() {
            if looks_like_workspace(parent) {
                return parent.to_path_buf();
            }
        }
    }

    if looks_like_workspace(&path) {
        return path;
    }

    // Walk up parents to see if candidate is a subfolder inside a workspace
    // Stop if parent is home directory or filesystem root
    let mut cursor = path.as_path();
    while let Some(parent) = cursor.parent() {
        if is_home_directory(parent) {
            break;
        }
        if looks_like_workspace(parent) {
            return parent.to_path_buf();
        }
        cursor = parent;
    }

    // Otherwise use candidate directory directly
    path
}

fn default_workspace_from_cwd() -> Option<PathBuf> {
    let cwd = std::env::current_dir().ok()?;
    Some(resolve_workspace_root(&cwd))
}

fn now_iso() -> String {
    chrono::Utc::now().to_rfc3339()
}

fn derive_project_name(path: &Path) -> String {
    path.file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("Untitled Project")
        .to_string()
}

pub fn load_registry() -> ProjectRegistry {
    let mut registry = ProjectRegistry::default();
    if let Some(path) = registry_file_path() {
        if path.is_file() {
            if let Ok(content) = fs::read_to_string(&path) {
                if let Ok(parsed) = serde_json::from_str::<ProjectRegistry>(&content) {
                    registry = parsed;
                }
            }
        }
    }
    registry
}

pub fn save_registry(registry: &ProjectRegistry) {
    if let Some(path) = registry_file_path() {
        if let Ok(json) = serde_json::to_string_pretty(registry) {
            let _ = fs::write(path, json);
        }
    }
}

pub fn get_project_state(_app: &AppHandle<Wry>) -> ProjectState {
    let mut registry = load_registry();
    let now = now_iso();
    let mut modified = false;

    // Filter out entries whose paths no longer exist on disk or resolve to Home
    let orig_count = registry.projects.len();
    registry.projects.retain(|p| {
        let p_path = Path::new(&p.path);
        p_path.exists() && !is_home_directory(p_path)
    });
    if registry.projects.len() != orig_count {
        modified = true;
    }

    // Resolve active project
    let active_path = if !registry.active_project.is_empty() && Path::new(&registry.active_project).exists() {
        resolve_workspace_root(Path::new(&registry.active_project))
    } else if let Some(cwd_root) = default_workspace_from_cwd() {
        cwd_root
    } else {
        PathBuf::from(".")
    };

    let active_str = active_path.to_string_lossy().to_string();
    if registry.active_project != active_str {
        registry.active_project = active_str.clone();
        modified = true;
    }

    // Ensure active project is in projects list (if not home directory)
    if !active_str.is_empty() && Path::new(&active_str).exists() && !is_home_directory(Path::new(&active_str)) {
        let has_spec = Path::new(&active_str).join("openspec").is_dir();
        if let Some(entry) = registry.projects.iter_mut().find(|p| p.path == active_str) {
            entry.last_opened_at = now.clone();
            entry.has_openspec = has_spec;
            modified = true;
        } else {
            let name = derive_project_name(&active_path);
            registry.projects.push(ProjectEntry {
                name,
                path: active_str.clone(),
                added_at: now.clone(),
                last_opened_at: now.clone(),
                has_openspec: has_spec,
            });
            modified = true;
        }
    }

    // Sort projects by last_opened_at descending
    registry.projects.sort_by(|a, b| b.last_opened_at.cmp(&a.last_opened_at));

    if modified {
        save_registry(&registry);
    }

    let recent_projects: Vec<String> = registry.projects.iter().map(|p| p.path.clone()).collect();

    ProjectState {
        active_project: registry.active_project,
        recent_projects,
        registry: registry.projects,
    }
}

pub fn set_active_project(app: &AppHandle<Wry>, project_path: &str) -> Result<ProjectState, String> {
    let p = Path::new(project_path);
    if !p.exists() || !p.is_dir() {
        return Err(format!("Invalid workspace directory: {}", project_path));
    }

    if is_home_directory(p) {
        let msg = format!("Cannot register home directory as project: {}", project_path);
        logger::log_warn("set_active_project", &msg);
        return Err(msg);
    }

    let resolved = resolve_workspace_root(p);
    let path_str = resolved.to_string_lossy().to_string();
    let now = now_iso();
    let has_spec = resolved.join("openspec").is_dir();

    let mut registry = load_registry();
    registry.active_project = path_str.clone();

    if let Some(entry) = registry.projects.iter_mut().find(|e| e.path == path_str) {
        entry.last_opened_at = now;
        entry.has_openspec = has_spec;
    } else {
        let name = derive_project_name(&resolved);
        registry.projects.push(ProjectEntry {
            name,
            path: path_str.clone(),
            added_at: now.clone(),
            last_opened_at: now,
            has_openspec: has_spec,
        });
    }

    // Sort projects by last_opened_at descending
    registry.projects.sort_by(|a, b| b.last_opened_at.cmp(&a.last_opened_at));

    save_registry(&registry);

    Ok(get_project_state(app))
}
