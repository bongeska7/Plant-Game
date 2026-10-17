/* Celebration effects drawn in front of the game: bursts, confetti rain, fireworks. */
import { createElement } from 'react';
import { Application, Container, Sprite, Texture } from 'pixi.js';
import { INK, Svg, seedD } from '../art/kit';
import type { BurstKind, FxApi } from './bus';
import { glowTexture, svgTexture } from './textures';

interface P {
  s: Sprite; vx: number; vy: number; g: number; drag: number; vr: number;
  life: number; max: number; size: number; wobble?: number; fade?: boolean; spark?: boolean;
}

const star = (fill: string) => createElement(Svg, { vb: '0 0 40 40' },
  createElement('path', { d: 'M20 2 L25 15 L38 15 L27 23 L31 37 L20 29 L9 37 L13 23 L2 15 L15 15Z', fill, stroke: INK, strokeWidth: 2.6, strokeLinejoin: 'round' }),
  createElement('circle', { cx: 16, cy: 15, r: 3, fill: '#fff', opacity: .7 }));
const petal = (fill: string) => createElement(Svg, { vb: '0 0 40 40' },
  createElement('ellipse', { cx: 20, cy: 20, rx: 10, ry: 17, fill, stroke: INK, strokeWidth: 2.4 }),
  createElement('ellipse', { cx: 16, cy: 13, rx: 3, ry: 5, fill: '#fff', opacity: .6 }));
const leaf = createElement(Svg, { vb: '0 0 40 40' },
  createElement('path', { d: 'M20 38 C4 30 4 10 20 2 C36 10 36 30 20 38Z', fill: 'url(#g-leaf)', stroke: INK, strokeWidth: 2.4 }),
  createElement('path', { d: 'M20 34 L20 8', stroke: '#2A7F35', strokeWidth: 1.8 }));
const drop = createElement(Svg, { vb: '0 0 40 40' },
  createElement('path', { d: 'M20 3 C28 14 33 21 33 27 C33 34 27 38 20 38 C13 38 7 34 7 27 C7 21 12 14 20 3Z', fill: 'url(#g-water)', stroke: INK, strokeWidth: 2.4 }),
  createElement('circle', { cx: 15, cy: 26, r: 3, fill: '#fff', opacity: .8 }));
const sparkle = createElement(Svg, { vb: '0 0 40 40' },
  createElement('path', { d: 'M20 0 Q22 18 40 20 Q22 22 20 40 Q18 22 0 20 Q18 18 20 0Z', fill: '#FFFDF0' }));
const seed = createElement(Svg, { vb: '-20 -20 40 40' },
  createElement('path', { d: seedD(32), fill: 'url(#g-seed)', stroke: INK, strokeWidth: 2.4 }));
const confettiRect = (fill: string) => createElement(Svg, { vb: '0 0 20 30' },
  createElement('rect', { x: 2, y: 2, width: 16, height: 26, rx: 4, fill, stroke: INK, strokeWidth: 2 }));

const COLORS = ['#FFD93B', '#FF5E8A', '#4FB4FF', '#7B5CFF', '#5ED35A', '#FF9F1C'];
const FIREWORK_TINTS = [0xFFE066, 0xFF7AA8, 0x7FD0FF, 0xB79CFF, 0x8FF07A, 0xFFB45A];

