/* The reward: the watering can pours magic water and Pip grows the new part. */
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ART } from '../art/pictures';
import { PipPlant, type Mood } from '../art/Pip';
import { SFX } from '../audio/sfx';
import { Voice } from '../audio/voice';
import { LEVELS } from '../content/levels';
import type { Level } from '../content/types';
import { grownParts, useGame, type Grown } from '../state/store';
import { Button } from '../ui/Button';
import { IconArrow } from '../ui/icons';
import { WateringCan } from '../ui/WateringCan';
import { fx, world } from '../world/bus';

const PART: Record<Level['id'], keyof Grown> = {
  seed: 'sprout', roots: 'roots', stem: 'stem', leaves: 'leaves', flower: 'flower', fruit: 'fruit', bloom: 'bloom',
};

export function Growth() {
  const levelIndex = useGame(s => s.levelIndex);
  const done = useGame(s => s.done);
  const go = useGame(s => s.go);
  const lv = LEVELS[levelIndex];
  const part = PART[lv.id];
  const after = grownParts(done);
  const before: Grown = { ...after, [part]: false };
  const [phase, setPhase] = useState<'pour' | 'grow' | 'done'>('pour');
  const [mood, setMood] = useState<Mood>('idle');
  const plant = useRef<HTMLDivElement>(null);
  const isBloom = lv.id === 'bloom';

  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    SFX.pour();
    at(1900, () => {
      setPhase('grow');
      setMood('cheer');
      SFX.grow();
      fx.burstAt(plant.current, 'sparkle', 40);
    });
    at(2300, () => {
      fx.burstAt(plant.current, 'leaves', 30);
      Voice.say([{ who: 'narrator', text: lv.growth.narrator }, { who: 'pip', text: lv.growth.pip }]);
    });
    at(3400, () => {
      SFX.fanfare();
      fx.confetti(isBloom ? 160 : 90);
      if (isBloom) fx.fireworks(6000);
      if (lv.creature) world.arrive(lv.creature);
      setMood('happy');
    });
    at(4200, () => setPhase('done'));
    return () => { timers.forEach(clearTimeout); Voice.stop(); };
  }, [lv, isBloom]);

  const Icon = ART[lv.icon];

  return (
    <div className="screen growth">
      <motion.h2 className="growth-title" initial={{ y: -200, scale: .5 }} animate={{ y: 0, scale: phase === 'pour' ? .85 : 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
        <span className="growth-icon" style={{ ['--c' as string]: lv.color }}><Icon /></span>
        {phase === 'pour' ? 'Magic water time!' : lv.growth.title}
      </motion.h2>

      <div className="growth-plant" ref={plant}>
        <PipPlant grown={phase === 'pour' ? before : after} growing={phase === 'pour' ? null : part} mood={mood} moodKey={phase === 'pour' ? 0 : phase === 'grow' ? 1 : 2} />
      </div>

      <AnimatePresence>
        {phase === 'pour' && (
          <motion.div className="pour-can" initial={{ x: -500, y: -200, rotate: 0 }} animate={{ x: 0, y: 0, rotate: [0, 0, 38] }} exit={{ x: -600, opacity: 0, transition: { duration: .6 } }}
            transition={{ duration: 1, times: [0, .5, 1], ease: 'easeOut' }}>
            <WateringCan fill={1} />
            <div className="stream" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <motion.span key={i} className="stream-drop" initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 330], x: [0, 30 + (i % 3) * 14], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: .7, repeat: Infinity, delay: .9 + i * .07, ease: 'easeIn' }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'grow' && (
          <motion.div className="flash" initial={{ opacity: 0 }} animate={{ opacity: [0, .85, 0] }} exit={{ opacity: 0 }} transition={{ duration: .8 }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'done' && (
          <motion.div className="growth-next" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
            <Button size="lg" tone="sun" onClick={() => { Voice.stop(); go(isBloom ? 'finale' : 'garden'); }}>
              {isBloom ? 'See the award' : 'Back to the garden'} <IconArrow />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
