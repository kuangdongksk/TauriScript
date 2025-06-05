use tauri::tray::TrayIconBuilder;
use tauri::{ Manager, tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent } };

tauri::Builder::default().setup(|app| {
    let tray = TrayIconBuilder::new().build(app)?;
    Ok(())
});

TrayIconBuilder::new().on_menu_event(|app, event| {
    match event.id.as_ref() {
        "quit" => {
            println!("quit menu item was clicked");
            app.exit(0);
        }
        _ => {
            println!("menu item {:?} not handled", event.id);
        }
    }
});

TrayIconBuilder::new().on_tray_icon_event(|tray, event| {
    match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } => {
            println!("left click pressed and released");
            // in this example, let's show and focus the main window when the tray is clicked
            let app = tray.app_handle();
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        _ => {
            println!("unhandled event {event:?}");
        }
    }
});
