import type { BurstKind } from '../world/bus';

/** What every activity can report. The level screen turns these into voice, sound, Pip and effects. */
export interface Feedback {
  /** one correct step inside a multi-step question (found one seed, placed one label) */
  right: (el: Element | null, say?: { label?: string; text?: string; kind?: BurstKind }) => void;
  /** a wrong try; `message` replaces the question's general hint */
  wrong: (message?: string) => void;
  /** the whole question is done */
  complete: (el: Element | null) => void;
  /** wrong tries on this question so far (activities glow the answer after 2) */
  misses: number;
  /** true once the question is complete — activities stop accepting input */
  locked: boolean;
}

export interface ActivityProps<Q> { q: Q; fb: Feedback }
