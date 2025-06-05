// use tauri::{AppHandle, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

// pub fn create_tray() -> SystemTray {
//     // 创建系统托盘菜单
//     let tray_menu = SystemTrayMenu::new()
//         .add_item(SystemTrayMenuItem::new("show", "显示窗口"))
//         .add_native_item(SystemTrayMenuItem::Separator)
//         .add_item(SystemTrayMenuItem::new("quit", "退出"));

//     // 创建系统托盘
//     SystemTray::new().with_menu(tray_menu)
// }

// pub fn handle_tray_event(app: &AppHandle, event: SystemTrayEvent) {
//     match event {
//         // 左键点击
//         SystemTrayEvent::LeftClick { .. } => {
//             let window = app.get_window("main").unwrap();
//             if window.is_visible().unwrap() {
//                 window.hide().unwrap();
//             } else {
//                 window.show().unwrap();
//                 window.set_focus().unwrap();
//             }
//         }
//         // 菜单事件
//         SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
//             "show" => {
//                 let window = app.get_window("main").unwrap();
//                 window.show().unwrap();
//                 window.set_focus().unwrap();
//             }
//             "quit" => {
//                 app.exit(0);
//             }
//             _ => {}
//         },
//         _ => {}
//     }
// }
