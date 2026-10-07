// Instrument 1: the Earth goes round the Sun, the axis points the same way, and the distance hardly changes.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { dateName, season, sunDistance } from './sun';

export function initOrbit(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-orbit-tool]');
  if (!tool) return;
  const cx = Number(tool.dataset.cx);
  const cy = Number(tool.dataset.cy);
  const r = Number(tool.dataset.r);
  const range = q<HTMLInputElement>(tool, '[data-orbit-range]');
  const out = q<HTMLOutputElement>(tool, '[data-orbit-out]');
  const dateEl = q<HTMLElement>(tool, '[data-orbit-date]');
  const distEl = q<HTMLElement>(tool, '[data-orbit-dist]');
  const status = q<HTMLElement>(tool, '[data-orbit-status]');
  const earth = q<SVGGElement>(tool, '[data-orbit-earth]');
  const lit = q<SVGPathElement>(tool, '[data-orbit-lit]');
  let last = '';

  function set(day: number, quiet = false) {
    range.value = String(day);
    fillRange(range);
    // The December solstice (day 355) is at the right, and the Earth goes anticlockwise
    const a = (2 * Math.PI * (day - 355)) / 365.25;
    const x = cx + r * Math.cos(a);
    const y = cy - r * Math.sin(a);
    earth.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    // The lit half of the Earth faces the Sun
    const toSun = (Math.atan2(cy - y, cx - x) * 180) / Math.PI;
    lit.setAttribute('transform', `rotate(${toSun.toFixed(1)})`);

    const name = dateName(day);
    const km = sunDistance(day);
    out.textContent = name;
    dateEl.textContent = name;
    distEl.textContent = `${km.toFixed(1)} million km from the Sun`;

    const north = season(day, true);
    const south = season(day, false);
    const near = km < 148.4 ? ', near its closest' : km > 150.8 ? ', near its farthest' : '';
    const lean = day >= 79 && day < 265 ? 'The north leans towards the Sun' : 'The north leans away from the Sun';
    status.textContent = `${name}. The Earth is ${km.toFixed(1)} million km from the Sun${near}. ${lean}: ${north} in the north, ${south} in the south.`;
    if (!quiet && north !== last) sound.play('tick');
    last = north;
  }

  range.addEventListener('input', () => set(Number(range.value)));
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-orbit-jump]')) {
    b.addEventListener('click', () => {
      set(Number(b.dataset.orbitJump));
      sound.play('pop');
    });
  }
  set(172, true);
}
