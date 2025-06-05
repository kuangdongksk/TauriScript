import { TrayIcon } from "@tauri-apps/api/tray";
import { useCallback } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import BreakOverlay from "./pages/Pomodoro/BreakOverlay";
import Pomodoro from "./pages/Pomodoro/Pomodoro";
import Setting from "./pages/Setting/Setting";
import { options } from "./utils/tray";

function App() {
  const tray = useCallback(async () => await TrayIcon.new(options), []);

  return (
    <div className="flex h-screen ">
      {/* 主应用路由 */}
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
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
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
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
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
    </div>
  );
}

export default App;