import { create } from 'zustand';
import { LEVELS } from '../content/levels';
import type { Level } from '../content/types';

export type Screen = 'title' | 'intro' | 'garden' | 'level' | 'growth' | 'finale';
export type Quality = 'high' | 'medium' | 'low';

const KEY = 'pips-magic-garden-v2';

function loadDone(): Level['id'][] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter(id => LEVELS.some(l => l.id === id)) : [];
  } catch {
    return [];
  }
}
function saveDone(done: Level['id'][]) {
  try { localStorage.setItem(KEY, JSON.stringify(done)); } catch { /* private mode: progress lasts this visit */ }
}

interface GameState {
  screen: Screen;
  levelIndex: number;
  done: Level['id'][];
  sound: boolean;
  quality: Quality;
  /** creature that just arrived, so the garden can greet it */
  arrived: Level['creature'] | null;
  go: (screen: Screen) => void;
  startLevel: (i: number) => void;
  finishLevel: () => void;
  reset: () => void;
  setSound: (on: boolean) => void;
  setQuality: (q: Quality) => void;
}

const devLevel = import.meta.env.DEV ? new URLSearchParams(location.search).get('level') : null;

export const useGame = create<GameState>((set, get) => ({
  screen: devLevel !== null ? 'level' : 'title',
  levelIndex: devLevel !== null ? Number(devLevel) : 0,
  done: loadDone(),
  sound: true,
  quality: 'high',
  arrived: null,
  go: screen => set({ screen }),
  startLevel: i => set({ levelIndex: i, screen: 'level', arrived: null }),
  finishLevel: () => {
    const lv = LEVELS[get().levelIndex];
    const done = get().done.includes(lv.id) ? get().done : [...get().done, lv.id];
    saveDone(done);
    set({ done, screen: 'growth', arrived: lv.creature ?? null });
  },
  reset: () => { saveDone([]); set({ done: [], screen: 'title', arrived: null }); },
  setSound: sound => set({ sound }),
  setQuality: quality => set({ quality }),
}));

/** the parts Pip has grown — one per finished level, even if levels were played out of order */
export type Grown = { sprout: boolean; roots: boolean; stem: boolean; leaves: boolean; flower: boolean; fruit: boolean; bloom: boolean };
export function grownParts(done: Level['id'][]): Grown {
  const has = (id: Level['id']) => done.includes(id);
  return {
    sprout: has('seed'), roots: has('roots'), stem: has('stem'), leaves: has('leaves'),
    flower: has('flower'), fruit: has('fruit'), bloom: has('bloom'),
  };
}

export function nextLevelIndex(done: Level['id'][]): number {
  return LEVELS.findIndex(l => !done.includes(l.id));
}
