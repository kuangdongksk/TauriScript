/**
 * 番茄钟相关的Tauri命令枚举
 */
export enum EPomodoroCommands {
  // 配置相关命令
  GET_CONFIGS = "Pomodoro_getPomodoroConfigs",
  SAVE_CONFIG = "Pomodoro_savePomodoroConfig",
  DELETE_CONFIG = "Pomodoro_deletePomodoroConfig",

  // 休息提醒相关命令
  SHOW_BREAK_OVERLAY = "Pomodoro_showBreakOverlay",
  END_BREAK = "Pomodoro_endBreak",
  POSTPONE_BREAK = "Pomodoro_postponeBreak",
}