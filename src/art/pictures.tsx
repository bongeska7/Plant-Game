/* Every picture card in the game, drawn in the B+ shaded style (200×200 unless noted). */
import type { JSX } from 'react';
import type { ArtKey } from '../content/types';
import { Blob, FlowerHead, INK, LEMON_D, S, S3, S4, SeedShape, Shadow, Shine, Svg, Tube, seedD } from './kit';

function SmileFace({ cx, cy, sp = 16 }: { cx: number; cy: number; sp?: number }) {
  return (
    <g>
      <ellipse cx={cx - sp} cy={cy} rx="5.5" ry="7.5" fill={INK} /><ellipse cx={cx + sp} cy={cy} rx="5.5" ry="7.5" fill={INK} />
      <circle cx={cx - sp + 1.8} cy={cy - 2.5} r="2" fill="#fff" /><circle cx={cx + sp + 1.8} cy={cy - 2.5} r="2" fill="#fff" />
      <path d={`M${cx - 11} ${cy + 13} Q${cx} ${cy + 24} ${cx + 11} ${cy + 13}`} fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx={cx - sp - 11} cy={cy + 12} rx="8" ry="5" fill="url(#g-cheek)" /><ellipse cx={cx + sp + 11} cy={cy + 12} rx="8" ry="5" fill="url(#g-cheek)" />
    </g>
  );
}

export function LeafShape({ d, vein }: { d: string; vein?: string }) {
  return (
    <>
      <path d={d} fill="url(#g-leaf)" {...S4} />
      {vein && <path d={vein} fill="none" stroke="#2A7F35" strokeWidth="2.6" strokeLinecap="round" />}
    </>
  );
}

const Seed = () => (
  <Svg><Shadow cy={180} rx={42} />
    <SeedShape cx={100} cy={102} h={150} sw={5} />
    <path d="M100 38 C112 80 112 130 100 168" fill="none" stroke="#9A5A26" strokeWidth="4" strokeLinecap="round" opacity=".6" />
  </Svg>
);

const Seeds = () => (
  <Svg><Shadow cy={176} rx={64} />
    <SeedShape cx={64} cy={124} h={74} rot={-28} />
    <SeedShape cx={136} cy={124} h={74} rot={24} />
    <SeedShape cx={100} cy={94} h={80} rot={2} />
  </Svg>
);

const SunSeed = () => (
  <Svg><Shadow cy={180} rx={36} />
    <path d="M100 22 C132 60 140 120 128 150 C118 176 82 176 72 150 C60 120 68 60 100 22Z" fill="url(#g-sunSeed)" {...S} />
    <path d="M100 36 L100 166 M86 62 C80 100 82 140 88 160 M114 62 C120 100 118 140 112 160" stroke="#E9E4F2" strokeWidth="5" fill="none" strokeLinecap="round" />
    <Shine d="M82 70 C78 90 78 110 80 126" w={5} o={.35} />
  </Svg>
);

const PumpkinSeed = () => (
  <Svg><Shadow cy={180} rx={42} />
    <path d="M100 26 C140 40 150 110 136 146 C124 176 76 176 64 146 C50 110 60 40 100 26Z" fill="url(#g-pumpkin)" {...S} />
    <path d="M100 42 C126 56 132 110 122 136 C113 158 87 158 78 136 C68 110 74 56 100 42Z" fill="none" stroke="#D2B877" strokeWidth="5" />
    <Shine d="M80 72 C76 92 76 112 80 128" w={6} o={.7} />
  </Svg>
);

const Sprout = () => (
  <Svg><Shadow cy={182} rx={74} o={.22} />
    <path d="M22 180 Q100 122 178 180 Z" fill="url(#g-soil)" {...S} />
    <circle cx="70" cy="166" r="4" fill="#5A341C" /><circle cx="132" cy="164" r="5" fill="#5A341C" />
    <Tube d="M100 158 C100 134 98 114 100 96" color="#4FC24C" w={7} />
    <LeafShape d="M100 106 C84 80 52 82 40 98 C58 120 86 120 100 106Z" vein="M98 104 C80 98 62 96 48 98" />
    <LeafShape d="M100 98 C112 68 146 64 160 78 C148 102 120 108 100 98Z" vein="M102 96 C118 86 136 80 152 80" />
    <Shine d="M56 92 C64 86 74 84 84 86" w={4} o={.6} />
  </Svg>
);

