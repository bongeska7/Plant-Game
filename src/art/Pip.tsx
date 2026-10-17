/* Pip — the seed hero. Grows real plant parts as the class finishes levels.
   The mouth follows the actual loudness of Pip's voice clip (lip-sync). */
import { motion, type TargetAndTransition } from 'motion/react';
import { useEffect, useRef } from 'react';
import { Voice } from '../audio/voice';
import type { Grown } from '../state/store';
import { FlowerHead, INK, S, S4, Shine, Svg, Tube } from './kit';

export type Mood = 'idle' | 'happy' | 'oops' | 'cheer' | 'sleep';

const BODY_D = 'M110 62 C170 96 192 160 180 204 C168 250 52 250 40 204 C28 160 50 96 110 62Z';

/** Moves the mouth every frame from the voice level, without re-rendering React. */
function useLipSync() {
  const smile = useRef<SVGPathElement>(null);
  const open = useRef<SVGEllipseElement>(null);
  const tongue = useRef<SVGPathElement>(null);
  useEffect(() => {
    let raf = 0, cur = 0;
    const tick = () => {
      const target = Voice.pipLevel();
      cur += (target - cur) * .45;
      const o = cur > .06;
      if (smile.current) smile.current.style.opacity = o ? '0' : '1';
      if (open.current) {
        open.current.style.opacity = o ? '1' : '0';
        open.current.setAttribute('ry', String(4 + cur * 13));
        open.current.setAttribute('rx', String(10 + cur * 3));
      }
      if (tongue.current) tongue.current.style.opacity = o && cur > .25 ? '1' : '0';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return { smile, open, tongue };
}

/** Pip's seed body with face, in the 220×270 body space. */
function PipSeed({ mood }: { mood: Mood }) {
  const { smile, open, tongue } = useLipSync();
  const sad = mood === 'oops';
  return (
    <g>
      <ellipse cx="84" cy="248" rx="18" ry="9" fill="#9A5A26" {...S4} />
      <ellipse cx="136" cy="248" rx="18" ry="9" fill="#9A5A26" {...S4} />
      <path d={BODY_D} fill="url(#g-seed)" {...S} />
      <path d="M170 150 C178 172 176 196 166 214" fill="none" stroke="#FFE3B8" strokeWidth="3.5" strokeLinecap="round" opacity=".75" />
      <ellipse cx="66" cy="132" rx="10" ry="20" fill="#fff" opacity=".42" transform="rotate(18 66 132)" />
      {mood === 'sleep' ? (
        <path d="M72 152 Q86 162 100 152 M120 152 Q134 162 148 152" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      ) : <g className="pip-eyes">
        <ellipse cx="86" cy="150" rx="16" ry="19" fill="#fff" {...S4} />
        <ellipse cx="134" cy="150" rx="16" ry="19" fill="#fff" {...S4} />
        <circle cx="89" cy="155" r="10" fill="url(#g-iris)" />
        <circle cx="137" cy="155" r="10" fill="url(#g-iris)" />
        <circle cx="93" cy="150" r="4" fill="#fff" /><circle cx="141" cy="150" r="4" fill="#fff" />
        <circle cx="86" cy="160" r="1.8" fill="#fff" /><circle cx="134" cy="160" r="1.8" fill="#fff" />
      </g>}
      <path d={sad ? 'M70 124 Q84 130 98 126 M122 126 Q136 130 150 124' : 'M70 126 Q84 118 98 124 M122 124 Q136 118 150 126'} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="62" cy="184" rx="14" ry="9" fill="url(#g-cheek)" />
      <ellipse cx="158" cy="184" rx="14" ry="9" fill="url(#g-cheek)" />
      <path ref={smile} d={sad ? 'M98 190 Q110 182 122 190' : 'M94 180 Q110 198 126 180'} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <ellipse ref={open} cx="110" cy="187" rx="11" ry="8" fill="#8E1B3A" stroke={INK} strokeWidth="4" style={{ opacity: 0 }} />
      <path ref={tongue} d="M102 193 Q110 198 118 193 Q110 196 102 193Z" fill="#FF7A90" style={{ opacity: 0 }} />
    </g>
  );
}

const moodAnim: Record<Mood, TargetAndTransition> = {
  idle: { y: [0, -8, 0], scaleX: [1, .98, 1], scaleY: [1, 1.02, 1], rotate: 0, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } },
  happy: { y: [0, 6, -54, 0, -14, 0], scaleX: [1, 1.12, .92, 1.1, .97, 1], scaleY: [1, .88, 1.08, .9, 1.03, 1], rotate: [0, 0, -6, 0, 3, 0], transition: { duration: .95, ease: 'easeOut' } },
  cheer: { y: [0, -40, 0, -40, 0], rotate: [0, -8, 0, 8, 0], scaleY: [1, 1.06, .9, 1.06, 1], transition: { duration: 1.3, ease: 'easeInOut' } },
  oops: { rotate: [0, -10, 8, -5, 3, 0], y: 0, scaleX: 1, scaleY: 1, transition: { duration: .8, ease: 'easeInOut' } },
  sleep: { scaleY: [1, 1.04, 1], scaleX: [1, .98, 1], y: 0, rotate: 0, transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } },
};

/** Pip as a small character (220×270) — the helper in the corner of every activity. */
export function PipBuddy({ mood = 'idle', moodKey = 0, className }: { mood?: Mood; moodKey?: number; className?: string }) {
  return (
    <Svg vb="-10 -10 240 290" className={className} style={{ overflow: 'visible' }}>
      <ellipse cx="110" cy="262" rx="62" ry="10" fill="#0E2A12" opacity=".28" filter="url(#f-soft)" />
      <motion.g key={`${mood}-${moodKey}`} animate={moodAnim[mood]} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
        <g className="pip-sprout">
          <Tube d="M110 70 C108 50 112 36 110 22" color="#4FC24C" w={7} ow={4} />
          <path d="M110 34 C92 10 62 12 52 26 C70 46 96 46 110 34Z" fill="url(#g-leaf)" {...S4} />
          <path d="M110 28 C126 4 156 4 166 18 C150 40 124 40 110 28Z" fill="url(#g-leaf)" {...S4} />
          <Shine d="M64 24 C74 18 86 18 96 22" w={4} o={.6} />
        </g>
        <PipSeed mood={mood} />
      </motion.g>
    </Svg>
  );
}

type PartKey = keyof Grown;

/** a part that springs into existence when it is the one growing right now */
function Grow({ show, growing, origin, children, delay = 0 }: { show: boolean; growing: boolean; origin: string; children: React.ReactNode; delay?: number }) {
  if (!show) return null;
  return (
    <motion.g
      initial={growing ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 11, delay }}
      style={{ transformBox: 'fill-box', transformOrigin: origin }}>
      {children}
    </motion.g>
  );
}

