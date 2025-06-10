import { Button } from "@/components/ui/button";
import { BreakTimeAtom, PomodoroStatusAtom } from "@/store/breakStore";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { EPomodoroCommands } from "./constant/enum";

dayjs.extend(duration);

const BreakOverlay = () => {
  const breakTime = useAtomValue(BreakTimeAtom);
  const [, setPomodoroStatus] = useAtom(PomodoroStatusAtom);

  const [remainingTime, setRemainingTime] = useState(breakTime * 60); // 剩余休息时间（秒）

  const endBreak = useCallback(async () => {
    await invoke(EPomodoroCommands.END_BREAK);
    setPomodoroStatus("专注中");
  }, [setPomodoroStatus]);

  useEffect(() => {
    setRemainingTime(breakTime * 60);
  }, [breakTime]);

  useEffect(() => {
    if (remainingTime <= 0) {
      endBreak();
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
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
  }, [remainingTime, endBreak]);

  const postponeBreak = async () => {
    // 增加5分钟休息时间
    const additionalTime = 5 * 60; // 5分钟转换为秒
    setRemainingTime((prev) => prev + additionalTime);
  };

  return (
    <div className="w-full h-full fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="max-w-md w-full bg-white/10 rounded-xl p-8 text-center shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2">休息时间</h2>
        <p className="text-gray-300 mb-6">请离开电脑，休息一下眼睛和身体</p>

        <div className="relative h-4 rounded-full mb-8">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${
                breakTime > 0
                  ? Math.max(
                      0,
                      Math.min(
                        100,
                        ((breakTime * 60 - remainingTime) / (breakTime * 60)) *
                          100
                      )
                    )
                  : 0
              }%`,
            }}
          ></div>
        </div>

        <div className="text-5xl font-bold text-white mb-8">
          {dayjs.duration(remainingTime, "seconds").format("mm:ss")}
        </div>

        <div className="flex space-x-4 justify-center">
          <Button
            onClick={postponeBreak}
            variant="outline"
            className="min-w-[140px] bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
          >
            +5分钟
          </Button>
          <Button
            onClick={endBreak}
            className="min-w-[140px] bg-green-600 hover:bg-green-500"
          >
            开始专注
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BreakOverlay;
