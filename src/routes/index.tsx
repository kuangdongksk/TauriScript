import App from "@/App";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import NoteIcon from "@mui/icons-material/Note";
import SettingsIcon from "@mui/icons-material/Settings";
import { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import BreakOverlay from "../pages/Pomodoro/BreakOverlay";
import Pomodoro from "../pages/Pomodoro/Pomodoro";
import Setting from "../pages/Setting/Setting";
import VditorNote from "../pages/Vditor";

export interface RouteConfig {
  path: string;
  element: ReactNode;
  icon?: ReactNode;
  title?: string;
  children?: RouteConfig[];
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/vditorNote",
        element: <VditorNote />,
      },
      {
        path: "/pomodoro",
        element: <Pomodoro />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
    ],
  },
  {
    path: "/break-overlay",
    element: <BreakOverlay />,
  },
]);

export default router;

export const mainRoute: RouteConfig[] = [
  {
    path: "/vditorNote",
    element: <VditorNote />,
    icon: <NoteIcon />,
    title: "笔记",
  },
  {
    path: "/pomodoro",
    element: <Pomodoro />,
    icon: <AccessAlarmsIcon />,
    title: "番茄钟",
  },
  {
    path: "/setting",
    element: <Setting />,
    icon: <SettingsIcon />,
    title: "设置",
  },
];
