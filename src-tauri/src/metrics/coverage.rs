use crate::logger;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct CoverageReport {
    pub total_requirements: usize,
    pub covered_requirements: usize,
    pub partial_requirements: usize,
    pub uncovered_requirements: usize,
    pub coverage_percent: f64,
    pub capabilities: Vec<CoverageCapability>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CoverageCapability {
    pub name: String,
    pub requirements: usize,
    pub covered: usize,
    pub uncovered: usize,
    pub items: Vec<CoverageRequirement>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CoverageRequirement {
    pub name: String,
    pub status: String,
    pub identifier_count: usize,
    pub matched_count: usize,
    pub matched_files: Vec<String>,
}

pub fn gather_coverage_report(workspace_root: &Path) -> CoverageReport {
    let mut report = CoverageReport::default();
    let specs_dir = workspace_root.join("openspec").join("specs");

    if !specs_dir.is_dir() {
        return report;
    }

    let workspace_files = list_scannable_files(workspace_root);

    let entries = match fs::read_dir(&specs_dir) {
        Ok(e) => e,
        Err(e) => {
            logger::log_error("gather_coverage_report", &format!("Failed to read specs dir: {}", e));
            return report;
        }
    };

    for entry in entries.filter_map(|e| e.ok()) {
        let cap_dir = entry.path();
        if cap_dir.is_dir() {
            let spec_file = cap_dir.join("spec.md");
            if spec_file.is_file() {
                if let Ok(content) = fs::read_to_string(&spec_file) {
                    let cap_name = entry.file_name().to_string_lossy().to_string();
                    let capability = build_capability(&cap_name, &content, &workspace_files, workspace_root);
                    if capability.requirements > 0 {
                        report.total_requirements += capability.requirements;
                        for item in &capability.items {
                            match item.status.as_str() {
                                "covered" => report.covered_requirements += 1,
                                "partial" => report.partial_requirements += 1,
                                _ => report.uncovered_requirements += 1,
                            }
                        }
                        report.capabilities.push(capability);
                    }
                }
            }
        }
    }

    if report.total_requirements > 0 {
        report.coverage_percent = ((report.covered_requirements as f64
            + (report.partial_requirements as f64 * 0.5))
            / report.total_requirements as f64)
            * 100.0;
    }

    report.capabilities.sort_by(|a, b| a.name.cmp(&b.name));
    report
}

fn list_scannable_files(workspace_root: &Path) -> Vec<String> {
    let mut files = Vec::new();
    let ignore_dirs = ["node_modules", "target", ".git", "vendor", "dist", ".krokis"];

    for entry in WalkDir::new(workspace_root)
        .into_iter()
        .filter_entry(|e| {
            if let Some(name) = e.file_name().to_str() {
                !ignore_dirs.contains(&name)
            } else {
                true
            }
        })
        .filter_map(|e| e.ok())
    {
        if entry.file_type().is_file() {
            if let Ok(rel) = entry.path().strip_prefix(workspace_root) {
                let rel_str = rel.to_string_lossy().to_string();
                if let Some(ext) = entry.path().extension().and_then(|s| s.to_str()) {
                    if matches!(ext, "js" | "ts" | "jsx" | "tsx" | "rs" | "go" | "py" | "html" | "css") {
                        files.push(rel_str);
                    }
                }
            }
        }
    }
    files
}

fn build_capability(name: &str, content: &str, workspace_files: &[String], workspace_root: &Path) -> CoverageCapability {
    let mut cap = CoverageCapability {
        name: name.to_string(),
        requirements: 0,
        covered: 0,
        uncovered: 0,
        items: Vec::new(),
    };

    let req_re = match Regex::new(r"(?m)^### Requirement:\s*(.+?)\s*$") {
        Ok(re) => re,
        Err(e) => {
            logger::log_error("coverage::build_capability", &e.to_string());
            return cap;
        }
    };

    let req_indices: Vec<(usize, usize, String)> = req_re
        .captures_iter(content)
        .filter_map(|cap| {
            let m = cap.get(0)?;
            let name = cap.get(1)?.as_str().to_string();
            Some((m.start(), m.end(), name))
        })
        .collect();

    if req_indices.is_empty() {
        return cap;
    }

    for (i, (_start, end, req_name)) in req_indices.iter().enumerate() {
        let body_end = if i + 1 < req_indices.len() {
            req_indices[i + 1].0
        } else {
            content.len()
        };
        let body = &content[*end..body_end];

        let identifiers = extract_identifiers(body);
        let (matched_count, matched_files) = scan_identifiers(&identifiers, workspace_files, workspace_root);

        let status = if matched_count == identifiers.len() && !identifiers.is_empty() {
            "covered".to_string()
        } else if matched_count > 0 {
            "partial".to_string()
        } else {
            "uncovered".to_string()
        };

        if status == "covered" || status == "partial" {
            cap.covered += 1;
        } else {
            cap.uncovered += 1;
        }

        cap.items.push(CoverageRequirement {
            name: req_name.clone(),
            status,
            identifier_count: identifiers.len(),
            matched_count,
            matched_files,
        });
    }

    cap.requirements = cap.items.len();
    cap
}

fn extract_identifiers(body: &str) -> Vec<String> {
    let mut raw = HashSet::new();

    if let Ok(tag_re) = Regex::new(r"<([a-z][a-z0-9]+(?:-[a-z0-9]+)+)>") {
        for cap in tag_re.captures_iter(body) {
            if let Some(m) = cap.get(1) {
                raw.insert(m.as_str().to_string());
            }
        }
    }

    if let Ok(route_re) = Regex::new(r"#/[a-zA-Z0-9/_\-]+") {
        for m in route_re.find_iter(body) {
            raw.insert(m.as_str().to_string());
        }
    }

    if let Ok(backtick_re) = Regex::new(r"`([^`]+)`") {
        for cap in backtick_re.captures_iter(body) {
            if let Some(m) = cap.get(1) {
                raw.insert(m.as_str().to_string());
            }
        }
    }

    let mut result: Vec<String> = raw
        .into_iter()
        .filter(|t| is_identifier(t))
        .collect();
    result.sort();
    result
}

fn is_identifier(token: &str) -> bool {
    if token.len() < 3 {
        return false;
    }
    if token.starts_with("#/") {
        return true;
    }
    let has_separator = token.contains('.') || token.contains('/') || token.contains('_') || token.contains('-');
    let has_case = token.chars().any(|c| c.is_uppercase());
    if !has_separator && !has_case && token.len() < 6 {
        return false;
    }
    true
}

fn scan_identifiers(identifiers: &[String], workspace_files: &[String], workspace_root: &Path) -> (usize, Vec<String>) {
    let mut matched = HashSet::new();
    let mut matched_files = HashSet::new();

    for id in identifiers {
        for rel_path in workspace_files {
            let abs_path = workspace_root.join(rel_path);
            if let Ok(content) = fs::read_to_string(&abs_path) {
                if content.contains(id) {
                    matched.insert(id.clone());
                    matched_files.insert(rel_path.clone());
                }
            }
        }
    }

    let mut files: Vec<String> = matched_files.into_iter().collect();
    files.sort();
    if files.len() > 3 {
        files.truncate(3);
    }

    (matched.len(), files)
}