const Plant = () => (
  <Svg><Shadow cy={184} rx={74} o={.22} />
    <path d="M22 184 Q100 148 178 184 Z" fill="url(#g-soil)" {...S} />
    <Tube d="M100 174 C100 140 102 110 100 82" color="#4FC24C" w={8} />
    <LeafShape d="M100 142 C84 118 52 120 40 136 C58 158 86 158 100 142Z" vein="M98 140 C80 134 62 134 48 136" />
    <LeafShape d="M100 122 C114 96 146 94 160 108 C148 130 120 134 100 122Z" vein="M102 120 C118 112 136 108 152 108" />
    <FlowerHead cx={100} cy={58} r={28} petal="url(#g-petal)" center="url(#g-center)" />
  </Svg>
);

const Sunflower = () => (
  <Svg><Shadow cy={188} rx={40} />
    <Tube d="M100 186 C100 150 100 120 100 96" color="#4FC24C" w={9} />
    <LeafShape d="M100 152 C84 130 52 132 42 148 C60 168 88 168 100 152Z" vein="M98 150 C80 146 62 146 50 148" />
    <LeafShape d="M100 136 C116 114 148 114 158 130 C140 150 112 150 100 136Z" vein="M102 134 C120 128 136 126 150 128" />
    <FlowerHead cx={100} cy={62} r={34} petal="url(#g-petalSun)" center="url(#g-centerBrown)" n={12} wide={.3} />
    {[[-8, -6], [6, -9], [9, 5], [-5, 9], [0, 0], [-10, 4]].map(([x, y], i) => <circle key={i} cx={100 + x} cy={62 + y} r="2.6" fill="#2A1608" />)}
  </Svg>
);

const Tulip = () => (
  <Svg><Shadow cy={188} rx={36} />
    <Tube d="M100 186 C100 150 98 120 100 96" color="#4FC24C" w={6} ow={4} />
    <path d="M100 178 C78 154 68 124 72 102 C90 122 98 152 100 178Z" fill="url(#g-leaf)" {...S4} />
    <path d="M100 172 C118 150 132 130 134 112 C116 126 104 148 100 172Z" fill="url(#g-leaf)" {...S4} />
    <path d="M64 46 L80 68 L100 36 L120 68 L136 46 C142 90 126 106 100 106 C74 106 58 90 64 46Z" fill="url(#g-tulip)" {...S} />
    <Shine d="M76 64 C78 80 84 92 92 98" w={5} o={.55} />
  </Svg>
);

const Daisy = () => (
  <Svg><Shadow cy={190} rx={30} />
    <Tube d="M100 188 C98 160 104 120 100 86" color="#4FC24C" w={5} ow={3} />
    <path d="M101 152 C116 136 138 136 146 144 C134 160 112 162 101 152Z" fill="url(#g-leaf)" {...S3} />
    <FlowerHead cx={100} cy={60} r={28} petal="url(#g-petalWhite)" center="url(#g-center)" n={10} wide={.32} sw={3.5} />
  </Svg>
);

const Flower = () => (
  <Svg><Shadow cy={188} rx={32} />
    <Tube d="M100 186 L100 112" color="#4FC24C" w={7} ow={4} />
    <path d="M101 160 C116 142 140 142 150 152 C136 170 112 172 101 160Z" fill="url(#g-leaf)" {...S4} />
    <FlowerHead cx={100} cy={76} r={38} petal="url(#g-petal)" center="url(#g-center)" />
  </Svg>
);

const Blossom = () => (
  <Svg>
    <path d="M100 100 C70 140 60 170 70 186 C92 176 104 146 100 100Z" fill="url(#g-leaf)" {...S4} />
    <path d="M100 100 C130 140 150 156 168 156 C164 134 136 112 100 100Z" fill="url(#g-leaf)" {...S4} />
    <FlowerHead cx={100} cy={88} r={44} petal="url(#g-petalWhite)" center="url(#g-lemon)" n={5} wide={.62} />
    <circle cx="92" cy="84" r="3" fill="#D9A300" /><circle cx="106" cy="82" r="3" fill="#D9A300" /><circle cx="100" cy="95" r="3" fill="#D9A300" />
  </Svg>
);

