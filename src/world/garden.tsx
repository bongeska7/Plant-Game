/* The living garden behind the game: sky, sun, clouds, hills, trees, wind-blown grass,
   swaying flowers, floating pollen, and the creatures that arrive as Pip grows. */
import { createElement } from 'react';
import { Application, Container, FillGradient, Graphics, Sprite, Texture } from 'pixi.js';
import { CREATURES } from '../art/creatures';
import { Blob, INK, S, Svg } from '../art/kit';
import { ART } from '../art/pictures';
import type { CreatureKey } from '../content/types';
import type { WorldApi } from './bus';
import { glowTexture, svgTexture } from './textures';

const W = 1920, H = 1080;
const far = (x: number) => 640 - 60 * Math.sin(x / 260 + 1) - 30 * Math.sin(x / 120);
const mid = (x: number) => 790 - 40 * Math.sin(x / 340 + 2.2) - 15 * Math.sin(x / 150 + 1);
const front = (x: number) => 935 - 22 * Math.sin(x / 420 + .5) - 10 * Math.sin(x / 170 + 2);

const hex = (c: string) => parseInt(c.slice(1), 16);

function hill(fn: (x: number) => number, top: string, bottom: string, stroke = true, strokeAlpha = 1) {
  const g = new Graphics();
  const pts: number[] = [];
  for (let x = -40; x <= W + 40; x += 16) pts.push(x, fn(x));
  const grad = new FillGradient({
    type: 'linear', start: { x: 0, y: 0 }, end: { x: 0, y: 1 }, textureSpace: 'local',
    colorStops: [{ offset: 0, color: top }, { offset: 1, color: bottom }],
  });
  g.poly([...pts, W + 40, H + 60, -40, H + 60]).fill(grad);
  if (stroke) {
    g.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    g.stroke({ width: 5, color: hex(INK), alpha: strokeAlpha, join: 'round' });
  }
  return g;
}

function bladeTexture(app: Application, h: number, w: number, dark: number, light: number): Texture {
  const g = new Graphics();
  g.moveTo(-w / 2, 0).quadraticCurveTo(-w * .2, -h * .55, w * .15, -h).quadraticCurveTo(w * .05, -h * .5, w / 2, 0).closePath().fill(dark);
  g.moveTo(-w * .12, -h * .1).quadraticCurveTo(-w * .02, -h * .55, w * .15, -h).quadraticCurveTo(w * .02, -h * .6, w * .12, -h * .1).closePath().fill({ color: light, alpha: .9 });
  return app.renderer.generateTexture({ target: g, resolution: 2 });
}

interface Blade { s: Sprite; base: number; phase: number; amp: number }
interface Swayer { s: Sprite; phase: number; amp: number; speed: number; skew?: boolean }

type Behavior = (t: number, c: Creature) => { x: number; y: number; flip?: number; flap?: number; rot?: number; sy?: number };
interface Creature {
  key: CreatureKey; s: Sprite; size: number; behavior: Behavior;
  x: number; y: number; rate: number; seed: number; dir: number;
}

