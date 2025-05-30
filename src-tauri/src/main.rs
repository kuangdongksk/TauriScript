// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod module;
use module::pomodoro::{end_break, postpone_break, show_break_overlay, BreakState};

fn main() {
    tauri::Builder::default()
        .manage(BreakState(std::sync::Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            show_break_overlay,
            end_break,
            postpone_break,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