const Bloom = () => (
  <Svg>
    <circle cx="100" cy="100" r="92" fill="url(#g-glow)" />
    <FlowerHead cx={100} cy={100} r={52} n={7} wide={.5}
      petal={['url(#g-petal)', 'url(#g-petalSun)', 'url(#g-water)', 'url(#g-petalPurple)', 'url(#g-leaf)', 'url(#g-tulip)', 'url(#g-petal)']}
      center="url(#g-center)" />
    <SmileFace cx={100} cy={96} sp={11} />
  </Svg>
);

const Tree = () => (
  <Svg><Shadow cy={190} rx={64} />
    <path d="M78 190 C86 160 86 130 80 106 L120 106 C114 130 114 160 122 190 Z" fill="url(#g-bark)" {...S} />
    <path d="M92 150 C94 166 92 178 90 186" stroke="#5A341C" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6" />
    <Blob circles={[[100, 72, 44], [60, 92, 32], [140, 92, 32], [74, 52, 30], [126, 52, 30], [100, 108, 26]]} fill="url(#g-tree)" />
    <circle cx="78" cy="56" r="11" fill="#fff" opacity=".28" /><circle cx="70" cy="50" r="5" fill="#fff" opacity=".5" />
  </Svg>
);

const PineTree = () => (
  <Svg><Shadow cy={190} rx={54} />
    <rect x="88" y="150" width="24" height="38" rx="4" fill="url(#g-bark)" {...S} />
    <path d="M100 18 L140 70 L124 70 L158 112 L136 112 L170 156 L30 156 L64 112 L42 112 L76 70 L60 70 Z" fill="url(#g-pine)" {...S} />
    <path d="M96 34 L76 64 M88 82 L60 110 M80 126 L52 152" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".3" />
  </Svg>
);

const Trunk = () => (
  <Svg><Shadow cy={186} rx={72} />
    <path d="M56 62 L56 158 C56 170 40 178 30 184 L170 184 C160 178 144 170 144 158 L144 62 Z" fill="url(#g-bark)" {...S} />
    <ellipse cx="100" cy="62" rx="44" ry="17" fill="url(#g-trunkTop)" {...S} />
    <ellipse cx="100" cy="62" rx="28" ry="10" fill="none" stroke="#B98A55" strokeWidth="3" />
    <ellipse cx="100" cy="62" rx="12" ry="4" fill="none" stroke="#B98A55" strokeWidth="3" />
    <path d="M76 92 C74 112 78 132 74 152 M102 86 C104 112 100 132 104 162 M126 98 C124 118 128 138 124 152" stroke="#4E2C17" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".7" />
  </Svg>
);

const Stem = () => (
  <Svg><Shadow cy={188} rx={30} />
    <Tube d="M96 186 C90 140 112 100 100 36" color="#4FC24C" w={7} ow={4} />
    <path d="M101 116 C118 100 142 102 150 112 C138 128 114 128 101 116Z" fill="url(#g-leaf)" {...S4} />
    <ellipse cx="100" cy="32" rx="11" ry="15" fill="url(#g-petal)" {...S4} />
  </Svg>
);

const Roots = () => (
  <Svg>
    <rect x="14" y="74" width="172" height="110" rx="22" fill="url(#g-soil)" {...S} />
    <circle cx="40" cy="160" r="5" fill="#5A341C" /><circle cx="160" cy="104" r="4" fill="#5A341C" /><circle cx="150" cy="168" r="5" fill="#5A341C" />
    <Tube d="M100 76 C100 112 98 132 100 172" color="url(#g-root)" w={6} ow={3.5} />
    <Tube d="M100 94 C84 106 66 112 50 136" color="url(#g-root)" w={5} ow={3.5} />
    <Tube d="M100 94 C116 106 134 112 150 136" color="url(#g-root)" w={5} ow={3.5} />
    <Tube d="M99 126 C88 138 80 152 76 168" color="url(#g-root)" w={4} ow={3.5} />
    <Tube d="M101 126 C112 138 120 152 124 168" color="url(#g-root)" w={4} ow={3.5} />
    <rect x="12" y="64" width="176" height="16" rx="8" fill="#5ED35A" {...S4} />
    <Tube d="M100 66 C100 54 100 44 100 36" color="#4FC24C" w={6} ow={4} />
    <LeafShape d="M100 46 C88 28 66 28 58 38 C70 54 90 54 100 46Z" />
    <LeafShape d="M100 42 C112 24 134 24 142 34 C130 50 110 50 100 42Z" />
  </Svg>
);

