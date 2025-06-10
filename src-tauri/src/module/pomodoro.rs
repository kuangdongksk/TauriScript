use serde::{ Deserialize, Serialize };
use std::sync::Mutex;
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use tauri::{ Emitter, Manager, WebviewWindow, AppHandle };

// 保存当前活动的休息窗口
pub struct BreakState(pub Mutex<Option<WebviewWindow>>);

// 番茄钟配置
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PomodoroConfig {
    pub name: String,
    pub focus_time: u32,
    pub break_time: u32,
    pub loop_times: u32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct BreakParams {
    pub break_time: u32, // 休息时间（分钟）
}

// 获取配置文件路径
fn get_config_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("Failed to get app data directory");
    
    // 确保目录存在
    fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
    
    app_dir.join("pomodoro_configs.json")
}

// 读取所有保存的配置
fn read_configs(app_handle: &AppHandle) -> HashMap<String, PomodoroConfig> {
    let config_path = get_config_path(app_handle);
    
    if !config_path.exists() {
        return HashMap::new();
    }
    
    match fs::read_to_string(&config_path) {
        Ok(content) => {
            match serde_json::from_str(&content) {
                Ok(configs) => configs,
                Err(e) => {
                    eprintln!("Failed to parse config file: {}", e);
                    HashMap::new()
                }
            }
        },
        Err(e) => {
            eprintln!("Failed to read config file: {}", e);
            HashMap::new()
        }
    }
}

// 写入配置到文件
fn write_configs(app_handle: &AppHandle, configs: &HashMap<String, PomodoroConfig>) -> Result<(), String> {
    let config_path = get_config_path(app_handle);
    
    let json = serde_json::to_string_pretty(configs)
        .map_err(|e| format!("Failed to serialize configs: {}", e))?;
    
    fs::write(&config_path, json)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    Ok(())
}

// 获取所有保存的番茄钟配置
#[tauri::command(rename = "Pomodoro_getPomodoroConfigs")]
pub async fn get_pomodoro_configs(app_handle: AppHandle) -> Result<Vec<PomodoroConfig>, String> {
    let configs = read_configs(&app_handle);
    let config_list: Vec<PomodoroConfig> = configs.values().cloned().collect();
    Ok(config_list)
}

// 保存番茄钟配置
#[tauri::command(rename = "Pomodoro_savePomodoroConfig")]
pub async fn save_pomodoro_config(app_handle: AppHandle, config: PomodoroConfig) -> Result<(), String> {
    let mut configs = read_configs(&app_handle);
    
    // 添加或更新配置
    configs.insert(config.name.clone(), config);
    
    // 写入到文件
    write_configs(&app_handle, &configs)
}

// 删除番茄钟配置
#[tauri::command(rename = "Pomodoro_deletePomodoroConfig")]
pub async fn delete_pomodoro_config(app_handle: AppHandle, name: String) -> Result<(), String> {
    let mut configs = read_configs(&app_handle);
    
    // 检查配置是否存在
    if !configs.contains_key(&name) {
        return Err(format!("配置 '{}' 不存在", name));
    }
    
    // 删除配置
    configs.remove(&name);
    
    // 写入到文件
    write_configs(&app_handle, &configs)
}

// 显示休息提醒蒙层
#[tauri::command(rename = "Pomodoro_showBreakOverlay")]
pub async fn show_break_overlay(
    window: WebviewWindow,
    app_handle: tauri::AppHandle,
    break_state: tauri::State<'_, BreakState>,
    params: BreakParams
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
    let break_window = tauri::WebviewWindowBuilder
        ::new(&app_handle, "break_overlay", tauri::WebviewUrl::App("/break-overlay".into()))
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
    break_window.emit("break-params", params).map_err(|e| e.to_string())?;

    Ok(())
}

// 结束休息
#[tauri::command(rename = "Pomodoro_endBreak")]
pub async fn end_break(
    app_handle: tauri::AppHandle,
    break_state: tauri::State<'_, BreakState>
) -> Result<(), String> {
    // 关闭休息窗口
    if let Some(break_window) = break_state.0.lock().unwrap().take() {
        break_window.close().map_err(|e| e.to_string())?;
    }

    // 通知主窗口休息结束
    if let Some(main_window) = app_handle.get_webview_window("main") {
        main_window.emit("break-ended", ()).map_err(|e| e.to_string())?;
    }

    Ok(())
}

// 延长休息时间
#[tauri::command(rename = "Pomodoro_postponeBreak")]
pub async fn postpone_break(
    break_state: tauri::State<'_, BreakState>,
    minutes: u32
) -> Result<(), String> {
    // 通知休息窗口延长时间
    if let Some(break_window) = break_state.0.lock().unwrap().as_ref() {
        break_window.emit("postpone-break", minutes).map_err(|e| e.to_string())?;
    }

    Ok(())
}