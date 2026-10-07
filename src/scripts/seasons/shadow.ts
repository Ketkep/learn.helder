// Instrument 4: the noon shadow of a stick 1 metre tall. Shadow = 1 m / tan(height of the Sun).

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { dateName, declination, noonElevation } from './sun';
import { latName } from './tilt';

const NS = 'http://www.w3.org/2000/svg';
const PER_METRE = 150; // drawing units for 1 metre
const MAX = 560; // longest shadow that fits in the picture

export function initShadow(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-shadow-tool]');
  if (!tool) return;
  const gy = Number(tool.dataset.gy);
  const sx = Number(tool.dataset.sx);
  const date = q<HTMLInputElement>(tool, '[data-shadow-range]');
  const lat = q<HTMLInputElement>(tool, '[data-shadow-lat]');
  const out = q<HTMLOutputElement>(tool, '[data-shadow-out]');
  const latOut = q<HTMLOutputElement>(tool, '[data-shadow-lat-out]');
  const lenEl = q<HTMLElement>(tool, '[data-shadow-len]');
  const elevEl = q<HTMLElement>(tool, '[data-shadow-elev]');
  const status = q<HTMLElement>(tool, '[data-shadow-status]');
  const beam = q<SVGLineElement>(tool, '[data-shadow-beam]');
  const sun = q<SVGCircleElement>(tool, '[data-shadow-sun]');
  const line = q<SVGLineElement>(tool, '[data-shadow-line]');
  const marks = q<SVGGElement>(tool, '[data-shadow-marks]');
  const end = q<SVGTextElement>(tool, '[data-shadow-end]');

  const metres = (v: number) => (v < 10 ? v.toFixed(2) : v.toFixed(1));

  function update() {
    const day = Number(date.value);
    const la = Number(lat.value);
    fillRange(date);
    fillRange(lat);
    const name = dateName(day);
    out.textContent = name;
    latOut.textContent = latName(la);

    const decl = declination(day);
    const elev = noonElevation(la, decl);
    const pole = Math.abs(la) > 89.9;
    const toward = pole ? 'away from the Sun' : la >= decl ? 'north' : 'south'; // the shadow points away from the Sun
    end.textContent = elev > 0 && elev < 90 ? `shadow points ${toward}` : '';

    // The Sun sits on a line from the top of the stick at the height of the Sun
    const e = Math.max(elev, 0) * (Math.PI / 180);
    const top = gy - PER_METRE;
    beam.setAttribute('x1', String(sx));
    beam.setAttribute('y1', String(top));
    beam.setAttribute('x2', String(sx + 115 * Math.cos(e)));
    beam.setAttribute('y2', String(top - 115 * Math.sin(e)));
    sun.setAttribute('cx', String(sx + 115 * Math.cos(e)));
    sun.setAttribute('cy', String(top - 115 * Math.sin(e)));
    beam.style.opacity = elev > 0 ? '' : '0';
    sun.style.opacity = elev > 0 ? '' : '0.25';

    let len = 0;
    if (elev <= 0) {
      line.setAttribute('x2', String(sx));
      lenEl.textContent = 'No noon Sun';
      elevEl.textContent = 'below the horizon';
      status.textContent = `At ${latName(la)} on ${name} the Sun stays below the horizon at noon, so the stick has no shadow. This is the polar night.`;
    } else if (elev >= 89.9) {
      line.setAttribute('x2', String(sx));
      lenEl.textContent = 'No shadow';
      elevEl.textContent = 'Sun straight overhead';
      status.textContent = `At ${latName(la)} on ${name} the Sun stands straight overhead at noon, so the stick has almost no shadow.`;
    } else {
      len = 1 / Math.tan(e);
      const drawn = Math.min(len * PER_METRE, MAX);
      line.setAttribute('x2', String(sx - drawn));
      lenEl.textContent = `${metres(len)} m shadow`;
      elevEl.textContent = `Sun ${Math.round(elev)}° high`;
      const long = len * PER_METRE > MAX ? ' It is longer than the picture.' : '';
      status.textContent = `At ${latName(la)} on ${name} the noon Sun is ${Math.round(elev)}° high. A 1 m stick makes a shadow ${metres(len)} m long, pointing ${toward}.${long}`;
    }

    // Small marks for the two solstices at this place, so you can compare
    while (marks.firstChild) marks.removeChild(marks.firstChild);
    for (const [d, label] of [[172, '21 Jun'], [355, '21 Dec']] as [number, string][]) {
      const el = noonElevation(la, declination(d));
      if (el <= 0 || el >= 89.9) continue;
      const drawn = (1 / Math.tan((el * Math.PI) / 180)) * PER_METRE;
      if (drawn > MAX) continue;
      const x = sx - drawn;
      const tick = document.createElementNS(NS, 'line');
      tick.setAttribute('class', 'mark');
      tick.setAttribute('x1', String(x));
      tick.setAttribute('x2', String(x));
      tick.setAttribute('y1', String(gy));
      tick.setAttribute('y2', String(gy + 22));
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('class', 'lab small');
      text.setAttribute('x', String(x));
      text.setAttribute('y', String(gy + 46));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = label;
      marks.appendChild(tick);
      marks.appendChild(text);
    }
    return len;
  }

  let lastBucket = -1;
  const run = () => {
    const len = update();
    const bucket = len === 0 ? 0 : Math.round(Math.log2(len + 0.1) * 3);
    if (bucket !== lastBucket) sound.play('tick');
    lastBucket = bucket;
  };
  date.addEventListener('input', run);
  lat.addEventListener('input', run);
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-shadow-place]')) {
    b.addEventListener('click', () => {
      lat.value = b.dataset.shadowPlace!;
      update();
      sound.play('pop');
    });
  }
  update();
}
