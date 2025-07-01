import App from "@/App";
import NoteEditor from "@/pages/Note";
import CherryMarkdown from "@/pages/Note/CherryMarkdown";
import MilkdownEditor from "@/pages/Note/MilkDown";
import Hello from "@/pages/hello";
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
        children: [
          {
            index: true,
            element: <NoteEditor />,
          },
          {
            path: "/noteEditor/vditorNote",
            element: <VditorNote />,
          },
          {
            path: "/noteEditor/milkdown",
            element: <MilkdownEditor />,
          },
          {
            path: "/noteEditor/cherry",
            element: <CherryMarkdown />,
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
  {
    path: "/hello",
    element: <Hello />,
  },
]);

export default router;
