import { Provider } from "jotai";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./pages/Setting/components/theme";
import router from "./routes";
import api from "./services/Requestor";
import { serviceOptions } from "./services/index.defs";
import { Toaster } from "./components/ui/sonner";

serviceOptions.axios = api;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider>
        <DndProvider backend={HTML5Backend}>
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </DndProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
