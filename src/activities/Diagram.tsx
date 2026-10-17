/* Activities on the plant diagram: drag words onto parts, and tap the water's path. */
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { DIAGRAM, PlantDiagram } from '../art/PlantDiagram';
import { LABEL_HINT } from '../content/lines';
import type { LabelQ, Part, TapOrderQ } from '../content/types';
import { shuffle } from '../lib/util';
import { Counter } from './Choice';
import { Draggable, findTarget, useDragEngine } from './drag';
import type { ActivityProps } from './types';

const pct = (p: Part) => ({ left: `${(DIAGRAM.anchor[p][0] / DIAGRAM.w) * 100}%`, top: `${(DIAGRAM.anchor[p][1] / DIAGRAM.h) * 100}%` });

export function Label({ q, fb }: ActivityProps<LabelQ>) {
  const dia = useRef<HTMLDivElement>(null);
  const chips = useMemo(() => shuffle(q.labels), [q]);
  const [placed, setPlaced] = useState<Part[]>([]);
  const [pop, setPop] = useState<Part | null>(null);
  const [lastWrong, setLastWrong] = useState<Part | null>(null);

  const engine = useDragEngine({
    disabled: fb.locked,
    targets: () => [...(dia.current?.querySelectorAll('.hit') ?? [])],
    accept: (id, t) => t.getAttribute('data-part') === id,
    onAccept: ({ id }) => {
      const part = id as Part;
      const next = [...placed, part];
      setPlaced(next);
      setPop(part);
      const partEl = dia.current?.querySelector(`.part[data-part="${part}"]`) ?? null;
      if (next.length === q.labels.length) fb.complete(partEl);
      else fb.right(partEl, { label: part });
    },
    onReject: id => { setLastWrong(id as Part); fb.wrong(q.labels.length === 1 ? q.hint : LABEL_HINT[id as Part]); },
  });

  const hintPart = fb.misses >= 2 ? (lastWrong && !placed.includes(lastWrong) ? lastWrong : chips.find(c => !placed.includes(c))) : undefined;
  const partClass = Object.fromEntries([
    ...(pop ? [[pop, 'pop']] : []),
    ...(hintPart ? [[hintPart, 'hint']] : []),
  ]) as Partial<Record<Part, string>>;

  return (
    <div className="label-wrap" onPointerUp={engine.tapAt}>
      <div className="diagram" ref={dia}>
        <PlantDiagram lines={placed} partClass={partClass} />
        <div className="diagram-tags">
          <AnimatePresence>
            {placed.map(p => (
              <motion.div key={p} className="placed-tag" style={pct(p)}
                initial={{ scale: 0, x: '-50%', y: '-50%' }} animate={{ scale: 1, x: '-50%', y: '-50%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}>{p}</motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className={`chip-tray ${q.labels.length > 3 ? 'many' : ''}`}>
        {q.labels.length > 1 && <Counter total={q.labels.length} got={placed.length} />}
        {chips.map((c, i) => (
          <motion.div key={c} initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 18, delay: .2 + i * .08 }}>
            <Draggable id={c} engine={engine} className="chip" hidden={placed.includes(c)}>{c}</Draggable>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TapOrder({ q, fb }: ActivityProps<TapOrderQ>) {
  const dia = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [pop, setPop] = useState<Part | null>(null);
  const watered = q.steps.slice(0, step).map(s => s.part);

  const onTap = (e: React.MouseEvent) => {
    if (fb.locked || step >= q.steps.length) return;
    const t = findTarget(e.clientX, e.clientY, [...(dia.current?.querySelectorAll('.hit') ?? [])], 0);
    if (!t) return;
    const want = q.steps[step];
    const part = t.getAttribute('data-part') as Part;
    if (part !== want.part) { fb.wrong(want.hint); return; }
    const n = step + 1;
    setStep(n);
    setPop(part);
    const partEl = dia.current?.querySelector(`.part[data-part="${part}"]`) ?? null;
    if (n === q.steps.length) fb.complete(partEl);
    else fb.right(partEl, { text: want.say, kind: 'water' });
  };

  const partClass: Partial<Record<Part, string>> = {};
  watered.forEach(p => { partClass[p] = 'watered'; });
  if (pop) partClass[pop] = `${partClass[pop] ?? ''} pop`;
  if (fb.misses >= 2 && step < q.steps.length) partClass[q.steps[step].part] = `${partClass[q.steps[step].part] ?? ''} hint`;

  return (
    <div className="taporder-wrap">
      <Counter total={q.steps.length} got={step} />
      <div className="diagram diagram-tap" ref={dia} onClick={onTap}>
        <PlantDiagram partClass={partClass} flow={step > 0} />
        <div className="diagram-tags">
          {watered.map((p, i) => (
            <motion.div key={p} className="step-badge" style={pct(p)}
              initial={{ scale: 0, x: '-50%', y: '-50%' }} animate={{ scale: 1, x: '-50%', y: '-50%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}>{i + 1}</motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
