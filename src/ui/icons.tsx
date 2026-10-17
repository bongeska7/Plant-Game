/* Small interface icons. */
import { INK } from '../art/kit';

const P = { fill: 'none', stroke: INK, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const IconSound = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M8 18h8l10-8v28l-10-8H8z" fill="#FFD93B" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {on
      ? <path d="M32 17c3 2 4 4.5 4 7s-1 5-4 7M36.5 11c5 3.5 7 8 7 13s-2 9.5-7 13" {...P} />
      : <path d="M33 18l11 12M44 18L33 30" {...P} />}
  </svg>
);
export const IconFull = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18V8h10M30 8h10v10M40 30v10H30M18 40H8V30" {...P} /></svg>
);
export const IconHome = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M10 22v18h10V30h8v10h10V22" fill="#FFD93B" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
    <path d="M5 24L24 7l19 17" {...P} />
  </svg>
);
export const IconReplay = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M8 18h8l10-8v28l-10-8H8z" fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M32 17c3 2 4 4.5 4 7s-1 5-4 7M36.5 11c5 3.5 7 8 7 13s-2 9.5-7 13" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);
export const IconArrow = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 24h26M26 12l12 12-12 12" {...P} strokeWidth={6} /></svg>
);
export const IconReset = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 14A16 16 0 1 1 8 26M12 6v8h8" {...P} /></svg>
);
export const IconCheck = () => (
  <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 21l7 7 15-16" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
