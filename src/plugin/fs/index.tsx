import { BaseDirectory, exists } from "@tauri-apps/plugin-fs";

class FileManager {
  private static async exists(path: string, BaseDirectory: BaseDirectory) {
    return await exists(path, { baseDir: BaseDirectory });
  }

  // static async readFile(
  //   filePath: string,
  //   config: {
  //     baseDir: BaseDirectory;
  //     createIfNotExists?: boolean;
  //   }
  // ): Promise<string> {
  //   const { baseDir, createIfNotExists } = config;
  //   const isExists = await this.exists(filePath, baseDir);
  //   if (!isExists && createIfNotExists) {
  //     await FileManager.writeFile(filePath, "", config);
  //     return "";
  //   }

  //   return null;
  // }
}
