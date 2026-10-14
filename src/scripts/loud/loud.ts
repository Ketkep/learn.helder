// The Loud page: four meters. This file starts each one.

import { fillRange, q } from '../util';
import { atDistance, combine, fmtHours, fmtRatio, intensityRatio, nearest, niosh, osha, zone } from '../../lib/decibel';

const root = document.querySelector<HTMLElement>('[data-loud]');

function needle(tool: HTMLElement, db: number) {
  q<HTMLElement>(tool, '[data-needle]').style.left = `${Math.max(0, Math.min(100, (db / 140) * 100))}%`;
}

function slider(tool: HTMLElement, name: string, show: (v: number) => string) {
  const el = q<HTMLInputElement>(tool, `[data-${name}]`);
  const out = q(tool, `[data-${name}-out]`);
  return {
    el,
    read() {
      fillRange(el);
      out.textContent = show(Number(el.value));
      return Number(el.value);
    },
  };
}

if (root) {
  const db = (v: number) => `${v} dB`;

  const ruler = root.querySelector<HTMLElement>('[data-ruler-tool]');
  if (ruler) {
    const s = slider(ruler, 'ruler', db);
    const status = q<HTMLElement>(ruler, '[data-ruler-status]');
    const draw = () => {
      const v = s.read();
      needle(ruler, v);
      status.textContent = `${v === 0 ? '0 dB is the starting point of the scale.' : `${v} dB is ${fmtRatio(intensityRatio(v))} more intense than 0 dB.`} ${Math.abs(nearest(v).db - v) <= 10 ? `Close to ${nearest(v).db} dB: ${nearest(v).name}.` : 'None of the listed sounds is close to this level.'} In this range sound is: ${zone(v)}.`;
    };
    s.el.addEventListener('input', draw);
    draw();
  }

  const two = root.querySelector<HTMLElement>('[data-two-tool]');
  if (two) {
    const a = slider(two, 'two-a', db);
    const b = slider(two, 'two-b', db);
    const status = q<HTMLElement>(two, '[data-two-status]');
    const draw = () => {
      const [x, y] = [a.read(), b.read()];
      const total = combine(x, y);
      needle(two, total);
      status.textContent = `${x} dB and ${y} dB together make ${total.toFixed(1)} dB, which is ${(total - Math.max(x, y)) < 0.05 ? 'the same as' : (total - Math.max(x, y)).toFixed(1) + ' dB more than'} the louder one.${Math.abs(x - y) <= 1 ? ' Two equal sounds add 3 dB.' : Math.abs(x - y) >= 10 ? ' The quieter sound hardly changes the total.' : ''}`;
    };
    a.el.addEventListener('input', draw);
    b.el.addEventListener('input', draw);
    draw();
  }

  const far = root.querySelector<HTMLElement>('[data-far-tool]');
  if (far) {
    const l = slider(far, 'far-l', db);
    const d = slider(far, 'far-d', (v) => `${v} metre${v === 1 ? '' : 's'}`);
    const status = q<HTMLElement>(far, '[data-far-status]');
    const draw = () => {
      const [lv, m] = [l.read(), d.read()];
      const here = atDistance(lv, m);
      needle(far, here);
      status.textContent = m === 1 ? `At 1 metre this source is ${lv} dB. Move the distance slider to see it fade.` : `A source of ${lv} dB at 1 metre is about ${here.toFixed(0)} dB at ${m} metres. Each doubling of the distance takes off about 6 dB.`;
    };
    l.el.addEventListener('input', draw);
    d.el.addEventListener('input', draw);
    draw();
  }

  const time = root.querySelector<HTMLElement>('[data-time-tool]');
  if (time) {
    const s = slider(time, 'time', (v) => `${v} dBA`);
    const status = q<HTMLElement>(time, '[data-time-status]');
    const lim = (h: number) => (h >= 24 ? 'a full day with no limit' : h < 1 / 60 ? 'under a minute a day' : `no more than ${fmtHours(h)} a day`);
    const draw = () => {
      const v = s.read();
      needle(time, v);
      status.textContent = `At ${v} dBA, NIOSH recommends ${lim(niosh(v))}, and OSHA allows ${lim(osha(v))}.${v >= 100 ? ' Sounds this loud are harmful in minutes.' : ''}`;
    };
    s.el.addEventListener('input', draw);
    draw();
  }
}
