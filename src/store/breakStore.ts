import { TPomodoroStatus } from '@/pages/Pomodoro/Pomodoro';
import { atom, } from 'jotai';

//#region 配置
export const BreakTimeAtom = atom(5);
export const FocusTimeAtom = atom(25);
export const LoopTimesAtom = atom(25);
//#endregion

//#region 运行态
export const currentFocusAtom = atom(0);
export const currentBreakAtom = atom(0);
export const currentLoopAtom = atom(0);
export const PomodoroStatusAtom = atom<TPomodoroStatus>('准备就绪');
//#endregion

export const PomodoroAtom = atom((get) => {
  return {
    focusTime: get(FocusTimeAtom),
    breakTime: get(BreakTimeAtom),
    loopTimes: get(LoopTimesAtom),
    status: get(PomodoroStatusAtom),
  }
})
