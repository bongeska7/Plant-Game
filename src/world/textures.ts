/* Turns React SVG art into Pixi textures, so the world uses the same drawings as the game. */
import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Texture } from 'pixi.js';
import { DefsContent } from '../art/kit';

export async function svgTexture(node: ReactElement, vbW: number, vbH: number, scale = 1, vbX = 0, vbY = 0): Promise<Texture> {
  const w = Math.max(1, Math.ceil(vbW * scale)), h = Math.max(1, Math.ceil(vbH * scale));
  const svg = renderToStaticMarkup(
    createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: `${vbX} ${vbY} ${vbW} ${vbH}`, width: w, height: h },
      createElement(DefsContent), node),
  );
  const img = new Image();
  img.decoding = 'async';
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
  return Texture.from(canvas);
}

/** soft glowing dot (pollen, firework sparks) */
export function glowTexture(size = 64, color = '255,250,210'): Texture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${color},1)`);
  grad.addColorStop(.35, `rgba(${color},.65)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return Texture.from(c);
}
