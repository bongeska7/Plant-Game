/* Pip's watering can — fills with magic water as the class answers questions. */
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import { INK } from '../art/kit';

export const WateringCan = forwardRef<HTMLDivElement, { fill: number; tilt?: number; className?: string }>(
  function WateringCan({ fill, tilt = 0, className = '' }, ref) {
    const level = 150 - 92 * Math.max(0, Math.min(1, fill));
    return (
      <motion.div ref={ref} className={`can ${className}`} animate={{ rotate: tilt }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
        <svg viewBox="0 0 240 180" aria-hidden="true">
          <defs>
            <clipPath id="can-body"><path d="M60 58 L172 58 L164 158 Q116 170 68 158Z" /></clipPath>
            <linearGradient id="can-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#7FD0FF" /><stop offset=".45" stopColor="#C9EEFF" /><stop offset="1" stopColor="#4FA8E8" /></linearGradient>
          </defs>
          <path d="M172 82 L224 40 L232 50 L178 110" fill="url(#can-metal)" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <ellipse cx="228" cy="44" rx="10" ry="14" transform="rotate(40 228 44)" fill="#7FD0FF" stroke={INK} strokeWidth="5" />
          <path d="M60 80 C20 70 18 130 62 128" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <path d="M60 80 C20 70 18 130 62 128" fill="none" stroke="#4FA8E8" strokeWidth="7" strokeLinecap="round" />
          <path d="M60 58 L172 58 L164 158 Q116 170 68 158Z" fill="url(#can-metal)" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <g clipPath="url(#can-body)">
            <motion.rect x="50" width="140" height="120" fill="url(#g-waterFlat)" opacity=".92"
              initial={false} animate={{ y: level }} transition={{ type: 'spring', stiffness: 90, damping: 14 }} />
            <motion.path d="M50 0 Q70 -6 90 0 T130 0 T170 0 T210 0 V8 H50Z" fill="#BFE8FF"
              initial={false} animate={{ y: level, x: [0, -40, 0] }} transition={{ y: { type: 'spring', stiffness: 90, damping: 14 }, x: { duration: 2, repeat: Infinity, ease: 'linear' } }} />
          </g>
          <path d="M78 70 L74 140" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".55" />
          <rect x="52" y="50" width="128" height="16" rx="8" fill="#4FA8E8" stroke={INK} strokeWidth="5" />
          <path d="M84 50 C84 18 148 18 148 50" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
          <path d="M84 50 C84 18 148 18 148 50" fill="none" stroke="#7FD0FF" strokeWidth="6" strokeLinecap="round" />
          <path d="M110 92 l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2z" fill="#FFE14D" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </motion.div>
    );
  });
