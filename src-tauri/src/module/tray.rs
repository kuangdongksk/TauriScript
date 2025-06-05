use tauri::{
    Manager,
    menu::{ Menu, MenuEvent, MenuItem, Submenu },
    tray::{ TrayIcon, TrayIconBuilder, TrayIconEvent },
};

pub fn create_tray(app: &tauri::AppHandle) -> Result<TrayIcon, Box<dyn std::error::Error>> {
    // 创建托盘菜单
    let menu = Menu::new()
        .add_item(MenuItem::new("show", "显示窗口"))
        .add_item(MenuItem::new("hide", "隐藏窗口"))
        .add_native_item(MenuItem::Separator)
        .add_item(MenuItem::new("quit", "退出"));

    // 创建托盘图标
    let tray = TrayIconBuilder::new()
        .menu(&menu)
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
    match event.id().as_str() {
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

fn handle_tray_icon_event(tray: &TrayIcon, event: TrayIconEvent) {
    if let TrayIconEvent::Click { click_type, .. } = event {
        if click_type == ClickType::Left {
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
    }
}
