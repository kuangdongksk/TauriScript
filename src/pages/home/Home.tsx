// import { options } from "@/utils/tray";
// import { TrayIcon } from "@tauri-apps/api/tray";
// import { useCallback } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AppSidebar from "./components/AppSidebar";

function Home() {
  // const tray = useCallback(async () => await TrayIcon.new(options), []);

  return (
    <div className="flex h-screen w-full bg-primary text-primary-foreground">
      {/* 侧边栏 */}
      <SidebarProvider>
        <AppSidebar />
        {/* 主内容区 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

export default Home;
