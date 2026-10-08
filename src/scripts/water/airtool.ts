// Stop 2: how much water air can hold, and what happens when it is cooled.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { capacity, dewPoint } from './air';

export function initAir(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-air-tool]');
  if (!tool) return;
  const temp = q<HTMLInputElement>(tool, '[data-air-t]');
  const rh = q<HTMLInputElement>(tool, '[data-air-rh]');
  const cool = q<HTMLInputElement>(tool, '[data-air-cool]');
  const tOut = q<HTMLOutputElement>(tool, '[data-air-t-out]');
  const rhOut = q<HTMLOutputElement>(tool, '[data-air-rh-out]');
  const coolOut = q<HTMLOutputElement>(tool, '[data-air-cool-out]');
  const status = q<HTMLElement>(tool, '[data-air-status]');
  const slots = [...tool.querySelectorAll<HTMLElement>('[data-slot]')];
  let lastCloud = false;

  const g = (n: number) => n.toFixed(1);

  function update(quiet = false) {
    const t = Number(temp.value);
    const h = Number(rh.value) / 100;
    const c = Number(cool.value);
    [temp, rh, cool].forEach(fillRange);
    tOut.textContent = `${t}°`;
    rhOut.textContent = `${Math.round(h * 100)}%`;
    coolOut.textContent = `${c}°`;

    const vapour = capacity(t) * h; // grams in a cubic metre
    const now = t - c;
    const room = capacity(now);
    const held = Math.min(vapour, room);
    const drops = Math.max(vapour - room, 0);
    slots.forEach((s, i) => {
      s.className = `slot ${i < held ? 'vapour' : i < vapour ? 'drop' : i < room ? 'room' : 'none'}`;
    });

    const dew = dewPoint(vapour);
    const base = `At ${t} degrees a cubic metre of air can hold at most ${g(capacity(t))} grams of water. It holds ${g(vapour)} grams, which is ${Math.round(h * 100)} per cent.`;
    if (c === 0) status.textContent = `${base} It must cool to ${dew.toFixed(1)} degrees before cloud forms.`;
    else if (drops > 0.05) status.textContent = `${base} Cooled to ${now} degrees it can hold only ${g(room)} grams, so ${g(drops)} grams turn into droplets. That is cloud.`;
    else status.textContent = `${base} Cooled to ${now} degrees it can hold ${g(room)} grams, which is still enough. No cloud forms yet. The dew point is ${dew.toFixed(1)} degrees.`;
    const cloud = drops > 0.05;
    if (!quiet && cloud !== lastCloud) sound.play(cloud ? 'good' : 'tick', 0.7);
    lastCloud = cloud;
  }

  for (const el of [temp, rh, cool]) el.addEventListener('input', () => update());
  update(true);
}
