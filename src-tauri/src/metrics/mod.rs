pub mod codebase;
pub mod change_flow;
pub mod coverage;
pub mod git;

use std::path::Path;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct TelemetryData {
    pub git: git::GitMetrics,
    pub codebase: codebase::CodeMetrics,
    pub change_flow: change_flow::ChangeFlowMetrics,
    pub coverage: coverage::CoverageReport,
}

pub fn gather_telemetry(workspace_root: &Path) -> TelemetryData {
    let git = git::gather_git_metrics(workspace_root);
    let codebase = codebase::gather_code_metrics(workspace_root);
    let change_flow = change_flow::gather_change_flow(&workspace_root.join("openspec").join("changes"));
    let coverage = coverage::gather_coverage_report(workspace_root);

    TelemetryData {
        git,
        codebase,
        change_flow,
        coverage,
    }
}
