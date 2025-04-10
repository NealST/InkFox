// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod chat_stream;
mod read_dir_recursive;
mod search_content;
use chat_stream::chat_stream;
use read_dir_recursive::read_dir_recursive;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_dir_info(path: &str) -> String {
    println!("input path: {}", path);
    let dir_info = read_dir_recursive(path);

    dir_info
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![chat_stream, get_dir_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
