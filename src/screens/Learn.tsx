/* The teaching moment at the start of each level: an animated picture and the textbook lines,
   read by the narrator with each line lighting up as it is spoken. */
import { motion, type TargetAndTransition } from 'motion/react';
import { useEffect, type ReactNode } from 'react';
import { ART } from '../art/pictures';
import { DIAGRAM, PlantDiagram } from '../art/PlantDiagram';
import { Voice } from '../audio/voice';
import type { ArtKey, Level, Part } from '../content/types';
import { Button } from '../ui/Button';
import { useSpeech } from '../ui/Speech';

const pop = (i: number) => ({
  initial: { scale: 0, rotate: -15, opacity: 0 },
  animate: { scale: 1, rotate: 0, opacity: 1 },
  transition: { type: 'spring' as const, stiffness: 220, damping: 13, delay: .3 + i * .45 },
});

function Fig({ art, cap, i, loop }: { art: ArtKey; cap?: string; i: number; loop?: TargetAndTransition }) {
  const A = ART[art];
  return (
    <motion.figure className="learn-fig" {...pop(i)}>
      <motion.span className="learn-fig-art" animate={loop} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * .3 }}><A /></motion.span>
      {cap && <figcaption>{cap}</figcaption>}
    </motion.figure>
  );
}

function Arrow({ i, sign = 'arrow' }: { i: number; sign?: 'arrow' | 'plus' }) {
  return (
    <motion.span className="learn-sep" {...pop(i + .5)}>
      {sign === 'plus'
        ? <svg viewBox="0 0 40 40"><path d="M20 6v28M6 20h28" stroke="#1D1340" strokeWidth="7" strokeLinecap="round" /></svg>
        : <motion.svg viewBox="0 0 60 40" animate={{ x: [0, 6, 0] }} transition={{ duration: 1.2, repeat: Infinity }}><path d="M4 20h44M36 6l16 14-16 14" fill="none" stroke="#1D1340" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></motion.svg>}
    </motion.span>
  );
}

const bob = { y: [0, -10, 0] };
const breathe = { scale: [1, 1.06, 1] };

function Row({ children }: { children: ReactNode }) {
  return <div className="learn-row">{children}</div>;
}

function LearnPicture({ lv }: { lv: Level }) {
  switch (lv.learn.art) {
    case 'seed':
      return <Row><Fig art="seed" cap="seed" i={0} loop={bob} /><Arrow i={0} /><Fig art="sprout" cap="sprout" i={1} loop={breathe} /><Arrow i={1} /><Fig art="plant" cap="plant" i={2} loop={bob} /></Row>;
    case 'roots':
    case 'bloom': {
      const focus: Part | undefined = lv.learn.art === 'roots' ? 'roots' : undefined;
      return (
        <motion.div className="learn-diagram" initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }}>
          <PlantDiagram focus={focus} flow lines={lv.learn.art === 'bloom' ? ['roots', 'stem', 'leaves', 'flower', 'fruit'] : []} />
          {lv.learn.art === 'bloom' && (
            <div className="diagram-tags">
              {(['roots', 'stem', 'leaves', 'flower', 'fruit'] as Part[]).map((p, i) => (
                <motion.div key={p} className="placed-tag"
                  style={{ left: `${(DIAGRAM.anchor[p][0] / DIAGRAM.w) * 100}%`, top: `${(DIAGRAM.anchor[p][1] / DIAGRAM.h) * 100}%` }}
                  initial={{ scale: 0, x: '-50%', y: '-50%' }} animate={{ scale: 1, x: '-50%', y: '-50%' }} transition={{ delay: .6 + i * .25, type: 'spring', stiffness: 380, damping: 14 }}>{p}</motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    }
    case 'stem':
      return <Row><Fig art="daisy" cap="thin, soft stem" i={0} loop={{ rotate: [-4, 4, -4] }} /><Fig art="tree" cap="thick, woody trunk" i={1} loop={breathe} /></Row>;
    case 'leaves':
      return <Row><Fig art="sun" cap="light" i={0} loop={{ rotate: [0, 20, 0] }} /><Arrow i={0} sign="plus" /><Fig art="air" cap="air" i={1} loop={{ x: [0, 10, 0] }} /><Arrow i={1} sign="plus" /><Fig art="water" cap="water" i={2} loop={bob} /><Arrow i={2} /><Fig art="leaf" cap="food!" i={3} loop={breathe} /></Row>;
    case 'flower':
      return <Row><Fig art="flower" cap="flower" i={0} loop={{ rotate: [-5, 5, -5] }} /><Arrow i={0} /><Fig art="seeds" cap="seeds" i={1} loop={bob} /></Row>;
    case 'fruit':
      return <Row><Fig art="blossom" cap="flower" i={0} loop={breathe} /><Arrow i={0} /><Fig art="lemon" cap="fruit" i={1} loop={{ rotate: [-6, 6, -6] }} /><Arrow i={1} /><Fig art="lemonHalf" cap="seeds" i={2} loop={{ rotate: [0, 360] }} /></Row>;
  }
}

export function Learn({ lv, onReady }: { lv: Level; onReady: () => void }) {
  const { who, text } = useSpeech();
  const read = (only?: number) => Voice.say(
    only === undefined
      ? [{ who: 'narrator', text: lv.learn.title }, ...lv.learn.lines.map(t => ({ who: 'narrator' as const, text: t }))]
      : { who: 'narrator', text: lv.learn.lines[only] },
  );
  useEffect(() => { read(); return () => Voice.stop(); }, [lv]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="learn">
      <div className="learn-art"><LearnPicture lv={lv} /></div>
      <motion.div className="learn-text" initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 18, delay: .2 }}>
        <motion.p className={`learn-word ${lv.learn.word.length > 8 ? 'long' : ''}`} style={{ ['--c' as string]: lv.color }} animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }}>{lv.learn.word}</motion.p>
        {lv.learn.lines.map((l, i) => (
          <button key={l} className={`learn-line ${who === 'narrator' && text === l ? 'reading' : ''}`} onClick={() => read(i)}>{l}</button>
        ))}
        <Button tone="leaf" size="lg" onClick={() => { Voice.stop(); onReady(); }}>I'm ready!</Button>
      </motion.div>
    </div>
  );
}
