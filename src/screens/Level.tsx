/* One level: learn → activities → hand off to the growth scene.
   Turns activity feedback into voice, sound, Pip's reactions, effects, and magic water drops. */
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from '../activities';
import type { Feedback } from '../activities/types';
import { ART } from '../art/pictures';
import { PipBuddy, type Mood } from '../art/Pip';
import { SFX } from '../audio/sfx';
import { Voice } from '../audio/voice';
import { LEVELS } from '../content/levels';
import { LABEL_CHEER, OOPS, PRAISE, STEP, type Line } from '../content/lines';
import { exclaim } from '../content/speech';
import type { Part } from '../content/types';
import { pick, shuffle } from '../lib/util';
import { stageScale } from '../stage/Stage';
import { useGame } from '../state/store';
import { fx } from '../world/bus';
import { Button, IconButton } from '../ui/Button';
import { IconArrow, IconHome, IconReplay } from '../ui/icons';
import { PipBubble } from '../ui/Speech';
import { WateringCan } from '../ui/WateringCan';
import { Learn } from './Learn';

interface Drop { id: number; from: { x: number; y: number }; to: { x: number; y: number } }

function toStage(x: number, y: number) {
  const r = document.querySelector('.stage')!.getBoundingClientRect(), s = stageScale();
  return { x: (x - r.left) / s, y: (y - r.top) / s };
}
function centerStage(el: Element | null) {
  if (!el) return { x: 960, y: 540 };
  const r = el.getBoundingClientRect();
  return toStage(r.left + r.width / 2, r.top + r.height / 2);
}

