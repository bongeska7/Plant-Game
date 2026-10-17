/* A fixed 1920×1080 stage, scaled to fit any screen. Everything in the game is laid out
   in stage pixels; pointer math divides by the current scale. */
import { useEffect, useState, type ReactNode } from 'react';

export const STAGE_W = 1920, STAGE_H = 1080;

let scale = 1;
export const stageScale = () => scale;

function measure() {
  return Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
}

export function Stage({ children }: { children: ReactNode }) {
  const [s, setS] = useState(measure);
  useEffect(() => {
    const on = () => setS(measure());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  scale = s;
  return (
    <div className="stage-wrap">
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${s})` }}>
        {children}
      </div>
    </div>
  );
}
