// Instrument 3: daylight on a 24 hour clock. Noon is at the top, in sun time.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { dateName, dayLength, declination, hm } from './sun';
import { latName } from './tilt';

const clock = (hours: number) => {
  const total = Math.round(hours * 60) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export function initDay(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-day-tool]');
  if (!tool) return;
  const cx = Number(tool.dataset.cx);
  const cy = Number(tool.dataset.cy);
  const r = Number(tool.dataset.r);
  const date = q<HTMLInputElement>(tool, '[data-day-range]');
  const lat = q<HTMLInputElement>(tool, '[data-day-lat]');
  const out = q<HTMLOutputElement>(tool, '[data-day-out]');
  const latOut = q<HTMLOutputElement>(tool, '[data-day-lat-out]');
  const placeEl = q<HTMLElement>(tool, '[data-day-place]');
  const dateEl = q<HTMLElement>(tool, '[data-day-date]');
  const status = q<HTMLElement>(tool, '[data-day-status]');
  const arc = q<SVGPathElement>(tool, '[data-day-arc]');
  const rise = q<SVGLineElement>(tool, '[data-day-rise]');
  const set = q<SVGLineElement>(tool, '[data-day-set]');
  const sun = q<SVGCircleElement>(tool, '[data-day-sun]');
  const center = q<SVGTextElement>(tool, '[data-day-center]');
  let last = '';

  // Hours (0 is midnight, at the bottom) to a point on the dial, clockwise
  const at = (h: number, rad: number) => {
    const a = (h / 24) * 2 * Math.PI;
    return { x: cx - rad * Math.sin(a), y: cy + rad * Math.cos(a) };
  };

  function update(quiet = false) {
    const day = Number(date.value);
    const la = Number(lat.value);
    fillRange(date);
    fillRange(lat);
    const name = dateName(day);
    out.textContent = name;
    latOut.textContent = latName(la);
    placeEl.textContent = latName(la);
    dateEl.textContent = name;

    const length = dayLength(la, declination(day));
    const from = 12 - length / 2;
    const to = 12 + length / 2;
    if (length >= 24) arc.setAttribute('d', `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`);
    else if (length <= 0) arc.setAttribute('d', '');
    else {
      const a = at(from, r);
      const b = at(to, r);
      arc.setAttribute('d', `M${cx} ${cy}L${a.x.toFixed(1)} ${a.y.toFixed(1)}A${r} ${r} 0 ${length > 12 ? 1 : 0} 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}Z`);
    }
    const hide = length <= 0 || length >= 24;
    for (const [el, h] of [[rise, from], [set, to]] as [SVGLineElement, number][]) {
      const p = at(h, r);
      el.setAttribute('x2', String(p.x));
      el.setAttribute('y2', String(p.y));
      el.style.opacity = hide ? '0' : '';
    }
    const noon = at(12, r - 26);
    sun.setAttribute('cx', String(noon.x));
    sun.setAttribute('cy', String(noon.y));
    center.textContent = length >= 24 ? 'Sun all day' : length <= 0 ? 'No sunrise' : hm(length);

    if (length >= 24) status.textContent = `At ${latName(la)} on ${name} the Sun does not set. This is the midnight sun.`;
    else if (length <= 0) status.textContent = `At ${latName(la)} on ${name} the Sun does not rise. This is the polar night.`;
    else status.textContent = `At ${latName(la)} on ${name} the Sun rises at ${clock(from)} and sets at ${clock(to)} sun time. That is ${hm(length)} of daylight and ${hm(24 - length)} of night.`;

    const kind = length >= 24 ? 'sun' : length <= 0 ? 'dark' : 'normal';
    if (!quiet && kind !== last && kind !== 'normal') sound.play('good');
    last = kind;
  }

  date.addEventListener('input', () => update());
  lat.addEventListener('input', () => update());
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-day-place-btn]')) {
    b.addEventListener('click', () => {
      lat.value = b.dataset.dayPlaceBtn!;
      update();
      sound.play('pop');
    });
  }
  update(true);
}
