import { Button } from "@/components/ui/button";
import { useInterval } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TimerProps } from "./types";

const Timer = ({
  initialTime,
  status,
  progressColor = "text-blue-500 dark:text-blue-400",
  backgroundColor = "text-gray-200 dark:text-gray-700",
  label,
  subLabel,
  showControls = true,
  startButtonText = "开始",
  pauseButtonText = "暂停",
  resetButtonText = "重置",
  onComplete,
  onStatusChange,
  onTimeChange,
  onReset,
  className = "",
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  console.log("🚀 ~ initialTime:", initialTime)

  // 重置计时器
  const resetTimer = () => {
    setTimeLeft(initialTime);
    onReset?.();
  };

  // 当初始时间变化时更新计时器
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, status]);

  // 处理计时器逻辑
  useInterval(() => {
    if (status === "running") {
      if (timeLeft > 0) {
        // 当时间到达0时，触发完成回调
        if (timeLeft - 1 === 0) {
          onComplete?.();
        } else {
          setTimeLeft((prevTime) => prevTime - 1);
          onTimeChange?.(timeLeft - 1);
        }
      }
    }
  }, 1000);

  // 计算进度条百分比
  const calculateProgress = () => {
    if (status === "ready" || initialTime === 0) return 0;
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  // 计算圆形进度条的周长
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = calculateProgress();

  const handleResetClick = () => {
    resetTimer();
    onStatusChange?.("ready");
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-72 h-72 mb-8">
        {/* 背景圆环 */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className={`${backgroundColor} stroke-current`}
            strokeWidth="5"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
          ></circle>

          {/* 进度圆环 */}
          <circle
            className={`${progressColor} stroke-current transition-all duration-1000 ease-linear`}
            strokeWidth="5"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
            transform="rotate(-90 50 50)"
          ></circle>
        </svg>

        {/* 中间的时间显示 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-gray-800 dark:text-white">
            {status === "ready" && initialTime === 0
              ? "--:--"
              : dayjs.duration(timeLeft, "seconds").format("mm:ss")}
          </div>
          {label && <div className="text-lg font-medium mt-2">{label}</div>}
          {subLabel && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {subLabel}
            </div>
          )}
        </div>
      </div>

      {/* 控制按钮 */}
      {showControls && (
        <div className="flex space-x-4">
          {status === "ready" || status === "paused" ? (
            <Button
              onClick={() => onStatusChange?.("running")}
              variant="default"
              size="lg"
              className="min-w-[100px]"
            >
              {status === "ready" ? startButtonText : "继续"}
            </Button>
          ) : (
            <Button
              onClick={() => onStatusChange?.("paused")}
              variant="outline"
              size="lg"
              className="min-w-[100px]"
            >
              {pauseButtonText}
            </Button>
          )}
          <Button
            onClick={handleResetClick}
            variant="secondary"
            size="lg"
            className="min-w-[100px]"
          >
            {resetButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Timer;
