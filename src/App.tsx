import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./App.less";
import Home from "./pages/home/Home";
import { authTokenA } from "./store/authStore";

function App() {
  const navigate = useNavigate();
  const token = useAtomValue(authTokenA);

  useEffect(() => {
    if (!token) {
      toast.error("您还未登录！");
      navigate("/hello");
    }
  }, [token]);

  return (
    <div className="flex h-screen">
      <Home />
    </div>
  );
}

export default App;
