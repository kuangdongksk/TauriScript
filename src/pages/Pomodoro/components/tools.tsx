import { BaseDirectory, readFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { PomodoroConfig } from "./ConfigForm";

// 保存当前配置
export const saveConfig = async ({
  configName,
  focusTime,
  breakTime,
  loopTimes,
  savedConfigs,
  setSavedConfigs,
  setConfigName,
  setIsLoading,
  form,
}: {
  configName: string;
  focusTime: number;
  breakTime: number;
  loopTimes: number;
  savedConfigs: Array<PomodoroConfig & { name: string }>;
  setSavedConfigs: React.Dispatch<
    React.SetStateAction<Array<PomodoroConfig & { name: string }>>
  >;
  setConfigName: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<any>;
}) => {
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
  writeTextFile("pomodoro.json", JSON.stringify([...savedConfigs, newConfig]), {
    baseDir: BaseDirectory.AppConfig,
  })
    .then(() => {
      setSavedConfigs([...savedConfigs, newConfig]);
      setConfigName("");
      form.clearErrors();
      toast.success("配置已保存", {
        description: `已保存配置: ${configName}`,
      });
    })
    .catch((error) => {
      console.error("保存配置失败：", error);
      form.setError("root", {
        type: "manual",
        message: "保存配置失败：" + error,
      });
      toast.error("保存配置失败", {
        description: error,
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
};

// 删除保存的配置
export const deleteConfig = async ({
  configToDelete,
  savedConfigs,
  setSavedConfigs,
  setConfigName,
  setIsLoading,
  form,
}: {
  configToDelete: PomodoroConfig & { name: string };
  savedConfigs: Array<PomodoroConfig & { name: string }>;
  setSavedConfigs: React.Dispatch<
    React.SetStateAction<Array<PomodoroConfig & { name: string }>>
  >;
  setConfigName: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<any>;
}) => {
  setIsLoading(true);

  const newConfig = savedConfigs.filter(
    (config) => config.name !== configToDelete.name
  );

  writeTextFile("pomodoro.json", JSON.stringify(newConfig), {
    baseDir: BaseDirectory.AppConfig,
  })
    .then(() => {
      setSavedConfigs(newConfig);
      setConfigName("");
      form.clearErrors();
      toast.success("配置已删除", {
        description: `已删除配置: ${configToDelete.name}`,
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

// 加载已保存的配置列表
export const loadSavedConfigs = async ({
  setSavedConfigs,
  setIsLoading,
}: {
  setSavedConfigs: React.Dispatch<
    React.SetStateAction<Array<PomodoroConfig & { name: string }>>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    setIsLoading(true);
    await readFile("pomodoro.json", {
      baseDir: BaseDirectory.AppConfig,
    }).then((data) => {
      if (data && data.length > 0) {
        const jsonStr = new TextDecoder().decode(data);
        try {
          const configs = JSON.parse(jsonStr ?? "");
          setSavedConfigs(Array.isArray(configs) ? configs : []);
        } catch (error) {
          throw new Error("配置文件格式错误" + error);
        }
      } else {
        setSavedConfigs([]);
      }
    });
  } catch (error) {
    console.error("无法加载已保存的配置:", error);
    toast.error("无法加载已保存的配置", {
      description: error as string,
    });
  } finally {
    setIsLoading(false);
  }
};
