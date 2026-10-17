import type { Speaker } from '../content/types';

/** FNV-1a 32-bit — shared by the voice generator and the game so file names always match. */
export function lineId(who: Speaker, text: string): string {
  let h = 0x811c9dc5;
  const s = `${who}|${text}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${who}-${(h >>> 0).toString(16).padStart(8, '0')}`;
}
