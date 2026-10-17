/* Sound effects, synthesized on the fly — no files to load. Shares Howler's audio context. */
import { Howler } from 'howler';

let on = true;

function ctx(): AudioContext | null {
  // Howler builds its context lazily; touching the volume makes it exist
  if (!Howler.ctx) Howler.volume(Howler.volume());
  const c = Howler.ctx as AudioContext | undefined;
  if (!c) return null;
  if (c.state === 'suspended') void c.resume();
  return c;
}

function out(c: AudioContext): AudioNode {
  return (Howler.masterGain as GainNode | undefined) ?? c.destination;
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = 'sine', vol = .16, slideTo?: number) {
  const c = ctx(); if (!c || !on) return;
  const t = c.currentTime + at;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + .012);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(out(c));
  o.start(t);
  o.stop(t + dur + .05);
}

function noise(dur: number, from: number, to: number, vol = .22, q = 1.2) {
  const c = ctx(); if (!c || !on) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
  src.buffer = buf;
  f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * .25);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  src.connect(f).connect(g).connect(out(c));
  src.start(t);
}

export const SFX = {
  get enabled() { return on; },
  set enabled(v: boolean) { on = v; },
  unlock() { ctx(); },
  tap: () => tone(700, 0, .08, 'sine', .12, 1100),
  pick: () => { tone(520, 0, .1, 'triangle', .12, 880); },
  drop: () => { tone(300, 0, .12, 'sine', .14, 180); },
  step: () => { tone(784, 0, .14, 'triangle', .15); tone(1175, .08, .22, 'triangle', .12); },
  correct: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .08, .35, 'triangle', .15));
    tone(2093, .32, .4, 'sine', .05);
  },
  wrong: () => { tone(330, 0, .12, 'square', .05, 300); tone(262, .13, .28, 'sine', .14, 220); },
  boing: () => tone(180, 0, .35, 'sine', .16, 520),
  whoosh: () => noise(.9, 300, 2600, .2),
  pour: () => noise(1.6, 900, 500, .14, .7),
  sparkle: () => [1568, 1976, 2349, 2637, 3136].forEach((f, i) => tone(f, i * .06, .25, 'sine', .05)),
  grow: () => { tone(220, 0, 1.2, 'triangle', .1, 880); tone(330, .1, 1.2, 'sine', .06, 1320); },
  fanfare: () => {
    [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * .13, .3, 'triangle', .15));
    tone(1047, .8, .9, 'triangle', .14); tone(1319, .8, .9, 'sine', .07); tone(1568, .8, .9, 'sine', .05);
  },
};
