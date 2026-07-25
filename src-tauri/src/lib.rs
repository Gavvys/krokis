pub mod doctor;
pub mod logger;
pub mod metrics;
pub mod projects;
pub mod roadmap;
pub mod wiki;

use doctor::DoctorReport;
use metrics::TelemetryData;
use projects::ProjectState;
use roadmap::RoadmapBoard;
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Wry};
use tauri_plugin_dialog::DialogExt;
use wiki::WikiFile;

fn resolve_workspace(app: &AppHandle<Wry>, project_path: Option<String>) -> PathBuf {
    if let Some(ref p) = project_path {
        if !p.trim().is_empty() && Path::new(p).exists() {
            return PathBuf::from(p);
        }
    }
    let state = projects::get_project_state(app);
    PathBuf::from(state.active_project)
}

#[tauri::command]
fn log_message(level: String, context: String, message: String) {
    let lvl = match level.to_lowercase().as_str() {
        "verbose" => logger::LogLevel::Verbose,
        "warn" | "warning" => logger::LogLevel::Warn,
        "error" => logger::LogLevel::Error,
        _ => logger::LogLevel::Info,
    };
    logger::log(lvl, &context, &message);
}

#[tauri::command]
fn log_error(context: String, message: String) {
    logger::log_error(&context, &message);
}

#[tauri::command]
async fn run_doctor(app: AppHandle<Wry>, project_path: Option<String>) -> Result<DoctorReport, String> {
    logger::log_info("ipc::run_doctor", &format!("Running doctor for candidate path: {:?}", project_path));
    let ws = resolve_workspace(&app, project_path);

    let ws_clone = ws.clone();
    let report = tauri::async_runtime::spawn_blocking(move || {
        doctor::run_doctor(&ws_clone)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error running doctor: {}", e);
        logger::log_error("ipc::run_doctor", &err);
        err
    })??;

    logger::log_info("ipc::run_doctor", &format!("Doctor report created for {}", ws.display()));
    Ok(report)
}

#[tauri::command]
async fn has_doctor_report(app: AppHandle<Wry>, project_path: Option<String>) -> Result<bool, String> {
    let ws = resolve_workspace(&app, project_path);
    let ws_clone = ws.clone();
    let exists = tauri::async_runtime::spawn_blocking(move || {
        doctor::check_doctor_report_exists(&ws_clone)
    }).await.map_err(|e| e.to_string())?;

    Ok(exists)
}

#[tauri::command]
async fn get_insights(app: AppHandle<Wry>, project_path: Option<String>) -> Result<TelemetryData, String> {
    logger::log_info("ipc::get_insights", &format!("Fetching insights for candidate path: {:?}", project_path));
    let ws = resolve_workspace(&app, project_path);
    logger::log_verbose("ipc::get_insights", &format!("Resolved workspace root: {}", ws.display()));

    let ws_clone = ws.clone();
    let telemetry = tauri::async_runtime::spawn_blocking(move || {
        metrics::gather_telemetry(&ws_clone)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error gathering telemetry: {}", e);
        logger::log_error("ipc::get_insights", &err);
        err
    })?;

    logger::log_info(
        "ipc::get_insights",
        &format!(
            "Insights gathered successfully for '{}'. Total Lines: {}, Commits: {}, Active WIP: {}",
            ws.display(), telemetry.codebase.total_lines, telemetry.git.total_commits, telemetry.change_flow.active_wip
        ),
    );
    Ok(telemetry)
}

#[tauri::command]
async fn get_roadmap(app: AppHandle<Wry>, project_path: Option<String>) -> Result<RoadmapBoard, String> {
    logger::log_info("ipc::get_roadmap", &format!("Fetching roadmap for candidate path: {:?}", project_path));
    let ws = resolve_workspace(&app, project_path);

    let ws_clone = ws.clone();
    let board = tauri::async_runtime::spawn_blocking(move || {
        roadmap::gather_roadmap(&ws_clone)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error gathering roadmap: {}", e);
        logger::log_error("ipc::get_roadmap", &err);
        err
    })?;

    logger::log_info(
        "ipc::get_roadmap",
        &format!(
            "Roadmap loaded from {} (found={}): {} columns",
            ws.display(),
            board.found,
            board.columns.len()
        ),
    );
    Ok(board)
}

#[tauri::command]
async fn list_wiki_files(app: AppHandle<Wry>, project_path: Option<String>) -> Result<Vec<WikiFile>, String> {
    logger::log_verbose("ipc::list_wiki_files", &format!("Listing wiki files for candidate path: {:?}", project_path));
    let ws = resolve_workspace(&app, project_path);

    let ws_clone = ws.clone();
    let files = tauri::async_runtime::spawn_blocking(move || {
        wiki::list_wiki_files(&ws_clone)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error listing wiki files: {}", e);
        logger::log_error("ipc::list_wiki_files", &err);
        err
    })?;

    logger::log_info("ipc::list_wiki_files", &format!("Found {} wiki files in {}", files.len(), ws.display()));
    Ok(files)
}

