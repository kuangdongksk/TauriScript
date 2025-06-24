import App from "@/App";
import NoteEditor from "@/pages/Note";
import { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import VditorNote from "../pages/Note/Vditor";
import BreakOverlay from "../pages/Pomodoro/BreakOverlay";
import Pomodoro from "../pages/Pomodoro/Pomodoro";
import Setting from "../pages/Setting/Setting";

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
        path: "/noteEditor",
        element: <NoteEditor />,
        children: [
          {
            path: "/noteEditor/vditorNote",
            element: <VditorNote />,
          },
        ],
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
