/* The labeled plant used for "drag the word" and "water's trip" activities (600×640). */
import type { ReactNode } from 'react';
import type { Part } from '../content/types';
import { FlowerHead, INK, S, S4, Shine, Svg, Tube } from './kit';

export const DIAGRAM = {
  w: 600, h: 640,
  /** where each part is (label line starts here) */
  point: { roots: [236, 556], stem: [300, 395], leaves: [196, 284], flower: [300, 108], fruit: [420, 228] } as Record<Part, [number, number]>,
  /** where each placed label sits */
  anchor: { roots: [112, 584], stem: [474, 404], leaves: [96, 196], flower: [132, 70], fruit: [528, 150] } as Record<Part, [number, number]>,
  hits: [['roots', 300, 530, 95], ['stem', 300, 392, 42], ['leaves', 214, 286, 70], ['leaves', 386, 334, 62], ['flower', 300, 108, 64], ['fruit', 420, 228, 50]] as [Part, number, number, number][],
};

const ROOTS = [
  'M300 432 C300 480 296 530 300 604', 'M300 466 C270 486 230 498 200 540', 'M300 466 C330 486 370 498 400 540',
  'M298 516 C270 536 250 558 236 598', 'M302 516 C330 536 352 560 366 598', 'M212 526 C198 532 184 530 170 524', 'M388 526 C402 532 416 530 430 524',
];

interface Props {
  /** parts to dim everything else around */
  focus?: Part;
  /** extra classes per part, e.g. { roots: 'pop' } */
  partClass?: Partial<Record<Part, string>>;
  /** labels/lines to draw */
  lines?: Part[];
  /** show water flowing up through the plant */
  flow?: boolean;
  children?: ReactNode;
}

export function PlantDiagram({ focus, partClass = {}, lines = [], flow = false, children }: Props) {
  const cls = (p: Part) => ['part', focus && focus !== p ? 'dim' : '', focus === p ? 'focus' : '', partClass[p] ?? ''].join(' ');
  return (
    <Svg vb="0 0 600 640" className="diagram-svg">
      <defs>
        <linearGradient id="dg-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFF0FF" /><stop offset="1" stopColor="#F2FBFF" /></linearGradient>
      </defs>
      <rect x="20" y="16" width="560" height="420" rx="36" fill="url(#dg-sky)" />
      <rect x="20" y="430" width="560" height="196" rx="36" fill="url(#g-soilDeep)" stroke={INK} strokeWidth="6" />
      {[[70, 490, 7], [520, 600, 8], [540, 480, 6], [160, 610, 5], [110, 540, 4], [470, 530, 5]].map(([x, y, r]) => <circle key={`${x}`} cx={x} cy={y} r={r} fill="#3E2210" opacity=".7" />)}
      <g className={cls('roots')} data-part="roots">
        {ROOTS.map(d => <Tube key={d} d={d} color="url(#g-root)" w={9} ow={4.5} />)}
        {flow && ROOTS.slice(0, 3).map(d => <path key={`w${d}`} d={d} className="flow-in" fill="none" stroke="#7FD0FF" strokeWidth="4" strokeLinecap="round" />)}
      </g>
      <rect x="18" y="418" width="564" height="22" rx="11" fill="#5ED35A" stroke={INK} strokeWidth="5" />
      <path d="M40 424 L560 424" stroke="#B7F5A6" strokeWidth="4" strokeLinecap="round" />
      <g className={cls('stem')} data-part="stem">
        <Tube d="M301 264 C330 242 370 222 410 198" color="#45B84A" w={9} ow={5} />
        <Tube d="M300 432 C298 380 304 300 300 150" color="#45B84A" w={18} ow={6} />
        <path d="M294 424 C292 380 297 300 294 160" fill="none" stroke="#A8F08F" strokeWidth="4" strokeLinecap="round" opacity=".8" />
        {flow && <path d="M300 432 C298 380 304 300 300 150" className="flow-line" fill="none" stroke="#7FD0FF" strokeWidth="6" strokeLinecap="round" />}
      </g>
      <g className={cls('leaves')} data-part="leaves">
        <path d="M300 300 C260 250 190 245 150 278 C190 320 260 322 300 300Z" fill="url(#g-leaf)" {...S} />
        <path d="M296 298 C250 286 200 282 162 280 M250 290 L232 270 M220 286 L204 268 M250 290 L236 306 M220 286 L206 302" fill="none" stroke="#2A7F35" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M300 345 C340 300 410 300 452 330 C410 370 340 372 300 345Z" fill="url(#g-leaf)" {...S} />
        <path d="M304 343 C350 332 400 330 440 330 M350 336 L368 316 M390 332 L408 314 M350 336 L366 354 M390 332 L406 350" fill="none" stroke="#2A7F35" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M300 204 C280 182 250 180 236 192 C252 210 280 212 300 204Z" fill="url(#g-leaf)" {...S4} />
        <Shine d="M180 274 C196 262 216 258 236 260" w={5} o={.5} />
      </g>
      <g className={cls('fruit')} data-part="fruit">
        <Tube d="M410 198 C415 194 418 192 420 196" color="#45B84A" w={4} ow={3} />
        <circle cx="420" cy="228" r="34" fill="url(#g-apple)" {...S} />
        <Shine d="M400 222 C400 212 404 206 410 202" w={6} o={.7} />
        <path d="M420 192 L428 202 L440 198 L432 208 L420 204 L408 208 L400 198 L412 202Z" fill="#5ED35A" {...S4} />
      </g>
      <g className={cls('flower')} data-part="flower">
        <FlowerHead cx={300} cy={108} r={38} petal="url(#g-petal)" center="url(#g-center)" />
      </g>
      <g className="label-lines">
        {lines.map(p => {
          const [px, py] = DIAGRAM.point[p], [ax, ay] = DIAGRAM.anchor[p];
          return (
            <g key={p}>
              <line x1={px} y1={py} x2={ax} y2={ay} stroke={INK} strokeWidth="5" strokeLinecap="round" />
              <circle cx={px} cy={py} r="9" fill="#fff" stroke={INK} strokeWidth="5" />
            </g>
          );
        })}
      </g>
      <g className="hits">
        {DIAGRAM.hits.map(([p, x, y, r], i) => <circle key={i} className="hit" data-part={p} cx={x} cy={y} r={r} />)}
      </g>
      {children}
    </Svg>
  );
}
