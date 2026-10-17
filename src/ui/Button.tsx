import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import { SFX } from '../audio/sfx';

type Tone = 'sun' | 'leaf' | 'sky' | 'pink';

export function Button({ tone = 'sun', size = 'md', children, onClick, className = '', ...rest }:
  { tone?: Tone; size?: 'md' | 'lg' | 'xl'; children: ReactNode } & HTMLMotionProps<'button'>) {
  return (
    <motion.button
      className={`btn btn-${tone} btn-${size} ${className}`}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: .94, y: 6 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      onClick={e => { SFX.tap(); onClick?.(e); }}
      {...rest}>
      <span className="btn-gloss" />
      <span className="btn-label">{children}</span>
    </motion.button>
  );
}

export function IconButton({ label, children, onClick, className = '', ...rest }:
  { label: string; children: ReactNode } & HTMLMotionProps<'button'>) {
  return (
    <motion.button
      className={`icon-btn ${className}`}
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: .9, y: 4 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      onClick={e => { SFX.tap(); onClick?.(e); }}
      {...rest}>
      {children}
    </motion.button>
  );
}