#[tauri::command]
async fn get_wiki_content(app: AppHandle<Wry>, project_path: Option<String>, file_path: String) -> Result<String, String> {
    logger::log_verbose("ipc::get_wiki_content", &format!("Reading wiki file: {}", file_path));
    let ws = resolve_workspace(&app, project_path);

    let ws_clone = ws.clone();
    let file_path_clone = file_path.clone();
    let content = tauri::async_runtime::spawn_blocking(move || {
        wiki::read_wiki_content(&ws_clone, &file_path_clone)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error reading wiki: {}", e);
        logger::log_error("ipc::get_wiki_content", &err);
        err
    })??;

    logger::log_info("ipc::get_wiki_content", &format!("Successfully read {} bytes from '{}'", content.len(), file_path));
    Ok(content)
}

#[tauri::command]
async fn create_wiki_page(app: AppHandle<Wry>, project_path: Option<String>, name: String) -> Result<String, String> {
    logger::log_info("ipc::create_wiki_page", &format!("Creating wiki page: '{}'", name));
    let ws = resolve_workspace(&app, project_path);

    let ws_clone = ws.clone();
    let name_clone = name.clone();
    let filename = tauri::async_runtime::spawn_blocking(move || {
        wiki::create_wiki_page(&ws_clone, &name_clone)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error creating wiki page: {}", e);
        logger::log_error("ipc::create_wiki_page", &err);
        err
    })??;

    logger::log_info("ipc::create_wiki_page", &format!("Created wiki file: '{}'", filename));
    Ok(filename)
}

#[tauri::command]
async fn get_recent_projects(app: AppHandle<Wry>) -> Result<ProjectState, String> {
    logger::log_verbose("ipc::get_recent_projects", "Fetching global project registry");
    let state = tauri::async_runtime::spawn_blocking(move || {
        projects::get_project_state(&app)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error fetching project state: {}", e);
        logger::log_error("ipc::get_recent_projects", &err);
        err
    })?;

    logger::log_info("ipc::get_recent_projects", &format!("Active: '{}', Total registered: {}", state.active_project, state.registry.len()));
    Ok(state)
}

#[tauri::command]
async fn add_recent_project(app: AppHandle<Wry>, project_path: String) -> Result<ProjectState, String> {
    logger::log_info("ipc::add_recent_project", &format!("Setting active project to: '{}'", project_path));
    let state = tauri::async_runtime::spawn_blocking(move || {
        projects::set_active_project(&app, &project_path)
    }).await.map_err(|e| {
        let err = format!("Spawn blocking error setting active project: {}", e);
        logger::log_error("ipc::add_recent_project", &err);
        err
    })??;

    logger::log_info("ipc::add_recent_project", &format!("Successfully activated project: '{}'", state.active_project));
    Ok(state)
}

#[tauri::command]
async fn select_project_folder(app: AppHandle<Wry>) -> Result<Option<String>, String> {
    logger::log_info("ipc::select_project_folder", "Opening native OS folder picker");
    let (tx, rx) = tokio::sync::oneshot::channel();
    app.dialog().file().pick_folder(move |folder| {
        let _ = tx.send(folder);
    });

    match rx.await {
        Ok(Some(path)) => {
            let path_str = path.to_string();
            logger::log_info("ipc::select_project_folder", &format!("User selected folder: '{}'", path_str));
            let state = projects::set_active_project(&app, &path_str)?;
            logger::log_info("ipc::select_project_folder", &format!("Activated selected project: '{}'", state.active_project));
            Ok(Some(path_str))
        }
        Ok(None) => {
            logger::log_info("ipc::select_project_folder", "Folder picker canceled by user");
            Ok(None)
        }
        Err(e) => {
            logger::log_warn("ipc::select_project_folder", &format!("Folder picker channel closed: {}", e));
            Ok(None)
        }
    }
}

pub fn run() {
    logger::log_info("app_runtime", "Starting Krokis Desktop Application");
    let res = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            log_message,
            log_error,
            run_doctor,
            has_doctor_report,
            get_insights,
            get_roadmap,
            list_wiki_files,
            get_wiki_content,
            create_wiki_page,
            get_recent_projects,
            add_recent_project,
            select_project_folder
        ])
        .run(tauri::generate_context!());

    if let Err(e) = res {
        logger::log_error("app_runtime", &format!("Krokis desktop app exit error: {}", e));
    }
}
