import { Provider } from "jotai";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./pages/Setting/components/theme";
import router from "./routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider>
        <AuthProvider>
          <DndProvider backend={HTML5Backend}>
            <Toaster />
            <RouterProvider router={router} />
          </DndProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
