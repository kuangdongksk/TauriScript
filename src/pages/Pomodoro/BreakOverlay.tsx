import { Button } from "@/components/ui/button";
import { BreakTimeA, PomodoroStatusA } from "@/store/breakStore";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useInterval, useUnmount } from "ahooks";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { EPomodoroCommands } from "./constant/enum";

dayjs.extend(duration);

const BreakOverlay = () => {
  const [breakTime, setBreakTime] = useAtom(BreakTimeA);
  const setPomodoroStatus = useSetAtom(PomodoroStatusA);

  const [remainingTime, setRemainingTime] = useState(breakTime * 60); // 剩余休息时间（秒）

  const unListen = useCallback(async () => {
    return await listen<number>("showBreakOverlay", (event) => {
      console.log("🚀 ~ unListen ~ event:", event);

      setBreakTime(event.payload);
    });
  }, []);

  useUnmount(() => unListen());

  useEffect(() => {
    setRemainingTime(breakTime * 60);
  }, [breakTime]);

  useInterval(() => {
    if (remainingTime - 1 <= 0) {
      return endBreak();
    }

    setRemainingTime((prev) => prev - 1);
  }, 1000);

  const endBreak = useCallback(async () => {
    await invoke(EPomodoroCommands.END_BREAK);
    setPomodoroStatus("专注中");
  }, [setPomodoroStatus]);

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
            onClick={() => {
              endBreak();
            }}
            variant="outline"
            className="min-w-[140px] bg-gray-600 hover:bg-gray-500 text-white border-gray-500"
          >
            5分钟后休息
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
