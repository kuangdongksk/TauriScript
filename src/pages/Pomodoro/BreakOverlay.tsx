import Button from "@/components/Button";
import { breakTimeAtom, pomodoroStatusAtom } from "@/store/breakStore";
import { invoke } from "@tauri-apps/api/core";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { TPomodoroStatus } from "./Pomodoro";

dayjs.extend(duration);

const BreakOverlay = () => {
  const [休息时间] = useAtom(breakTimeAtom);
  const [, setPomodoroStatus] = useAtom<TPomodoroStatus>(pomodoroStatusAtom);

  const [剩余休息时间, 令剩余休息时间为] = useState(休息时间 * 60); // 剩余休息时间（秒）

  const 结束休息2 = useCallback(async () => {
    await invoke("end_break");
    setPomodoroStatus("专注中");
  }, []);

  useEffect(() => {
    令剩余休息时间为(休息时间 * 60);
  }, [休息时间]);

  useEffect(() => {
    if (剩余休息时间 <= 0) {
      结束休息2();
      return;
    }

    const interval = setInterval(() => {
      令剩余休息时间为((prev) => {
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
  }, [剩余休息时间]);

  const postponeBreak = async () => {
    await invoke("postpone_break", { minutes: 5 });
    令剩余休息时间为((prev) => prev + 5 * 60);
  };

  return (
    <div className="w-full h-full fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="max-w-md w-full rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">休息时间</h2>
        <p className="text-gray-300 mb-6">请离开电脑，休息一下眼睛和身体</p>

        <div className="relative h-4 rounded-full mb-8">
          <div
            className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${
                休息时间 > 0 ? ((休息时间 - 剩余休息时间) / 休息时间) * 100 : 0
              }%`,
            }}
          ></div>
        </div>

        <div className="text-5xl font-bold text-white mb-8">
          {dayjs.duration(剩余休息时间, "seconds").format("mm:ss")}
        </div>

        <div className="flex space-x-4 justify-center">
          <Button
            onClick={postponeBreak}
            className=" bg-gray-600 hover:bg-gray-500 focus:ring-gray-500 focus:ring-offset-gray-800"
          >
            稍后休息 (+5分钟)
          </Button>
          <Button
            onClick={结束休息2}
            className=" bg-green-600 hover:bg-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
          >
            开始专注
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BreakOverlay;
