use chrono::{NaiveDate, Utc};
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct ChangeFlowMetrics {
    pub active_wip: usize,
    pub changes: Vec<ChangeFlowRecord>,
    pub monthly_throughput: Vec<MonthlyThroughput>,
    pub artifact_map: HashMap<String, Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChangeFlowRecord {
    pub name: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub completed_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub age_days: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cycle_time_days: Option<i64>,
    pub planning_health: PlanningHealth,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PlanningHealth {
    pub proposal_present: bool,
    pub specs_present: bool,
    pub design_present: bool,
    pub tasks_present: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub completed_tasks: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub remaining_tasks: Option<usize>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MonthlyThroughput {
    pub month: String,
    pub completed: usize,
}

pub fn gather_change_flow(change_root: &Path) -> ChangeFlowMetrics {
    let mut flow = ChangeFlowMetrics::default();
    let today = Utc::now().date_naive();

    let entries = match fs::read_dir(change_root) {
        Ok(e) => e,
        Err(_) => return flow,
    };

    let mut monthly: HashMap<String, usize> = HashMap::new();

    for entry in entries.filter_map(|e| e.ok()) {
        let path = entry.path();
        if !path.is_dir() {
            continue;
        }

        let name = entry.file_name().to_string_lossy().to_string();

        if name == "archive" {
            if let Ok(archive_entries) = fs::read_dir(&path) {
                for arch_entry in archive_entries.filter_map(|e| e.ok()) {
                    let arch_path = arch_entry.path();
                    if !arch_path.is_dir() {
                        continue;
                    }
                    let arch_name = arch_entry.file_name().to_string_lossy().to_string();
                    if let Some((record, month)) = archived_change_record(&arch_path, &arch_name) {
                        *monthly.entry(month).or_insert(0) += 1;
                        flow.artifact_map.insert(record.name.clone(), collect_artifacts(&arch_path));
                        flow.changes.push(record);
                    }
                }
            }
            continue;
        }

        let record = change_record(&path, &name, "active", today);
        flow.active_wip += 1;
        flow.artifact_map.insert(name.clone(), collect_artifacts(&path));
        flow.changes.push(record);
    }

    for (month, completed) in monthly {
        flow.monthly_throughput.push(MonthlyThroughput { month, completed });
    }
    flow.monthly_throughput.sort_by(|a, b| a.month.cmp(&b.month));

    flow.changes.sort_by(|a, b| {
        if a.status != b.status {
            if a.status == "active" {
                std::cmp::Ordering::Less
            } else {
                std::cmp::Ordering::Greater
            }
        } else {
            a.name.cmp(&b.name)
        }
    });

    flow
}

fn archived_change_record(path: &Path, directory: &str) -> Option<(ChangeFlowRecord, String)> {
    if directory.len() < 11 || !directory.chars().nth(10).map_or(false, |c| c == '-') {
        return None;
    }

    let date_part = &directory[..10];
    let name_part = &directory[11..];

    let completed_at = NaiveDate::parse_from_str(date_part, "%Y-%m-%d").ok()?;
    let mut record = change_record(path, name_part, "completed", completed_at);
    record.completed_date = Some(date_part.to_string());

    if let Some(created_at) = read_created_date(path) {
        if completed_at >= created_at {
            let cycle_days = (completed_at - created_at).num_days();
            record.cycle_time_days = Some(cycle_days);
        }
    }

    let month = date_part[..7].to_string();
    Some((record, month))
}

fn change_record(path: &Path, name: &str, status: &str, reference_date: NaiveDate) -> ChangeFlowRecord {
    let mut record = ChangeFlowRecord {
        name: name.to_string(),
        status: status.to_string(),
        created_date: None,
        completed_date: None,
        age_days: None,
        cycle_time_days: None,
        planning_health: read_planning_health(path),
    };

    if let Some(created_at) = read_created_date(path) {
        record.created_date = Some(created_at.format("%Y-%m-%d").to_string());
        if status == "active" && reference_date >= created_at {
            let age_days = (reference_date - created_at).num_days();
            record.age_days = Some(age_days);
        }
    }

    record
}

fn read_created_date(change_path: &Path) -> Option<NaiveDate> {
    let yaml_path = change_path.join(".openspec.yaml");
    let content = fs::read_to_string(yaml_path).ok()?;
    for line in content.lines() {
        if let Some((key, val)) = line.split_once(':') {
            if key.trim() == "created" {
                let trimmed_val = val.trim().trim_matches(|c| c == '"' || c == '\'');
                return NaiveDate::parse_from_str(trimmed_val, "%Y-%m-%d").ok();
            }
        }
    }
    None
}

fn read_planning_health(change_path: &Path) -> PlanningHealth {
    let proposal_present = change_path.join("proposal.md").exists();
    let specs_present = has_spec_file(&change_path.join("specs"));
    let design_present = change_path.join("design.md").exists();
    let tasks_path = change_path.join("tasks.md");
    let tasks_present = tasks_path.exists();

    let mut completed_tasks = None;
    let mut remaining_tasks = None;

    if tasks_present {
        if let Ok(content) = fs::read_to_string(tasks_path) {
            if let Ok(re) = Regex::new(r"(?m)^\s*- \[([ xX])\]") {
                let mut completed = 0;
                let mut remaining = 0;

                for cap in re.captures_iter(&content) {
                    if let Some(mark) = cap.get(1) {
                        if mark.as_str().eq_ignore_ascii_case("x") {
                            completed += 1;
                        } else {
                            remaining += 1;
                        }
                    }
                }

                completed_tasks = Some(completed);
                remaining_tasks = Some(remaining);
            }
        }
    }

    PlanningHealth {
        proposal_present,
        specs_present,
        design_present,
        tasks_present,
        completed_tasks,
        remaining_tasks,
    }
}

fn has_spec_file(specs_dir: &Path) -> bool {
    if !specs_dir.is_dir() {
        return false;
    }
    if let Ok(entries) = fs::read_dir(specs_dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            if entry.path().extension().map_or(false, |e| e == "md") {
                return true;
            }
        }
    }
    false
}

fn collect_artifacts(change_path: &Path) -> Vec<String> {
    let mut artifacts = Vec::new();
    for name in &["proposal.md", "design.md", "tasks.md"] {
        if change_path.join(name).exists() {
            artifacts.push(name.to_string());
        }
    }

    let specs_dir = change_path.join("specs");
    if specs_dir.is_dir() {
        for entry in walkdir::WalkDir::new(&specs_dir).into_iter().filter_map(|e| e.ok()) {
            if entry.file_type().is_file() && entry.path().extension().map_or(false, |e| e == "md") {
                if let Ok(rel) = entry.path().strip_prefix(change_path) {
                    artifacts.push(rel.to_string_lossy().replace('\\', "/"));
                }
            }
        }
    }

    artifacts.sort();
    artifacts
}
