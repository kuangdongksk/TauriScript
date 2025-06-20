// import { options } from "@/utils/tray";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import SettingsIcon from "@mui/icons-material/Settings";
// import { TrayIcon } from "@tauri-apps/api/tray";
// import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { NavLink, Route, Routes } from "react-router-dom";
import BreakOverlay from "../Pomodoro/BreakOverlay";
import Pomodoro from "../Pomodoro/Pomodoro";
import Setting from "../Setting/Setting";
import VditorNote from "../Vditor";

function Home() {
  // const tray = useCallback(async () => await TrayIcon.new(options), []);

  return (
    <Routes>
      {/* 休息提醒蒙层路由 */}
      <Route path="/break-overlay" element={<BreakOverlay />} />

      {/* 主应用内容路由 */}
      <Route
        path="*"
        element={
          <div className="flex h-screen w-full bg-primary text-primary-foreground">
            {/* 侧边栏 */}
            <aside className="w-64  border-r  ">
              <nav className="p-4">
                <h2 className="text-lg font-semibold mb-4">工具箱</h2>
                <ul className="space-y-2">
                  <li>
                    <NavLink to="/vditorNote">
                      {(isActive) => {
                        return (
                          <Button variant={isActive ? "default" : "ghost"}>
                            <AccessAlarmsIcon />
                            笔记
                          </Button>
                        );
                      }}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/pomodoro">
                      {(isActive) => {
                        return (
                          <Button variant={isActive ? "default" : "ghost"}>
                            <AccessAlarmsIcon />
                            番茄钟
                          </Button>
                        );
                      }}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/setting">
                      {(isActive) => {
                        return (
                          <Button variant={isActive ? "default" : "ghost"}>
                            <SettingsIcon />
                            设置
                          </Button>
                        );
                      }}
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/vditorNote" element={<VditorNote />} />
                <Route
                  path="/"
                  element={
                    <div className="flex items-center justify-center h-full">
                      <h1 className="text-2xl text-gray-600 dark:text-gray-300">
                        请从左侧选择工具
                      </h1>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default Home;
