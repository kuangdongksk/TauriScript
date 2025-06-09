import { TPomodoroStatus } from '@/pages/Pomodoro/Pomodoro';
import { atom, } from 'jotai';

export const focusTimeAtom = atom(25);
export const breakTimeAtom = atom(5);
export const loopTimesAtom = atom(25);
export const pomodoroStatusAtom = atom<TPomodoroStatus>('准备就绪');

