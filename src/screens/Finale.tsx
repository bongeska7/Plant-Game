/* The end: Pip in full bloom, fireworks, and the class award. */
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { ART } from '../art/pictures';
import { PipPlant } from '../art/Pip';
import { SFX } from '../audio/sfx';
import { Voice } from '../audio/voice';
import { LEVELS } from '../content/levels';
import { AWARD_TITLE, FINALE } from '../content/lines';
import { grownParts, useGame } from '../state/store';
import { Button } from '../ui/Button';
import { fx } from '../world/bus';

export function Finale() {
  const done = useGame(s => s.done);
  const go = useGame(s => s.go);
  const reset = useGame(s => s.reset);

  useEffect(() => {
    SFX.fanfare();
    fx.fireworks(8000);
    fx.confetti(180);
    const t = setTimeout(() => Voice.say(FINALE), 700);
    const again = setInterval(() => fx.confetti(60), 5000);
    return () => { clearTimeout(t); clearInterval(again); Voice.stop(); };
  }, []);

  return (
    <div className="screen finale">
      <motion.div className="finale-plant" initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 100, damping: 14 }}>
        <PipPlant grown={grownParts(done)} mood="cheer" />
      </motion.div>
      <motion.div className="award" initial={{ scale: 0, rotate: 12 }} animate={{ scale: 1, rotate: -1.5 }} transition={{ type: 'spring', stiffness: 160, damping: 12, delay: .5 }}>
        <span className="award-ribbon" />
        <h2 className="award-title">{AWARD_TITLE}</h2>
        <p className="award-text">You know all the parts of a plant!</p>
        <div className="award-badges">
          {LEVELS.slice(0, 6).map((l, i) => {
            const A = ART[l.icon];
            return (
              <motion.figure key={l.id} style={{ ['--c' as string]: l.color }}
                initial={{ scale: 0, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 1.1 + i * .15 }}>
                <span><A /></span>
                <figcaption>{l.name.toLowerCase()}</figcaption>
              </motion.figure>
            );
          })}
        </div>
        <div className="award-actions">
          <Button tone="leaf" size="lg" onClick={reset}>Play again</Button>
          <Button tone="sun" size="lg" onClick={() => go('garden')}>Garden</Button>
        </div>
      </motion.div>
    </div>
  );
}
