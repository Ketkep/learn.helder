// Stop 3: air over a mountain. Dry air cools about 9.8 degrees a kilometre, cloudy air about 6.5.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { overMountain } from './air';

const NS = 'http://www.w3.org/2000/svg';
const PER_KM = 70; // pixels for one kilometre of height

function el(name: string, attrs: Record<string, string | number>) {
  const node = document.createElementNS(NS, name);
  for (const k of Object.keys(attrs)) node.setAttribute(k, String(attrs[k]));
  return node;
}

export function initMountain(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-mountain-tool]');
  if (!tool) return;
  const ground = Number(tool.dataset.ground);
  const x0 = Number(tool.dataset.x0);
  const xt = Number(tool.dataset.xt);
  const x1 = Number(tool.dataset.x1);
  const height = q<HTMLInputElement>(tool, '[data-mountain-h]');
  const temp = q<HTMLInputElement>(tool, '[data-mountain-t]');
  const rh = q<HTMLInputElement>(tool, '[data-mountain-rh]');
  const hOut = q<HTMLOutputElement>(tool, '[data-mountain-h-out]');
  const tOut = q<HTMLOutputElement>(tool, '[data-mountain-t-out]');
  const rhOut = q<HTMLOutputElement>(tool, '[data-mountain-rh-out]');
  const status = q<HTMLElement>(tool, '[data-mountain-status]');
  const hill = q<SVGPathElement>(tool, '[data-mountain-hill]');
  const cloud = q<SVGGElement>(tool, '[data-mountain-cloud]');
  const rain = q<SVGGElement>(tool, '[data-mountain-rain]');
  let last = '';

  const clear = (g: Element) => {
    while (g.firstChild) g.removeChild(g.firstChild);
  };

  function update(quiet = false) {
    const h = Number(height.value) / 10;
    const t = Number(temp.value);
    const humidity = Number(rh.value) / 100;
    [height, temp, rh].forEach(fillRange);
    hOut.textContent = `${h.toFixed(1)} km`;
    tOut.textContent = `${t}°`;
    rhOut.textContent = `${Math.round(humidity * 100)}%`;

    const top = ground - h * PER_KM;
    hill.setAttribute('d', `M0 ${ground}L${x0} ${ground}L${xt} ${top}L${x1} ${ground}L800 ${ground}V390H0Z`);
    const r = overMountain(t, humidity, h);

    clear(cloud);
    clear(rain);
    if (r.cloudy && h > 0.05) {
      // Cloud sits along the windward slope from the cloud base up and over the top
      const baseY = ground - r.base * PER_KM;
      const slopeX = (y: number) => x0 + ((ground - y) / (ground - top)) * (xt - x0);
      const puffs = 5;
      for (let i = 0; i < puffs; i++) {
        const y = baseY - ((baseY - top) * i) / (puffs - 1) - 18;
        const x = slopeX(y + 18) - 10 - (puffs - i) * 4;
        cloud.appendChild(el('ellipse', { class: 'cloud', cx: x.toFixed(1), cy: y.toFixed(1), rx: 52 - i * 2, ry: 22 }));
      }
      cloud.appendChild(el('ellipse', { class: 'cloud', cx: xt - 10, cy: top - 30, rx: 70, ry: 26 }));
      // Rain falls from the lower cloud to the slope, more of it for more water
      const drops = Math.min(Math.round(r.rain * 2.2), 16);
      for (let i = 0; i < drops; i++) {
        const y1 = baseY - 6 - (i % 4) * 4;
        const x = x0 + 20 + ((xt - x0 - 80) * (i + 0.5)) / Math.max(drops, 1);
        const ySlope = ground - ((x - x0) / (xt - x0)) * (ground - top);
        if (ySlope - 12 > y1) rain.appendChild(el('line', { class: 'drop', x1: x.toFixed(1), y1: y1.toFixed(1), x2: (x - 6).toFixed(1), y2: (ySlope - 10).toFixed(1) }));
      }
    }

    const grams = (n: number) => n.toFixed(1);
    const wet = r.topT < 0 ? 'rain and snow' : 'rain';
    const start = `The air starts at ${t} degrees with ${Math.round(humidity * 100)} per cent humidity.`;
    if (h < 0.05) status.textContent = `${start} With no mountain the air does not rise, so nothing changes.`;
    else if (!r.cloudy) status.textContent = `${start} This mountain is lower than the height where cloud forms (${r.base.toFixed(1)} km), so the air stays clear. At the top it is ${r.topT.toFixed(1)} degrees. Raise the mountain.`;
    else
      status.textContent = `${start} Cloud forms at ${r.base.toFixed(1)} km. At the top it is ${r.topT.toFixed(1)} degrees, and about ${grams(r.rain)} grams of water in every cubic metre have fallen as ${wet}. On the far side the air is ${r.farT.toFixed(1)} degrees and only ${Math.round(r.farRh * 100)} per cent humid.`;
    const state = !r.cloudy ? 'clear' : r.rain > 4 ? 'heavy' : 'rain';
    if (!quiet && state !== last) sound.play(state === 'clear' ? 'tick' : 'whoosh', 0.4);
    last = state;
  }

  for (const input of [height, temp, rh]) input.addEventListener('input', () => update());
  update(true);
}
