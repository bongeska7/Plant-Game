/* Tap the right spots inside an illustration (lemon seeds, lemon blossoms, mangrove roots). */
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { SCENES } from '../art/scenes';
import type { SceneTapQ } from '../content/types';
import { Counter } from './Choice';
import type { ActivityProps } from './types';

const NS = 'http://www.w3.org/2000/svg';

export function SceneTap({ q, fb }: ActivityProps<SceneTapQ>) {
  const box = useRef<HTMLDivElement>(null);
  const [need, setNeed] = useState(0);
  const [found, setFound] = useState(0);
  const Scene = SCENES[q.scene];

  useEffect(() => {
    setNeed(box.current?.querySelectorAll('.spot[data-ok="1"]').length ?? 0);
  }, [q]);

  // glow the remaining answers after two misses
  useEffect(() => {
    if (fb.misses < 2) return;
    box.current?.querySelectorAll('.spot[data-ok="1"]:not(.found)').forEach(s => s.classList.add('hint'));
  }, [fb.misses]);

  const onTap = (e: React.MouseEvent) => {
    if (fb.locked) return;
    const spot = (e.target as Element).closest('.spot');
    if (!spot || spot.classList.contains('found')) return;
    if (spot.getAttribute('data-ok') === '1') {
      spot.classList.remove('hint');
      spot.classList.add('found');
      const b = (spot as SVGGraphicsElement).getBBox();
      const ring = document.createElementNS(NS, 'circle');
      ring.setAttribute('cx', String(b.x + b.width / 2));
      ring.setAttribute('cy', String(b.y + b.height / 2));
      ring.setAttribute('r', String(Math.min(Math.max(b.width, b.height) / 2 + 6, 80)));
      ring.setAttribute('class', 'found-ring');
      spot.appendChild(ring);
      const n = found + 1;
      setFound(n);
      if (n >= need) fb.complete(spot); else fb.right(spot);
    } else {
      spot.classList.remove('flash');
      void (spot as SVGGraphicsElement).getBBox();
      spot.classList.add('flash');
      fb.wrong(q.wrong?.[spot.getAttribute('data-spot') ?? '']);
    }
  };

  return (
    <div className="scene-wrap">
      <Counter total={need} got={found} />
      <motion.div ref={box} className={`scene-frame scene-${q.scene}`} onClick={onTap}
        initial={{ scale: .6, opacity: 0, rotate: -4 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
        <Scene />
      </motion.div>
    </div>
  );
}
