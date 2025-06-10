/**
 * 番茄钟相关的Tauri命令枚举
 */
export enum EPomodoroCommands {
  // 休息提醒相关命令
  SHOW_BREAK_OVERLAY = "Pomodoro_showBreakOverlay",
  END_BREAK = "Pomodoro_endBreak",
  POSTPONE_BREAK = "Pomodoro_postponeBreak",
}