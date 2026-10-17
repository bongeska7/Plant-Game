/* Picture card shared by the tap and drag activities. */
import { motion } from 'motion/react';
import type { ArtKey } from '../content/types';
import { ART } from '../art/pictures';
import { IconCheck } from '../ui/icons';
import { tiltFor } from '../lib/util';

export type CardState = 'idle' | 'right' | 'nope';

const TINTS = ['tint-pink', 'tint-green', 'tint-sun', 'tint-sky', 'tint-lilac', 'tint-peach'];

export function CardFace({ art, label, hideLabel }: { art: ArtKey; label: string; hideLabel?: boolean }) {
  const A = ART[art];
  return (
    <>
      <span className="card-gloss" />
      <span className="card-art"><A /></span>
      {!hideLabel && <span className="card-label">{label}</span>}
    </>
  );
}

export function PicCard({ art, label, index, state = 'idle', hint, hideLabel, onTap, size = 'md' }: {
  art: ArtKey; label: string; index: number; state?: CardState; hint?: boolean; hideLabel?: boolean;
  onTap: (el: HTMLElement) => void; size?: 'md' | 'sm';
}) {
  return (
    <motion.button
      className={`card card-${size} ${TINTS[index % TINTS.length]} ${state} ${hint ? 'hint-glow' : ''}`}
      aria-label={label}
      initial={{ y: -500, rotate: 25, opacity: 0 }}
      animate={
        state === 'right' ? { y: 0, opacity: 1, rotate: [tiltFor(index), -6, 6, 0], scale: [1, 1.14, .96, 1.04] }
        : state === 'nope' ? { y: 0, opacity: 1, rotate: tiltFor(index), x: [0, -16, 16, -12, 12, 0], scale: 1 }
        : { y: 0, opacity: 1, rotate: tiltFor(index), scale: 1 }
      }
      transition={state === 'idle'
        ? { type: 'spring', stiffness: 260, damping: 16, delay: index * .08 }
        : { duration: .55, ease: 'easeOut' }}
      whileHover={state === 'idle' ? { scale: 1.05, rotate: 0, y: -6 } : undefined}
      whileTap={state === 'idle' ? { scale: .93 } : undefined}
      onClick={e => onTap(e.currentTarget)}>
      <CardFace art={art} label={label} hideLabel={hideLabel} />
      {state === 'right' && (
        <motion.span className="check-badge" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
          <IconCheck />
        </motion.span>
      )}
    </motion.button>
  );
}
