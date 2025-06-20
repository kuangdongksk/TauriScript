import { Toaster } from "@/components/ui/sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ThemeProvider, ThemeSwitch } from "@/components/theme";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <DndProvider backend={HTML5Backend}>
          <div className="fixed top-4 right-4 z-50">
            <ThemeSwitch />
          </div>
          <Toaster />
          <Home />
        </DndProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;