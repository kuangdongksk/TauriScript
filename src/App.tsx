import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <DndProvider backend={HTML5Backend}>
          <Toaster />
          <Home />
        </DndProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
