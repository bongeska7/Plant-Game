/* Live speech state, and Pip's speech bubble. */
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Voice } from '../audio/voice';
import type { Speaker } from '../content/types';

export function useSpeech() {
  const [s, setS] = useState<{ who: Speaker | null; text: string }>({ who: null, text: '' });
  useEffect(() => Voice.subscribe((who, text) => setS({ who, text })), []);
  return s;
}

/** shows what Pip is saying; stays up a moment after Pip finishes */
export function PipBubble({ className = '' }: { className?: string }) {
  const { who, text } = useSpeech();
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (who === 'pip') { setShown(text); return; }
    const t = setTimeout(() => setShown(''), who === null ? 2200 : 0);
    return () => clearTimeout(t);
  }, [who, text]);
  return (
    <AnimatePresence mode="wait">
      {shown && (
        <motion.div key={shown} className={`bubble ${className}`}
          initial={{ scale: .5, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: .8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}>
          {shown}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
