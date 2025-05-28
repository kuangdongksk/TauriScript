import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";

// 组件导入
import BreakOverlay from "./pages/BreakOverlay";
import Pomodoro from "./pages/Pomodoro";

function App() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* 主应用路由 */}
      <Routes>
        {/* 休息提醒蒙层路由 */}
        <Route path="/break-overlay" element={<BreakOverlay />} />

        {/* 主应用内容路由 */}
        <Route
          path="*"
          element={
            <div className="flex h-screen">
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
                  </ul>
                </nav>
              </aside>

              {/* 主内容区 */}
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/pomodoro" element={<Pomodoro />} />
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
