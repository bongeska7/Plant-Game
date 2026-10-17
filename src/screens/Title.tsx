import { motion } from 'motion/react';
import { useState } from 'react';
import { PipPlant } from '../art/Pip';
import { SFX } from '../audio/sfx';
import { grownParts, useGame } from '../state/store';
import { Button } from '../ui/Button';
import { fx } from '../world/bus';

export function Title() {
  const done = useGame(s => s.done);
  const go = useGame(s => s.go);
  const [moodKey, setMoodKey] = useState(0);
  const letters = "Pip's".split('');
  return (
    <div className="screen title">
      <h1 className="logo" aria-label="Pip's Magic Garden">
        <span className="logo-top" aria-hidden="true">
          {letters.map((ch, i) => ch === "'" ? (
            // Chrome drops the apostrophe while it animates on its own layer, so it stays still
            <span key={i} className="logo-letter">{ch}</span>
          ) : (
            <motion.span key={i} className="logo-letter"
              initial={{ y: -300, rotate: -30, opacity: 0 }} animate={{ y: [0, -14, 0], rotate: 0, opacity: 1 }}
              transition={{ y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1 + i * .12 }, default: { type: 'spring', stiffness: 220, damping: 12, delay: .1 + i * .08 } }}>
              {ch}
            </motion.span>
          ))}
        </span>
        <motion.span className="logo-bottom" aria-hidden="true" initial={{ scale: 0, rotate: 8 }} animate={{ scale: 1, rotate: -2 }} transition={{ type: 'spring', stiffness: 200, damping: 11, delay: .6 }}>
          Magic Garden
        </motion.span>
      </h1>

      <motion.div className="title-pip" initial={{ y: 400 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 13, delay: .9 }}
        onClick={e => { setMoodKey(k => k + 1); SFX.boing(); fx.burst(e.clientX, e.clientY, 'petals', 14); }}>
        <PipPlant grown={grownParts(done)} mood={moodKey ? 'happy' : 'idle'} moodKey={moodKey} fit />
      </motion.div>

      <motion.div className="title-play" initial={{ scale: 0 }} animate={{ scale: [1, 1.06, 1] }}
        transition={{ scale: { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } }}>
        <Button size="xl" tone="sun" onClick={() => go(done.length ? 'garden' : 'intro')}>
          {done.length ? 'Continue' : 'Play'}
        </Button>
      </motion.div>
    </div>
  );
}
