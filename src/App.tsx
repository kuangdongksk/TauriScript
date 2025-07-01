import { Toaster } from "@/components/ui/sonner";
import "./App.less";
import Home from "./pages/home/Home";

function App() {
  return (
    <div className="flex h-screen">
      <Toaster />
      <Home />
    </div>
  );
}

export default App;
