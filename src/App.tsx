import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./App.less";
import Home from "./pages/home/Home";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token === "未登录") {
      toast.error("您还未登录！");
      navigate("/hello");
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Home />
    </div>
  );
}

export default App;
