/* Mounts the two Pixi layers: the living world behind the game and the effects in front.
   Watches the frame rate and lowers the effect quality if the classroom PC struggles. */
import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { LEVELS } from '../content/levels';
import type { CreatureKey } from '../content/types';
import { useGame, type Quality } from '../state/store';
import { fxChannel, worldChannel } from './bus';
import { createFx } from './fx';
import { createGarden } from './garden';

const FACTOR: Record<Quality, number> = { high: 1, medium: .5, low: .2 };

async function makeApp(host: HTMLElement) {
  const app = new Application();
  await app.init({
    resizeTo: window, backgroundAlpha: 0, antialias: true, autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2), preference: 'webgl',
  });
  app.canvas.style.position = 'absolute';
  app.canvas.style.inset = '0';
  host.appendChild(app.canvas);
  return app;
}

export function WorldLayer() {
  const host = useRef<HTMLDivElement>(null);
  const done = useGame(s => s.done);
  const quality = useGame(s => s.quality);
  const ready = useRef(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const app = await makeApp(host.current!);
      if (disposed) { app.destroy(true); return; }
      const garden = await createGarden(app);
      if (disposed) { garden.destroy(); app.destroy(true); return; }
      worldChannel.attach(garden.api);
      ready.current = true;

      // frame-rate watch: step quality down if the PC can't keep up
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) useGame.getState().setQuality('low');
      let acc = 0, frames = 0, warmup = 3;
      const watch = () => {
        acc += app.ticker.deltaMS; frames++;
        if (acc < 2000) return;
        const fps = frames / (acc / 1000);
        acc = 0; frames = 0;
        if (warmup-- > 0) return;
        const q = useGame.getState().quality;
        if (fps < 28 && q !== 'low') useGame.getState().setQuality('low');
        else if (fps < 42 && q === 'high') useGame.getState().setQuality('medium');
      };
      app.ticker.add(watch);
      cleanup = () => { app.ticker.remove(watch); worldChannel.detach(); garden.destroy(); app.destroy(true, { children: true }); };
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  useEffect(() => {
    // the creature that just arrived is left out: the growth scene brings it in with an entrance
    const arrived = useGame.getState().arrived;
    const list = LEVELS.filter(l => done.includes(l.id) && l.creature && l.creature !== arrived).map(l => l.creature as CreatureKey);
    worldChannel.run(w => w.setCreatures(list));
  }, [done]);

  useEffect(() => {
    worldChannel.run(w => w.setQualityFactor(FACTOR[quality]));
    fxChannel.run(f => f.setQualityFactor(FACTOR[quality]));
  }, [quality]);

  return <div ref={host} className="layer layer-world" aria-hidden="true" />;
}

export function FxLayer() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const app = await makeApp(host.current!);
      if (disposed) { app.destroy(true); return; }
      const fx = await createFx(app);
      if (disposed) { fx.destroy(); app.destroy(true); return; }
      fxChannel.attach(fx.api);
      cleanup = () => { fxChannel.detach(); fx.destroy(); app.destroy(true, { children: true }); };
    })();
    return () => { disposed = true; cleanup(); };
  }, []);
  return <div ref={host} className="layer layer-fx" aria-hidden="true" />;
}
