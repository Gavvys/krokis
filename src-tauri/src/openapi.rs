use crate::logger;
use std::fs;
use std::path::Path;

/// Read the workspace's OpenAPI contract (`openapi.yaml` at the workspace root).
///
/// Returns `Ok(None)` when no spec is present so callers can show an empty
/// state that is distinct from a read failure.
pub fn read_spec(workspace_root: &Path) -> Result<Option<String>, String> {
    let spec_path = workspace_root.join("openapi.yaml");

    if !spec_path.exists() {
        logger::log_verbose(
            "openapi::read_spec",
            &format!("No OpenAPI spec at '{}'", spec_path.display()),
        );
        return Ok(None);
    }

    fs::read_to_string(&spec_path).map(Some).map_err(|e| {
        let msg = format!(
            "Failed to read OpenAPI spec '{}': {}",
            spec_path.display(),
            e
        );
        logger::log_error("openapi::read_spec", &msg);
        msg
    })
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
        let path = std::env::temp_dir().join(format!("krokis-openapi-{label}-{stamp}"));
        fs::create_dir_all(&path).unwrap();
        path
    }

    #[test]
    fn reads_spec_from_workspace_root() {
        let workspace = temp_workspace("reads");
        fs::write(workspace.join("openapi.yaml"), "openapi: 3.0.3\n").unwrap();

        assert_eq!(
            read_spec(&workspace).unwrap().unwrap(),
            "openapi: 3.0.3\n"
        );

        fs::remove_dir_all(workspace).unwrap();
    }

    #[test]
    fn missing_spec_returns_none() {
        let workspace = temp_workspace("missing");

        assert!(read_spec(&workspace).unwrap().is_none());

        fs::remove_dir_all(workspace).unwrap();
    }
}