const Leaf = () => (
  <Svg><Shadow cy={186} rx={40} />
    <Tube d="M100 182 L100 150" color="#4FC24C" w={6} ow={4} />
    <path d="M100 156 C40 130 40 50 100 18 C160 50 160 130 100 156Z" fill="url(#g-leaf)" {...S} />
    <path d="M100 150 L100 40 M100 122 L72 102 M100 122 L128 102 M100 92 L78 74 M100 92 L122 74 M100 62 L86 50 M100 62 L114 50" fill="none" stroke="#2A7F35" strokeWidth="3.5" strokeLinecap="round" />
    <Shine d="M66 70 C70 54 80 40 92 32" w={7} o={.55} />
  </Svg>
);

const BananaLeaf = () => {
  let ribs = '';
  for (let y = 40; y <= 160; y += 18) ribs += `M100 ${y} L${64 + (y > 100 ? 4 : 0)} ${y - 14} M100 ${y} L${136 - (y > 100 ? 4 : 0)} ${y - 14} `;
  return (
    <Svg><Shadow cy={186} rx={50} />
      <g transform="rotate(-30 100 100) scale(.9) translate(11 10)">
        <Tube d="M100 198 L100 176" color="#4FC24C" w={8} ow={4} />
        <path d="M100 182 C56 162 52 44 100 6 C148 44 144 162 100 182Z" fill="url(#g-leafLt)" {...S} />
        <path d={ribs} stroke="#3E9A45" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M100 178 L100 16" stroke="#3E9A45" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M58 120 L66 118 M142 90 L134 92" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <Shine d="M70 70 C74 50 84 30 96 18" w={6} o={.5} />
      </g>
    </Svg>
  );
};

const PineNeedles = () => {
  const x0 = 40, y0 = 172, x1 = 160, y1 = 34;
  const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
  let needles = '';
  for (let t = .12; t <= .96; t += .07) {
    const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
    for (const a of [-38, 38]) {
      const r = a * Math.PI / 180;
      const dx = ux * Math.cos(r) - uy * Math.sin(r), dy = ux * Math.sin(r) + uy * Math.cos(r);
      const L = 42 - t * 10;
      needles += `M${px.toFixed(1)} ${py.toFixed(1)} L${(px + dx * L).toFixed(1)} ${(py + dy * L).toFixed(1)} `;
    }
  }
  return (
    <Svg><Shadow cy={186} rx={46} />
      <path d={needles} fill="none" stroke={INK} strokeWidth="8.5" strokeLinecap="round" />
      <path d={needles} fill="none" stroke="#2E9A5E" strokeWidth="4" strokeLinecap="round" />
      <path d={needles} fill="none" stroke="#7FE0A0" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />
      <Tube d={`M${x0} ${y0} L${x1} ${y1}`} color="url(#g-bark)" w={6} ow={3.5} />
    </Svg>
  );
};

const Clover = () => (
  <Svg><Shadow cy={188} rx={32} />
    <Tube d="M100 186 C102 160 96 130 100 100" color="#4FC24C" w={6} ow={4} />
    {[0, 120, 240].map(a => (
      <g key={a} transform={`rotate(${a} 100 96)`}>
        <path d="M100 96 C80 84 62 68 70 50 C76 38 92 38 100 50 C108 38 124 38 130 50 C138 68 120 84 100 96Z" fill="url(#g-leaf)" {...S4} />
        <path d="M88 62 L100 74 L112 62" fill="none" stroke="#C8F7B4" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    ))}
  </Svg>
);

const Maple = () => (
  <Svg><Shadow cy={192} rx={36} />
    <Tube d="M100 190 L100 150" color="#B7262A" w={5} ow={3.5} />
    <path d="M100 18 L114 54 L140 44 L132 80 L170 70 L156 100 L182 114 L140 124 L148 150 L108 138 L104 158 L96 158 L92 138 L52 150 L60 124 L18 114 L44 100 L30 70 L68 80 L60 44 L86 54 Z" fill="url(#g-maple)" {...S} />
    <path d="M100 150 L100 50 M100 118 L60 92 M100 118 L140 92 M100 132 L64 136 M100 132 L136 136" stroke="#FFB0A8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </Svg>
);

