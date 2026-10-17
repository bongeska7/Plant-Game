/* Plays pre-generated voice clips in order. Pip's mouth follows the real audio level. */
import { Howl, Howler } from 'howler';
import type { Line } from '../content/lines';
import type { Speaker } from '../content/types';
import { lineId } from './hash';

type Listener = (who: Speaker | null, text: string) => void;

let enabled = true;
let token = 0;
let current: Howl | null = null;
let speaking: Speaker | null = null;
let analyser: AnalyserNode | null = null;
let level = new Uint8Array(0);
const listeners = new Set<Listener>();
const cache = new Map<string, Howl>();

const emit = (who: Speaker | null, text: string) => listeners.forEach(fn => fn(who, text));

function ensureAnalyser() {
  if (analyser || !Howler.ctx || !Howler.masterGain) return;
  analyser = Howler.ctx.createAnalyser();
  analyser.fftSize = 512;
  level = new Uint8Array(analyser.fftSize);
  Howler.masterGain.connect(analyser);
}

function clip(line: Line): Howl {
  const id = lineId(line.who, line.text);
  let h = cache.get(id);
  if (h && h.state() === 'unloaded') { h.unload(); h = undefined; } // failed before: try again
  if (!h) {
    h = new Howl({ src: [`/voice/${id}.mp3`], preload: true, html5: false });
    cache.set(id, h);
  }
  return h;
}

/** browser speech as a fallback when a clip is missing, so the game never goes silent */
function speakFallback(line: Line, done: () => void) {
  const synth = window.speechSynthesis;
  if (!synth) { setTimeout(done, 400 + line.text.length * 50); return; }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(line.text);
  u.rate = .95;
  u.pitch = line.who === 'pip' ? 1.35 : 1.05;
  u.onend = done;
  u.onerror = done;
  synth.speak(u);
}

function playOne(line: Line, my: number, done: () => void) {
  if (my !== token) return;
  speaking = line.who;
  emit(line.who, line.text);
  let finished = false;
  let guard = 0;
  const finish = () => {
    if (finished || my !== token) return;
    finished = true;
    clearTimeout(guard);
    done();
  };
  // never let a silent or stuck clip freeze the game
  const arm = (ms: number) => { clearTimeout(guard); guard = window.setTimeout(finish, ms); };
  if (!enabled) { arm(350 + line.text.length * 45); return; }
  const h = clip(line);
  ensureAnalyser();
  current = h;
  arm(4000 + line.text.length * 110);
  h.once('play', () => arm(h.duration() * 1000 + 1500));
  h.once('end', finish);
  const fallback = () => { arm(2500 + line.text.length * 110); speakFallback(line, finish); };
  h.once('loaderror', fallback);
  h.once('playerror', fallback);
  h.play();
}

export const Voice = {
  /** say one or more lines in order; anything already playing stops */
  say(lines: Line | Line[], onDone?: () => void) {
    const list = Array.isArray(lines) ? lines : [lines];
    const my = ++token;
    current?.stop();
    window.speechSynthesis?.cancel();
    const run = (i: number) => {
      if (my !== token) return;
      if (i >= list.length) { speaking = null; emit(null, ''); onDone?.(); return; }
      playOne(list[i], my, () => run(i + 1));
    };
    run(0);
  },
  stop() {
    token++;
    current?.stop();
    window.speechSynthesis?.cancel();
    speaking = null;
    emit(null, '');
  },
  /** preload clips that are about to be needed */
  preload(lines: Line[]) { lines.forEach(clip); },
  subscribe(fn: Listener) { listeners.add(fn); return () => { listeners.delete(fn); }; },
  get enabled() { return enabled; },
  set enabled(v: boolean) { enabled = v; Howler.mute(!v); if (!v) Voice.stop(); },
  /** 0..1 loudness of Pip's voice right now (0 when someone else is talking) */
  pipLevel(): number {
    if (speaking !== 'pip' || !analyser) return 0;
    analyser.getByteTimeDomainData(level);
    let sum = 0;
    for (let i = 0; i < level.length; i++) { const v = (level[i] - 128) / 128; sum += v * v; }
    return Math.min(1, Math.sqrt(sum / level.length) * 5);
  },
  get speaking() { return speaking; },
};
