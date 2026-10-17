/* B+ shaded-cartoon art kit: one ink color, shared gradients, and drawing helpers.
   Gradients live once in <ArtDefs/> and every picture references them by id. */
import type { ReactNode, SVGProps } from 'react';

export const INK = '#1D1340';

export const S = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
export const S4 = { ...S, strokeWidth: 4 } as const;
export const S3 = { ...S, strokeWidth: 3 } as const;

type Stop = [number, string];
const lin = (id: string, stops: Stop[], x2 = 0, y2 = 1, x1 = 0, y1 = 0) => (
  <linearGradient id={id} key={id} x1={x1} y1={y1} x2={x2} y2={y2}>
    {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
  </linearGradient>
);
const rad = (id: string, stops: Stop[], cx = .36, cy = .3, r = .85) => (
  <radialGradient id={id} key={id} cx={cx} cy={cy} r={r}>
    {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
  </radialGradient>
);

/** All gradients and filters. Render once in the page (and inside standalone SVGs for textures). */
export function DefsContent() {
  return (
    <defs>
      {rad('g-seed', [[0, '#FFC98A'], [.45, '#EE9B4C'], [1, '#B8622A']])}
      {lin('g-leaf', [[0, '#A4F286'], [.55, '#4FC24C'], [1, '#2E8F3B']], 1, 1)}
      {lin('g-leafLt', [[0, '#C2FAA6'], [1, '#55C451']], 1, 1)}
      {lin('g-stem', [[0, '#2E8F3B'], [.45, '#6FDB5C'], [1, '#2E8F3B']], 1, 0)}
      {lin('g-soil', [[0, '#B57A48'], [1, '#6E4226']])}
      {lin('g-soilDeep', [[0, '#9A653A'], [1, '#4E2C17']])}
      {lin('g-root', [[0, '#FFE7B8'], [1, '#DDA864']], 1, 1)}
      {rad('g-petal', [[0, '#FFE6EE'], [.55, '#FF6F9A'], [1, '#E23F72']], .5, .95, 1)}
      {rad('g-petalWhite', [[0, '#FFFFFF'], [.7, '#F6F2FF'], [1, '#D8D0F2']], .5, .95, 1)}
      {rad('g-petalSun', [[0, '#FFF6A0'], [.6, '#FFC72C'], [1, '#F2930C']], .5, .95, 1)}
      {rad('g-petalPurple', [[0, '#EDE6FF'], [.55, '#A68CFF'], [1, '#6B4CE6']], .5, .95, 1)}
      {lin('g-tulip', [[0, '#FF9A9A'], [1, '#E0303A']])}
      {rad('g-center', [[0, '#FFF3A0'], [1, '#F2B01E']], .4, .35, .75)}
      {rad('g-centerBrown', [[0, '#A86F42'], [1, '#4A2A12']], .4, .35, .75)}
      {rad('g-apple', [[0, '#FF9A90'], [.5, '#E8383B'], [1, '#A51D24']], .34, .3, .8)}
      {rad('g-lemon', [[0, '#FFF9C0'], [.55, '#FFE14D'], [1, '#E2AE00']], .38, .3, .8)}
      {rad('g-lemonFlesh', [[0, '#FFFBD6'], [1, '#FFE45E']], .5, .5, .6)}
      {rad('g-water', [[0, '#E2F5FF'], [.5, '#4FB4FF'], [1, '#1E7FD6']], .35, .3, .85)}
      {lin('g-waterFlat', [[0, '#7FD0FF'], [1, '#2E8FE0']])}
      {lin('g-bark', [[0, '#6E4226'], [.5, '#B07848'], [1, '#6E4226']], 1, 0)}
      {lin('g-trunkTop', [[0, '#FFE2B0'], [1, '#E3B57A']])}
      {rad('g-rock', [[0, '#ECE8F4'], [.55, '#A49DB8'], [1, '#6E6784']], .35, .3, .85)}
      {rad('g-sun', [[0, '#FFFBD0'], [.5, '#FFD93B'], [1, '#FFA51F']], .4, .35, .75)}
      {lin('g-ray', [[0, '#FFCF4A'], [1, '#FF9F1C']])}
      {lin('g-cloud', [[.45, '#FFFFFF'], [1, '#C9ECFF']])}
      {rad('g-tree', [[0, '#9AF07F'], [.65, '#41B24A'], [1, '#2A8B3A']], .35, .3, .8)}
      {lin('g-pine', [[0, '#3DB070'], [1, '#1F7446']], 1, 0)}
      {rad('g-maple', [[0, '#FF8A7A'], [.6, '#E53935'], [1, '#B71C1C']], .5, .4, .8)}
      {rad('g-strawberry', [[0, '#FF8A9A'], [.55, '#E8283E'], [1, '#A8122A']], .38, .3, .85)}
      {lin('g-car', [[0, '#FF9A90'], [1, '#D7263D']])}
      {lin('g-glass', [[0, '#E8F7FF'], [1, '#8FD3FF']])}
      {rad('g-candy', [[0, '#FFC4DA'], [.6, '#FF5E8A'], [1, '#D6336C']], .38, .32, .8)}
      {lin('g-pizza', [[0, '#FFE89A'], [1, '#F7B731']])}
      {lin('g-crust', [[0, '#F0B46A'], [1, '#B8702E']])}
      {lin('g-wingO', [[0, '#FFD27A'], [1, '#FF8A1C']], 1, 1)}
      {lin('g-wingP', [[0, '#C2B0FF'], [1, '#6B4CE6']], 1, 1)}
      {lin('g-bowl', [[0, '#A994FF'], [1, '#6247D8']])}
      {lin('g-food', [[0, '#FFE89A'], [1, '#F5B529']])}
      {lin('g-pumpkin', [[0, '#FFF6DC'], [1, '#E5CF98']], 1, 1)}
      {lin('g-sunSeed', [[0, '#62577F'], [1, '#272040']], 1, 0)}
      {lin('g-gloss', [[0, 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']])}
      {lin('g-stone', [[0, '#F2EFF7'], [.6, '#C9C2D9'], [1, '#9C93B3']])}
      {rad('g-cheek', [[0, 'rgba(255,110,122,.75)'], [1, 'rgba(255,110,122,0)']], .5, .5, .5)}
      {rad('g-iris', [[0, '#8A5530'], [.7, '#3E200C'], [1, '#1E0E04']], .45, .4, .6)}
      {rad('g-glow', [[0, 'rgba(255,248,200,.95)'], [.4, 'rgba(255,236,140,.55)'], [1, 'rgba(255,236,140,0)']], .5, .5, .5)}
      {rad('g-worm', [[0, '#FFC2C8'], [1, '#E9808C']], .4, .3, .8)}
      {rad('g-ladybug', [[0, '#FF8A80'], [.6, '#E53935'], [1, '#A51D24']], .38, .3, .8)}
      {rad('g-shell', [[0, '#FFE2A8'], [.6, '#E9A24E'], [1, '#B8692A']], .4, .35, .8)}
      {rad('g-bee', [[0, '#FFF2A0'], [1, '#FFC21F']], .4, .3, .8)}
      {rad('g-bird', [[0, '#9FE1FF'], [.6, '#3FA9F5'], [1, '#1F6FC4']], .38, .3, .8)}
      <filter id="f-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      <filter id="f-blur1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" /></filter>
    </defs>
  );
}

/** Hidden page-level SVG that holds the shared gradients (must not be display:none). */
export function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
      <DefsContent />
    </svg>
  );
}

export function Svg({ children, vb = '0 0 200 200', className, ...rest }: { children?: ReactNode; vb?: string } & SVGProps<SVGSVGElement>) {
  return <svg viewBox={vb} className={className} aria-hidden="true" {...rest}>{children}</svg>;
}

/** thick line with an ink outline (stems, roots, twigs) */
export function Tube({ d, color, w = 8, ow = 4.5 }: { d: string; color: string; w?: number; ow?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + ow * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

/** overlapping circles with a single outer outline (tree tops, clouds, bushes) */
export function Blob({ circles, fill, ow = 4.5 }: { circles: [number, number, number][]; fill: string; ow?: number }) {
  return (
    <>
      {circles.map(([x, y, r], i) => <circle key={`o${i}`} cx={x} cy={y} r={r + ow} fill={INK} />)}
      {circles.map(([x, y, r], i) => <circle key={`f${i}`} cx={x} cy={y} r={r} fill={fill} />)}
    </>
  );
}

/** soft contact shadow under an object */
export function Shadow({ cx = 100, cy = 186, rx = 50, ry = 9, o = .28 }: { cx?: number; cy?: number; rx?: number; ry?: number; o?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#0E2A12" opacity={o} filter="url(#f-soft)" />;
}

/** glossy highlight stroke */
export function Shine({ d, w = 7, o = .65 }: { d: string; w?: number; o?: number }) {
  return <path d={d} fill="none" stroke="#fff" strokeWidth={w} strokeLinecap="round" opacity={o} />;
}

export function FlowerHead({ cx, cy, r, petal, center, n = 6, wide = .55, sw = 4 }: {
  cx: number; cy: number; r: number; petal: string | string[]; center: string; n?: number; wide?: number; sw?: number;
}) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={cx} cy={cy - r * .72} rx={r * wide} ry={r * .62}
          transform={`rotate(${(360 / n) * i} ${cx} ${cy})`}
          fill={Array.isArray(petal) ? petal[i % petal.length] : petal} stroke={INK} strokeWidth={sw} />
      ))}
      <circle cx={cx} cy={cy} r={r * .5} fill={center} stroke={INK} strokeWidth={sw} />
      <circle cx={cx - r * .16} cy={cy - r * .18} r={r * .14} fill="#fff" opacity=".6" />
    </g>
  );
}

/** teardrop seed shape centered at (cx, cy) with height h */
export function seedD(h: number) {
  const k = h / 2;
  return `M0 ${-k} C${k * .58} ${-k * .52} ${k * .72} ${k * .16} ${k * .58} ${k * .58} C${k * .44} ${k * 1.06} ${-k * .44} ${k * 1.06} ${-k * .58} ${k * .58} C${-k * .72} ${k * .16} ${-k * .58} ${-k * .52} 0 ${-k}Z`;
}

export function SeedShape({ cx, cy, h, rot = 0, fill = 'url(#g-seed)', sw = 4 }: { cx: number; cy: number; h: number; rot?: number; fill?: string; sw?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <path d={seedD(h)} fill={fill} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M${-h * .17} ${-h * .12} C${-h * .22} 0 ${-h * .2} ${h * .14} ${-h * .14} ${h * .24}`} fill="none" stroke="#fff" strokeWidth={h * .06} strokeLinecap="round" opacity=".55" />
    </g>
  );
}

export const LEMON_D = 'M-78 0 C-70 -8 -66 -18 -56 -28 C-30 -54 30 -54 56 -28 C66 -18 70 -8 78 0 C70 8 66 18 56 28 C30 54 -30 54 -56 28 C-66 18 -70 8 -78 0Z';
