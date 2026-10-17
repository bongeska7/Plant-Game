/* The garden hub: Pip's plant grows in the middle; seven stepping stones lead to the levels. */
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { INK } from '../art/kit';
import { ART } from '../art/pictures';
import { PipPlant } from '../art/Pip';
import { SFX } from '../audio/sfx';
import { Voice } from '../audio/voice';
import { LEVELS } from '../content/levels';
import { GARDEN_ALL_DONE } from '../content/lines';
import { grownParts, nextLevelIndex, useGame } from '../state/store';
import { IconCheck, IconReset } from '../ui/icons';

const STONES: [number, number][] = [[330, 880], [400, 640], [560, 420], [1360, 420], [1520, 640], [1590, 880], [960, 150]];

function Stone({ i, onPick }: { i: number; onPick: () => void }) {
  const done = useGame(s => s.done);
  const lv = LEVELS[i];
  const isDone = done.includes(lv.id);
  const isNext = nextLevelIndex(done) === i;
  const Icon = ART[lv.icon];
  const [x, y] = STONES[i];
  const big = lv.id === 'bloom';
  return (
    <motion.button
      className={`stone ${isDone ? 'done' : ''} ${isNext ? 'next' : ''} ${big ? 'big' : ''}`}
      style={{ left: x, top: y, ['--c' as string]: lv.color }}
      aria-label={`${lv.name}${isDone ? ', finished' : ''}`}
      initial={{ scale: 0, y: 60 }}
      animate={{ scale: 1, y: isNext ? [0, -16, 0] : 0 }}
      transition={{ scale: { type: 'spring', stiffness: 260, damping: 14, delay: .15 + i * .07 }, y: isNext ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { type: 'spring' } }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: .92 }}
      onClick={() => { SFX.tap(); onPick(); }}>
      {isNext && <span className="stone-glow" />}
      <span className="stone-rock">
        <span className="stone-medal"><Icon /></span>
      </span>
      <span className="stone-num">{i + 1}</span>
      {isDone && <span className="stone-check"><IconCheck /></span>}
      <span className="stone-name">{lv.name}</span>
    </motion.button>
  );
}

/** long-press so little hands can't reset by accident */
function ResetButton() {
  const reset = useGame(s => s.reset);
  const [holding, setHolding] = useState(false);
  const t = useRef<number>(0);
  const start = () => { setHolding(true); t.current = window.setTimeout(() => { setHolding(false); SFX.whoosh(); reset(); }, 1600); };
  const stop = () => { setHolding(false); clearTimeout(t.current); };
  return (
    <button className={`reset-btn ${holding ? 'holding' : ''}`} onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} aria-label="Hold to start over">
      <svg viewBox="0 0 60 60" className="reset-ring" aria-hidden="true"><circle cx="30" cy="30" r="26" /></svg>
      <IconReset />
      <span className="reset-tip">Hold to start over</span>
    </button>
  );
}

export function Garden() {
  const done = useGame(s => s.done);
  const startLevel = useGame(s => s.startLevel);
  const grown = grownParts(done);
  const ni = nextLevelIndex(done);
  const [mood, setMood] = useState<'idle' | 'happy'>('idle');
  const [moodKey, setMoodKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => Voice.say({ who: 'narrator', text: ni === -1 ? GARDEN_ALL_DONE : LEVELS[ni].gardenLine }), 500);
    return () => { clearTimeout(t); Voice.stop(); };
  }, [ni]);

  return (
    <div className="screen garden">
      <motion.div className="sign" initial={{ y: -200, rotate: -8 }} animate={{ y: 0, rotate: -3 }} transition={{ type: 'spring', stiffness: 160, damping: 12 }}>
        <span className="sign-title">Pip's Magic Garden</span>
        <span className="sign-leaves">
          {LEVELS.map(l => (
            <svg key={l.id} viewBox="0 0 40 40" className={done.includes(l.id) ? 'on' : ''} aria-hidden="true">
              <path d="M20 38 C4 30 4 10 20 2 C36 10 36 30 20 38Z" stroke={INK} strokeWidth="3" />
            </svg>
          ))}
        </span>
      </motion.div>

      <svg className="garden-path" viewBox="0 0 1920 1080" aria-hidden="true">
        <path d="M330 880 C360 760 380 700 400 640 C430 540 480 470 560 420 C700 330 820 200 960 150 C1100 200 1220 330 1360 420 C1440 470 1490 540 1520 640 C1540 700 1560 760 1590 880"
          fill="none" stroke="#F7E3B5" strokeWidth="34" strokeLinecap="round" strokeDasharray="2 58" />
      </svg>

      <motion.div className="garden-plant" onClick={() => { setMood('happy'); setMoodKey(k => k + 1); SFX.boing(); }}
        initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}>
        <PipPlant grown={grown} mood={mood} moodKey={moodKey} />
      </motion.div>

      {LEVELS.map((_, i) => <Stone key={i} i={i} onPick={() => { Voice.stop(); startLevel(i); }} />)}
      <ResetButton />
    </div>
  );
}
