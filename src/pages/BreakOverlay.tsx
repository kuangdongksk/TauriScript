import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useBreakStore } from "../store/breakStore";

const BreakOverlay = () => {
  const { breakTime, postponeBreak: postponeBreakStore } = useBreakStore();

  const [timeLeft, setTimeLeft] = useState(0); // 剩余休息时间（秒）
  const [initialTime, setInitialTime] = useState(0); // 初始休息时间（秒）

  // 从全局状态获取休息时间
  useEffect(() => {
    if (breakTime > 0) {
      const seconds = breakTime * 60;

      setTimeLeft(seconds);
      setInitialTime(seconds);
    }
  }, [breakTime]);

  // 倒计时逻辑
  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        if (next === 0) {
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 结束休息，关闭蒙层
  const { endBreak: endBreakStore } = useBreakStore();
  const endBreak = async () => {
    await invoke("end_break");
    endBreakStore(); // 更新全局状态
  };

  // 稍后休息（延长休息时间）
  const postponeBreak = async () => {
    await invoke("postpone_break", { minutes: 5 });
    postponeBreakStore(5); // 更新全局状态
    // 本地UI立即更新
    setTimeLeft((prev) => prev + 5 * 60);
    setInitialTime((prev) => prev + 5 * 60);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="max-w-md w-full rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">休息时间</h2>
        <p className="text-gray-300 mb-6">请离开电脑，休息一下眼睛和身体</p>

        <div className="relative h-4 rounded-full mb-8">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${
                initialTime > 0
                  ? ((initialTime - timeLeft) / initialTime) * 100
                  : 0
              }%`,
            }}
          ></div>
        </div>

        <div className="text-5xl font-bold text-white mb-8">
          {formatTime(timeLeft)}
        </div>

        <div className="flex space-x-4 justify-center">
          <button
            onClick={postponeBreak}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            稍后休息 (+5分钟)
          </button>
          <button
            onClick={endBreak}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            开始专注
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakOverlay;
