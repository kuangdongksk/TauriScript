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
import { EPomodoroCommands } from "@/pages/Pomodoro/constant/enum";
import {
  BreakTimeAtom,
  FocusTimeAtom,
  LoopTimesAtom,
} from "@/store/breakStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoke } from "@tauri-apps/api/core";
import { BaseDirectory, open } from "@tauri-apps/plugin-fs";
import { useAtom } from "jotai";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
    focusTime: z.coerce
      .number()
      .min(1, { message: "专注时间至少为1分钟" })
      .max(120, { message: "专注时间最多为120分钟" }), // 专注时间（分钟）
    breakTime: z.coerce
      .number()
      .min(1, { message: "休息时间至少为1分钟" })
      .max(60, { message: "休息时间最多为60分钟" }), // 休息时间（分钟）
    loopTimes: z.coerce
      .number()
      .min(1, { message: "循环次数至少为1次" })
      .max(100, { message: "循环次数最多为100次" }), // 循环次数
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      focusTime,
      breakTime,
      loopTimes,
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setFocusTime(values.focusTime);
      setBreakTime(values.breakTime);
      setLoopTimes(values.loopTimes);

      toast.success("设置已更新", {
        description: `专注: ${values.focusTime}分钟, 休息: ${values.breakTime}分钟, 循环: ${values.loopTimes}次`,
      });
    },
    [setFocusTime, setBreakTime, setLoopTimes]
  );

  // 状态管理
  const [savedConfigs, setSavedConfigs] = React.useState<
    Array<PomodoroConfig & { name: string }>
  >([]);
  const [configName, setConfigName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // 加载已保存的配置列表
  const loadSavedConfigs = useCallback(async () => {
    try {
      setIsLoading(true);
      const configs = await invoke<Array<PomodoroConfig & { name: string }>>(
        EPomodoroCommands.GET_CONFIGS
      );
      setSavedConfigs(configs || []);
    } catch (error) {
      console.error("Failed to load saved configs:", error);
      toast.error("无法加载已保存的配置", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始加载已保存的配置
  useEffect(() => {
    loadSavedConfigs();
  }, [loadSavedConfigs]);

  // 保存当前配置
  const saveConfig = async () => {
    if (configName.trim() === "") {
      form.setError("root", {
        type: "manual",
        message: "请输入配置名称",
      });
      toast.error("请输入配置名称");
      return;
    }

    const newConfig = {
      focusTime,
      breakTime,
      loopTimes,
      name: configName,
    };

    setIsLoading(true);
    await open("./pomodoro.json", {
      baseDir: BaseDirectory.Config,
      create: true,
    })
      .then((configFile) => {
        configFile
          .write(new TextEncoder().encode(JSON.stringify(newConfig)))
          .then(() => {
            setSavedConfigs([...savedConfigs, newConfig]);
            setConfigName("");
            form.clearErrors();
            toast.success("配置已保存", {
              description: `已保存配置: ${configName}`,
            });
          });
      })
      .catch((error) => {
        form.setError("root", {
          type: "manual",
          message: "保存配置失败：" + (error as Error).message,
        });
        toast.error("保存配置失败", {
          description: (error as Error).message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 删除保存的配置
  const deleteConfig = async (
    configToDelete: PomodoroConfig & { name: string }
  ) => {
    setIsLoading(true);

    await open("./pomodoro.json", {
      baseDir: BaseDirectory.Config,
      create: true,
    })
      .then((configFile) => {
        const newConfig = savedConfigs.filter(
          (config) => config.name !== configToDelete.name
        );
        configFile
          .write(new TextEncoder().encode(JSON.stringify(newConfig)))
          .then(() => {
            setSavedConfigs(newConfig);
            setConfigName("");
            form.clearErrors();
            toast.success("配置已删除", {
              description: `已删除配置: ${configToDelete.name}`,
            });
          });
      })
      .catch((error) => {
        form.setError("root", {
          type: "manual",
          message: "删除配置失败：" + (error as Error).message,
        });
        toast.error("删除配置失败", {
          description: (error as Error).message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 加载保存的配置
  const loadConfig = (savedConfig: PomodoroConfig & { name: string }) => {
    try {
      setIsLoading(true);
      setFocusTime(savedConfig.focusTime);
      setBreakTime(savedConfig.breakTime);
      setLoopTimes(savedConfig.loopTimes);
      form.reset({
        focusTime: savedConfig.focusTime,
        breakTime: savedConfig.breakTime,
        loopTimes: savedConfig.loopTimes,
      });
      toast.success("配置已加载", {
        description: `已加载配置: ${savedConfig.name}`,
      });
    } catch (error) {
      console.error("Failed to load config:", error);
      toast.error("加载配置失败", {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
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
          <Button
            type="submit"
            disabled={isLoading || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "应用中..." : "应用"}
          </Button>
        </form>
      </Form>

      {/* 保存配置区域 */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="输入配置名称"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            className="max-w-[200px]"
          />
          <Button onClick={saveConfig} variant="outline" disabled={isLoading}>
            {isLoading ? "保存中..." : "保存配置"}
          </Button>
        </div>

        {/* 已保存的配置列表 */}
        {savedConfigs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              已保存的配置
            </h3>
            <div className="space-y-3">
              {savedConfigs.map((saved, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {saved.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {saved.focusTime}分钟专注 / {saved.breakTime}分钟休息 ×{" "}
                      {saved.loopTimes}循环
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => loadConfig(saved)}
                      variant="secondary"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "加载中..." : "加载"}
                    </Button>
                    <Button
                      onClick={() => deleteConfig(saved)}
                      variant="destructive"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "删除中..." : "删除"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {form.formState.errors.root && (
          <p className="mt-2 text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfigForm;