import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import Home from "./pages/home/Home";

function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen">
          <Toaster />
          <Home />
        </div>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