const Ash = () => {
  const lf = (x: number, y: number, a: number) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="13" ry="27" transform={`rotate(${a} ${x} ${y})`} fill="url(#g-leaf)" {...S4} />;
  return (
    <Svg><Shadow cy={192} rx={32} />
      <Tube d="M100 190 L100 40" color="#4FC24C" w={5} ow={3.5} />
      {lf(72, 146, -62)}{lf(128, 146, 62)}{lf(72, 108, -62)}{lf(128, 108, 62)}{lf(74, 70, -58)}{lf(126, 70, 58)}{lf(100, 36, 0)}
    </Svg>
  );
};

const Sun = () => (
  <Svg>
    <circle cx="100" cy="100" r="96" fill="url(#g-glow)" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d="M100 10 L112 40 L88 40Z" transform={`rotate(${i * 30} 100 100)`} fill="url(#g-ray)" {...S4} />)}
    <circle cx="100" cy="100" r="52" fill="url(#g-sun)" {...S} />
    <SmileFace cx={100} cy={94} />
  </Svg>
);

const Air = () => (
  <Svg>
    <Tube d="M28 66 L120 66 C150 66 156 30 130 30 C112 30 108 52 122 56" color="#BDE8FF" w={10} ow={4.5} />
    <Tube d="M18 104 L148 104 C180 104 186 146 158 148 C138 150 134 128 148 124" color="#BDE8FF" w={10} ow={4.5} />
    <Tube d="M40 142 L98 142" color="#BDE8FF" w={10} ow={4.5} />
    <path d="M36 62 L110 62 M28 100 L130 100" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".9" />
  </Svg>
);

const Water = () => (
  <Svg><Shadow cy={184} rx={42} />
    <path d="M100 20 C130 66 154 98 154 126 C154 158 130 176 100 176 C70 176 46 158 46 126 C46 98 70 66 100 20Z" fill="url(#g-water)" {...S} />
    <Shine d="M72 116 C70 136 80 152 96 156" w={9} o={.75} />
    <circle cx="124" cy="100" r="6" fill="#fff" opacity=".7" />
  </Svg>
);

const Cloud = () => (
  <Svg>
    <Blob circles={[[64, 112, 34], [104, 92, 44], [144, 112, 32], [104, 124, 30]]} fill="url(#g-cloud)" />
    <Shine d="M70 104 C76 96 86 92 96 94" w={6} o={.9} />
  </Svg>
);

const Food = () => (
  <Svg><Shadow cy={178} rx={64} />
    <path d="M40 98 C42 70 70 58 88 70 C98 50 128 52 134 70 C152 62 168 80 162 98Z" fill="url(#g-food)" {...S} />
    <circle cx="80" cy="84" r="8" fill="url(#g-apple)" {...S3} /><circle cx="122" cy="80" r="8" fill="url(#g-leaf)" {...S3} />
    <path d="M28 98 L172 98 C172 142 142 170 100 170 C58 170 28 142 28 98Z" fill="url(#g-bowl)" {...S} />
    <Shine d="M52 116 C58 132 72 144 88 148" w={7} o={.45} />
    <path d="M78 46 C72 36 84 30 78 20 M104 42 C98 32 110 26 104 16 M130 46 C124 36 136 30 130 20" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".8" />
  </Svg>
);

const Apple = () => (
  <Svg><Shadow cy={186} rx={52} />
    <path d="M100 62 C80 48 40 50 34 92 C28 136 60 180 84 178 C92 178 96 172 100 172 C104 172 108 178 116 178 C140 180 172 136 166 92 C160 50 120 48 100 62Z" fill="url(#g-apple)" {...S} />
    <Tube d="M100 64 C100 50 104 40 110 32" color="#7A4E2D" w={5} ow={3.5} />
    <path d="M106 46 C118 28 142 28 150 36 C140 54 118 56 106 46Z" fill="url(#g-leaf)" {...S4} />
    <Shine d="M56 90 C52 106 54 122 60 134" w={9} o={.6} />
    <circle cx="70" cy="76" r="5" fill="#fff" opacity=".7" />
  </Svg>
);

