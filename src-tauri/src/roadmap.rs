use crate::logger;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

const HORIZONS: [&str; 5] = ["Now", "Queued", "Exploring", "Parked", "Shipped"];

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct RoadmapCard {
    pub title: String,
    pub body: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct RoadmapColumn {
    pub name: String,
    pub cards: Vec<RoadmapCard>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct RoadmapBoard {
    pub columns: Vec<RoadmapColumn>,
    pub source_path: String,
    pub found: bool,
}

pub fn empty_board() -> RoadmapBoard {
    RoadmapBoard {
        columns: HORIZONS
            .iter()
            .map(|name| RoadmapColumn {
                name: (*name).to_string(),
                cards: Vec::new(),
            })
            .collect(),
        source_path: "ROADMAP.md".to_string(),
        found: false,
    }
}

pub fn gather_roadmap(workspace_root: &Path) -> RoadmapBoard {
    let path = workspace_root.join("ROADMAP.md");
    if !path.is_file() {
        logger::log_info(
            "gather_roadmap",
            &format!("No ROADMAP.md at {}", path.display()),
        );
        return empty_board();
    }

    match fs::read_to_string(&path) {
        Ok(content) => {
            let mut board = parse_roadmap_markdown(&content);
            board.source_path = "ROADMAP.md".to_string();
            board.found = true;
            board
        }
        Err(e) => {
            logger::log_error(
                "gather_roadmap",
                &format!("Failed to read {}: {}", path.display(), e),
            );
            empty_board()
        }
    }
}

pub fn parse_roadmap_markdown(content: &str) -> RoadmapBoard {
    let mut board = empty_board();
    board.found = true;

    let mut current: Option<usize> = None;

    for line in content.lines() {
        let trimmed = line.trim_end();

        if let Some(heading) = trimmed.strip_prefix("## ") {
            let name = heading.trim();
            current = HORIZONS.iter().position(|h| *h == name);
            continue;
        }

        let Some(col_idx) = current else {
            continue;
        };

        let Some(item) = trimmed.strip_prefix("- ") else {
            continue;
        };

        // Nested bullets (indented) are not top-level cards.
        if line.starts_with(' ') || line.starts_with('\t') {
            continue;
        }

        board.columns[col_idx].cards.push(parse_card(item.trim()));
    }

    board
}

fn parse_card(item: &str) -> RoadmapCard {
    // **Title**: body  or  **Title** body
    if let Some(rest) = item.strip_prefix("**") {
        if let Some(end) = rest.find("**") {
            let title = rest[..end].trim().to_string();
            let mut body = rest[end + 2..].trim().to_string();
            if let Some(stripped) = body.strip_prefix(':') {
                body = stripped.trim().to_string();
            }
            return RoadmapCard { title, body };
        }
    }

    RoadmapCard {
        title: item.to_string(),
        body: String::new(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::time::{SystemTime, UNIX_EPOCH};

    fn sample_md() -> &'static str {
        r#"# Roadmap

Intro text.

## Now

- (none — idle)

## Queued

- **Wiki content enrichment**: improve docs
- Plain bullet without bold

## Exploring

- **Codebase Context Packer (Repomix)**: Compress the tree

## Notes

- Should be ignored

## Parked

- Cross-compilation CI pipelines

## Shipped

- **OpenSpec workflow visibility** (2026-07-20): done
"#
    }

    #[test]
    fn parses_known_horizons_and_title_split() {
        let board = parse_roadmap_markdown(sample_md());
        assert!(board.found);
        assert_eq!(board.columns.len(), 5);
        assert_eq!(board.columns[0].name, "Now");
        assert_eq!(board.columns[0].cards.len(), 1);
        assert_eq!(board.columns[0].cards[0].title, "(none — idle)");

        assert_eq!(board.columns[1].cards.len(), 2);
        assert_eq!(board.columns[1].cards[0].title, "Wiki content enrichment");
        assert_eq!(board.columns[1].cards[0].body, "improve docs");
        assert_eq!(board.columns[1].cards[1].title, "Plain bullet without bold");
        assert_eq!(board.columns[1].cards[1].body, "");

        assert_eq!(
            board.columns[2].cards[0].title,
            "Codebase Context Packer (Repomix)"
        );
        assert_eq!(
            board.columns[3].cards[0].title,
            "Cross-compilation CI pipelines"
        );
        assert_eq!(
            board.columns[4].cards[0].title,
            "OpenSpec workflow visibility"
        );
        assert!(board.columns[4].cards[0].body.contains("done"));
    }

    #[test]
    fn ignores_unknown_headings() {
        let board = parse_roadmap_markdown(sample_md());
        let all_titles: Vec<_> = board
            .columns
            .iter()
            .flat_map(|c| c.cards.iter().map(|card| card.title.as_str()))
            .collect();
        assert!(!all_titles.iter().any(|t| t.contains("ignored")));
    }

    #[test]
    fn ignores_nested_bullets() {
        let md = "## Queued\n\n- Parent card\n  - nested child\n\t- tab nested\n";
        let board = parse_roadmap_markdown(md);
        assert_eq!(board.columns[1].cards.len(), 1);
        assert_eq!(board.columns[1].cards[0].title, "Parent card");
    }

    #[test]
    fn missing_file_returns_empty_columns() {
        let stamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let dir = std::env::temp_dir().join(format!("krokis-roadmap-missing-{stamp}"));
        fs::create_dir_all(&dir).unwrap();
        let board = gather_roadmap(&dir);
        let _ = fs::remove_dir_all(&dir);
        assert!(!board.found);
        assert_eq!(board.columns.len(), 5);
        assert!(board.columns.iter().all(|c| c.cards.is_empty()));
    }
}
