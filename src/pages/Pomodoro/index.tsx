import { invoke } from "@tauri-apps/api/core";
import { Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useBreakStore } from "../../store/breakStore";

interface PomodoroConfig {
  focusTime: number; // 专注时间（分钟）
  breakTime: number; // 休息时间（分钟）
  cycles: number; // 循环次数
}

type TimerStatus = "准备就绪" | "专注中" | "休息中";

const Pomodoro = () => {
  const { 令休息时间为: setGlobalBreakTime } = useBreakStore();
  // 番茄钟配置
  const [config, setConfig] = useState<PomodoroConfig>({
    focusTime: 1,
    breakTime: 1,
    cycles: 4,
  });

  // 计时器状态
  const [status, setStatus] = useState<TimerStatus>("准备就绪");
  const [timeLeft, setTimeLeft] = useState(0); // 剩余时间（秒）
  const [isActive, setIsActive] = useState(false); // 计时器是否激活
  const [currentCycle, setCurrentCycle] = useState(1); // 当前循环次数

  // 保存配置
  const [savedConfigs, setSavedConfigs] = useState<
    Array<PomodoroConfig & { name: string }>
  >([]);
  const [configName, setConfigName] = useState("");

  // 处理配置变更
  const handleConfigChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof PomodoroConfig
  ) => {
    const value = parseInt(e.target.value) || 0;
    setConfig({ ...config, [field]: value });
    setGlobalBreakTime(config.breakTime);
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
    setConfig({
      focusTime: savedConfig.focusTime,
      breakTime: savedConfig.breakTime,
      cycles: savedConfig.cycles,
    });
  };

  // 开始番茄钟
  const startTimer = () => {
    if (status === "准备就绪") {
      setStatus("专注中");
      setTimeLeft(config.focusTime * 60);
      setCurrentCycle(1);
    }
    setIsActive(true);
  };

  // 暂停番茄钟
  const pauseTimer = () => {
    setIsActive(false);
  };

  // 重置番茄钟
  const resetTimer = () => {
    setIsActive(false);
    setStatus("准备就绪");
    setTimeLeft(0);
    setCurrentCycle(1);
  };

  // 监听休息结束状态
  const { 休息是否结束: isBreakEnded, 开始休息: resetBreakEnded } =
    useBreakStore();

  useEffect(() => {
    if (isBreakEnded) {
      // 休息结束，开始新的专注时间
      if (currentCycle < config.cycles) {
        // 还有循环，继续专注
        setCurrentCycle((prev) => prev + 1);
        setStatus("专注中");
        setTimeLeft(config.focusTime * 60);
        setIsActive(true);
      } else {
        // 所有循环完成
        resetTimer();
      }
      // 重置休息结束状态
      resetBreakEnded();
    }
  }, [
    isBreakEnded,
    config.cycles,
    config.focusTime,
    currentCycle,
    resetBreakEnded,
  ]);

  // 处理计时器逻辑
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // 时间结束，切换状态
      if (status === "专注中") {
        // 专注时间结束，显示休息提醒
        showBreakOverlay();
        setStatus("休息中");
        setTimeLeft(config.breakTime * 60);
      } else if (status === "休息中") {
        // 休息时间结束
        if (currentCycle < config.cycles) {
          // 还有循环，继续专注
          setCurrentCycle((prev) => prev + 1);
          setStatus("专注中");
          setTimeLeft(config.focusTime * 60);
        } else {
          // 所有循环完成
          resetTimer();
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, status, currentCycle, config]);

  // 显示休息提醒蒙层
  const { 令休息时间为 } = useBreakStore();

  const showBreakOverlay = async () => {
    令休息时间为(config.breakTime);

    await invoke("show_break_overlay", {
      params: {
        break_time: config.breakTime,
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        番茄钟
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 番茄钟设置 */}
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
                type="number"
                id="focusTime"
                value={config.focusTime}
                onChange={(e) => handleConfigChange(e, "focusTime")}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                type="number"
                id="breakTime"
                value={config.breakTime}
                onChange={(e) => handleConfigChange(e, "breakTime")}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
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
                <Button
                  onClick={saveConfig}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  保存
                </Button>
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
                      {saved.name} ({saved.focusTime}分钟专注 /{" "}
                      {saved.breakTime}
                      分钟休息 x {saved.cycles}循环)
                    </span>
                    <Button
                      onClick={() => loadConfig(saved)}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      加载
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 番茄钟计时器 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col items-center justify-center">
          <div
            className={`w-64 h-64 rounded-full border-8 ${
              status === "专注中"
                ? "border-red-500"
                : status === "休息中"
                ? "border-green-500"
                : "border-gray-300 dark:border-gray-600"
            } flex items-center justify-center mb-6`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 dark:text-white">
                {status === "准备就绪"
                  ? "--:--"
                  : dayjs.duration(timeLeft, "seconds").format("mm:ss")}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {status}
              </div>
              {status !== "准备就绪" && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  循环 {currentCycle}/{config.cycles}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            {!isActive ? (
              <Button
                onClick={startTimer}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {status === "准备就绪" ? "开始" : "继续"}
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                暂停
              </Button>
            )}
            <Button
              onClick={resetTimer}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              重置
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
