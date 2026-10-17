/* Drag-or-tap engine. Children can drag a card to a target, or tap a card and then tap the target.
   Works on the scaled stage (pointer deltas are divided by the stage scale). */
import { animate, motion, useMotionValue, type MotionValue } from 'motion/react';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { SFX } from '../audio/sfx';
import { stageScale } from '../stage/Stage';

interface Handles { x: MotionValue<number>; y: MotionValue<number>; rotate: MotionValue<number>; scale: MotionValue<number> }

export interface DropInfo { id: string; target: Element; el: HTMLElement; handles: Handles }

export interface EngineOptions {
  /** current drop targets (elements) */
  targets: () => Element[];
  accept: (id: string, target: Element) => boolean;
  /** called after a successful drop; return 'stay' to leave the card where it is (caller animates it) */
  onAccept: (info: DropInfo) => void | 'stay';
  onReject: (id: string, target: Element) => void;
  disabled?: boolean;
}

export function findTarget(x: number, y: number, list: Element[], pad = 26): Element | null {
  const p = pad * stageScale();
  let best: Element | null = null, bd = Infinity;
  for (const t of list) {
    const r = t.getBoundingClientRect();
    if (x < r.left - p || x > r.right + p || y < r.top - p || y > r.bottom + p) continue;
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) / Math.max(r.width, r.height);
    if (d < bd) { bd = d; best = t; }
  }
  return best;
}

const SPRING = { type: 'spring', stiffness: 380, damping: 22 } as const;

export function springBack(h: Handles) {
  animate(h.x, 0, SPRING); animate(h.y, 0, SPRING);
  animate(h.rotate, 0, SPRING); animate(h.scale, 1, SPRING);
}

/** fly a dropped card into the middle of a target and shrink it away */
export function flyInto(info: DropInfo, target: Element) {
  const a = info.el.getBoundingClientRect(), b = target.getBoundingClientRect(), s = stageScale();
  const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) / s + info.handles.x.get();
  const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) / s + info.handles.y.get();
  const t = { duration: .45, ease: [.5, 0, .75, 0] } as const;
  animate(info.handles.x, dx, t); animate(info.handles.y, dy, t);
  animate(info.handles.scale, .15, t); animate(info.handles.rotate, 25, t);
}

export function useDragEngine(opts: EngineOptions) {
  const ref = useRef(opts);
  ref.current = opts;
  const [selected, setSelected] = useState<{ id: string; el: HTMLElement; handles: Handles } | null>(null);
  const hoverEl = useRef<Element | null>(null);

  const setHover = (t: Element | null) => {
    if (t === hoverEl.current) return;
    hoverEl.current?.classList.remove('hover');
    t?.classList.add('hover');
    hoverEl.current = t;
  };

  const attempt = useCallback((id: string, el: HTMLElement, handles: Handles, x: number, y: number): boolean | 'miss' => {
    const o = ref.current;
    const t = findTarget(x, y, o.targets());
    if (!t) return 'miss';
    if (o.accept(id, t)) {
      SFX.drop();
      const r = o.onAccept({ id, target: t, el, handles });
      if (r !== 'stay') { handles.x.set(0); handles.y.set(0); handles.rotate.set(0); handles.scale.set(1); }
      return true;
    }
    o.onReject(id, t);
    return false;
  }, []);

  const down = useCallback((e: React.PointerEvent, id: string, el: HTMLElement, h: Handles) => {
    if (ref.current.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    try { el.setPointerCapture(e.pointerId); } catch { /* element may have been removed */ }
    const sx = e.clientX, sy = e.clientY;
    let moved = false;
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const s = stageScale();
      const dx = (ev.clientX - sx) / s, dy = (ev.clientY - sy) / s;
      if (!moved && Math.hypot(dx, dy) > 10) {
        moved = true;
        setSelected(null);
        el.classList.add('dragging');
        SFX.pick();
        animate(h.scale, 1.1, { duration: .15 }); animate(h.rotate, -5, { duration: .15 });
      }
      if (moved) {
        h.x.set(dx); h.y.set(dy);
        setHover(findTarget(ev.clientX, ev.clientY, ref.current.targets()));
      }
    };
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', end);
      ev.stopPropagation();
      setHover(null);
      el.classList.remove('dragging');
      if (!moved) {
        setSelected(cur => (cur?.id === id ? null : { id, el, handles: h }));
        SFX.pick();
        return;
      }
      const ok = ev.type === 'pointerup' && !ref.current.disabled ? attempt(id, el, h, ev.clientX, ev.clientY) : 'miss';
      if (ok !== true) springBack(h);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }, [attempt]);

  /** call from the activity area's pointer-up: drops a tapped card where the child taps next */
  const tapAt = useCallback((e: React.PointerEvent) => {
    if (!selected || ref.current.disabled) return;
    const r = attempt(selected.id, selected.el, selected.handles, e.clientX, e.clientY);
    if (r !== 'miss') setSelected(null);
  }, [selected, attempt]);

  return useMemo(() => ({ down, tapAt, selected: selected?.id ?? null, clear: () => setSelected(null) }), [down, tapAt, selected]);
}

export type Engine = ReturnType<typeof useDragEngine>;

/** a card that can be dragged (or tapped to select) */
export function Draggable({ id, engine, className = '', children, hidden }: {
  id: string; engine: Engine; className?: string; children: ReactNode; hidden?: boolean;
}) {
  const x = useMotionValue(0), y = useMotionValue(0), rotate = useMotionValue(0), scale = useMotionValue(1);
  const el = useRef<HTMLDivElement>(null);
  const handles = useMemo(() => ({ x, y, rotate, scale }), [x, y, rotate, scale]);
  return (
    <motion.div
      ref={el}
      className={`draggable ${engine.selected === id ? 'selected' : ''} ${className}`}
      style={{ x, y, rotate, scale, visibility: hidden ? 'hidden' : undefined }}
      onPointerDown={e => engine.down(e, id, el.current!, handles)}>
      {children}
    </motion.div>
  );
}