export async function createGarden(app: Application): Promise<{ api: WorldApi; destroy: () => void }> {
  const stage = app.stage;
  const sky = new Graphics();
  const root = new Container();
  stage.addChild(sky, root);

  /* ----- textures from the game's own art ----- */
  const el = (key: keyof typeof ART) => createElement(ART[key]);
  const sunDisc = createElement(Svg, { vb: '0 0 200 200' },
    createElement('circle', { cx: 100, cy: 100, r: 60, fill: 'url(#g-sun)', ...S }),
    createElement('ellipse', { cx: 82, cy: 94, rx: 6, ry: 8, fill: INK }), createElement('ellipse', { cx: 118, cy: 94, rx: 6, ry: 8, fill: INK }),
    createElement('circle', { cx: 84, cy: 91, r: 2.2, fill: '#fff' }), createElement('circle', { cx: 120, cy: 91, r: 2.2, fill: '#fff' }),
    createElement('path', { d: 'M86 112 Q100 124 114 112', fill: 'none', stroke: INK, strokeWidth: 5, strokeLinecap: 'round' }),
    createElement('ellipse', { cx: 70, cy: 110, rx: 9, ry: 6, fill: 'url(#g-cheek)' }), createElement('ellipse', { cx: 130, cy: 110, rx: 9, ry: 6, fill: 'url(#g-cheek)' }),
    createElement('path', { d: 'M62 82 C66 66 78 54 94 48', fill: 'none', stroke: '#fff', strokeWidth: 7, strokeLinecap: 'round', opacity: .6 }));
  const sunRays = createElement(Svg, { vb: '0 0 200 200' },
    ...Array.from({ length: 14 }, (_, i) => createElement('path', { key: i, d: 'M100 4 L111 30 L89 30Z', transform: `rotate(${i * (360 / 14)} 100 100)`, fill: 'url(#g-ray)', ...S, strokeWidth: 4 })));
  const bush = createElement(Svg, { vb: '0 0 200 120' }, createElement(Blob, { circles: [[50, 80, 36], [100, 60, 46], [152, 80, 36], [100, 90, 30]], fill: 'url(#g-tree)' }));

  const [tTree, tPine, tCloud, tSun, tRays, tBush, ...tFlowers] = await Promise.all([
    svgTexture(el('tree'), 200, 200, 2.4), svgTexture(el('pineTree'), 200, 200, 2),
    svgTexture(el('cloud'), 200, 200, 2), svgTexture(sunDisc, 200, 200, 2), svgTexture(sunRays, 200, 200, 2),
    svgTexture(bush, 200, 120, 1.6),
    svgTexture(el('tulip'), 200, 200, 1), svgTexture(el('daisy'), 200, 200, 1),
    svgTexture(el('sunflower'), 200, 200, 1), svgTexture(el('flower'), 200, 200, 1),
  ]);
  const creatureTex = Object.fromEntries(await Promise.all(
    (Object.keys(CREATURES) as CreatureKey[]).map(async k => [k, await svgTexture(createElement(CREATURES[k]), 200, 200, 1.2)] as const),
  )) as Record<CreatureKey, Texture>;
  const tGlow = glowTexture(64);

  /* ----- sun and clouds ----- */
  const rays = new Sprite(tRays); rays.anchor.set(.5); rays.position.set(1660, 170); rays.scale.set(1.25); rays.alpha = .95;
  const sun = new Sprite(tSun); sun.anchor.set(.5); sun.position.set(1660, 170); sun.scale.set(.85);
  root.addChild(rays, sun);
  const clouds: { s: Sprite; speed: number }[] = [];
  [[220, 150, .9, 9], [760, 90, .7, 6], [1180, 230, .55, 4], [1460, 330, .45, 3.5], [460, 340, .5, 5]].forEach(([x, y, sc, sp]) => {
    const s = new Sprite(tCloud); s.anchor.set(.5); s.position.set(x, y); s.scale.set(sc * 1.1, sc);
    root.addChild(s); clouds.push({ s, speed: sp });
  });

  /* ----- hills, trees, bushes ----- */
  root.addChild(hill(far, '#B8EFA4', '#86D47E', true, .35));
  const swayers: Swayer[] = [];
  [[380, .42], [560, .36], [1080, .4], [1250, .34], [1420, .38]].forEach(([x, sc], i) => {
    const s = new Sprite(i % 2 ? tPine : tTree); s.anchor.set(.5, .95); s.position.set(x, far(x) + 8); s.scale.set(sc * (i % 2 ? 1.2 : 1));
    s.tint = 0xE6F4FF; root.addChild(s); swayers.push({ s, phase: i, amp: .02, speed: .8, skew: true });
  });
  root.addChild(hill(mid, '#86E46E', '#47B54B'));
  [[700, .55], [1180, .5], [1560, .6]].forEach(([x, sc]) => {
    const s = new Sprite(tBush); s.anchor.set(.5, .85); s.position.set(x, mid(x) + 4); s.scale.set(sc); root.addChild(s);
  });
  const bigTree = new Sprite(tTree); bigTree.anchor.set(.5, .95); bigTree.position.set(170, mid(170) + 24); bigTree.scale.set(.95);
  const bigPine = new Sprite(tPine); bigPine.anchor.set(.5, .95); bigPine.position.set(1790, mid(1790) + 20); bigPine.scale.set(1.25);
  root.addChild(bigTree, bigPine);
  swayers.push({ s: bigTree, phase: 0, amp: .025, speed: .7, skew: true }, { s: bigPine, phase: 2, amp: .02, speed: .6, skew: true });

  root.addChild(hill(front, '#7EE36A', '#2E9A3E'));

  /* ----- flowers on the front ground ----- */
  const flowerLayer = new Container();
  root.addChild(flowerLayer);
  for (let i = 0, x = 60; x < W; i++, x += 120 + ((i * 53) % 70)) {
    if (x > 760 && x < 1160) continue; // keep the middle calm behind Pip
    const s = new Sprite(tFlowers[i % tFlowers.length]); s.anchor.set(.5, .94);
    const y = front(x) + 18 + ((i * 29) % 40);
    s.position.set(x, y); s.scale.set(.5 + ((i * 17) % 10) / 40);
    flowerLayer.addChild(s);
    swayers.push({ s, phase: i * .9, amp: .07, speed: 1.4 });
  }

  /* ----- creatures ----- */
  const creatureLayer = new Container();
  root.addChild(creatureLayer);

  /* ----- grass ----- */
  const grassBack = new Container(), grassFront = new Container();
  root.addChild(grassBack);
  const bladeTex = [
    bladeTexture(app, 46, 12, 0x2E9A3E, 0x8FE070), bladeTexture(app, 60, 14, 0x3FB34A, 0xA8F08F),
    bladeTexture(app, 38, 10, 0x34A043, 0x9BEB80), bladeTexture(app, 70, 16, 0x2A8C3A, 0x86DD6C),
  ];
  const blades: Blade[] = [];
  for (let x = -20; x < W + 20; x += 9) {
    const s = new Sprite(bladeTex[(x / 9 | 0) % 4]); s.anchor.set(.5, 1);
    s.position.set(x + Math.sin(x) * 4, front(x) + 10 + Math.abs(Math.sin(x * 1.7)) * 16);
    s.scale.set(.8 + Math.abs(Math.sin(x * 3.1)) * .6);
    grassBack.addChild(s);
    blades.push({ s, base: Math.sin(x * 2.3) * .15, phase: x * .012, amp: .14 });
  }
  root.addChild(grassFront);
  for (let x = -40; x < W + 40; x += 22) {
    if (x > 520 && x < 1400 && (x / 22 | 0) % 2) continue;
    const s = new Sprite(bladeTex[(x / 22 | 0) % 4]); s.anchor.set(.5, 1);
    s.position.set(x, H + 8);
    s.scale.set(2 + Math.abs(Math.sin(x * 1.3)) * 1.4);
    s.tint = 0x9AC79A;
    grassFront.addChild(s);
    blades.push({ s, base: Math.sin(x * 1.1) * .1, phase: x * .01, amp: .1 });
  }

  /* ----- pollen ----- */
  const pollenLayer = new Container();
  root.addChild(pollenLayer);
  const pollen = Array.from({ length: 70 }, (_, i) => {
    const s = new Sprite(tGlow); s.anchor.set(.5); s.blendMode = 'add';
    s.position.set(Math.random() * W, 400 + Math.random() * 640);
    s.scale.set(.15 + Math.random() * .25);
    pollenLayer.addChild(s);
    return { s, vy: 8 + Math.random() * 16, phase: Math.random() * 6, i };
  });

  /* ----- creature behaviors ----- */
  const behaviors: Record<CreatureKey, Behavior> = {
    worm: (t, c) => ({ x: 1520 + c.seed * 40, y: front(1520) + 30 - Math.abs(Math.sin(t * 1.3 + c.seed)) * 22, sy: .9 + Math.abs(Math.sin(t * 1.3)) * .15 }),
    ladybug: (t, c) => {
      const span = 1300, p = ((t * 45 + c.seed * 500) % (span * 2));
      const x = 280 + (p < span ? p : span * 2 - p);
      return { x, y: front(x) + 6, flip: p < span ? 1 : -1, rot: Math.sin(t * 10) * .04 };
    },
    snail: (t, c) => {
      const span = 420, p = ((t * 10 + c.seed * 200) % (span * 2));
      const x = 1180 + (p < span ? p : span * 2 - p);
      return { x, y: front(x) + 10, flip: p < span ? -1 : 1, sy: 1 + Math.sin(t * 2) * .03 };
    },
    butterfly: (t, c) => ({
      x: 300 + c.seed * 520 + Math.sin(t * .35 + c.seed * 2) * 260 + Math.sin(t * .9 + c.seed) * 60,
      y: 520 + Math.sin(t * .5 + c.seed * 3) * 120 + Math.sin(t * 1.7) * 20,
      flap: .3 + .7 * Math.abs(Math.cos(t * 13 + c.seed)), rot: Math.sin(t * .7 + c.seed) * .2,
    }),
    bee: (t, c) => {
      const cx = c.seed ? 1500 : 420, a = t * 1.8 + c.seed * 3;
      return { x: cx + Math.sin(a) * 110, y: front(cx) - 60 + Math.sin(a * 2) * 34, flip: Math.cos(a) > 0 ? 1 : -1, rot: Math.sin(t * 25) * .05 };
    },
    bird: t => {
      const cycle = t % 24;
      if (cycle < 18) return { x: 230, y: mid(170) - 330 - Math.abs(Math.sin(t * 2.2)) * (cycle % 6 < 1 ? 14 : 0), flip: 1, flap: 1 };
      const p = (cycle - 18) / 6;
      return { x: 230 + Math.sin(p * Math.PI) * 1400, y: mid(170) - 330 - Math.sin(p * Math.PI) * 220, flip: p < .5 ? 1 : -1, flap: .5 + .5 * Math.abs(Math.sin(t * 12)) };
    },
  };
  const sizes: Record<CreatureKey, number> = { worm: .42, ladybug: .34, snail: .4, butterfly: .36, bee: .3, bird: .5 };
  const counts: Record<CreatureKey, number> = { worm: 1, ladybug: 1, snail: 1, butterfly: 3, bee: 2, bird: 1 };
  const entries: Record<CreatureKey, [number, number]> = {
    worm: [1520, front(1520) + 90], ladybug: [-120, front(0)], snail: [W + 120, front(W)],
    butterfly: [W + 150, 260], bee: [W + 150, 700], bird: [-200, 160],
  };
  let creatures: Creature[] = [];
  let time = 0;

  function spawn(key: CreatureKey, arriving: boolean) {
    for (let i = 0; i < counts[key]; i++) {
      const s = new Sprite(creatureTex[key]); s.anchor.set(.5, .85);
      creatureLayer.addChild(s);
      const c: Creature = { key, s, size: sizes[key], behavior: behaviors[key], x: 0, y: 0, rate: arriving ? 1.1 : 100, seed: i, dir: 1 };
      const target = c.behavior(time, c);
      if (arriving) { [c.x, c.y] = entries[key]; c.x += i * 80; } else { c.x = target.x; c.y = target.y; }
      creatures.push(c);
    }
  }

  /* ----- quality ----- */
  let quality = 1;
  function applyQuality() {
    blades.forEach((b, i) => { b.s.visible = quality >= 1 || i % Math.round(1 / Math.max(quality, .2)) === 0; });
    pollen.forEach(p => { p.s.visible = p.i < 70 * quality; });
  }

  /* ----- layout: cover the screen, keep the ground at the bottom ----- */
  function layout() {
    const sw = app.screen.width, sh = app.screen.height;
    const s = Math.max(sw / W, sh / H);
    root.scale.set(s);
    root.position.set((sw - W * s) / 2, sh - H * s);
    sky.clear();
    const grad = new FillGradient({
      type: 'linear', start: { x: 0, y: 0 }, end: { x: 0, y: 1 }, textureSpace: 'local',
      colorStops: [{ offset: 0, color: '#1494E6' }, { offset: .45, color: '#5CC6FA' }, { offset: 1, color: '#CBEFFF' }],
    });
    sky.rect(0, 0, sw, sh).fill(grad);
  }
  layout();
  app.renderer.on('resize', layout);

  /* ----- animate ----- */
  const tick = () => {
    const dt = Math.min(app.ticker.deltaMS / 1000, .05);
    time += dt;
    const gust = .6 + .4 * Math.sin(time * .35) * Math.sin(time * .13 + 1);
    rays.rotation += dt * .06;
    sun.scale.set(.85 + Math.sin(time * 1.5) * .015);
    clouds.forEach(c => { c.s.x += c.speed * dt; if (c.s.x > W + 260) c.s.x = -260; });
    for (const b of blades) {
      if (!b.s.visible) continue;
      b.s.rotation = b.base + Math.sin(time * 1.7 + b.phase) * b.amp * gust + gust * .06;
    }
    for (const w of swayers) {
      const v = Math.sin(time * w.speed + w.phase) * w.amp * (quality < .5 && w.skew ? 0 : 1);
      if (w.skew) w.s.skew.x = v; else w.s.rotation = v * gust;
    }
    for (const p of pollen) {
      if (!p.s.visible) continue;
      p.s.y -= p.vy * dt;
      p.s.x += Math.sin(time + p.phase) * 12 * dt;
      p.s.alpha = .35 + .45 * Math.sin(time * 2 + p.phase);
      if (p.s.y < 380) { p.s.y = 1060; p.s.x = Math.random() * W; }
    }
    for (const c of creatures) {
      const t = c.behavior(time, c);
      const k = Math.min(1, dt * c.rate);
      c.x += (t.x - c.x) * k; c.y += (t.y - c.y) * k;
      if (c.rate < 100) c.rate = Math.min(100, c.rate + dt * .6);
      c.s.position.set(c.x, c.y);
      const flip = t.flip ?? 1;
      c.s.scale.set(c.size * flip * (t.flap ?? 1), c.size * (t.sy ?? 1));
      c.s.rotation = t.rot ?? 0;
    }
  };
  app.ticker.add(tick);

  const api: WorldApi = {
    setCreatures(list) {
      creatures.forEach(c => c.s.destroy());
      creatures = [];
      list.forEach(k => spawn(k, false));
    },
    arrive(key) {
      creatures.filter(c => c.key === key).forEach(c => c.s.destroy());
      creatures = creatures.filter(c => c.key !== key);
      spawn(key, true);
    },
    setQualityFactor(f) { quality = f; applyQuality(); },
  };

  return {
    api,
    destroy: () => { app.ticker.remove(tick); app.renderer.off('resize', layout); },
  };
}
