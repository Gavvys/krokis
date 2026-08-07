use std::fs::OpenOptions;
use std::io::Write;
use std::path::PathBuf;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum LogLevel {
    Verbose,
    Info,
    Warn,
    Error,
}

impl LogLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            LogLevel::Verbose => "VERBOSE",
            LogLevel::Info => "INFO",
            LogLevel::Warn => "WARN",
            LogLevel::Error => "ERROR",
        }
    }
}

/// Return global ~/.krokis directory path, ensuring it exists.
pub fn krokis_home_dir() -> Option<PathBuf> {
    let home = std::env::var_os("HOME")
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("USERPROFILE").map(PathBuf::from))?;
    let dir = home.join(".krokis");
    if !dir.exists() {
        let _ = std::fs::create_dir_all(&dir);
    }
    Some(dir)
}

/// Centralized logger: outputs formatted logs to terminal (stdout/stderr) and ~/.krokis/app.log
pub fn log(level: LogLevel, context: &str, message: &str) {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let formatted_file = format!(
        "[{}] [{}] [{}] {}\n",
        timestamp,
        level.as_str(),
        context,
        message
    );

    // 1. Output directly to terminal stdout/stderr
    match level {
        LogLevel::Error => eprintln!("\x1b[31m[ERROR]\x1b[0m [{}] {}", context, message),
        LogLevel::Warn => eprintln!("\x1b[33m[WARN]\x1b[0m  [{}] {}", context, message),
        LogLevel::Info => println!("\x1b[32m[INFO]\x1b[0m  [{}] {}", context, message),
        LogLevel::Verbose => println!("\x1b[34m[VERBOSE]\x1b[0m [{}] {}", context, message),
    }

    // 2. Append to ~/.krokis/app.log and ~/.krokis/errors.log (if Error)
    if let Some(dir) = krokis_home_dir() {
        let log_file = dir.join("app.log");
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(log_file) {
            let _ = file.write_all(formatted_file.as_bytes());
        }

        if level == LogLevel::Error {
            let err_file = dir.join("errors.log");
            if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(err_file) {
                let _ = file.write_all(formatted_file.as_bytes());
            }
        }
    }
}

pub fn log_verbose(context: &str, message: &str) {
    log(LogLevel::Verbose, context, message);
}

pub fn log_info(context: &str, message: &str) {
    log(LogLevel::Info, context, message);
}

pub fn log_warn(context: &str, message: &str) {
    log(LogLevel::Warn, context, message);
}

pub fn log_error(context: &str, message: &str) {
    log(LogLevel::Error, context, message);
}
