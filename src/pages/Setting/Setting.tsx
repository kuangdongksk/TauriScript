import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Setting = () => {
  const [autoStart, setAutoStart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化时检查自启动状态
    const checkAutoStart = async () => {
      try {
        const enabled = await isEnabled();
        setAutoStart(enabled);
      } catch (error) {
        console.error("检查自启动状态失败:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAutoStart();
  }, []);

  const handleAutoStartChange = async (checked: boolean) => {
    try {
      if (checked) {
        await enable();
      } else {
        await disable();
      }
      setAutoStart(checked);
    } catch (error) {
      console.error("设置自启动状态失败:", error);
      // 如果设置失败，恢复之前的状态
      setAutoStart(!checked);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        设置
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="airplane-mode">开机自动启动 Mode</Label>
          <Switch
            // checked={autoStart}
            onCheckedChange={(e) => handleAutoStartChange(e)}
            id="airplane-mode"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">主题色</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Setting;
