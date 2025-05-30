import { create } from 'zustand';

interface BreakState {
  休息时间: number; // 分钟
  休息是否结束: boolean; // 休息是否结束
  令休息时间为: (minutes: number) => void;
  延长休息时间: (additionalMinutes: number) => void;
  结束休息: () => void;
  开始休息: () => void;
}

export const useBreakStore = create<BreakState>((set) => ({
  休息时间: 1,
  休息是否结束: false,
  令休息时间为: (time) => set({ 休息时间: time }),
  延长休息时间: (additionalMinutes) =>
    set((state) => ({ 休息时间: state.休息时间 + additionalMinutes })),
  结束休息: () => set({ 休息是否结束: true }),
  开始休息: () => set({ 休息是否结束: false }),
}));