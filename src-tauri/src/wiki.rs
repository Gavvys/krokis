use crate::logger;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

pub fn is_valid_wiki_name(name: &str) -> bool {
    !name.is_empty() && name.chars().all(|c| c.is_ascii_uppercase() || c.is_ascii_digit() || c == '_')
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WikiFile {
    pub name: String,
    pub path: String,
    pub is_canonical: bool,
}

pub fn list_wiki_files(workspace_root: &Path) -> Vec<WikiFile> {
    let mut wiki_files = Vec::new();

    // Canonical master docs first — these are the primary sidebar entries.
    let canonicals = [
        "AGENTS.md",
        "PRODUCT.md",
        "ARCHITECTURE.md",
        "DESIGN.md",
        "ROADMAP.md",
        "PROJECT_MEMORY.md",
    ];

    for canon in canonicals {
        if workspace_root.join(canon).exists() {
            wiki_files.push(WikiFile {
                name: canon.to_string(),
                path: canon.to_string(),
                is_canonical: true,
            });
        }
    }

    let wiki_dir = workspace_root.join(".krokis").join("wiki");
    let mut mdx_files = Vec::new();

    if wiki_dir.is_dir() {
        if let Ok(entries) = fs::read_dir(&wiki_dir) {
            for entry in entries.filter_map(|e| e.ok()) {
                let path = entry.path();
                if path.is_file() {
                    if let Some(ext) = path.extension() {
                        if ext == "mdx" {
                            if let Some(stem) = path.file_stem().and_then(|s| s.to_str()) {
                                if is_valid_wiki_name(stem) {
                                    mdx_files.push(WikiFile {
                                        name: entry.file_name().to_string_lossy().to_string(),
                                        path: format!(
                                            ".krokis/wiki/{}",
                                            entry.file_name().to_string_lossy()
                                        ),
                                        is_canonical: false,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    mdx_files.sort_by(|a, b| a.name.cmp(&b.name));
    wiki_files.extend(mdx_files);
    wiki_files
}

pub fn read_wiki_content(workspace_root: &Path, file_path: &str) -> Result<String, String> {
    let abs_path = workspace_root.join(file_path);
    fs::read_to_string(&abs_path).map_err(|e| {
        let msg = format!("Failed to read wiki file '{}': {}", abs_path.display(), e);
        logger::log_error("wiki::read_wiki_content", &msg);
        msg
    })
}

pub fn create_wiki_page(workspace_root: &Path, name: &str) -> Result<String, String> {
    let upper_name = name.to_uppercase().replace('-', "_");
    if !is_valid_wiki_name(&upper_name) {
        let err = format!("Invalid wiki name '{}': must be SNAKE_CASE", name);
        logger::log_error("wiki::create_wiki_page", &err);
        return Err(err);
    }

    let wiki_dir = workspace_root.join(".krokis").join("wiki");
    if !wiki_dir.exists() {
        if let Err(e) = fs::create_dir_all(&wiki_dir) {
            let err = format!("Failed to create wiki dir '{}': {}", wiki_dir.display(), e);
            logger::log_error("wiki::create_wiki_page", &err);
            return Err(err);
        }
    }

    let filename = format!("{}.mdx", upper_name);
    let target_path = wiki_dir.join(&filename);

    if target_path.exists() {
        let err = format!("Wiki file '{}' already exists", filename);
        logger::log_error("wiki::create_wiki_page", &err);
        return Err(err);
    }

    let display_title = upper_name.replace('_', " ");
    let content = format!(
        "---\ntitle: {}\nauthor: Krokis Desktop\n---\n\n# {}\n\nDescribe this document here.\n",
        display_title, upper_name
    );

    if let Err(e) = fs::write(&target_path, content) {
        let err = format!("Failed to write wiki file '{}': {}", target_path.display(), e);
        logger::log_error("wiki::create_wiki_page", &err);
        return Err(err);
    }

    Ok(filename)
}