const Lemon = () => (
  <Svg><Shadow cy={176} rx={60} />
    <g transform="translate(100 108)">
      <path d={LEMON_D} fill="url(#g-lemon)" {...S} />
      <Shine d="M-36 -24 C-20 -34 0 -36 16 -32" w={8} o={.7} />
      {[[-30, 6], [-10, 18], [16, 12], [34, -4], [0, -12]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#D9A300" opacity=".6" />)}
    </g>
    <path d="M100 62 C108 40 132 32 146 38 C140 58 118 66 100 62Z" fill="url(#g-leaf)" {...S4} />
  </Svg>
);

/** lemon cut in half — also the "tap the seeds" scene (400×400). Seeds carry data-spot="seed". */
export function LemonHalfArt({ interactive = false }: { interactive?: boolean }) {
  const n = 10, R = 134, r0 = 20, gap = 4;
  const p = (a: number, rad: number) => `${(200 + Math.cos(a) * rad).toFixed(1)} ${(200 + Math.sin(a) * rad).toFixed(1)}`;
  const wedges = Array.from({ length: n }, (_, i) => {
    const a1 = (i * 36 + gap) * Math.PI / 180, a2 = ((i + 1) * 36 - gap) * Math.PI / 180;
    return <path key={i} d={`M${p(a1, r0)} L${p(a1, R)} A${R} ${R} 0 0 1 ${p(a2, R)} L${p(a2, r0)} Z`} fill="url(#g-lemonFlesh)" stroke="#F2C53D" strokeWidth="3" strokeLinejoin="round" />;
  });
  const seeds = [[18, 90], [90, 84], [162, 92], [234, 86], [306, 92]].map(([deg, rad]) => {
    const a = deg * Math.PI / 180, x = 200 + Math.cos(a) * rad, y = 200 + Math.sin(a) * rad;
    return (
      <g key={deg} className={interactive ? 'spot' : undefined} data-spot="seed" data-ok="1">
        <SeedShape cx={x} cy={y} h={40} rot={deg - 90} fill="#FFF3D6" sw={4} />
        {interactive && <circle cx={x} cy={y} r="36" fill="transparent" />}
      </g>
    );
  });
  return (
    <Svg vb="0 0 400 400">
      <ellipse cx="200" cy="378" rx="150" ry="14" fill="#0E2A12" opacity=".25" filter="url(#f-soft)" />
      <circle cx="200" cy="200" r="178" fill="url(#g-lemon)" stroke={INK} strokeWidth="7" />
      <circle cx="200" cy="200" r="154" fill="#FFF6C2" />
      {wedges}
      <circle cx="200" cy="200" r="16" fill="#FFF6C2" />
      <path d="M84 110 C110 70 160 50 210 50" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" opacity=".55" />
      {seeds}
    </Svg>
  );
}
const LemonHalf = () => <LemonHalfArt />;

const Strawberry = () => (
  <Svg><Shadow cy={186} rx={42} />
    <path d="M100 180 C70 170 34 120 40 84 C44 64 70 58 100 64 C130 58 156 64 160 84 C166 120 130 170 100 180Z" fill="url(#g-strawberry)" {...S} />
    {[[78, 96], [100, 100], [122, 96], [86, 122], [114, 122], [100, 146], [70, 118], [130, 118]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="3" ry="5" fill="#FFE14D" stroke="#B88A00" strokeWidth="1" />)}
    <Shine d="M58 92 C56 106 60 120 66 130" w={7} o={.5} />
    <path d="M62 70 L80 56 L84 38 L100 54 L116 38 L120 56 L138 70 L114 74 L100 84 L86 74Z" fill="url(#g-leaf)" {...S4} />
  </Svg>
);

const Pizza = () => (
  <Svg><Shadow cy={184} rx={52} />
    <path d="M40 52 Q100 22 160 52 L100 178 Z" fill="url(#g-pizza)" {...S} />
    <path d="M36 52 Q100 16 164 52 L157 68 Q100 38 43 68 Z" fill="url(#g-crust)" {...S} />
    {[[88, 86, 11], [118, 98, 10], [100, 128, 9]].map(([x, y, r]) => <g key={x}><circle cx={x} cy={y} r={r} fill="url(#g-apple)" {...S3} /><circle cx={x - 3} cy={y - 3} r={r * .3} fill="#fff" opacity=".5" /></g>)}
  </Svg>
);

const Car = () => (
  <Svg><Shadow cy={162} rx={76} />
    <path d="M22 140 L22 114 C22 106 28 102 36 100 L58 98 L76 70 C80 64 86 62 94 62 L130 62 C138 62 144 66 148 72 L162 98 C172 100 178 106 178 116 L178 140 Z" fill="url(#g-car)" {...S} />
    <path d="M84 96 L96 76 L114 76 L114 96Z M124 96 L124 76 L136 76 L148 96Z" fill="url(#g-glass)" {...S4} />
    <Shine d="M34 112 L70 112" w={5} o={.6} />
    {[58, 144].map(x => <g key={x}><circle cx={x} cy="142" r="18" fill="#3B3355" {...S} /><circle cx={x} cy="142" r="7" fill="#D9D5E5" /></g>)}
  </Svg>
);

const Rock = () => (
  <Svg><Shadow cy={168} rx={70} />
    <path d="M34 156 C24 120 46 84 82 76 C108 60 150 72 164 104 C178 132 168 160 150 164 L50 166 C42 166 36 162 34 156Z" fill="url(#g-rock)" {...S} />
    <Shine d="M70 100 C80 92 96 90 106 94" w={8} o={.7} />
    <circle cx="130" cy="128" r="5" fill="#7E7796" /><circle cx="84" cy="138" r="4" fill="#7E7796" />
  </Svg>
);

const Candy = () => (
  <Svg><Shadow cy={156} rx={66} />
    <path d="M60 100 L22 70 L28 130 Z" fill="url(#g-candy)" {...S} />
    <path d="M140 100 L178 72 L172 128 Z" fill="url(#g-candy)" {...S} />
    <circle cx="100" cy="100" r="44" fill="url(#g-candy)" {...S} />
    <path d="M70 84 C90 70 112 74 120 92 C126 108 112 122 96 116" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
  </Svg>
);

export function ButterflyBody({ flap = false }: { flap?: boolean }) {
  return (
    <g>
      <g className={flap ? 'wing-l' : undefined}>
        <ellipse cx="66" cy="74" rx="36" ry="30" transform="rotate(-20 66 74)" fill="url(#g-wingO)" {...S4} />
        <ellipse cx="72" cy="126" rx="26" ry="23" fill="url(#g-wingP)" {...S4} />
        <circle cx="62" cy="72" r="9" fill="#FFF3D6" />
      </g>
      <g className={flap ? 'wing-r' : undefined}>
        <ellipse cx="134" cy="74" rx="36" ry="30" transform="rotate(20 134 74)" fill="url(#g-wingO)" {...S4} />
        <ellipse cx="128" cy="126" rx="26" ry="23" fill="url(#g-wingP)" {...S4} />
        <circle cx="138" cy="72" r="9" fill="#FFF3D6" />
      </g>
      <ellipse cx="100" cy="102" rx="9" ry="44" fill={INK} />
      <path d="M96 62 C90 44 82 36 72 32 M104 62 C110 44 118 36 128 32" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}
const Butterfly = () => <Svg><ButterflyBody /></Svg>;

export const ART: Record<ArtKey, () => JSX.Element> = {
  seed: Seed, seeds: Seeds, sunSeed: SunSeed, pumpkinSeed: PumpkinSeed, sprout: Sprout, plant: Plant,
  sunflower: Sunflower, tulip: Tulip, daisy: Daisy, flower: Flower, blossom: Blossom, bloom: Bloom,
  tree: Tree, pineTree: PineTree, trunk: Trunk, stem: Stem, roots: Roots,
  leaf: Leaf, bananaLeaf: BananaLeaf, pineNeedles: PineNeedles, clover: Clover, maple: Maple, ash: Ash,
  sun: Sun, air: Air, water: Water, cloud: Cloud, food: Food,
  apple: Apple, lemon: Lemon, lemonHalf: LemonHalf, strawberry: Strawberry,
  pizza: Pizza, car: Car, rock: Rock, candy: Candy, butterfly: Butterfly,
};

export function Picture({ art, className }: { art: ArtKey; className?: string }) {
  const C = ART[art];
  return <span className={className ?? 'pic'}><C /></span>;
}

// helper re-exports used by scenes
export { seedD };