/** Pip planted in the garden (600×820), showing every part grown so far. */
export function PipPlant({ grown, growing, mood = 'idle', moodKey = 0, className, fit = false }: {
  grown: Grown; growing?: PartKey | null; mood?: Mood; moodKey?: number; className?: string;
  /** crop to Pip when there is no tall plant yet (title and intro) */
  fit?: boolean;
}) {
  const g = (k: PartKey) => growing === k;
  const tall = grown.stem || grown.leaves || grown.flower || grown.fruit || grown.bloom;
  const roots = [
    'M300 596 C300 650 296 720 300 790', 'M300 620 C268 640 226 652 196 700', 'M300 620 C332 640 374 652 404 700',
    'M298 680 C270 700 250 730 236 780', 'M302 680 C330 700 352 730 366 780', 'M206 690 C190 696 174 694 160 688', 'M394 690 C410 696 426 694 440 688',
  ];
  const flowerR = grown.bloom ? 56 : 46;
  return (
    <Svg vb={fit && !tall ? '40 250 520 570' : '0 0 600 820'} className={className} style={{ overflow: 'visible' }}>
      <defs>
        <clipPath id="pip-soil-clip"><rect x="90" y="590" width="420" height="214" rx="40" /></clipPath>
      </defs>
      {grown.bloom && <circle cx="300" cy="300" r="300" fill="url(#g-glow)" className="bloom-glow" />}

      {/* soil cutaway */}
      <ellipse cx="300" cy="808" rx="230" ry="16" fill="#0E2A12" opacity=".3" filter="url(#f-soft)" />
      <rect x="90" y="590" width="420" height="214" rx="40" fill="url(#g-soilDeep)" stroke={INK} strokeWidth="6" />
      {[[140, 650, 7], [460, 760, 8], [470, 640, 6], [170, 770, 5], [420, 700, 4]].map(([x, y, r]) => <circle key={x} cx={x} cy={y} r={r} fill="#3E2210" opacity=".7" />)}
      <g clipPath="url(#pip-soil-clip)">
        <Grow show={grown.roots} growing={g('roots')} origin="50% 0%">
          {roots.map(d => <Tube key={d} d={d} color="url(#g-root)" w={10} ow={4.5} />)}
          {roots.slice(0, 3).map(d => <path key={`w${d}`} d={d} fill="none" stroke="#7FD0FF" strokeWidth="3.5" strokeLinecap="round" className="flow-in" />)}
        </Grow>
      </g>
      <path d="M70 606 Q300 548 530 606 L530 620 Q300 566 70 620Z" fill="#5ED35A" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M100 600 Q300 556 500 600" stroke="#B7F5A6" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* stem, leaves, flower, fruit grow from Pip's head */}
      <Grow show={tall} growing={g('stem')} origin="50% 100%">
        {grown.fruit && <>
          <Tube d="M301 250 C340 236 370 226 400 214" color="#45B84A" w={9} ow={5} />
          <Tube d="M299 300 C262 290 232 288 206 286" color="#45B84A" w={9} ow={5} />
        </>}
        <Tube d="M300 400 C298 330 304 230 300 110" color="#45B84A" w={18} ow={6} />
        <path d="M294 392 C292 330 297 236 294 124" fill="none" stroke="#A8F08F" strokeWidth="4" strokeLinecap="round" opacity=".8" />
        <path d="M302 400 C300 330 306 230 302 110" fill="none" stroke="#9FE0FF" strokeWidth="3" strokeLinecap="round" className="flow-line" opacity={grown.roots ? .75 : 0} />
      </Grow>

      <Grow show={grown.leaves} growing={g('leaves')} origin="50% 50%">
        <path d="M300 286 C262 242 196 238 158 268 C196 308 262 310 300 286Z" fill="url(#g-leaf)" {...S} />
        <path d="M296 284 C250 272 200 268 168 268 M250 276 L232 256 M216 272 L200 254 M250 276 L236 292 M216 272 L202 288" fill="none" stroke="#2A7F35" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M300 226 C338 184 404 182 442 212 C404 252 338 254 300 226Z" fill="url(#g-leaf)" {...S} />
        <path d="M304 224 C350 212 400 210 432 212 M350 218 L366 198 M390 214 L406 196 M350 218 L366 236 M390 214 L406 232" fill="none" stroke="#2A7F35" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M300 350 C284 332 258 330 246 340 C260 356 284 358 300 350Z" fill="url(#g-leaf)" {...S4} />
        <path d="M300 344 C316 326 342 324 354 334 C340 350 316 352 300 344Z" fill="url(#g-leaf)" {...S4} />
        <Shine d="M186 262 C202 250 222 246 242 248" w={5} o={.5} />
        <Shine d="M340 210 C356 200 376 196 396 198" w={5} o={.5} />
      </Grow>

      {/* bud on a bare stem, or the flower */}
      {tall && !grown.flower && !grown.bloom && (
        <g><ellipse cx="300" cy="102" rx="16" ry="22" fill="url(#g-leaf)" {...S4} /><path d="M292 90 C296 84 304 84 308 90" stroke="#fff" strokeWidth="3" fill="none" opacity=".6" /></g>
      )}
      <Grow show={grown.flower || grown.bloom} growing={g('flower') || g('bloom')} origin="50% 50%">
        <g className="flower-spin">
          <FlowerHead cx={300} cy={96} r={flowerR}
            petal={grown.bloom ? ['url(#g-petal)', 'url(#g-petalSun)', 'url(#g-petalPurple)', 'url(#g-water)', 'url(#g-petal)', 'url(#g-tulip)', 'url(#g-petalSun)'] : 'url(#g-petal)'}
            center="url(#g-center)" n={grown.bloom ? 7 : 6} />
        </g>
      </Grow>

      <Grow show={grown.fruit} growing={g('fruit')} origin="50% 0%" delay={.15}>
        {[[410, 250, 30], [196, 318, 28]].map(([x, y, r]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={r} fill="url(#g-apple)" {...S} />
            <Shine d={`M${x - 18} ${y - 4} C${x - 18} ${y - 14} ${x - 14} ${y - 20} ${x - 8} ${y - 24}`} w={6} o={.7} />
            <path d={`M${x} ${y - r - 4} l7 9 l11 -3 l-7 9 l-11 -3 l-11 3 l-7 -9 l11 3z`} fill="#5ED35A" {...S4} />
          </g>
        ))}
      </Grow>

      <Grow show={grown.bloom} growing={g('bloom')} origin="50% 50%" delay={.3}>
        <FlowerHead cx={430} cy={160} r={28} petal="url(#g-petalSun)" center="url(#g-center)" />
        <FlowerHead cx={170} cy={220} r={26} petal="url(#g-petalPurple)" center="url(#g-center)" />
        <FlowerHead cx={460} cy={300} r={22} petal="url(#g-petal)" center="url(#g-center)" />
      </Grow>

      {/* Pip's body sits in the soil */}
      <g transform="translate(173.5 320.7) scale(1.15)">
        <motion.g key={`${mood}-${moodKey}`} animate={moodAnim[mood]} style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
          {!tall && (
            <Grow show growing={g('sprout')} origin="50% 100%">
              <g className="pip-sprout">
                <Tube d={grown.sprout ? 'M110 70 C106 44 114 26 110 6' : 'M110 70 C108 56 112 46 110 36'} color="#4FC24C" w={7} ow={4} />
                <path d={grown.sprout ? 'M110 20 C88 -10 50 -8 38 10 C60 36 94 36 110 20Z' : 'M110 44 C96 26 74 28 66 38 C78 52 98 52 110 44Z'} fill="url(#g-leaf)" {...S4} />
                <path d={grown.sprout ? 'M110 12 C130 -18 168 -18 180 0 C160 26 128 28 110 12Z' : 'M110 40 C122 22 144 22 152 32 C140 46 122 48 110 40Z'} fill="url(#g-leaf)" {...S4} />
              </g>
            </Grow>
          )}
          <PipSeed mood={mood} />
        </motion.g>
      </g>
    </Svg>
  );
}
