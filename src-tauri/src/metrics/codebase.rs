use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct CodeMetrics {
    pub total_files: usize,
    pub total_lines: usize,
    pub breakdown: Vec<LangStat>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LangStat {
    pub extension: String,
    pub files: usize,
    pub lines: usize,
}

pub fn gather_code_metrics(workspace_root: &Path) -> CodeMetrics {
    let mut code = CodeMetrics::default();
    let mut lang_map: HashMap<String, LangStat> = HashMap::new();

    let walker = WalkDir::new(workspace_root).into_iter().filter_entry(|e| {
        let name = e.file_name().to_string_lossy();
        if e.file_type().is_dir() {
            if name.starts_with('.') && name != "." {
                return false;
            }
            if name == "node_modules" || name == "vendor" || name == "openspec" || name == "target" {
                return false;
            }
        }
        true
    });

    for entry in walker.filter_map(|e| e.ok()) {
        if !entry.file_type().is_file() {
            continue;
        }

        let path = entry.path();
        let ext = path
            .extension()
            .map(|s| format!(".{}", s.to_string_lossy().to_lowercase()))
            .unwrap_or_default();

        if ext.is_empty() {
            continue;
        }

        if let Ok(content) = fs::read_to_string(path) {
            let lines = content.lines().count();
            code.total_files += 1;
            code.total_lines += lines;

            let stat = lang_map.entry(ext.clone()).or_insert(LangStat {
                extension: ext,
                files: 0,
                lines: 0,
            });
            stat.files += 1;
            stat.lines += lines;
        }
    }

    code.breakdown = lang_map.into_values().collect();
    code.breakdown.sort_by(|a, b| b.lines.cmp(&a.lines));
    code
}
