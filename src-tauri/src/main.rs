// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{Emitter, Manager, WebviewWindow};

// 保存当前活动的休息窗口
struct BreakState(Mutex<Option<WebviewWindow>>);

#[derive(Serialize, Deserialize, Clone)]
struct BreakParams {
    break_time: u32, // 休息时间（分钟）
}

// 显示休息提醒蒙层
#[tauri::command]
async fn show_break_overlay(
    window: WebviewWindow,
    app_handle: tauri::AppHandle,
    break_state: tauri::State<'_, BreakState>,
    params: BreakParams,
) -> Result<(), String> {
    // 如果已经存在休息窗口，先关闭它
    if let Some(existing_window) = break_state.0.lock().unwrap().take() {
        existing_window.close().map_err(|e| e.to_string())?;
    }

    // 获取主窗口的位置和大小
    let main_window = window.clone();
    let monitor = main_window
        .current_monitor()
        .map_err(|e| e.to_string())?
        .expect("无法获取当前显示器");

    let monitor_size = monitor.size();

    // 创建新的休息提醒窗口
    let break_window = tauri::WebviewWindowBuilder::new(
        &app_handle,
        "break_overlay",
        tauri::WebviewUrl::App("localhost:1420/break-overlay".into()),
    )
    .title("休息提醒")
    .fullscreen(true)
    .decorations(true) // 无边框
    .transparent(true) // 透明背景
    .always_on_top(false) // 不总在最上层
    .position(0.0, 0.0)
    .inner_size(monitor_size.width as f64, monitor_size.height as f64)
    .build()
    .map_err(|e| e.to_string())?;

    // 存储休息窗口引用
    *break_state.0.lock().unwrap() = Some(break_window.clone());

    // 发送休息时间参数到前端
    break_window
        .emit("break-params", params)
        .map_err(|e| e.to_string())?;

    Ok(())
}

// 结束休息
#[tauri::command]
async fn end_break(
    app_handle: tauri::AppHandle,
    break_state: tauri::State<'_, BreakState>,
) -> Result<(), String> {
    // 关闭休息窗口
    if let Some(break_window) = break_state.0.lock().unwrap().take() {
        break_window.close().map_err(|e| e.to_string())?;
    }

    // 通知主窗口休息结束
    if let Some(main_window) = app_handle.get_webview_window("main") {
        main_window
            .emit("break-ended", ())
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

// 延长休息时间
#[tauri::command]
async fn postpone_break(
    break_state: tauri::State<'_, BreakState>,
    minutes: u32,
) -> Result<(), String> {
    // 通知休息窗口延长时间
    if let Some(break_window) = break_state.0.lock().unwrap().as_ref() {
        break_window
            .emit("postpone-break", minutes)
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(BreakState(Mutex::new(None)))
        .invoke_handler(tauri::generate_handler![
            show_break_overlay,
            end_break,
            postpone_break,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
