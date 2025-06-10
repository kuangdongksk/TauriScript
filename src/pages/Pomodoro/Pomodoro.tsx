import { Button } from "@/components/ui/button";
import {
  BreakTimeAtom,
  currentBreakAtom,
  currentFocusAtom,
  currentLoopAtom,
  FocusTimeAtom,
  LoopTimesAtom,
  PomodoroStatusAtom,
} from "@/store/breakStore";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import ConfigForm from "./components/ConfigForm";
import { EPomodoroCommands } from "./constant/enum";

export type TPomodoroStatus = "准备就绪" | "专注中" | "暂停中" | "休息中";

const Pomodoro = () => {
  const breakTime = useAtomValue(BreakTimeAtom);
  const focusTime = useAtomValue(FocusTimeAtom);
  const loopTimes = useAtomValue(LoopTimesAtom);

  const [currentFocusTime, setCurrentFocusTime] = useAtom(currentFocusAtom);
  const [currentBreakTime, setCurrentBreakTime] = useAtom(currentBreakAtom);
  const [currentLoop, setCurrentLoop] = useAtom(currentLoopAtom);
  const [pomodoroStatus, setPomodoroStatus] =
    useAtom<TPomodoroStatus>(PomodoroStatusAtom);

  // 计时器状态
  const [timeLeft, setTimeLeft] = useState(0); // 剩余时间（秒）

  // 开始番茄钟
  const startTimer = () => {
    if (pomodoroStatus === "准备就绪") {
      setPomodoroStatus("专注中");
      setTimeLeft(currentFocusTime * 60);
      setCurrentLoop(1);
    } else if (pomodoroStatus === "暂停中") {
      // 从暂停状态恢复
      if (timeLeft > 0) {
        // 根据当前循环阶段恢复到专注或休息状态
        if (currentLoop > 0 && timeLeft <= currentBreakTime * 60) {
          setPomodoroStatus("休息中");
        } else {
          setPomodoroStatus("专注中");
        }
      }
    }
  };

  // 暂停番茄钟
  const pauseTimer = () => {
    // 只有在专注中或休息中的状态才能暂停
    if (["专注中", "休息中"].includes(pomodoroStatus) && timeLeft > 0) {
      setPomodoroStatus("暂停中");
    }
  };

  // 重置番茄钟
  const resetTimer = () => {
    setPomodoroStatus("准备就绪");
    setTimeLeft(0);
    setCurrentLoop(0);
    // 重置为当前设置的时间
    setCurrentBreakTime(breakTime);
    setCurrentFocusTime(focusTime);
  };

  // 初始化
  useEffect(() => {
    setCurrentBreakTime(breakTime);
    setCurrentFocusTime(focusTime);
  }, [breakTime, focusTime]);

  // 监听配置变化
  useEffect(() => {
    if (pomodoroStatus === "准备就绪") {
      // 在准备就绪状态下，更新当前配置
      setCurrentBreakTime(breakTime);
      setCurrentFocusTime(focusTime);
    }
  }, [pomodoroStatus, breakTime, focusTime]);

  // 处理计时器逻辑
  useEffect(() => {
    let interval: number | undefined;

    if (["专注中", "休息中"].includes(pomodoroStatus)) {
      if (timeLeft > 0) {
        interval = window.setInterval(() => {
          setTimeLeft((prevTime) => {
            // 确保时间不会变成负数
            const newTime = Math.max(0, prevTime - 1);

            // 当时间到达0时，在下一个渲染周期处理状态切换
            if (newTime === 0) {
              // 使用setTimeout确保状态切换在下一个渲染周期
              setTimeout(() => {
                if (pomodoroStatus === "专注中") {
                  // 专注时间结束，显示休息提醒
                  showBreakOverlay();
                  setPomodoroStatus("休息中");
                  setTimeLeft(currentBreakTime * 60);
                } else if (pomodoroStatus === "休息中") {
                  // 休息时间结束
                  if (currentLoop < loopTimes) {
                    // 还有循环，继续专注
                    setCurrentLoop((prev) => prev + 1);
                    setPomodoroStatus("专注中");
                    setTimeLeft(currentFocusTime * 60);
                  } else {
                    // 所有循环完成
                    resetTimer();
                  }
                }
              }, 0);
            }

            return newTime;
          });
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    pomodoroStatus,
    timeLeft,
    currentLoop,
    currentBreakTime,
    currentFocusTime,
    loopTimes,
  ]);

  const showBreakOverlay = async () => {
    await invoke(EPomodoroCommands.SHOW_BREAK_OVERLAY, {
      params: {
        break_time: currentBreakTime,
      },
    });
  };

  // 计算进度条百分比
  const calculateProgress = () => {
    if (pomodoroStatus === "准备就绪") return 0;

    const totalTime =
      pomodoroStatus === "专注中"
        ? currentFocusTime * 60
        : currentBreakTime * 60;

    if (totalTime === 0) return 0;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // 计算圆形进度条的周长
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = calculateProgress();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        番茄钟
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 番茄钟设置 */}
        <div className="order-2 md:order-1">
          <ConfigForm />
        </div>

        {/* 番茄钟计时器 */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center justify-center order-1 md:order-2">
          <div className="relative w-72 h-72 mb-8">
            {/* 背景圆环 */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 dark:text-gray-700 stroke-current"
                strokeWidth="5"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
              ></circle>

              {/* 进度圆环 */}
              <circle
                className={`${
                  pomodoroStatus === "专注中"
                    ? "text-red-500 dark:text-red-400"
                    : pomodoroStatus === "休息中"
                    ? "text-green-500 dark:text-green-400"
                    : "text-blue-500 dark:text-blue-400"
                } stroke-current transition-all duration-1000 ease-linear`}
                strokeWidth="5"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference - (circumference * progress) / 100
                }
                transform="rotate(-90 50 50)"
              ></circle>
            </svg>

            {/* 中间的时间显示 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-800 dark:text-white">
                {pomodoroStatus === "准备就绪"
                  ? "--:--"
                  : dayjs.duration(timeLeft, "seconds").format("mm:ss")}
              </div>
              <div
                className={`text-lg font-medium mt-2 ${
                  pomodoroStatus === "专注中"
                    ? "text-red-500 dark:text-red-400"
                    : pomodoroStatus === "休息中"
                    ? "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {pomodoroStatus}
              </div>

              {pomodoroStatus !== "准备就绪" && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  循环 {currentLoop}/{loopTimes}
                </div>
              )}
            </div>
          </div>

          {/* 状态信息 */}
          <div className="mb-8 text-center">
            {pomodoroStatus === "专注中" && (
              <p className="text-gray-600 dark:text-gray-300">
                专注时间 {currentFocusTime} 分钟
              </p>
            )}
            {pomodoroStatus === "休息中" && (
              <p className="text-gray-600 dark:text-gray-300">
                休息时间 {currentBreakTime} 分钟
              </p>
            )}
          </div>

          {/* 控制按钮 */}
          <div className="flex space-x-4">
            {["准备就绪", "暂停中"].includes(pomodoroStatus) ? (
              <Button
                onClick={startTimer}
                variant="default"
                size="lg"
                className="min-w-[100px]"
              >
                {pomodoroStatus === "准备就绪" ? "开始" : "继续"}
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="outline"
                size="lg"
                className="min-w-[100px]"
              >
                暂停
              </Button>
            )}
            <Button
              onClick={resetTimer}
              variant="secondary"
              size="lg"
              className="min-w-[100px]"
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
