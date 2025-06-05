import { useEffect, useState } from "react";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";

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
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => handleAutoStartChange(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="text-gray-700 dark:text-gray-300">开机自动启动</span>
        </label>
      </div>
    </div>
  );
};

export default Setting;