export async function createFx(app: Application): Promise<{ api: FxApi; destroy: () => void }> {
  const layer = new Container();
  app.stage.addChild(layer);

  const tex = async (node: ReturnType<typeof createElement>, w: number, h: number) => svgTexture(node, w, h, 2);
  const [stars, petals, leaves, drops, sparkles, seeds, rects] = await Promise.all([
    Promise.all(['#FFD93B', '#FFB020', '#FFF27A'].map(c => tex(star(c), 40, 40))),
    Promise.all(['url(#g-petal)', 'url(#g-petalSun)', 'url(#g-petalPurple)', 'url(#g-petalWhite)'].map(c => tex(petal(c), 40, 40))),
    Promise.all([tex(leaf, 40, 40)]),
    Promise.all([tex(drop, 40, 40)]),
    Promise.all([tex(sparkle, 40, 40)]),
    Promise.all([tex(seed, 40, 40)]),
    Promise.all(COLORS.map(c => tex(confettiRect(c), 20, 30))),
  ]);
  const glow = glowTexture(64);
  const sets: Record<Exclude<BurstKind, 'mix'>, Texture[]> = { stars, petals, leaves, water: drops, sparkle: sparkles };
  const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

  let parts: P[] = [];
  let quality = 1;
  let fireworksUntil = 0, nextRocket = 0;
  const rockets: { s: Sprite; vx: number; vy: number; tint: number }[] = [];

  function add(texture: Texture, x: number, y: number, o: Partial<P> & { size: number }) {
    const s = new Sprite(texture);
    s.anchor.set(.5);
    s.position.set(x, y);
    s.rotation = Math.random() * Math.PI * 2;
    layer.addChild(s);
    const p: P = { s, vx: 0, vy: 0, g: 900, drag: .985, vr: (Math.random() - .5) * 8, life: 0, max: 1.4, ...o };
    // keep particles in proportion to the screen (designed for a 1920px-wide board)
    const k = Math.min(1.3, Math.max(.5, app.screen.width / 1920));
    p.size *= k; p.vx *= k; p.vy *= k; p.g *= k;
    s.scale.set(p.size / texture.width * 2);
    parts.push(p);
    return p;
  }

  function burst(x: number, y: number, kind: BurstKind = 'mix', n = 24) {
    const count = Math.max(6, Math.round(n * quality));
    for (let i = 0; i < count; i++) {
      const k = kind === 'mix' ? pick(['stars', 'petals', 'leaves', 'sparkle', 'stars'] as const) : kind;
      const a = Math.random() * Math.PI * 2, sp = 260 + Math.random() * 520;
      add(pick(sets[k]), x, y, {
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 260, size: k === 'sparkle' ? 22 + Math.random() * 18 : 26 + Math.random() * 20,
        g: k === 'sparkle' ? 200 : 900, drag: .97, max: .9 + Math.random() * .7, fade: true,
      });
    }
    const g = add(glow, x, y, { size: 260, g: 0, vr: 0, max: .45, fade: true });
    g.s.blendMode = 'add';
  }

  function confetti(n = 120) {
    const count = Math.round(n * quality);
    const w = app.screen.width;
    for (let i = 0; i < count; i++) {
      const isRect = Math.random() < .55;
      const texture = isRect ? pick(rects) : pick([...stars, ...petals, ...seeds]);
      add(texture, Math.random() * w, -40 - Math.random() * 300, {
        vx: (Math.random() - .5) * 120, vy: 80 + Math.random() * 160, size: isRect ? 18 + Math.random() * 10 : 24 + Math.random() * 14,
        g: 160, drag: .995, max: 5, wobble: Math.random() * 6, vr: (Math.random() - .5) * 6,
      });
    }
  }

  function explode(x: number, y: number, tint: number) {
    const count = Math.round(48 * quality) + 12;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2, sp = 220 + Math.random() * 220;
      const p = add(glow, x, y, { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 30 + Math.random() * 16, g: 140, drag: .965, max: 1.2 + Math.random() * .5, fade: true, spark: true, vr: 0 });
      p.s.tint = tint;
      p.s.blendMode = 'add';
    }
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2, sp = 100 + Math.random() * 160;
      add(pick(stars), x, y, { vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, size: 24, g: 300, drag: .97, max: 1.3, fade: true });
    }
    const flash = add(glow, x, y, { size: 420, g: 0, vr: 0, max: .35, fade: true });
    flash.s.tint = tint;
    flash.s.blendMode = 'add';
  }

  let time = 0;
  const tick = () => {
    const dt = Math.min(app.ticker.deltaMS / 1000, .05);
    time += dt;
    if (time < fireworksUntil && time > nextRocket) {
      nextRocket = time + .35 + Math.random() * .5;
      const s = new Sprite(glow); s.anchor.set(.5); s.scale.set(.5); s.blendMode = 'add';
      const tint = pick(FIREWORK_TINTS);
      s.tint = tint;
      s.position.set(app.screen.width * (.15 + Math.random() * .7), app.screen.height + 20);
      layer.addChild(s);
      rockets.push({ s, vx: (Math.random() - .5) * 120, vy: -(app.screen.height * (1.05 + Math.random() * .35)), tint });
    }
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.vy += 700 * dt;
      r.s.x += r.vx * dt;
      r.s.y += r.vy * dt;
      if (Math.random() < .8) {
        const t = add(glow, r.s.x, r.s.y, { size: 16, g: 60, vr: 0, max: .5, fade: true });
        t.s.tint = r.tint; t.s.blendMode = 'add';
      }
      if (r.vy > -40) { explode(r.s.x, r.s.y, r.tint); r.s.destroy(); rockets.splice(i, 1); }
    }
    const h = app.screen.height;
    parts = parts.filter(p => {
      p.life += dt;
      p.vy += p.g * dt;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.s.x += (p.vx + (p.wobble ? Math.sin(time * 3 + p.wobble) * 60 : 0)) * dt;
      p.s.y += p.vy * dt;
      p.s.rotation += p.vr * dt;
      const left = 1 - p.life / p.max;
      if (p.fade) p.s.alpha = Math.max(0, Math.min(1, left * 1.6));
      if (p.wobble !== undefined) p.s.scale.x = Math.abs(Math.cos(time * 4 + p.wobble)) * (p.size / p.s.texture.width * 2);
      if (p.life >= p.max || p.s.y > h + 80) { p.s.destroy(); return false; }
      return true;
    });
  };
  app.ticker.add(tick);

  return {
    api: {
      burst,
      confetti,
      fireworks(ms = 4000) { fireworksUntil = time + ms / 1000; nextRocket = time; },
      setQualityFactor(f) { quality = Math.max(.35, f); },
    },
    destroy: () => app.ticker.remove(tick),
  };
}