export function Level() {
  const levelIndex = useGame(s => s.levelIndex);
  const go = useGame(s => s.go);
  const finishLevel = useGame(s => s.finishLevel);
  const lv = LEVELS[levelIndex];
  const questions = useMemo(
    () => [...lv.questions, ...(lv.pool ? shuffle(lv.pool).slice(0, lv.poolPick ?? 3) : [])],
    [lv],
  );

  // dev shortcut: ?level=2&q=1 opens a question directly
  const [phase, setPhase] = useState<number>(() => {
    if (!import.meta.env.DEV) return -1;
    const q = new URLSearchParams(location.search).get('q');
    return q === null ? -1 : Math.min(Number(q), questions.length - 1);
  }); // -1 = learn
  const [misses, setMisses] = useState(0);
  const [locked, setLocked] = useState(false);
  const [solved, setSolved] = useState(0);
  const [mood, setMood] = useState<Mood>('idle');
  const [moodKey, setMoodKey] = useState(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [canBump, setCanBump] = useState(0);
  const can = useRef<HTMLDivElement>(null);
  const q = phase >= 0 ? questions[phase] : null;

  const react = (m: Mood) => { setMood(m); setMoodKey(k => k + 1); };
  useEffect(() => {
    if (mood === 'idle') return;
    const t = setTimeout(() => setMood('idle'), 1300);
    return () => clearTimeout(t);
  }, [mood, moodKey]);

  // read each question aloud when it appears
  useEffect(() => {
    if (!q) return;
    setMisses(0);
    setLocked(false);
    const t = setTimeout(() => Voice.say({ who: 'narrator', text: q.prompt }), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => () => Voice.stop(), []);

  const replay = useCallback(() => {
    if (q) Voice.say({ who: 'narrator', text: q.prompt });
  }, [q]);

  const next = useCallback(() => {
    SFX.tap();
    if (phase + 1 >= questions.length) { Voice.stop(); finishLevel(); return; }
    setPhase(p => p + 1);
  }, [phase, questions.length, finishLevel]);

  // keyboard help for the teacher: → or Enter = next, R = repeat
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && locked) { e.preventDefault(); next(); }
      if (e.key === 'r' || e.key === 'R') replay();
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [locked, next, replay]);

  const fb: Feedback = useMemo(() => ({
    misses,
    locked,
    right(el, say) {
      SFX.step();
      fx.burstAt(el, say?.kind ?? 'stars', 16);
      react('happy');
      const lines: Line[] = [];
      if (say?.text) lines.push({ who: 'pip', text: say.text });
      else {
        lines.push({ who: 'pip', text: pick(STEP) });
        if (say?.label) lines.push({ who: 'pip', text: (LABEL_CHEER as Record<string, string>)[say.label as Part] ?? exclaim(say.label) });
      }
      Voice.say(lines);
    },
    wrong(message) {
      if (!q) return;
      SFX.wrong();
      react('oops');
      setMisses(m => m + 1);
      Voice.say([{ who: 'pip', text: pick(OOPS) }, { who: 'pip', text: message || q.hint }]);
    },
    complete(el) {
      if (!q) return;
      setLocked(true);
      SFX.correct();
      fx.burstAt(el, 'mix', 34);
      react('cheer');
      Voice.say([{ who: 'pip', text: pick(PRAISE) }, { who: 'pip', text: q.yes }]);
      // a drop of magic water flies to Pip's watering can
      const from = centerStage(el), to = centerStage(can.current);
      setDrops(d => [...d, { id: Date.now(), from, to }]);
    },
  }), [misses, locked, q]);

  const landDrop = (id: number) => {
    setDrops(d => d.filter(x => x.id !== id));
    setSolved(n => n + 1);
    setCanBump(b => b + 1);
    SFX.sparkle();
  };

  const Icon = ART[lv.icon];

  return (
    <div className="screen level" style={{ ['--lv' as string]: lv.color }}>
      <header className="topbar">
        <IconButton label="Back to the garden" onClick={() => { Voice.stop(); go('garden'); }}><IconHome /></IconButton>
        <div className="level-chip"><span className="level-chip-icon"><Icon /></span><span>{lv.name}</span></div>
        <div className="progress-dots">
          {questions.map((_, i) => <span key={i} className={`pdot ${i < solved ? 'done' : ''} ${i === phase ? 'now' : ''}`} />)}
        </div>
        <motion.div key={canBump} className="can-wrap" initial={{ scale: canBump ? 1.25 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
          <WateringCan ref={can} fill={solved / questions.length} />
        </motion.div>
      </header>

      <AnimatePresence mode="wait">
        {q && (
          <motion.div key={`p${phase}`} className="prompt"
            initial={{ y: -80, opacity: 0, rotate: -1.5 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <IconButton label="Hear it again" className="say-btn" onClick={replay}><IconReplay /></IconButton>
            <p className={q.prompt.length > 62 ? 'long' : ''}>{q.prompt}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="stage-area">
        <AnimatePresence mode="wait">
          <motion.div key={phase} className={`area area-${q ? q.type : 'learn'}`}
            initial={{ opacity: 0, x: 120 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -160, transition: { duration: .25 } }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
            {q ? <Activity q={q} fb={fb} /> : <Learn lv={lv} onReady={() => setPhase(0)} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={`guide ${locked ? 'with-next' : ''}`}>
        <PipBubble className="guide-bubble" />
        <PipBuddy mood={mood} moodKey={moodKey} className="guide-pip" />
      </div>

      <AnimatePresence>
        {locked && (
          <motion.div className="next-wrap" initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14, delay: .6 }}>
            <Button tone="leaf" size="lg" onClick={next} className="next-btn">
              {phase + 1 >= questions.length ? 'Grow Pip!' : 'Next'} <IconArrow />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {drops.map(d => (
        <motion.div key={d.id} className="magic-drop"
          initial={{ x: d.from.x, y: d.from.y, scale: .4, opacity: 0 }}
          animate={{ x: [d.from.x, (d.from.x + d.to.x) / 2, d.to.x], y: [d.from.y, Math.min(d.from.y, d.to.y) - 220, d.to.y], scale: [.4, 1.3, .7], opacity: [0, 1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 1.1, ease: 'easeInOut', delay: .25 }}
          onAnimationComplete={() => landDrop(d.id)}>
          {(() => { const W = ART.water; return <W />; })()}
        </motion.div>
      ))}
    </div>
  );
}
