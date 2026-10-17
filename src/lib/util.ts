export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];

/** a small, stable tilt per index so cards look hand-placed */
export const tiltFor = (i: number) => [-3, 2.5, -1.5, 3, -2.5, 1.5, -3.5, 2][i % 8];
