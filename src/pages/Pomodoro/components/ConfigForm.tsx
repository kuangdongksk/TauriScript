import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  BreakTimeAtom,
  FocusTimeAtom,
  LoopTimesAtom,
} from "@/store/breakStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoke } from "@tauri-apps/api/core";
import { useAtom } from "jotai";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface PomodoroConfig {
  focusTime: number; // 专注时间（分钟）
  breakTime: number; // 休息时间（分钟）
  loopTimes: number; // 循环次数
}

interface ConfigFormProps {}

const ConfigForm: React.FC<ConfigFormProps> = ({}) => {
  const [breakTime, setBreakTime] = useAtom(BreakTimeAtom);
  const [focusTime, setFocusTime] = useAtom(FocusTimeAtom);
  const [loopTimes, setLoopTimes] = useAtom(LoopTimesAtom);

  const formSchema = z.object({
    focusTime: z.number().min(1).max(60), // 专注时间（分钟）
    breakTime: z.number().min(1).max(60), // 休息时间（分钟）
    loopTimes: z.number().min(1).max(100), // 循环次数
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      focusTime,
      breakTime,
      loopTimes,
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    setFocusTime(values.focusTime);
    setBreakTime(values.breakTime);
    setLoopTimes(values.loopTimes);
  }, []);

  // 保存配置
  const [savedConfigs, setSavedConfigs] = React.useState<
    Array<PomodoroConfig & { name: string }>
  >([]);
  const [configName, setConfigName] = React.useState("");

  // 保存当前配置
  const saveConfig = async () => {
    if (configName.trim() === "") {
      form.setError("root", {
        type: "manual",
        message: "请输入配置名称",
      });
      return;
    }

    const newConfig = {
      focusTime,
      breakTime,
      loopTimes,
      name: configName,
    };

    try {
      // 调用 Tauri 命令保存配置
      await invoke("save_pomodoro_config", { config: newConfig });
      setSavedConfigs([...savedConfigs, newConfig]);
      setConfigName("");
      form.clearErrors();
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: "保存配置失败：" + (error as Error).message,
      });
    }
  };

  // 删除保存的配置
  const deleteConfig = async (
    configToDelete: PomodoroConfig & { name: string }
  ) => {
    try {
      // 调用 Tauri 命令删除配置
      await invoke("delete_pomodoro_config", { name: configToDelete.name });
      setSavedConfigs(
        savedConfigs.filter((config) => config.name !== configToDelete.name)
      );
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: "删除配置失败：" + (error as Error).message,
      });
    }
  };

  // 加载保存的配置
  const loadConfig = (savedConfig: PomodoroConfig & { name: string }) => {
    setFocusTime(savedConfig.focusTime);
    setBreakTime(savedConfig.breakTime);
    setLoopTimes(savedConfig.loopTimes);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        设置
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="focusTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>专注时间</FormLabel>
                <FormControl>
                  <Input placeholder="专注时间" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="breakTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>休息时间</FormLabel>
                <FormControl>
                  <Input placeholder="休息时间" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loopTimes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>循环次数</FormLabel>
                <FormControl>
                  <Input placeholder="循环次数" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">应用</Button>
        </form>
      </Form>

      {/* 已保存的配置 */}
      {savedConfigs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
            已保存的配置
          </h3>
          <div className="space-y-2">
            {savedConfigs.map((saved, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {saved.name} ({saved.focusTime}分钟专注 / {saved.breakTime}
                  分钟休息 x {loopTimes}循环)
                </span>
                <button
                  onClick={() => loadConfig(saved)}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  加载
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigForm;
