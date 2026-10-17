/* Illustrations with tappable spots. Each spot: class "spot", data-spot=<name>, data-ok="1" when it is a right answer. */
import type { SceneKey } from '../content/types';
import { Blob, FlowerHead, INK, LEMON_D, S, S4, Shine, Svg, Tube } from './kit';
import { LemonHalfArt } from './pictures';

function SkyBack() {
  return (
    <>
      <rect width="600" height="420" fill="url(#scene-sky)" />
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FD0FA" /><stop offset="1" stopColor="#E3F6FF" /></linearGradient>
      </defs>
    </>
  );
}

function Mangrove() {
  const roots = [
    'M300 236 C262 246 232 276 212 332', 'M300 236 C282 266 272 300 264 336', 'M300 236 C318 266 328 300 336 336',
    'M300 236 C340 246 370 276 390 332', 'M292 224 C240 228 190 268 168 334', 'M308 224 C360 228 410 268 432 334',
  ];
  return (
    <Svg vb="0 0 600 420">
      <SkyBack />
      <Blob circles={[[80, 70, 24], [114, 58, 32], [150, 72, 22]]} fill="url(#g-cloud)" ow={3.5} />
      <Blob circles={[[480, 56, 20], [508, 46, 26], [538, 58, 18]]} fill="url(#g-cloud)" ow={3.5} />
      <rect x="-10" y="300" width="620" height="130" fill="url(#g-waterFlat)" stroke={INK} strokeWidth="5" />
      <path d="M40 350 q15 -10 30 0 t30 0 M440 372 q15 -10 30 0 t30 0 M200 396 q15 -10 30 0 t30 0 M520 340 q12 -8 24 0" stroke="#D6F1FF" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="300" cy="334" rx="170" ry="10" fill="#0E3A6A" opacity=".25" filter="url(#f-soft)" />
      <g className="spot" data-spot="roots" data-ok="1">
        {roots.map(d => <Tube key={d} d={d} color="#A8743F" w={11} ow={4.5} />)}
        {roots.map(d => <path key={`h${d}`} d={d} fill="none" stroke="#D9A86A" strokeWidth="3" strokeLinecap="round" transform="translate(-2 -2)" opacity=".8" />)}
        <rect x="150" y="226" width="300" height="116" fill="transparent" />
      </g>
      <g className="spot" data-spot="trunk">
        <path d="M280 240 C286 200 284 160 276 118 L324 118 C316 160 314 200 320 240Z" fill="url(#g-bark)" {...S} />
        <path d="M292 220 C294 190 292 160 288 134" stroke="#5A341C" strokeWidth="3" fill="none" opacity=".6" />
        <rect x="272" y="140" width="56" height="90" fill="transparent" />
      </g>
      <g className="spot" data-spot="leaves">
        <Blob circles={[[300, 92, 62], [228, 112, 46], [372, 112, 46], [258, 60, 44], [342, 60, 44]]} fill="url(#g-tree)" />
        <circle cx="262" cy="58" r="14" fill="#fff" opacity=".3" /><circle cx="252" cy="52" r="6" fill="#fff" opacity=".5" />
      </g>
    </Svg>
  );
}

function LemonBranch() {
  const lemonAt = (x: number, y: number) => (
    <g key={`l${x}`} className="spot" data-spot="lemon">
      <g transform={`translate(${x} ${y}) rotate(90) scale(.62)`}>
        <path d={LEMON_D} fill="url(#g-lemon)" stroke={INK} strokeWidth="7.5" strokeLinejoin="round" />
        <path d="M-34 -22 C-20 -32 0 -34 16 -30" stroke="#fff" strokeWidth="11" fill="none" strokeLinecap="round" opacity=".65" />
      </g>
      <circle cx={x} cy={y} r="46" fill="transparent" />
    </g>
  );
  const blossomAt = (x: number, y: number) => (
    <g key={`b${x}`} className="spot" data-spot="flower" data-ok="1">
      <FlowerHead cx={x} cy={y} r={23} petal="url(#g-petalWhite)" center="url(#g-lemon)" n={5} wide={.62} sw={3.5} />
      <circle cx={x} cy={y} r="44" fill="transparent" />
    </g>
  );
  const leafAt = (x: number, y: number, rot: number) => (
    <g key={`f${x}${y}`} className="spot" data-spot="leaf">
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <path d="M0 0 C-22 -24 -22 -62 0 -86 C22 -62 22 -24 0 0Z" fill="url(#g-leaf)" {...S4} />
        <path d="M0 -8 L0 -74" stroke="#2A7F35" strokeWidth="3" strokeLinecap="round" />
        <Shine d="M-10 -30 C-12 -46 -8 -60 -2 -70" w={4} o={.5} />
      </g>
    </g>
  );
  const twigs: [number, number, number, number][] = [[160, 112, 160, 162], [310, 146, 310, 216], [450, 186, 450, 254], [240, 128, 240, 66], [420, 178, 420, 112], [70, 106, 70, 178]];
  return (
    <Svg vb="0 0 600 420">
      <SkyBack />
      <Blob circles={[[520, 70, 24], [552, 60, 30], [586, 72, 22]]} fill="url(#g-cloud)" ow={3.5} />
      {twigs.map(([a, b, c, d]) => <Tube key={`${a}${b}`} d={`M${a} ${b} L${c} ${d}`} color="#8A5A34" w={6} ow={3.5} />)}
      <Tube d="M-10 112 C150 88 320 150 610 236" color="#8A5A34" w={16} ow={5} />
      <path d="M-10 106 C150 82 320 144 610 230" fill="none" stroke="#C08A5A" strokeWidth="4" strokeLinecap="round" opacity=".7" />
      {leafAt(120, 110, -40)}{leafAt(300, 145, 35)}{leafAt(500, 203, -25)}{leafAt(230, 128, 160)}{leafAt(540, 214, 150)}
      {lemonAt(160, 206)}{lemonAt(310, 262)}{lemonAt(450, 300)}
      {blossomAt(240, 50)}{blossomAt(420, 94)}{blossomAt(70, 196)}
    </Svg>
  );
}

function LemonHalfScene() {
  return <LemonHalfArt interactive />;
}

export const SCENES: Record<SceneKey, () => React.JSX.Element> = {
  mangrove: Mangrove,
  lemonBranch: LemonBranch,
  lemonHalf: LemonHalfScene,
};
