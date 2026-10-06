// Bench 2: the tide clock. Highs come every 12.42 hours, so each day they slide about 50 minutes later.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import type { Staff } from './quay';
import { LUNAR_DAY_H, clock, heightOnDay, highTides } from './model';

const NS = 'http://www.w3.org/2000/svg';
const FIRST_HIGH = 6; // the high tide at 06:00 on day 1 is made up
const X0 = 56;
const X1 = 776;
const YMID = 165;
const YAMP = 110;

const px = (h: number) => X0 + ((X1 - X0) * h) / 24;
const py = (v: number) => YMID - YAMP * v;

function mark(parent: Element, name: string, attrs: Record<string, string | number>, text?: string) {
  const el = document.createElementNS(NS, name);
  for (const k of Object.keys(attrs)) el.setAttribute(k, String(attrs[k]));
  if (text) el.textContent = text;
  parent.appendChild(el);
  return el;
}

export function initClock(root: HTMLElement, staff: Staff) {
  const tool = root.querySelector<HTMLElement>('[data-clock-tool]');
  if (!tool) return;
  const day = q<HTMLInputElement>(root, '[data-clock-day]');
  const hour = q<HTMLInputElement>(root, '[data-clock-hour]');
  const dayOut = q<HTMLOutputElement>(root, '[data-clock-day-out]');
  const hourOut = q<HTMLOutputElement>(root, '[data-clock-hour-out]');
  const status = q<HTMLElement>(root, '[data-clock-status]');
  const curve = q<SVGPathElement>(tool, '[data-clock-curve]');
  const highs = q<SVGGElement>(tool, '[data-clock-highs]');
  const ghosts = q<SVGGElement>(tool, '[data-clock-yesterday]');
  const cursor = q<SVGLineElement>(tool, '[data-clock-cursor]');
  const knob = q<SVGCircleElement>(tool, '[data-clock-knob]');
  let lastDay = 0;

  function draw() {
    const d = Number(day.value) - 1;
    const h = Number(hour.value);
    const first = FIRST_HIGH;

    let path = '';
    for (let i = 0; i <= 96; i++) {
      const t = (i / 96) * 24;
      path += `${i ? 'L' : 'M'}${px(t).toFixed(1)} ${py(heightOnDay(d, t, first)).toFixed(1)}`;
    }
    curve.setAttribute('d', path);

    highs.textContent = '';
    ghosts.textContent = '';
    const today = highTides(d, first);
    for (const t of today) {
      mark(highs, 'circle', { class: 'c-high', cx: px(t), cy: py(1), r: 10 });
      const anchor = t > 21 ? 'end' : t < 3 ? 'start' : 'middle';
      mark(highs, 'text', { class: 'c-high-text', x: px(t) + (anchor === 'end' ? 8 : anchor === 'start' ? -8 : 0), y: py(1) - 18, 'text-anchor': anchor }, clock(t));
    }
    if (d > 0) {
      for (const t of highTides(d - 1, first)) {
        mark(ghosts, 'circle', { class: 'c-ghost', cx: px(t), cy: py(1), r: 10 });
      }
      mark(ghosts, 'text', { class: 'c-ghost-text', x: X1 - 4, y: 296, 'text-anchor': 'end' }, 'Dashed rings: yesterday’s high tides');
    }

    cursor.setAttribute('x1', String(px(h)));
    cursor.setAttribute('x2', String(px(h)));
    knob.setAttribute('cx', String(px(h)));
    knob.setAttribute('cy', String(py(heightOnDay(d, h, first))));

    dayOut.textContent = String(d + 1);
    hourOut.textContent = clock(h);
    fillRange(day);
    fillRange(hour);

    const list = today.map(clock);
    const shift = Math.round((LUNAR_DAY_H - 24) * 60);
    const base = list.length === 1 ? `Day ${d + 1}. Only one high tide today, at ${list[0]}.` : `Day ${d + 1}. High tides at ${list[0]} and ${list[1]}.`;
    status.textContent = d === 0 ? `${base} Press on and see them slide.` : `${base} Each one is about ${shift} minutes later than yesterday’s.`;

    const level = heightOnDay(d, h, first);
    staff.set('clock', {
      level: (level + 1) / 2,
      text: level > 0.85 ? 'High water' : level < -0.85 ? 'Low water' : level > 0 ? 'Upper half of the tide' : 'Lower half of the tide',
    });
    if (d !== lastDay) {
      sound.play('tick');
      lastDay = d;
    }
  }

  day.addEventListener('input', draw);
  hour.addEventListener('input', draw);
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-clock-jump]')) {
    b.addEventListener('click', () => {
      day.value = b.dataset.clockJump!;
      draw();
      sound.play('pop');
    });
  }
  draw();
}
