// import { options } from "@/utils/tray";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import SettingsIcon from "@mui/icons-material/Settings";
// import { TrayIcon } from "@tauri-apps/api/tray";
// import { useCallback } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import BreakOverlay from "../Pomodoro/BreakOverlay";
import Pomodoro from "../Pomodoro/Pomodoro";
import Setting from "../Setting/Setting";

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
          <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* 侧边栏 */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
              <nav className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  工具箱
                </h2>
                <ul className="space-y-2">
                  <li>
                    <NavLink
                      to="/pomodoro"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <AccessAlarmsIcon />
                      番茄钟
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/setting"
                      className={({ isActive }) =>
                        `flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <SettingsIcon />
                      设置
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
