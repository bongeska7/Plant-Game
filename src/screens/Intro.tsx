/* The story intro: the narrator introduces Pip, magic water wakes Pip up, Pip asks for help. */
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ART } from '../art/pictures';
import { PipPlant, type Mood } from '../art/Pip';
import { SFX } from '../audio/sfx';
import { Voice } from '../audio/voice';
import { INTRO } from '../content/lines';
import { grownParts, useGame } from '../state/store';
import { Button } from '../ui/Button';
import { useSpeech } from '../ui/Speech';
import { WateringCan } from '../ui/WateringCan';
import { fx } from '../world/bus';

const NONE = grownParts([]);

export function Intro() {
  const go = useGame(s => s.go);
  const { who, text } = useSpeech();
  const [beat, setBeat] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => Voice.say(INTRO, () => setFinished(true)), 600);
    return () => { clearTimeout(t); Voice.stop(); };
  }, []);

  useEffect(() => {
    const i = INTRO.findIndex(l => l.text === text);
    if (i > beat) setBeat(i);
  }, [text, beat]);

  // effects tied to story beats
  useEffect(() => {
    if (beat === 0) { SFX.sparkle(); setTimeout(() => fx.burst(innerWidth / 2, innerHeight * .3, 'sparkle', 30), 300); }
    if (beat === 3) { SFX.whoosh(); setTimeout(() => { SFX.boing(); fx.burst(innerWidth / 2, innerHeight * .55, 'water', 30); }, 900); }
    if (beat === 5) { SFX.fanfare(); fx.confetti(90); }
  }, [beat]);

  const mood: Mood = beat < 3 ? 'sleep' : beat === 3 ? 'happy' : 'idle';
  const current = INTRO[beat];
  const Bloom = ART.bloom;

  return (
    <div className="screen intro">
      <AnimatePresence>
        {beat === 0 && (
          <motion.div className="intro-card" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: -2 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
            The Magic Garden
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="intro-pip" initial={{ y: 600 }} animate={{ y: beat >= 1 ? 0 : 600 }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
        <PipPlant grown={NONE} mood={mood} moodKey={beat} fit />
        {beat < 3 && beat >= 1 && (
          <div className="zzz" aria-hidden="true">
            {['z', 'z', 'Z'].map((z, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 0, x: 0 }} animate={{ opacity: [0, 1, 0], y: -120, x: 40 + i * 20 }} transition={{ duration: 2.4, repeat: Infinity, delay: i * .8 }}>{z}</motion.span>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {beat === 2 && (
          <motion.div className="dream" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 13 }}>
            <span className="dream-dot d1" /><span className="dream-dot d2" />
            <motion.span className="dream-bloom" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><Bloom /></motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {beat === 3 && (
          <motion.div className="falling-drop" initial={{ y: -700, scale: .8 }} animate={{ y: 0, scale: [1, 1, 1.4], opacity: [1, 1, 0] }} transition={{ duration: 1, times: [0, .85, 1], ease: 'easeIn' }}>
            {(() => { const W = ART.water; return <W />; })()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {beat >= 4 && (
          <motion.div className="intro-can" initial={{ x: 500, rotate: 20 }} animate={{ x: 0, rotate: -6 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
            <WateringCan fill={beat >= 5 ? 1 : .35} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {who && current && (
          <motion.div key={current.text} className={`caption caption-${current.who}`}
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
            {current.who === 'pip' && <span className="caption-who">Pip</span>}
            {current.text}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(finished || beat >= 5) && (
          <motion.div className="intro-go" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
            <Button size="xl" tone="leaf" onClick={() => { Voice.stop(); go('garden'); }}>Let's go!</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="skip-btn" onClick={() => { SFX.tap(); Voice.stop(); go('garden'); }}>Skip story</button>
    </div>
  );
}
