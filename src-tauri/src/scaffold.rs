use crate::doctor::{self, DoctorReport};
use crate::logger;
use serde::Serialize;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;

#[derive(Debug, Serialize)]
pub struct ScaffoldResult {
    pub workspace_path: String,
    pub created: Vec<String>,
    pub skipped: Vec<String>,
    pub doctor: DoctorReport,
}

const CANONICAL_TEMPLATES: [(&str, &str); 6] = [
    (
        "AGENTS.md",
        "# Project guidance\n\n<!-- Adapt this file to the repository's contribution rules. -->\n\nRead the relevant project references before planning or implementing work. Follow the local OpenSpec workflow in `openspec/config.yaml` and `.agents/skills/`.\n\n## Reference artifacts\n\n- `PRODUCT.md` — product intent, users, scope, and non-goals.\n- `ARCHITECTURE.md` — technical architecture and durable decisions.\n- `DESIGN.md` — UX and design conventions.\n- `ROADMAP.md` — commitment horizons: Now, Queued, Exploring, Parked.\n- `PROJECT_MEMORY.md` — settled decisions and project orientation.\n",
    ),
    (
        "PRODUCT.md",
        "# Product Intent\n\n<!-- Adapt this file: what does this project do, for whom, and why? -->\n\n## Vision\n\nDescribe the product's purpose and the users it serves.\n\n## Scope\n\nRecord the capabilities this project owns.\n\n## Non-Goals\n\nRecord what this project intentionally does not do.\n",
    ),
    (
        "ARCHITECTURE.md",
        "# Architecture Overview\n\n<!-- Adapt this file to the repository's actual architecture. -->\n\n## System shape\n\nDescribe the major modules, boundaries, data flow, and runtime dependencies.\n\n## Durable decisions\n\nRecord technical decisions that future agents must preserve.\n",
    ),
    (
        "DESIGN.md",
        "# Design System\n\n<!-- Adapt this file to the project's user experience and interface conventions. -->\n\n## Experience principles\n\nDescribe the qualities the product should preserve.\n\n## Interface conventions\n\nRecord typography, colors, layout, interaction, and accessibility rules.\n",
    ),
    (
        "ROADMAP.md",
        "# Roadmap\n\nThis roadmap orders work by commitment, not by date.\n\n## Now\n\n- (none — no active OpenSpec change)\n\n## Queued\n\n- (none)\n\n## Exploring\n\n- (none)\n\n## Parked\n\n- (none)\n",
    ),
    (
        "PROJECT_MEMORY.md",
        "# Project memory\n\n<!-- Record settled decisions and orientation here. Keep canonical intent in PRODUCT.md and accepted behavior in openspec/specs/. -->\n\n## Durable conventions\n\n- Use OpenSpec for bounded, reviewable changes.\n- Keep important decisions in repository artifacts, not only in chat.\n\n## Established decisions\n\n| Date | Decision |\n| --- | --- |\n| | |\n",
    ),
];

const CONFIG_TEMPLATE: &str = "[wiki]\ndirectory = '.krokis/wiki'\n\n[insights]\ndirectory = '.krokis/insights'\nopenapi = 'openapi.yaml'\n\n[server]\nport = 8080\n";

const OPENSPEC_CONFIG_TEMPLATE: &str = "schema: spec-driven\n\ncontext: |\n  Read AGENTS.md and the relevant project references before authoring OpenSpec artifacts.\n  Accepted behavior lives in openspec/specs/; proposed work lives in openspec/changes/.\n\nrules:\n  proposal:\n    - State the bounded outcome, non-goals, and affected references.\n  specs:\n    - Write testable requirements with scenarios.\n  design:\n    - Explain architecture and UX decisions.\n  tasks:\n    - Include validation and documentation updates.\n";

const DEPENDENCY_MAP_TEMPLATE: &str = "---\ntitle: Dependency Map\nauthor: Krokis Desktop\n---\n\n# System Dependencies\n\nMaintain a clear map of external APIs, services, libraries, and client boundaries.\n\n<InfoBox type=\"tip\">\nKeep this document current so agents understand system limits before making changes.\n</InfoBox>\n";

const USER_MANUAL_TEMPLATE: &str = "---\ntitle: User Manual\nauthor: Krokis Desktop\n---\n\n# User Manual\n\nDescribe how people use this project, including local setup, common workflows, and troubleshooting.\n\n## OpenSpec workflow\n\nUse the local OpenSpec skills and keep accepted behavior in `openspec/specs/`.\n";

const WIKI_INDEX_TEMPLATE: &str = "---\ntitle: Wiki Index\nauthor: Krokis Desktop\n---\n\n# Wiki Index\n\n- [User Manual](#/wiki/USER_MANUAL)\n- [Dependency Map](#/wiki/DEPENDENCY_MAP)\n";

const OPENAPI_TEMPLATE: &str = "openapi: 3.0.3\ninfo:\n  title: Project API\n  description: Replace this starter specification with the project's API contract.\n  version: 1.0.0\npaths: {}\n";

