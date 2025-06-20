import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 主题类型
export type ThemeMode = 'light' | 'dark';

// 主题名称
export type ThemeName = 'default' | 'Bubblegum' | 'MochaMousse' | 'Perpetuity' | '紫色1';

// 创建持久化的主题原子
export const themeAtom = atomWithStorage<ThemeName>('theme', 'default');
export const modeAtom = atomWithStorage<ThemeMode>('mode', 'light');

// 创建派生原子用于切换模式
export const toggleModeAtom = atom(
  (get) => get(modeAtom),
  (get, set) => {
    const currentMode = get(modeAtom);
    set(modeAtom, currentMode === 'light' ? 'dark' : 'light');
  }
);

// 获取所有可用主题
export const getAvailableThemes = (): { name: ThemeName; label: string }[] => [
  { name: 'default', label: '默认主题' },
  { name: 'Bubblegum', label: '泡泡糖' },
  { name: 'MochaMousse', label: '摩卡慕斯' },
  { name: 'Perpetuity', label: '永恒' },
  { name: '紫色1', label: '紫色主题' },
];