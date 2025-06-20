import { SidebarProvider } from "@/components/ui/sidebar";
import routes from "@/routes";
import { Route, Routes } from "react-router-dom";
import BreakOverlay from "../Pomodoro/BreakOverlay";
import AppSidebar from "./components/AppSidebar";

function Home() {
  return (
    <Routes>
      {/* 休息提醒蒙层路由 */}
      <Route path="/break-overlay" element={<BreakOverlay />} />

      {/* 主应用内容路由 */}
      <Route
        path="*"
        element={
          <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full bg-background">
              {/* 侧边栏 */}
              <AppSidebar />

              {/* 主内容区 */}
              <main className="flex-1 overflow-auto">
                <Routes>
                  {routes.map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        }
      />
    </Routes>
  );
}

export default Home;
