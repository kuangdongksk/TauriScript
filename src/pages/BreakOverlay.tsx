import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

const BreakOverlay = () => {
  const [timeLeft, setTimeLeft] = useState(0); // 剩余休息时间（秒）
  const [initialTime, setInitialTime] = useState(0); // 初始休息时间（秒）

  // 从Tauri事件获取休息时间
  useEffect(() => {
    let unlisten: () => void;
    let unlistenPostpone: () => void;

    const setupListeners = async () => {
      unlisten = await window.__TAURI__.event.listen<{ break_time: number }>(
        "break-params",
        (event) => {
          const seconds = event.payload.break_time * 60;
          console.log("收到break-params事件:", {
            break_time: event.payload.break_time,
            seconds,
          });
          setTimeLeft(seconds);
          setInitialTime(seconds);
        }
      );

      unlistenPostpone = await window.__TAURI__.event.listen<number>(
        "postpone-break",
        (event) => {
          const additionalSeconds = event.payload * 60;
          setTimeLeft((prev) => prev + additionalSeconds);
          setInitialTime((prev) => prev + additionalSeconds);
        }
      );
    };

    setupListeners();

    return () => {
      unlisten?.();
      unlistenPostpone?.();
    };
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    console.log("倒计时状态变化:", { timeLeft, initialTime });

    if (timeLeft <= 0) {
      console.log("倒计时结束或未开始");
      return;
    }

    console.log("开始新的倒计时间隔");
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        console.log("倒计时更新:", { prev, next });
        if (next === 0) {
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);

    return () => {
      console.log("清理倒计时间隔");
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

  // 计算进度百分比
  const progressPercentage =
    initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  // 结束休息，关闭蒙层
  const endBreak = async () => {
    try {
      await invoke("end_break");
    } catch (error) {
      console.error("结束休息失败", error);
    }
  };

  // 稍后休息（延长休息时间）
  const postponeBreak = async () => {
    try {
      await invoke("postpone_break", { minutes: 5 });
      // 本地UI立即更新，不等待后端事件
      setTimeLeft((prev) => prev + 5 * 60);
      setInitialTime((prev) => prev + 5 * 60);
    } catch (error) {
      console.error("延长休息失败", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="max-w-md w-full bg-gray-800/90 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">休息时间</h2>
        <p className="text-gray-300 mb-6">请离开电脑，休息一下眼睛和身体</p>

        <div className="relative h-4 bg-gray-700 rounded-full mb-8">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
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
