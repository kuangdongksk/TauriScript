// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod module;
use module::pomodoro::{
  end_break,
  postpone_break,
  show_break_overlay,
  BreakState,
};
use module::tray::create_tray;
use tauri_plugin_autostart::{ init, MacosLauncher };

fn main() {
  tauri::Builder
    ::default()
    .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None))
    .plugin(tauri_plugin_upload::init())
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_store::Builder::new().build())
    .plugin(tauri_plugin_sql::Builder::new().build())
    .plugin(tauri_plugin_window_state::Builder::new().build())
    .plugin(init(MacosLauncher::LaunchAgent, None))
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_fs::init())
    .manage(BreakState(std::sync::Mutex::new(None)))
    .setup(|app| {
      create_tray(&app.handle())?;
      Ok(())
    })
    .invoke_handler(
      tauri::generate_handler![show_break_overlay, end_break, postpone_break]
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
