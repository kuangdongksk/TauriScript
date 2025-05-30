import { create } from 'zustand';

interface BreakState {
  breakTime: number; // 休息时间（分钟）
  isBreakEnded: boolean; // 休息是否结束
  setBreakTime: (time: number) => void; // 设置休息时间
  postponeBreak: (additionalMinutes: number) => void; // 延长休息时间
  endBreak: () => void; // 结束休息
  resetBreakEnded: () => void; // 重置休息结束状态
}

export const useBreakStore = create<BreakState>((set) => ({
  breakTime: 0,
  isBreakEnded: false,
  setBreakTime: (time) => set({ breakTime: time }),
  postponeBreak: (additionalMinutes) => 
    set((state) => ({ breakTime: state.breakTime + additionalMinutes })),
  endBreak: () => set({ isBreakEnded: true }),
  resetBreakEnded: () => set({ isBreakEnded: false }),
}));