const SKILL_TEMPLATES: [(&str, &str); 6] = [
    (
        ".agents/skills/krokis/SKILL.md",
        include_str!("../../.agents/skills/krokis/SKILL.md"),
    ),
    (
        ".agents/skills/krokis/workflows/insights.md",
        include_str!("../../.agents/skills/krokis/workflows/insights.md"),
    ),
    (
        ".agents/skills/krokis/workflows/wiki.md",
        include_str!("../../.agents/skills/krokis/workflows/wiki.md"),
    ),
    (
        ".agents/skills/krokis/workflows/roadmap.md",
        include_str!("../../.agents/skills/krokis/workflows/roadmap.md"),
    ),
    (
        ".agents/skills/krokis/references/commands.md",
        include_str!("../../.agents/skills/krokis/references/commands.md"),
    ),
    (
        ".agents/skills/krokis/references/plan-discipline.md",
        include_str!("../../.agents/skills/krokis/references/plan-discipline.md"),
    ),
];

pub fn scaffold_workspace(workspace_root: &Path) -> Result<ScaffoldResult, String> {
    if !workspace_root.is_dir() {
        return Err(format!(
            "Workspace directory does not exist: {}",
            workspace_root.display()
        ));
    }

    let mut created = Vec::new();
    let mut skipped = Vec::new();

    for (relative, content) in CANONICAL_TEMPLATES {
        write_if_missing(
            workspace_root,
            relative,
            content,
            &mut created,
            &mut skipped,
        )?;
    }

    for (relative, content) in [
        (".krokis/config.toml", CONFIG_TEMPLATE),
        (".krokis/wiki/DEPENDENCY_MAP.mdx", DEPENDENCY_MAP_TEMPLATE),
        (".krokis/wiki/USER_MANUAL.mdx", USER_MANUAL_TEMPLATE),
        (".krokis/wiki/WIKI_INDEX.mdx", WIKI_INDEX_TEMPLATE),
        ("openapi.yaml", OPENAPI_TEMPLATE),
        ("openspec/config.yaml", OPENSPEC_CONFIG_TEMPLATE),
    ] {
        write_if_missing(
            workspace_root,
            relative,
            content,
            &mut created,
            &mut skipped,
        )?;
    }

    for (relative, content) in SKILL_TEMPLATES {
        write_if_missing(
            workspace_root,
            relative,
            content,
            &mut created,
            &mut skipped,
        )?;
    }

    logger::log_info(
        "scaffold::workspace",
        &format!(
            "Scaffolded {} (created {}, skipped {})",
            workspace_root.display(),
            created.len(),
            skipped.len()
        ),
    );

    let doctor = doctor::run_doctor(workspace_root)?;
    Ok(ScaffoldResult {
        workspace_path: workspace_root.to_string_lossy().to_string(),
        created,
        skipped,
        doctor,
    })
}

fn write_if_missing(
    workspace_root: &Path,
    relative: &str,
    content: &str,
    created: &mut Vec<String>,
    skipped: &mut Vec<String>,
) -> Result<(), String> {
    let target = workspace_root.join(relative);
    if target.is_file() {
        skipped.push(relative.to_string());
        return Ok(());
    }

    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent).map_err(|e| {
            format!(
                "Failed to create parent directory for {}: {}",
                target.display(),
                e
            )
        })?;
    }

    let mut file = match OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&target)
    {
        Ok(file) => file,
        Err(e) if e.kind() == std::io::ErrorKind::AlreadyExists => {
            skipped.push(relative.to_string());
            return Ok(());
        }
        Err(e) => {
            return Err(format!("Failed to create {}: {}", target.display(), e));
        }
    };

    file.write_all(content.as_bytes())
        .map_err(|e| format!("Failed to write {}: {}", target.display(), e))?;
    created.push(relative.to_string());
    Ok(())
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
        let path = std::env::temp_dir().join(format!("krokis-scaffold-{label}-{stamp}"));
        fs::create_dir_all(&path).unwrap();
        path
    }

    #[test]
    fn creates_expected_starter_files() {
        let workspace = temp_workspace("fresh");
        let result = scaffold_workspace(&workspace).unwrap();

        assert!(result.created.contains(&"AGENTS.md".to_string()));
        assert!(workspace.join("PRODUCT.md").is_file());
        assert!(workspace.join(".krokis/wiki/USER_MANUAL.mdx").is_file());
        assert!(workspace.join(".agents/skills/krokis/SKILL.md").is_file());
        assert!(workspace.join("openspec/config.yaml").is_file());
        assert!(result.doctor.items.iter().all(|item| item.status != "FAIL"));

        fs::remove_dir_all(workspace).unwrap();
    }

    #[test]
    fn rerun_skips_existing_files_and_preserves_content() {
        let workspace = temp_workspace("idempotent");
        fs::write(workspace.join("PRODUCT.md"), "user-owned product\n").unwrap();

        let first = scaffold_workspace(&workspace).unwrap();
        let second = scaffold_workspace(&workspace).unwrap();

        assert!(first.skipped.contains(&"PRODUCT.md".to_string()));
        assert!(second.skipped.contains(&"PRODUCT.md".to_string()));
        assert_eq!(
            fs::read_to_string(workspace.join("PRODUCT.md")).unwrap(),
            "user-owned product\n"
        );

        fs::remove_dir_all(workspace).unwrap();
    }
}
