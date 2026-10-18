use crate::logger;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Component, Path, PathBuf};

pub fn is_valid_wiki_name(name: &str) -> bool {
    !name.is_empty()
        && name
            .chars()
            .all(|c| c.is_ascii_uppercase() || c.is_ascii_digit() || c == '_')
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

/// Resolve `file_path` inside `workspace_root`, refusing anything that escapes it.
///
/// Rejects empty, absolute, and `..` paths outright, then canonicalizes both
/// sides so symlinks inside the workspace cannot point reads outside of it.
fn resolve_inside_workspace(workspace_root: &Path, file_path: &str) -> Result<PathBuf, String> {
    let relative = Path::new(file_path);
    if file_path.is_empty()
        || relative.is_absolute()
        || relative.components().any(|c| {
            matches!(
                c,
                Component::ParentDir | Component::RootDir | Component::Prefix(_)
            )
        })
    {
        let err = format!(
            "Refusing to read wiki file '{}': path must stay inside the workspace",
            file_path
        );
        logger::log_error("wiki::read_wiki_content", &err);
        return Err(err);
    }

    let root = workspace_root.canonicalize().map_err(|e| {
        let msg = format!(
            "Failed to resolve workspace root '{}': {}",
            workspace_root.display(),
            e
        );
        logger::log_error("wiki::read_wiki_content", &msg);
        msg
    })?;

    let resolved = root.join(relative).canonicalize().map_err(|e| {
        let msg = format!("Failed to read wiki file '{}': {}", file_path, e);
        logger::log_error("wiki::read_wiki_content", &msg);
        msg
    })?;

    if !resolved.starts_with(&root) {
        let err = format!(
            "Refusing to read wiki file '{}': path resolves outside the workspace",
            file_path
        );
        logger::log_error("wiki::read_wiki_content", &err);
        return Err(err);
    }

    Ok(resolved)
}

pub fn read_wiki_content(workspace_root: &Path, file_path: &str) -> Result<String, String> {
    let abs_path = resolve_inside_workspace(workspace_root, file_path)?;
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
        let err = format!(
            "Failed to write wiki file '{}': {}",
            target_path.display(),
            e
        );
        logger::log_error("wiki::create_wiki_page", &err);
        return Err(err);
    }

    Ok(filename)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::PathBuf;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn temp_workspace(label: &str) -> PathBuf {
        let stamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path = std::env::temp_dir().join(format!("krokis-wiki-{label}-{stamp}"));
        fs::create_dir_all(path.join(".krokis").join("wiki")).unwrap();
        path
    }

    fn temp_sibling(label: &str) -> PathBuf {
        let stamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        std::env::temp_dir().join(format!("krokis-wiki-{label}-{stamp}"))
    }

    #[test]
    fn reads_files_inside_workspace() {
        let workspace = temp_workspace("inside");
        fs::write(workspace.join("PRODUCT.md"), "product\n").unwrap();
        fs::write(workspace.join(".krokis/wiki/USER_MANUAL.mdx"), "manual\n").unwrap();

        assert_eq!(
            read_wiki_content(&workspace, "PRODUCT.md").unwrap(),
            "product\n"
        );
        assert_eq!(
            read_wiki_content(&workspace, ".krokis/wiki/USER_MANUAL.mdx").unwrap(),
            "manual\n"
        );

        fs::remove_dir_all(workspace).unwrap();
    }

    #[test]
    fn rejects_paths_outside_workspace() {
        let workspace = temp_workspace("outside");
        let outside = temp_sibling("outside-target");
        fs::write(&outside, "secret\n").unwrap();

        let escape = format!("../{}", outside.file_name().unwrap().to_string_lossy());
        assert!(read_wiki_content(&workspace, &escape).is_err());
        assert!(read_wiki_content(&workspace, "/etc/passwd").is_err());
        assert!(read_wiki_content(&workspace, "").is_err());

        fs::remove_file(outside).unwrap();
        fs::remove_dir_all(workspace).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn rejects_symlink_escape() {
        let workspace = temp_workspace("symlink");
        let outside = temp_sibling("symlink-target");
        fs::write(&outside, "secret\n").unwrap();
        std::os::unix::fs::symlink(&outside, workspace.join("leak.md")).unwrap();

        assert!(read_wiki_content(&workspace, "leak.md").is_err());

        fs::remove_file(outside).unwrap();
        fs::remove_dir_all(workspace).unwrap();
    }
}
