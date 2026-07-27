use crate::logger;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct GitMetrics {
    pub total_commits: usize,
    pub recent_commits: usize,
    pub authors: Vec<AuthorStat>,
    pub history: Vec<CommitInfo>,
    pub daily: Vec<DayCount>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthorStat {
    pub name: String,
    pub commits: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommitInfo {
    pub hash: String,
    pub date: String,
    pub author: String,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DayCount {
    pub date: String,
    pub count: usize,
}

pub fn gather_git_metrics(workspace_root: &Path) -> GitMetrics {
    let mut git = GitMetrics::default();

    // 1. Get recent commit history
    let output = Command::new("git")
        .arg("log")
        .arg("--pretty=format:%h|%aI|%an|%s")
        .arg("-n")
        .arg("100")
        .current_dir(workspace_root)
        .output();

    match output {
        Ok(out) if out.status.success() => {
            let text = String::from_utf8_lossy(&out.stdout);
            let lines: Vec<&str> = text.lines().collect();

            let mut author_map: HashMap<String, usize> = HashMap::new();
            let now = Utc::now();

            for line in &lines {
                let parts: Vec<&str> = line.splitn(4, '|').collect();
                if parts.len() < 4 {
                    continue;
                }
                let info = CommitInfo {
                    hash: parts[0].to_string(),
                    date: parts[1].to_string(),
                    author: parts[2].to_string(),
                    message: parts[3].to_string(),
                };

                *author_map.entry(info.author.clone()).or_insert(0) += 1;

                if let Ok(parsed_date) = DateTime::parse_from_rfc3339(&info.date) {
                    let diff = now.signed_duration_since(parsed_date.with_timezone(&Utc));
                    if diff.num_days() <= 14 {
                        git.recent_commits += 1;
                    }
                }

                git.history.push(info);
            }

            git.total_commits = git.history.len();

            for (name, count) in author_map {
                git.authors.push(AuthorStat {
                    name,
                    commits: count,
                });
            }
        }
        Ok(out) => {
            let err = String::from_utf8_lossy(&out.stderr);
            logger::log_error("gather_git_metrics", &format!("git log status non-zero in '{}': {}", workspace_root.display(), err));
        }
        Err(e) => {
            logger::log_error("gather_git_metrics", &format!("Failed to run git log in '{}': {}", workspace_root.display(), e));
        }
    }

    // 2. Daily commit counts for heatmap
    let since = (Utc::now() - chrono::Duration::days(364)).format("%Y-%m-%d").to_string();
    let daily_output = Command::new("git")
        .arg("log")
        .arg(format!("--since={}", since))
        .arg("--date=short")
        .arg("--pretty=format:%ad")
        .current_dir(workspace_root)
        .output();

    if let Ok(out) = daily_output {
        if out.status.success() {
            let text = String::from_utf8_lossy(&out.stdout);
            let mut buckets: HashMap<String, usize> = HashMap::new();
            for line in text.lines() {
                let trimmed = line.trim();
                if !trimmed.is_empty() {
                    *buckets.entry(trimmed.to_string()).or_insert(0) += 1;
                }
            }

            if !buckets.is_empty() {
                let mut days: Vec<String> = buckets.keys().cloned().collect();
                days.sort();
                if let (Some(min_day), Some(max_day)) = (days.first(), days.last()) {
                    if let (Ok(start), Ok(end)) = (
                        chrono::NaiveDate::parse_from_str(min_day, "%Y-%m-%d"),
                        chrono::NaiveDate::parse_from_str(max_day, "%Y-%m-%d"),
                    ) {
                        let mut curr = start;
                        while curr <= end {
                            let key = curr.format("%Y-%m-%d").to_string();
                            let count = *buckets.get(&key).unwrap_or(&0);
                            git.daily.push(DayCount { date: key, count });
                            curr += chrono::Duration::days(1);
                        }
                    }
                }
            }
        }
    }

    git
}
