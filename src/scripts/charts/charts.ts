// The misleading charts page: three slides. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { A, areaRatio, B, barsSvg, change, circlesSvg, extreme, fmt, lineSvg, looksLike, MONTHS, really, series } from '../../lib/charts';

const root = document.querySelector<HTMLElement>('[data-charts]');

if (root) {
  initSoundButton(root);

  // Slide 1: where the bars start
  const ba = root.querySelector<HTMLElement>('[data-baseline-tool]');
  if (ba) {
    const range = q<HTMLInputElement>(ba, '[data-baseline-range]');
    const draw = () => {
      fillRange(range);
      const s = Number(range.value);
      q(ba, '[data-baseline-out]').textContent = String(s);
      q(ba, '[data-baseline-g]').innerHTML = barsSvg(s);
      const l = looksLike(s);
      q(ba, '[data-baseline-status]').textContent = `With the axis starting at ${s}, bar B looks ${fmt(l, 2)} times as tall as bar A, but the values (${B} and ${A}) are in the ratio ${fmt(really, 2)}.${s === 0 ? ' This is the honest picture.' : l > 1.5 ? ' The picture is badly out of proportion.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Slide 2: which months to show
  const wi = root.querySelector<HTMLElement>('[data-window-tool]');
  if (wi) {
    const d = series();
    const a = q<HTMLInputElement>(wi, '[data-window-a]');
    const b = q<HTMLInputElement>(wi, '[data-window-b]');
    const buttons = wi.querySelectorAll<HTMLElement>('.pick');
    const mark = (which: string) => buttons.forEach((p) => p.setAttribute('aria-pressed', p.hasAttribute(which) ? 'true' : 'false'));
    const draw = () => {
      [a, b].forEach(fillRange);
      let from = Number(a.value) - 1;
      let to = Number(b.value) - 1;
      if (to <= from) {
        to = Math.min(MONTHS - 1, from + 1);
        from = Math.min(from, to - 1);
      }
      q(wi, '[data-window-outa]').textContent = String(from + 1);
      q(wi, '[data-window-outb]').textContent = String(to + 1);
      q(wi, '[data-window-g]').innerHTML = lineSvg(d, from, to);
      const c = change(d, from, to);
      q(wi, '[data-window-status]').textContent = `From month ${from + 1} to month ${to + 1} the line ${c >= 0 ? 'rises' : 'falls'} by ${fmt(Math.abs(c), 1)}%. Over all ${MONTHS} months it changes by ${fmt(change(d, 0, MONTHS - 1), 1)}%.`;
    };
    const set = (r: [number, number], which: string) => {
      a.value = String(r[0] + 1);
      b.value = String(r[1] + 1);
      mark(which);
      draw();
      sound.play('tick', 0.3);
    };
    q(wi, '[data-window-best]').addEventListener('click', () => set(extreme(d, 6, true), 'data-window-best'));
    q(wi, '[data-window-worst]').addEventListener('click', () => set(extreme(d, 6, false), 'data-window-worst'));
    q(wi, '[data-window-all]').addEventListener('click', () => set([0, MONTHS - 1], 'data-window-all'));
    [a, b].forEach((i) =>
      i.addEventListener('input', () => {
        mark('none');
        draw();
      }),
    );
    draw();
  }

  // Slide 3: length or area
  const ar = root.querySelector<HTMLElement>('[data-area-tool]');
  if (ar) {
    const range = q<HTMLInputElement>(ar, '[data-area-range]');
    const draw = () => {
      fillRange(range);
      const v = Number(range.value) / 10;
      q(ar, '[data-area-out]').textContent = v.toFixed(1);
      q(ar, '[data-area-g]').innerHTML = circlesSvg(v);
      q(ar, '[data-area-status]').textContent = `A value that is ${v.toFixed(1)} times bigger, drawn with a radius ${v.toFixed(1)} times as long, takes ${fmt(areaRatio(v), 1)} times the area. A fair circle has a radius ${fmt(Math.sqrt(v), 2)} times as long, so its area is ${v.toFixed(1)} times as big.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
