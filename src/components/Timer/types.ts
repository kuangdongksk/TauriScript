export type TimerStatus = "ready" | "running" | "paused";

export interface ITimerRef {
  /**
   * @单位 秒
   */
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export interface TimerProps {
  /**
   * @description 计时器状态
   */
  status: TimerStatus;
  /**
   * @name 版本
   * @description 防止因为initialTime一样导致计时器无法更新
   */
  version?: number;

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
   * @name ref
   * @description
   */
  timerRef?: React.Ref<ITimerRef>;


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