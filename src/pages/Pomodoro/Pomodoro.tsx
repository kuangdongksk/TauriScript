import { Timer, TimerStatus } from "@/components/Timer";
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

  // 显示休息提醒
  const showBreakOverlay = async () => {
    await invoke(EPomodoroCommands.SHOW_BREAK_OVERLAY, {
      params: {
        break_time: currentBreakTime,
      },
    });
  };

  // 开始番茄钟
  const startTimer = () => {
    if (pomodoroStatus === "准备就绪") {
      setPomodoroStatus("专注中");
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

  // 初始化和监听配置变化
  useEffect(() => {
    if (pomodoroStatus === "准备就绪") {
      // 在准备就绪状态下，更新当前配置
      setCurrentBreakTime(breakTime);
      setCurrentFocusTime(focusTime);
    }
  }, [pomodoroStatus, breakTime, focusTime]);

  // 将番茄钟状态映射到Timer组件状态
  const mapPomodoroStatusToTimerStatus = (
    status: TPomodoroStatus
  ): TimerStatus => {
    switch (status) {
      case "准备就绪":
        return "ready";
      case "专注中":
      case "休息中":
        return "running";
      case "暂停中":
        return "paused";
      default:
        return "ready";
    }
  };

  // 获取当前阶段的总时间（秒）
  const getCurrentPhaseTime = () => {
    return pomodoroStatus === "休息中"
      ? currentBreakTime * 60
      : currentFocusTime * 60;
  };

  // 获取当前进度条颜色
  const getProgressColor = () => {
    switch (pomodoroStatus) {
      case "专注中":
        return "text-red-500 dark:text-red-400";
      case "休息中":
        return "text-green-500 dark:text-green-400";
      default:
        return "text-blue-500 dark:text-blue-400";
    }
  };

  // 处理Timer组件的状态变化
  const handleStatusChange = (status: TimerStatus) => {
    switch (status) {
      case "running":
        startTimer();
        break;
      case "paused":
        pauseTimer();
        break;
      case "ready":
        resetTimer();
        break;
    }
  };

  // 处理Timer组件的完成事件
  const handleComplete = () => {
    // 使用React 18的自动批处理功能
    if (pomodoroStatus === "专注中") {
      // 专注时间结束，显示休息提醒
      Promise.resolve().then(() => {
        showBreakOverlay();
        setPomodoroStatus("休息中");
        setTimeLeft(currentBreakTime * 60);
      });
    } else if (pomodoroStatus === "休息中") {
      // 休息时间结束
      if (currentLoop < loopTimes) {
        // 还有循环，继续专注
        Promise.resolve().then(() => {
          setCurrentLoop((prev) => prev + 1);
          setPomodoroStatus("专注中");
          setTimeLeft(currentFocusTime * 60);
        });
      } else {
        // 所有循环完成
        Promise.resolve().then(() => {
          resetTimer();
        });
      }
    }
  };

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
          <Timer
            initialTime={getCurrentPhaseTime()}
            status={mapPomodoroStatusToTimerStatus(pomodoroStatus)}
            progressColor={getProgressColor()}
            label={pomodoroStatus}
            subLabel={
              pomodoroStatus !== "准备就绪"
                ? `循环 ${currentLoop}/${loopTimes}`
                : undefined
            }
            onStatusChange={handleStatusChange}
            onComplete={handleComplete}
            onTimeChange={setTimeLeft}
            onReset={resetTimer}
            className="mb-8"
          />

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
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;