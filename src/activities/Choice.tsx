/* Tap the one right picture / tap every right picture. */
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { ART } from '../art/pictures';
import type { ChoiceQ, TapAllQ } from '../content/types';
import { shuffle } from '../lib/util';
import { PicCard, type CardState } from './cards';
import type { ActivityProps } from './types';

const cols = (n: number) => (n <= 4 ? n : n === 6 ? 3 : n === 8 ? 4 : Math.ceil(n / 2));

export function Choice({ q, fb }: ActivityProps<ChoiceQ>) {
  const opts = useMemo(() => shuffle(q.options), [q]);
  const [states, setStates] = useState<CardState[]>(() => opts.map(() => 'idle'));
  const Show = q.show ? ART[q.show] : null;

  const tap = (i: number, el: HTMLElement) => {
    if (fb.locked || states[i] !== 'idle') return;
    const o = opts[i];
    setStates(s => s.map((v, k) => (k === i ? (o.ok ? 'right' : 'nope') : v)));
    if (o.ok) fb.complete(el); else fb.wrong(o.no);
  };

  return (
    <div className="choice-wrap">
      {Show && (
        <motion.div className="show-art" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
          <Show />
          <svg className="show-arrow" viewBox="0 0 60 40" aria-hidden="true"><path d="M4 20h44M36 6l16 14-16 14" fill="none" stroke="#1D1340" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
      )}
      <div className={`cards ${opts.length > 4 ? 'many' : ''}`} style={{ ['--cols' as string]: cols(opts.length) }}>
        {opts.map((o, i) => (
          <PicCard key={o.art + o.label} art={o.art} label={o.label} index={i} state={states[i]}
            hideLabel={q.hideLabels} hint={fb.misses >= 2 && !!o.ok && states[i] === 'idle'}
            onTap={el => tap(i, el)} size={opts.length > 4 ? 'sm' : 'md'} />
        ))}
      </div>
    </div>
  );
}

export function TapAll({ q, fb }: ActivityProps<TapAllQ>) {
  const items = useMemo(() => shuffle(q.items), [q]);
  const need = items.filter(o => o.ok).length;
  const [states, setStates] = useState<CardState[]>(() => items.map(() => 'idle'));

  const tap = (i: number, el: HTMLElement) => {
    if (fb.locked || states[i] !== 'idle') return;
    const o = items[i];
    const next = states.map((v, k) => (k === i ? (o.ok ? 'right' : 'nope') : v)) as CardState[];
    setStates(next);
    if (!o.ok) { fb.wrong(o.no); return; }
    const found = next.filter((s, k) => s === 'right' && items[k].ok).length;
    if (found === need) fb.complete(el); else fb.right(el, { label: o.label });
  };

  return (
    <div className="tapall-wrap">
      <Counter total={need} got={states.filter((s, k) => s === 'right' && items[k].ok).length} />
      <div className={`cards ${items.length > 4 ? 'many' : ''}`} style={{ ['--cols' as string]: cols(items.length) }}>
        {items.map((o, i) => (
          <PicCard key={o.art + o.label} art={o.art} label={o.label} index={i} state={states[i]}
            hint={fb.misses >= 2 && !!o.ok && states[i] === 'idle'} onTap={el => tap(i, el)} size={items.length > 4 ? 'sm' : 'md'} />
        ))}
      </div>
    </div>
  );
}

/** a row of seeds that fill up as the children find things */
export function Counter({ total, got }: { total: number; got: number }) {
  return (
    <div className="counter" aria-label={`${got} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <motion.span key={i} className={`counter-dot ${i < got ? 'on' : ''}`}
          animate={i < got ? { scale: [1, 1.5, 1], rotate: [0, 20, 0] } : { scale: 1 }}
          transition={{ duration: .45 }}>
          <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 L25 15 L38 15 L27 23 L31 37 L20 29 L9 37 L13 23 L2 15 L15 15Z" /></svg>
        </motion.span>
      ))}
    </div>
  );
}
