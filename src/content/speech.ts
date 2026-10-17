/* Collects every line the game can speak, so voices can be generated ahead of time. */
import { LEVELS } from './levels';
import { FINALE, GARDEN_ALL_DONE, GARDEN_WELCOME, INTRO, LABEL_CHEER, LABEL_HINT, OOPS, PRAISE, STEP, type Line } from './lines';
import type { Question } from './types';

/** what Pip shouts when a single item is found ("Banana leaf!") */
export const exclaim = (label: string) => `${label.charAt(0).toUpperCase()}${label.slice(1)}!`;

function questionLines(q: Question): Line[] {
  const out: Line[] = [
    { who: 'narrator', text: q.prompt },
    { who: 'pip', text: q.hint },
    { who: 'pip', text: q.yes },
  ];
  const pics = q.type === 'choice' ? q.options
    : q.type === 'tapAll' || q.type === 'order' ? q.items
    : q.type === 'dragTo' || q.type === 'sort' ? q.items
    : [];
  for (const p of pics) {
    if (p.no) out.push({ who: 'pip', text: p.no });
    if (p.ok || q.type === 'sort') out.push({ who: 'pip', text: exclaim(p.label) });
  }
  if (q.type === 'sceneTap' && q.wrong) Object.values(q.wrong).forEach(text => out.push({ who: 'pip', text }));
  if (q.type === 'tapOrder') q.steps.forEach(s => { out.push({ who: 'pip', text: s.hint }); if (s.say) out.push({ who: 'pip', text: s.say }); });
  return out;
}

export function allLines(): Line[] {
  const lines: Line[] = [
    ...INTRO, ...FINALE,
    { who: 'narrator', text: GARDEN_WELCOME },
    { who: 'narrator', text: GARDEN_ALL_DONE },
    ...PRAISE.map(text => ({ who: 'pip' as const, text })),
    ...STEP.map(text => ({ who: 'pip' as const, text })),
    ...OOPS.map(text => ({ who: 'pip' as const, text })),
    ...Object.values(LABEL_CHEER).map(text => ({ who: 'pip' as const, text })),
    ...Object.values(LABEL_HINT).map(text => ({ who: 'pip' as const, text })),
  ];
  for (const lv of LEVELS) {
    lines.push({ who: 'narrator', text: lv.gardenLine });
    lines.push({ who: 'narrator', text: lv.learn.title });
    lv.learn.lines.forEach(text => lines.push({ who: 'narrator', text }));
    lines.push({ who: 'narrator', text: lv.growth.narrator });
    lines.push({ who: 'pip', text: lv.growth.pip });
    [...lv.questions, ...(lv.pool ?? [])].forEach(q => lines.push(...questionLines(q)));
  }
  // de-duplicate
  const seen = new Set<string>();
  return lines.filter(l => {
    const k = `${l.who}|${l.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
