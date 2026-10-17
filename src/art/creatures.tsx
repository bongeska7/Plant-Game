/* Garden creatures that move in as Pip grows (200×200 each). Used as Pixi textures. */
import type { JSX } from 'react';
import type { CreatureKey } from '../content/types';
import { INK, S, S3, S4 } from './kit';
import { ButterflyBody } from './pictures';

const Eye = ({ x, y, r = 7 }: { x: number; y: number; r?: number }) => (
  <g><circle cx={x} cy={y} r={r} fill="#fff" {...S3} /><circle cx={x + 1} cy={y + 1} r={r * .55} fill={INK} /><circle cx={x + 2.5} cy={y - 1.5} r={r * .22} fill="#fff" /></g>
);
const Smile = ({ x, y, w = 8 }: { x: number; y: number; w?: number }) => (
  <path d={`M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}`} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
);

const Worm = () => (
  <g>
    {[[40, 150, 20], [66, 140, 22], [94, 132, 23], [122, 124, 24]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="url(#g-worm)" {...S4} />)}
    <circle cx="152" cy="104" r="30" fill="url(#g-worm)" {...S4} />
    <path d="M60 132 L64 150 M88 122 L92 142 M116 114 L120 134" stroke="#D9707E" strokeWidth="3" strokeLinecap="round" />
    <Eye x={144} y={96} /><Eye x={166} y={96} />
    <Smile x={156} y={114} />
    <ellipse cx="138" cy="112" rx="6" ry="4" fill="url(#g-cheek)" /><ellipse cx="174" cy="112" rx="6" ry="4" fill="url(#g-cheek)" />
  </g>
);

const Ladybug = () => (
  <g>
    {[60, 100, 140].map(x => <path key={x} d={`M${x} 136 l-14 22 M${x} 136 l14 22`} stroke={INK} strokeWidth="5" strokeLinecap="round" />)}
    <path d="M30 136 C30 76 170 76 170 136 Z" fill="url(#g-ladybug)" {...S} />
    <path d="M100 82 L100 136" stroke={INK} strokeWidth="4" />
    {[[66, 106, 10], [134, 106, 10], [80, 126, 7], [120, 126, 7]].map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={INK} />)}
    <path d="M52 100 C58 88 70 82 82 80" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".6" />
    <circle cx="176" cy="120" r="22" fill="#2A2440" {...S4} />
    <path d="M182 100 C186 86 194 80 200 78 M170 100 C168 86 160 80 154 78" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    <Eye x={172} y={116} r={6} /><Eye x={188} y={118} r={6} />
  </g>
);

const Snail = () => (
  <g>
    <path d="M20 160 C40 150 120 146 172 150 C186 152 190 138 182 128 L170 112 L150 150 Z" fill="#E8F59A" {...S4} />
    <path d="M164 120 L160 84 M178 124 L184 88" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    <circle cx="160" cy="82" r="7" fill="#fff" {...S3} /><circle cx="184" cy="86" r="7" fill="#fff" {...S3} />
    <circle cx="161" cy="83" r="3.5" fill={INK} /><circle cx="185" cy="87" r="3.5" fill={INK} />
    <Smile x={170} y={136} w={6} />
    <circle cx="96" cy="110" r="46" fill="url(#g-shell)" {...S} />
    <path d="M96 110 m0 -30 a30 30 0 1 1 -28 20 a20 20 0 1 1 22 -14 a10 10 0 1 1 -6 10" fill="none" stroke="#8A4A1A" strokeWidth="4" strokeLinecap="round" />
    <path d="M64 86 C72 74 86 68 98 68" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".6" />
  </g>
);

const Butterfly = () => <ButterflyBody />;

const Bee = () => (
  <g>
    <ellipse cx="86" cy="70" rx="30" ry="22" fill="rgba(220,240,255,.85)" {...S3} transform="rotate(-20 86 70)" />
    <ellipse cx="118" cy="66" rx="26" ry="20" fill="rgba(220,240,255,.85)" {...S3} transform="rotate(16 118 66)" />
    <ellipse cx="100" cy="112" rx="56" ry="40" fill="url(#g-bee)" {...S} />
    <path d="M84 76 C78 100 78 124 84 148 M108 74 C102 100 102 126 108 150" stroke={INK} strokeWidth="12" fill="none" />
    <path d="M44 112 L30 112" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    <circle cx="150" cy="104" r="26" fill="url(#g-bee)" {...S4} />
    <Eye x={146} y={98} r={6} /><Eye x={162} y={100} r={6} />
    <Smile x={154} y={114} w={6} />
    <path d="M150 80 C150 64 158 56 166 54 M160 82 C166 68 176 62 184 62" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </g>
);

const Bird = () => (
  <g>
    <path d="M40 120 L14 108 L22 132 Z" fill="#1F6FC4" {...S4} />
    <ellipse cx="96" cy="118" rx="62" ry="50" fill="url(#g-bird)" {...S} />
    <ellipse cx="104" cy="138" rx="36" ry="24" fill="#E6F6FF" opacity=".9" />
    <path d="M72 108 C92 90 120 96 126 120 C110 130 88 128 72 108Z" fill="#1F6FC4" {...S4} />
    <path d="M150 104 L180 112 L150 122 Z" fill="#FFB020" {...S4} />
    <Eye x={136} y={98} r={9} />
    <path d="M60 84 C70 74 84 70 96 70" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".6" />
    <path d="M84 166 l-4 16 M108 166 l4 16" stroke="#FFB020" strokeWidth="5" strokeLinecap="round" />
  </g>
);

export const CREATURES: Record<CreatureKey, () => JSX.Element> = {
  worm: Worm, ladybug: Ladybug, snail: Snail, butterfly: Butterfly, bee: Bee, bird: Bird,
};
