import { ITimerRef, Timer, TimerStatus } from "@/components/Timer";
import {
  BreakTimeA,
  CurrentLoopA,
  CurrentTimeLeftA,
  FocusTimeA,
  LoopTimesA,
  PomodoroStatusA,
} from "@/store/breakStore";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import ConfigForm from "./components/ConfigForm";
import { EPomodoroCommands } from "./constant/enum";

export type TPomodoroStatus = "准备就绪" | "专注中" | "暂停中" | "休息中";

const Pomodoro = () => {
  const focusTime = useAtomValue(FocusTimeA);
  const breakTime = useAtomValue(BreakTimeA);
  const loopTimes = useAtomValue(LoopTimesA);
  const [currentTimeLeft, setCurrentTimeLeft] = useAtom(CurrentTimeLeftA);
  const [currentLoop, setCurrentLoop] = useAtom(CurrentLoopA);
  const [pomodoroStatus, setPomodoroStatus] =
    useAtom<TPomodoroStatus>(PomodoroStatusA);

  // 计时器状态
  const timerRef = useRef<ITimerRef | null>(null);
  const preStateRef = useRef(pomodoroStatus);
  const [timerVersion, setTimerVersion] = useState(0);

  useEffect(() => {
    if (preStateRef.current === "休息中" && pomodoroStatus === "专注中") {
      setCurrentLoop((prev) => prev + 1);
    }
  }, [pomodoroStatus]);

  useEffect(() => {
    if (currentTimeLeft !== 0) {
      timerRef.current?.setTimeLeft(currentTimeLeft * 60);
      setCurrentTimeLeft(0);
    }
  }, [currentTimeLeft]);

  // 显示休息提醒
  const showBreakOverlay = async () => {
    await invoke(EPomodoroCommands.SHOW_BREAK_OVERLAY, {
      params: {
        break_time: breakTime,
      },
    });
    await emit("showBreakOverlay", { breakTime });
  };

  // 开始番茄钟
  const startTimer = () => {
    if (pomodoroStatus === "准备就绪") {
      setPomodoroStatus("专注中");
      setCurrentLoop(1);
    } else if (pomodoroStatus === "暂停中") {
      // 从暂停状态恢复
      preStateRef.current === "休息中"
        ? setPomodoroStatus("休息中")
        : setPomodoroStatus("专注中");
    }
  };

  // 暂停番茄钟
  const pauseTimer = () => {
    // 只有在专注中或休息中的状态才能暂停
    if (["专注中", "休息中"].includes(pomodoroStatus)) {
      preStateRef.current = pomodoroStatus;
      setPomodoroStatus("暂停中");
    }
  };

  // 重置番茄钟
  const resetTimer = () => {
    setPomodoroStatus("准备就绪");
    setCurrentLoop(0);
  };

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
    return pomodoroStatus === "休息中" ? breakTime * 60 : focusTime * 60;
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
  const onComplete = () => {
    setTimerVersion((prev) => prev + 1);
    if (pomodoroStatus === "专注中") {
      // 专注时间结束，显示休息提醒
      showBreakOverlay();
      setPomodoroStatus("休息中");
    } else if (pomodoroStatus === "休息中") {
      // 休息时间结束
      if (currentLoop < loopTimes) {
        // 还有循环，继续专注
        setCurrentLoop((prev) => prev + 1);
        setPomodoroStatus("专注中");
      } else {
        // 所有循环完成
        resetTimer();
      }
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 ">番茄钟</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 番茄钟设置 */}
        <div className="order-2 md:order-1">
          <ConfigForm />
        </div>

        {/* 番茄钟计时器 */}
        <div className=" p-8 rounded-xl shadow-lg flex flex-col items-center justify-center order-1 md:order-2">
          <Timer
            status={mapPomodoroStatusToTimerStatus(pomodoroStatus)}
            version={timerVersion}
            initialTime={getCurrentPhaseTime()}
            progressColor={getProgressColor()}
            label={pomodoroStatus}
            subLabel={
              pomodoroStatus !== "准备就绪"
                ? `循环 ${currentLoop}/${loopTimes}`
                : undefined
            }
            timerRef={timerRef}
            onStatusChange={handleStatusChange}
            onComplete={onComplete}
            onReset={resetTimer}
            className="mb-8"
          />

          {/* 状态信息 */}
          <div className="mb-8 text-center">
            {pomodoroStatus === "专注中" && <p>专注时间 {focusTime} 分钟</p>}
            {pomodoroStatus === "休息中" && <p>休息时间 {breakTime} 分钟</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
