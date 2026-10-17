/* The game talks to the Pixi layers only through this object. Calls made before the
   layers are ready are queued, so callers never need to wait. */
import type { CreatureKey } from '../content/types';

export type BurstKind = 'stars' | 'petals' | 'leaves' | 'water' | 'sparkle' | 'mix';

export interface WorldApi {
  setCreatures(list: CreatureKey[]): void;
  arrive(key: CreatureKey): void;
  setQualityFactor(f: number): void;
}
export interface FxApi {
  burst(x: number, y: number, kind?: BurstKind, n?: number): void;
  confetti(n?: number): void;
  fireworks(ms?: number): void;
  setQualityFactor(f: number): void;
}

type Call<T> = (api: T) => void;

function channel<T>() {
  let api: T | null = null;
  const queue: Call<T>[] = [];
  return {
    attach(a: T) { api = a; queue.splice(0).forEach(fn => fn(a)); },
    detach() { api = null; },
    run(fn: Call<T>) { if (api) fn(api); else queue.push(fn); },
  };
}

export const worldChannel = channel<WorldApi>();
export const fxChannel = channel<FxApi>();

/** screen point at the center of an element */
export function centerOf(el: Element | null): { x: number; y: number } {
  if (!el) return { x: innerWidth / 2, y: innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export const world = {
  setCreatures: (list: CreatureKey[]) => worldChannel.run(w => w.setCreatures(list)),
  arrive: (key: CreatureKey) => worldChannel.run(w => w.arrive(key)),
};

export const fx = {
  burst: (x: number, y: number, kind: BurstKind = 'mix', n = 24) => fxChannel.run(f => f.burst(x, y, kind, n)),
  burstAt: (el: Element | null, kind: BurstKind = 'mix', n = 24) => { const p = centerOf(el); fxChannel.run(f => f.burst(p.x, p.y, kind, n)); },
  confetti: (n = 120) => fxChannel.run(f => f.confetti(n)),
  fireworks: (ms = 4000) => fxChannel.run(f => f.fireworks(ms)),
};
