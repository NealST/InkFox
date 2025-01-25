// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod read_dir_recursive;

use std::path::Path;
use read_dir_recursive::{DirectoryInfo, read_dir_recursive};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_dir_info(path: &str) -> DirectoryInfo {
  let path = Path::new(path);
  let dir_info = read_dir_recursive(path);
  let mut result_dir_info: DirectoryInfo;

  match dir_info {
    Ok(value) => result_dir_info = value,
    Err(e) => result_dir_info = DirectoryInfo {
      path: String::new(),
      files: Vec::new(),
      subdirectories: Vec::new()
    }
  }
  
  result_dir_info
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![get_dir_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
