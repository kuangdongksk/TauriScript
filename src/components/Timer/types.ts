export type TimerStatus = "ready" | "running" | "paused";

export interface TimerProps {
  /**
   * 计时器状态
   */
  status: TimerStatus;

  /**
   * 背景颜色
   */
  backgroundColor?: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 初始时间（秒）
   */
  initialTime?: number;
  /**
   * 主标签
   */
  label?: string;
  /**
   * 进度条颜色
   */
  progressColor?: string;
  /**
   * 暂停按钮文本
   */
  pauseButtonText?: string;
  /**
   * 重置按钮文本
   */
  resetButtonText?: string;
  /**
   * 是否显示控制按钮
   */
  showControls?: boolean;
  /**
   * 副标签
   */
  subLabel?: string;
  /**
   * 开始按钮文本
   */
  startButtonText?: string;
  /**
   * ref
   */
  timerRef?: React.Ref<{ setTimeLeft: React.Dispatch<React.SetStateAction<number>> }>;

  /**
   * 计时完成回调
   */
  onComplete?: () => void;

  /**
   * 状态变化回调
   */
  onStatusChange?: (status: TimerStatus) => void;

  /**
   * 时间变化回调
   */
  onTimeChange?: (timeLeft: number) => void;

  /**
   * 重置回调
   */
  onReset?: () => void;

}