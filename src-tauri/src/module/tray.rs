use tauri::{
    menu::{Menu, MenuEvent, MenuItem},
    tray::{TrayIcon, TrayIconBuilder, TrayIconEvent},
    Manager,
};

pub fn create_tray(app: &tauri::AppHandle) -> Result<TrayIcon, Box<dyn std::error::Error>> {
    // 创建菜单项
    let show_i = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let hide_i = MenuItem::with_id(app, "hide", "隐藏窗口", true, None::<&str>)?;
    let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;

    // 创建托盘菜单
    let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

    // 创建托盘图标
    let tray = TrayIconBuilder::new()
        .menu(&menu)
        .show_menu_on_left_click(true) // 左键点击时显示菜单
        .on_menu_event(move |app, event| {
            handle_menu_event(app, event);
        })
        .on_tray_icon_event(move |tray, event| {
            handle_tray_icon_event(tray, event);
        })
        .build(app)?;

    Ok(tray)
}

fn handle_menu_event(app: &tauri::AppHandle, event: MenuEvent) {
    match event.id().0.as_str() {
        "quit" => {
            app.exit(0);
        }
        "show" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        "hide" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.hide();
            }
        }
        _ => {}
    }
}

fn handle_tray_icon_event(_tray: &TrayIcon, event: TrayIconEvent) {
    match event {
        TrayIconEvent::Click {
            button,
            button_state,
            position,
            ..
        } => {
            println!(
                "托盘图标被点击: 按钮={:?}, 状态={:?}, 位置={:?}",
                button, button_state, position
            );
        }
        TrayIconEvent::DoubleClick {
            button, position, ..
        } => {
            println!("托盘图标被双击: 按钮={:?}, 位置={:?}", button, position);
        }
        TrayIconEvent::Enter { position, .. } => {
            println!("托盘图标被右键点击: 位置={:?}", position);
        }
        TrayIconEvent::Move { position, .. } => {
            println!("鼠标移动到托盘图标: 位置={:?}", position);
        }
        TrayIconEvent::Leave { id, .. } => {
            println!("鼠标离开托盘图标: 事件名={:?}", id);
        }
        _ => todo!(),
    }
}
