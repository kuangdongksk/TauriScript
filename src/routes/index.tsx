import { ReactNode } from "react";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import SettingsIcon from "@mui/icons-material/Settings";
import NoteIcon from "@mui/icons-material/Note";
import Pomodoro from "../pages/Pomodoro/Pomodoro";
import Setting from "../pages/Setting/Setting";
import VditorNote from "../pages/Vditor";
import BreakOverlay from "../pages/Pomodoro/BreakOverlay";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  icon?: ReactNode;
  title?: string;
  showInSidebar?: boolean;
  children?: RouteConfig[];
}

const routes: RouteConfig[] = [
  {
    path: "/break-overlay",
    element: <BreakOverlay />,
    showInSidebar: false,
  },
  {
    path: "/vditorNote",
    element: <VditorNote />,
    icon: <NoteIcon />,
    title: "笔记",
    showInSidebar: true,
  },
  {
    path: "/pomodoro",
    element: <Pomodoro />,
    icon: <AccessAlarmsIcon />,
    title: "番茄钟",
    showInSidebar: true,
  },
  {
    path: "/setting",
    element: <Setting />,
    icon: <SettingsIcon />,
    title: "设置",
    showInSidebar: true,
  },
  {
    path: "/",
    element: (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl text-gray-600 dark:text-gray-300">
          请从左侧选择工具
        </h1>
      </div>
    ),
    showInSidebar: false,
  },
];

export default routes;
