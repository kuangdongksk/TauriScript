import { breakTimeAtom } from "@/store/breakStore";
import { useAtom } from "jotai";
import React from "react";

export interface PomodoroConfig {
  focusTime: number; // 专注时间（分钟）
  breakTime: number; // 休息时间（分钟）
  cycles: number; // 循环次数
}

interface ConfigFormProps {
  config: PomodoroConfig;
  onConfigChange: (newConfig: PomodoroConfig) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onConfigChange }) => {
  const [breakTime, setBreakTime] = useAtom(breakTimeAtom);

  // 保存配置
  const [savedConfigs, setSavedConfigs] = React.useState<
    Array<PomodoroConfig & { name: string }>
  >([]);
  const [configName, setConfigName] = React.useState("");

  // 处理配置变更
  const handleConfigChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof PomodoroConfig
  ) => {
    const value = parseInt(e.target.value) || 0;
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
    if (field === "breakTime") {
      setBreakTime(value);
    }
  };

  // 保存当前配置
  const saveConfig = () => {
    if (configName.trim() === "") return;

    const newConfig = { ...config, name: configName };
    setSavedConfigs([...savedConfigs, newConfig]);
    setConfigName("");

    // TODO 调用 Tauri 命令保存配置
    // invoke("save_pomodoro_config", { config: newConfig });
  };

  // 加载保存的配置
  const loadConfig = (savedConfig: PomodoroConfig & { name: string }) => {
    onConfigChange({
      focusTime: savedConfig.focusTime,
      breakTime: savedConfig.breakTime,
      cycles: savedConfig.cycles,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        设置
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="focusTime"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            专注时间（分钟）
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            type="number"
            id="focusTime"
            value={config.focusTime}
            onChange={(e) => handleConfigChange(e, "focusTime")}
          />
        </div>

        <div>
          <label
            htmlFor="breakTime"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            休息时间（分钟）
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            type="number"
            id="breakTime"
            value={config.breakTime}
            onChange={(e) => handleConfigChange(e, "breakTime")}
          />
        </div>

        <div>
          <label
            htmlFor="cycles"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            循环次数
          </label>
          <input
            type="number"
            id="cycles"
            value={config.cycles}
            onChange={(e) => handleConfigChange(e, "cycles")}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="pt-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="配置名称"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={saveConfig}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              保存
            </button>
          </div>
        </div>
      </div>

      {/* 已保存的配置 */}
      {savedConfigs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            已保存的配置
          </h3>
          <div className="space-y-2">
            {savedConfigs.map((saved, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {saved.name} ({saved.focusTime}分钟专注 / {saved.breakTime}
                  分钟休息 x {saved.cycles}循环)
                </span>
                <button
                  onClick={() => loadConfig(saved)}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  加载
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigForm;
