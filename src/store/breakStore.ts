import { TPomodoroStatus } from '@/pages/Pomodoro/Pomodoro';
import { atom } from 'jotai';
import { atomWithStorage } from "jotai/utils";

export const FocusTimeA = atom(25);
export const BreakTimeA = atomWithStorage('BreakTimeA', 5);
export const LoopTimesA = atom(25);
export const CurrentLoopA = atom(0);
export const PomodoroStatusA = atom<TPomodoroStatus>('准备就绪');

