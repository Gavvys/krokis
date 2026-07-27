use crate::logger;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DoctorItem {
    pub name: String,
    pub status: String, // "PASS", "WARN", "FAIL"
    pub details: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DoctorReport {
    pub timestamp: String,
    pub project_path: String,
    pub items: Vec<DoctorItem>,
    pub flutter_output: Option<String>,
    pub markdown_path: String,
}

pub fn check_doctor_report_exists(workspace_root: &Path) -> bool {
    workspace_root.join(".krokis").join("DOCTOR.md").exists()
}

pub fn run_doctor(workspace_root: &Path) -> Result<DoctorReport, String> {
    logger::log_info("doctor::run_doctor", &format!("Running doctor checks for {}", workspace_root.display()));

    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut items = Vec::new();

    // 1. Git Repository
    if workspace_root.join(".git").exists() {
        items.push(DoctorItem {
            name: "Git Repository".to_string(),
            status: "PASS".to_string(),
            details: "Found `.git` directory".to_string(),
        });
    } else {
        items.push(DoctorItem {
            name: "Git Repository".to_string(),
            status: "WARN".to_string(),
            details: "No `.git` directory found. Version control is recommended.".to_string(),
        });
    }

    // 2. Krokis Config
    if workspace_root.join(".krokis").join("config.toml").exists() {
        items.push(DoctorItem {
            name: "Krokis Configuration".to_string(),
            status: "PASS".to_string(),
            details: "Found `.krokis/config.toml`".to_string(),
        });
    } else {
        items.push(DoctorItem {
            name: "Krokis Configuration".to_string(),
            status: "WARN".to_string(),
            details: "Missing `.krokis/config.toml`".to_string(),
        });
    }

    // 3. OpenSpec Setup
    let openspec_dir = workspace_root.join("openspec");
    if openspec_dir.is_dir() {
        items.push(DoctorItem {
            name: "OpenSpec Directory".to_string(),
            status: "PASS".to_string(),
            details: "Found `openspec/` directory".to_string(),
        });
    } else {
        items.push(DoctorItem {
            name: "OpenSpec Directory".to_string(),
            status: "WARN".to_string(),
            details: "Missing `openspec/` workspace directory".to_string(),
        });
    }

    // 4. Product Specification
    if workspace_root.join("PRODUCT.md").exists() {
        items.push(DoctorItem {
            name: "Product Specification".to_string(),
            status: "PASS".to_string(),
            details: "Found `PRODUCT.md`".to_string(),
        });
    } else {
        items.push(DoctorItem {
            name: "Product Specification".to_string(),
            status: "WARN".to_string(),
            details: "Missing `PRODUCT.md`".to_string(),
        });
    }

    // 5. Agent Guidance
    if workspace_root.join("AGENTS.md").exists() {
        items.push(DoctorItem {
            name: "Agent Guidance".to_string(),
            status: "PASS".to_string(),
            details: "Found `AGENTS.md`".to_string(),
        });
    } else {
        items.push(DoctorItem {
            name: "Agent Guidance".to_string(),
            status: "WARN".to_string(),
            details: "Missing `AGENTS.md`".to_string(),
        });
    }

    // 6. Project Wiki
    if workspace_root.join(".krokis").join("wiki").is_dir() {
        items.push(DoctorItem {
            name: "Project Wiki".to_string(),
            status: "PASS".to_string(),
            details: "Found `.krokis/wiki/` directory".to_string(),
        });
    } else {
        items.push(DoctorItem {
            name: "Project Wiki".to_string(),
            status: "WARN".to_string(),
            details: "Missing `.krokis/wiki/` directory".to_string(),
        });
    }

    // 7. Check for Flutter project or Flutter CLI
    let is_flutter_project = workspace_root.join("pubspec.yaml").exists();
    let mut flutter_output = None;

    if is_flutter_project || Command::new("flutter").arg("--version").output().is_ok() {
        logger::log_info("doctor::run_doctor", "Running `flutter doctor`...");
        let output = Command::new("flutter")
            .arg("doctor")
            .arg("--no-color")
            .current_dir(workspace_root)
            .output();

        match output {
            Ok(out) => {
                let text = String::from_utf8_lossy(&out.stdout).to_string();
                let err_text = String::from_utf8_lossy(&out.stderr).to_string();
                let full = if text.is_empty() { err_text } else { text };
                flutter_output = Some(full);
            }
            Err(e) => {
                logger::log_warn("doctor::run_doctor", &format!("`flutter doctor` failed to execute: {}", e));
            }
        }
    }

    // Generate Markdown content
    let mut md = String::new();
    md.push_str("# Doctor Report\n\n");
    md.push_str(&format!("*Generated on {} for `{}`*\n\n", timestamp, workspace_root.display()));

    md.push_str("## Project Health Checks\n\n");
    md.push_str("| Check | Status | Details |\n");
    md.push_str("| --- | --- | --- |\n");

    for item in &items {
        let status_icon = match item.status.as_str() {
            "PASS" => "✓ PASS",
            "WARN" => "⚠ WARN",
            _ => "✗ FAIL",
        };
        md.push_str(&format!("| {} | {} | {} |\n", item.name, status_icon, item.details));
    }
    md.push_str("\n");

    if let Some(ref flut) = flutter_output {
        md.push_str("## Flutter Doctor\n\n```text\n");
        md.push_str(flut.trim());
        md.push_str("\n```\n\n");
    }

    // Ensure .krokis folder exists and write DOCTOR.md
    let krokis_dir = workspace_root.join(".krokis");
    if !krokis_dir.exists() {
        let _ = fs::create_dir_all(&krokis_dir);
    }

    let doctor_md_path = krokis_dir.join("DOCTOR.md");
    if let Err(e) = fs::write(&doctor_md_path, &md) {
        let err_msg = format!("Failed to write DOCTOR.md: {}", e);
        logger::log_error("doctor::run_doctor", &err_msg);
        return Err(err_msg);
    }

    logger::log_info("doctor::run_doctor", &format!("Doctor report written to {}", doctor_md_path.display()));

    Ok(DoctorReport {
        timestamp,
        project_path: workspace_root.to_string_lossy().to_string(),
        items,
        flutter_output,
        markdown_path: ".krokis/DOCTOR.md".to_string(),
    })
}
