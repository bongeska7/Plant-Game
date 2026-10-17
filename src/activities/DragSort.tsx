/* Drag the right things into one target / sort into two groups / put in order. */
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ART } from '../art/pictures';
import type { DragToQ, OrderQ, SortQ } from '../content/types';
import { shuffle } from '../lib/util';
import { CardFace } from './cards';
import { Counter } from './Choice';
import { Draggable, flyInto, useDragEngine } from './drag';
import type { ActivityProps } from './types';

const TINTS = ['tint-pink', 'tint-green', 'tint-sun', 'tint-sky', 'tint-lilac', 'tint-peach'];

function Entrance({ i, children }: { i: number; children: ReactNode }) {
  return (
    <motion.div initial={{ y: -420, rotate: 20, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 16, delay: i * .08 }}>
      {children}
    </motion.div>
  );
}

export function DragTo({ q, fb }: ActivityProps<DragToQ>) {
  const items = useMemo(() => shuffle(q.items).map((o, i) => ({ ...o, id: `${i}` })), [q]);
  const need = items.filter(o => o.ok).length;
  const target = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState<string[]>([]);
  const goneNow = useRef<string[]>([]);
  const [gulp, setGulp] = useState(0);
  const Target = ART[q.target.art];

  const engine = useDragEngine({
    disabled: fb.locked,
    targets: () => (target.current ? [target.current] : []),
    accept: id => !!items.find(o => o.id === id)?.ok && !goneNow.current.includes(id),
    onAccept: info => {
      flyInto(info, info.target);
      const next = [...goneNow.current, info.id];
      goneNow.current = next;
      setTimeout(() => { setGone([...goneNow.current]); setGulp(g => g + 1); }, 430);
      const o = items.find(x => x.id === info.id)!;
      if (next.length === need) setTimeout(() => fb.complete(target.current), 450);
      else setTimeout(() => fb.right(target.current, { label: o.label, kind: o.art === 'water' ? 'water' : 'sparkle' }), 450);
      return 'stay';
    },
    onReject: id => fb.wrong(items.find(o => o.id === id)?.no),
  });

  return (
    <div className="dragto-wrap" onPointerUp={engine.tapAt}>
      <div className="tray-grid">
        {items.map((o, i) => (
          <Entrance key={o.id} i={i}>
            <Draggable id={o.id} engine={engine} hidden={gone.includes(o.id)}
              className={`card card-sm ${TINTS[i % TINTS.length]} ${fb.misses >= 2 && o.ok && !gone.includes(o.id) ? 'hint-glow' : ''}`}>
              <CardFace art={o.art} label={o.label} />
            </Draggable>
          </Entrance>
        ))}
      </div>
      <div className="drop-col">
        <Counter total={need} got={gone.length} />
        <motion.div ref={target} className="drop-target" key={gulp}
          initial={{ scale: gulp ? 1.15 : .5, opacity: gulp ? 1 : 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
          <span className="drop-ring" />
          <span className="drop-art"><Target /></span>
          <span className="drop-label">{q.target.label}</span>
        </motion.div>
        <div className="drop-got">
          <AnimatePresence>
            {gone.map(id => {
              const A = ART[items.find(o => o.id === id)!.art];
              return <motion.span key={id} className="got" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}><A /></motion.span>;
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function Sort({ q, fb }: ActivityProps<SortQ>) {
  const items = useMemo(() => shuffle(q.items).map((o, i) => ({ ...o, id: `${i}` })), [q]);
  const bins = useRef<Record<string, HTMLDivElement | null>>({});
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [hintBin, setHintBin] = useState<string | null>(null);

  const engine = useDragEngine({
    disabled: fb.locked,
    targets: () => Object.values(bins.current).filter(Boolean) as Element[],
    accept: (id, t) => items.find(o => o.id === id)?.bin === t.getAttribute('data-bin'),
    onAccept: ({ id, target }) => {
      const next = { ...placed, [id]: target.getAttribute('data-bin')! };
      setPlaced(next);
      setHintBin(null);
      const o = items.find(x => x.id === id)!;
      if (Object.keys(next).length === items.length) fb.complete(target);
      else fb.right(target, { label: o.label });
    },
    onReject: id => { const o = items.find(x => x.id === id)!; setHintBin(o.bin); fb.wrong(o.no); },
  });

  return (
    <div className="sort-wrap" onPointerUp={engine.tapAt}>
      <div className="tray-row">
        {items.map((o, i) => (
          <Entrance key={o.id} i={i}>
            <Draggable id={o.id} engine={engine} hidden={!!placed[o.id]} className={`card card-sm ${TINTS[i % TINTS.length]}`}>
              <CardFace art={o.art} label={o.label} />
            </Draggable>
          </Entrance>
        ))}
      </div>
      <div className="bins">
        {q.bins.map((b, i) => {
          const A = ART[b.art];
          return (
            <motion.div key={b.id} ref={el => { bins.current[b.id] = el; }} data-bin={b.id}
              className={`bin bin-${i} ${fb.misses >= 2 && hintBin === b.id ? 'hint-glow' : ''}`}
              initial={{ y: 300, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 16, delay: .3 + i * .1 }}>
              <div className="bin-head"><span className="bin-art"><A /></span><span className="bin-label">{b.label}</span></div>
              <div className="bin-items">
                <AnimatePresence>
                  {items.filter(o => placed[o.id] === b.id).map((o, k) => (
                    <motion.div key={o.id} className={`card card-xs ${TINTS[k % TINTS.length]}`}
                      initial={{ scale: 1.6, opacity: 0, rotate: -15 }} animate={{ scale: 1, opacity: 1, rotate: k % 2 ? 4 : -4 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 14 }}>
                      <CardFace art={o.art} label={o.label} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function Order({ q, fb }: ActivityProps<OrderQ>) {
  const items = useMemo(() => {
    let list = q.items.map((o, i) => ({ ...o, id: `${i}`, idx: i }));
    do { list = shuffle(list); } while (list.every((o, k) => o.idx === k));
    return list;
  }, [q]);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const [filled, setFilled] = useState<(string | null)[]>(() => q.items.map(() => null));

  const engine = useDragEngine({
    disabled: fb.locked,
    targets: () => slots.current.filter((s, i) => s && !filled[i]) as Element[],
    accept: (id, t) => String(items.find(o => o.id === id)?.idx) === t.getAttribute('data-idx'),
    onAccept: ({ id, target }) => {
      const k = Number(target.getAttribute('data-idx'));
      const next = filled.map((v, i) => (i === k ? id : v));
      setFilled(next);
      if (next.every(Boolean)) fb.complete(target.parentElement);
      else fb.right(target, { label: items.find(o => o.id === id)!.label });
    },
    onReject: () => fb.wrong(q.hint),
  });

  const firstOpen = filled.findIndex(v => !v);

  return (
    <div className="order-wrap" onPointerUp={engine.tapAt}>
      <div className="slots">
        {q.items.map((_, i) => {
          const id = filled[i];
          const o = id ? items.find(x => x.id === id)! : null;
          return (
            <div key={i} className="slot-group">
              <motion.div ref={el => { slots.current[i] = el; }} data-idx={i}
                className={`slot ${o ? 'filled' : ''} ${fb.misses >= 2 && i === firstOpen ? 'hint-glow' : ''}`}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: i * .1 }}>
                <span className="slot-num">{i + 1}</span>
                <AnimatePresence>
                  {o && (
                    <motion.div className="card card-sm tint-green slot-card" initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }}>
                      <CardFace art={o.art} label={o.label} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              {i < q.items.length - 1 && (
                <motion.svg className="slot-arrow" viewBox="0 0 60 40" aria-hidden="true" animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  <path d="M4 20h44M36 6l16 14-16 14" fill="none" stroke="#1D1340" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </div>
          );
        })}
      </div>
      <div className="tray-row">
        {items.map((o, i) => (
          <Entrance key={o.id} i={i}>
            <Draggable id={o.id} engine={engine} hidden={filled.includes(o.id)}
              className={`card card-sm ${TINTS[i % TINTS.length]} ${fb.misses >= 2 && firstOpen >= 0 && o.idx === firstOpen ? 'hint-glow' : ''}`}>
              <CardFace art={o.art} label={o.label} />
            </Draggable>
          </Entrance>
        ))}
      </div>
    </div>
  );
}
