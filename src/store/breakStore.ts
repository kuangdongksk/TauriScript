import { TPomodoroStatus } from '@/pages/Pomodoro/Pomodoro';
import { create } from 'zustand';

interface BreakState {
  专注时间: number; // 分钟
  休息时间: number; // 分钟
  循环次数: number; // 循环次数
  番茄钟状态: TPomodoroStatus;
  令休息时间为: (minutes: number) => void;
  令番茄钟状态为: (status: TPomodoroStatus) => void;
  开始专注: () => void;
  开始休息: () => void;

  推迟休息时间: (延迟时间: number) => void;
}

export const useBreakStore = create<BreakState>((set) => ({
  专注时间: 25,
  休息时间: 5,
  循环次数: 25,
  番茄钟状态: '准备就绪',
  令休息时间为: (休息时间) => set({ 休息时间 }),
  令番茄钟状态为: (番茄钟状态) => set({ 番茄钟状态 }),
  开始专注: () => set({ 番茄钟状态: '专注中' }),
  开始休息: () => set({ 番茄钟状态: '休息中' }),

  推迟休息时间: (延迟时间: number) => {
    this.开始专注()
  }
}));