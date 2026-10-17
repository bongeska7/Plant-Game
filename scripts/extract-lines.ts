/* Writes scripts/lines.json: every line the game speaks, with its speaker and audio file id. */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lineId } from '../src/audio/hash';
import { allLines } from '../src/content/speech';

const lines = allLines().map(l => ({ id: lineId(l.who, l.text), who: l.who, text: l.text }));
const out = fileURLToPath(new URL('./lines.json', import.meta.url));
writeFileSync(out, JSON.stringify(lines, null, 2));
console.log(`${lines.length} lines → ${out}`);
