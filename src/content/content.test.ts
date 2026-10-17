import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ART } from '../art/pictures';
import { DIAGRAM } from '../art/PlantDiagram';
import { lineId } from '../audio/hash';
import { LEVELS } from './levels';
import { allLines } from './speech';
import type { Question } from './types';

const every = (): Question[] => LEVELS.flatMap(l => [...l.questions, ...(l.pool ?? [])]);

describe('lesson content', () => {
  it('covers all six plant parts in lesson order, then the final challenge', () => {
    expect(LEVELS.map(l => l.id)).toEqual(['seed', 'roots', 'stem', 'leaves', 'flower', 'fruit', 'bloom']);
  });

  it('every question can be answered', () => {
    for (const q of every()) {
      switch (q.type) {
        case 'choice': expect(q.options.filter(o => o.ok)).toHaveLength(1); break;
        case 'tapAll': expect(q.items.some(o => o.ok)).toBe(true); expect(q.items.some(o => !o.ok)).toBe(true); break;
        case 'dragTo': expect(q.items.some(o => o.ok)).toBe(true); break;
        case 'sort': for (const it of q.items) expect(q.bins.map(b => b.id)).toContain(it.bin); break;
        case 'order': expect(q.items.length).toBeGreaterThanOrEqual(3); break;
        case 'label': for (const p of q.labels) expect(DIAGRAM.hits.some(h => h[0] === p)).toBe(true); break;
        case 'tapOrder': for (const s of q.steps) expect(DIAGRAM.hits.some(h => h[0] === s.part)).toBe(true); break;
        case 'sceneTap': expect(q.scene).toBeTruthy(); break;
      }
    }
  });

  it('every picture used exists in the art library', () => {
    const arts = every().flatMap(q =>
      q.type === 'choice' ? q.options.map(o => o.art)
      : q.type === 'tapAll' || q.type === 'order' || q.type === 'dragTo' ? q.items.map(o => o.art)
      : q.type === 'sort' ? [...q.items.map(o => o.art), ...q.bins.map(b => b.art)]
      : []);
    for (const a of arts) expect(ART[a], a).toBeTypeOf('function');
  });

  it('a picture name never appears twice in one question', () => {
    for (const q of every()) {
      const list = q.type === 'choice' ? q.options : 'items' in q ? q.items : [];
      const labels = list.map(o => o.label);
      expect(new Set(labels).size, q.prompt).toBe(labels.length);
    }
  });
});

describe('voices', () => {
  it('line ids are stable and speaker-specific', () => {
    expect(lineId('pip', 'Yes!')).toBe(lineId('pip', 'Yes!'));
    expect(lineId('pip', 'Yes!')).not.toBe(lineId('narrator', 'Yes!'));
  });

  it('every spoken line has an audio file (run `npm run voices` if this fails)', () => {
    const dir = fileURLToPath(new URL('../../public/voice/', import.meta.url));
    const missing = allLines().filter(l => !existsSync(`${dir}${lineId(l.who, l.text)}.mp3`));
    expect(missing.map(l => `${l.who}: ${l.text}`)).toEqual([]);
  });
});
