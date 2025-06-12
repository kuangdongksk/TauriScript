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
import { BreakTimeA, FocusTimeA, LoopTimesA } from "@/store/breakStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { deleteConfig, loadSavedConfigs, saveConfig } from "./tools";

export interface PomodoroConfig {
  focusTime: number; // 专注时间（分钟）
  breakTime: number; // 休息时间（分钟）
  loopTimes: number; // 循环次数
}

interface ConfigFormProps {}

const ConfigForm: React.FC<ConfigFormProps> = ({}) => {
  const setBreakTime = useSetAtom(BreakTimeA);
  const setFocusTime = useSetAtom(FocusTimeA);
  const setLoopTimes = useSetAtom(LoopTimesA);

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
    defaultValues: { focusTime: 25, breakTime: 5, loopTimes: 30 },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      const { focusTime, breakTime, loopTimes } = values;
      setFocusTime(focusTime);
      setBreakTime(breakTime);
      setLoopTimes(loopTimes);

      toast.success("设置已更新", {
        description: `专注: ${focusTime}分钟, 休息: ${breakTime}分钟, 循环: ${loopTimes}次`,
      });
    },
    [setBreakTime, setFocusTime, setLoopTimes]
  );

  // 状态管理
  const [savedConfigs, setSavedConfigs] = React.useState<
    Array<PomodoroConfig & { name: string }>
  >([]);
  const [configName, setConfigName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // 初始加载已保存的配置
  useEffect(() => {
    loadSavedConfigs({ setSavedConfigs, setIsLoading });
  }, []);

  // 保存当前配置的处理函数
  const handleSaveConfig = async () => {
    await saveConfig({
      configName,
      savedConfigs,
      setSavedConfigs,
      setConfigName,
      setIsLoading,
      form,
    });
  };

  // 删除配置的处理函数
  const handleDeleteConfig = async (
    configToDelete: PomodoroConfig & { name: string }
  ) => {
    await deleteConfig({
      configToDelete,
      savedConfigs,
      setSavedConfigs,
      setConfigName,
      setIsLoading,
      form,
    });
  };

  // 加载配置的处理函数
  const handleLoadConfig = (savedConfig: PomodoroConfig & { name: string }) => {
    const { focusTime, breakTime, loopTimes } = savedConfig;
    setFocusTime(focusTime);
    setBreakTime(breakTime);
    setLoopTimes(loopTimes);
    form.reset({ focusTime, breakTime, loopTimes });
    toast("配置已加载", {
      description: `已加载配置: ${savedConfig.name}：专注: ${focusTime}分钟, 休息: ${breakTime}分钟, 循环: ${loopTimes}次`,
    });
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
                  <Input type="number" placeholder="专注时间" {...field} />
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
                  <Input type="number" placeholder="休息时间" {...field} />
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
                  <Input type="number" placeholder="循环次数" {...field} />
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
          <Button
            onClick={handleSaveConfig}
            variant="outline"
            disabled={isLoading}
          >
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
                      onClick={() => handleLoadConfig(saved)}
                      variant="secondary"
                      size="sm"
                      disabled={isLoading}
                    >
                      {isLoading ? "加载中..." : "加载"}
                    </Button>
                    <Button
                      onClick={() => handleDeleteConfig(saved)}
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
