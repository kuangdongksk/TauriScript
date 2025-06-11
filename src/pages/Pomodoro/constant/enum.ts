/**
 * 番茄钟相关的Tauri命令枚举
 */
export enum EPomodoroCommands {
  // 休息提醒相关命令
  SHOW_BREAK_OVERLAY = "pomodoro_show_break_overlay",
  END_BREAK = "pomodoro_end_break",
  POSTPONE_BREAK = "pomodoro_postpone_break",
}