import { Button } from "@/components/ui/button";
import CardContent from "@mui/material/CardContent";
import { useInterval } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useImperativeHandle, useState } from "react";
import { Card, CardFooter } from "../ui/card";
import { TimerProps } from "./types";

const Timer = ({
  status,
  version,
  //
  backgroundColor = "text-primary-foreground",
  className = "",
  initialTime = 0,
  label,
  pauseButtonText = "暂停",
  progressColor = "text-primary",
  resetButtonText = "重置",
  subLabel,
  showControls = true,
  startButtonText = "开始",
  timerRef,
  //
  onComplete,
  onStatusChange,
  onTimeChange,
  onReset,
}: TimerProps) => {
  // 计算圆形进度条的周长
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const [timeLeft, setTimeLeft] = useState(initialTime);

  // 当初始时间变化时更新计时器
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime, version]);

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

  useImperativeHandle(timerRef, () => {
    return {
      setTimeLeft,
    };
  });

  // 计算进度条百分比
  const calculateProgress = () => {
    if (status === "ready" || initialTime === 0) return 0;
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  // 重置计时器
  const handleResetClick = () => {
    setTimeLeft(initialTime);
    onReset?.();
    onStatusChange?.("ready");
  };

  return (
    <Card
      className={`h-full flex flex-col items-center justify-center ${className}`}
    >
      <CardContent>
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
              strokeDashoffset={
                circumference - (circumference * calculateProgress()) / 100
              }
              transform="rotate(-90 50 50)"
            ></circle>
          </svg>

          {/* 中间的时间显示 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold ">
              {status === "ready" && initialTime === 0
                ? "--:--"
                : dayjs.duration(timeLeft, "seconds").format("mm:ss")}
            </div>
            {label && <div className="text-lg font-medium mt-2">{label}</div>}
            {subLabel && <div className="text-sm  mt-2">{subLabel}</div>}
          </div>
        </div>
      </CardContent>

      {/* 控制按钮 */}
      {showControls && (
        <CardFooter>
          {status === "ready" || status === "paused" ? (
            <Button
              onClick={() => onStatusChange?.("running")}
              variant="default"
              size="lg"
            >
              {status === "ready" ? startButtonText : "继续"}
            </Button>
          ) : (
            <Button
              onClick={() => onStatusChange?.("paused")}
              variant="secondary"
              size="lg"
            >
              {pauseButtonText}
            </Button>
          )}
          <Button
            onClick={handleResetClick}
            variant="destructive"
            size="lg"
            className="ml-3"
          >
            {resetButtonText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Timer;
