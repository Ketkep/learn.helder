// The calendar page: three parts. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { GREGORIAN_YEAR, JULIAN_YEAR, MONTHS, SWITCHES, drift, fmt, fromGregorian, fromJulian, jdnGregorian, jdnJulian, say, skipped, stripSvg, weekday } from '../../lib/cal';

const root = document.querySelector<HTMLElement>('[data-cal]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

if (root) {
  initSoundButton(root);

  // Part 1: one day, two dates
  const co = root.querySelector<HTMLElement>('[data-convert-tool]');
  if (co) {
    let from = 'Gregorian';
    const d = q<HTMLInputElement>(co, '[data-convert-d]');
    const m = q<HTMLSelectElement>(co, '[data-convert-m]');
    const y = q<HTMLInputElement>(co, '[data-convert-y]');
    MONTHS.forEach((name, i) => {
      const o = document.createElement('option');
      o.value = String(i + 1);
      o.textContent = name;
      m.appendChild(o);
    });
    const draw = () => {
      const dd = Number(d.value);
      const mm = Number(m.value);
      const yy = Number(y.value);
      const jd = from === 'Gregorian' ? jdnGregorian(yy, mm, dd) : jdnJulian(yy, mm, dd);
      const back = from === 'Gregorian' ? fromGregorian(jd) : fromJulian(jd);
      const status = q(co, '[data-convert-status]');
      if (back.d !== dd || back.m !== mm || back.y !== yy) {
        status.textContent = `That date does not exist in the ${from} calendar.`;
        return;
      }
      const other = from === 'Gregorian' ? fromJulian(jd) : fromGregorian(jd);
      status.textContent = `${say({ y: yy, m: mm, d: dd })} in the ${from} calendar is ${say(other)} in the ${from === 'Gregorian' ? 'Julian' : 'Gregorian'} calendar. It is a ${weekday(jd)}. The Gregorian date is ${Math.abs(jdnJulian(yy, mm, dd) - jdnGregorian(yy, mm, dd))} days ahead at this time.`;
    };
    picks(q(co, '[data-convert-picks]'), ['Gregorian', 'Julian'], 'Gregorian', (v) => {
      from = v;
      draw();
    });
    d.value = '1';
    m.value = '1';
    [d, m, y].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Part 2: a small error adds up
  const dr = root.querySelector<HTMLElement>('[data-drift-tool]');
  if (dr) {
    const range = q<HTMLInputElement>(dr, '[data-drift-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(dr, '[data-drift-out]').textContent = fmt(n);
      const j = drift(n, JULIAN_YEAR);
      const g = drift(n, GREGORIAN_YEAR);
      const max = Math.max(1, drift(3300, JULIAN_YEAR));
      q(dr, '[data-drift-g]').innerHTML = `<rect class="page" x="1" y="1" width="298" height="98" rx="8"/><text class="lab small" x="12" y="30">Julian</text><rect class="bar" x="70" y="20" width="${Math.max(2, (j / max) * 210).toFixed(1)}" height="14"/><text class="lab small" x="12" y="68">Gregorian</text><rect class="bar hot" x="70" y="58" width="${Math.max(2, (g / max) * 210).toFixed(1)}" height="14"/><text class="lab small" x="12" y="92">Days of drift, to the same scale</text>`;
      q(dr, '[data-drift-status]').textContent = `After ${fmt(n)} years the Julian calendar has drifted ${fmt(j, 1)} days from the seasons and the Gregorian calendar ${fmt(g, 2)} days.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Part 3: who changed, and when
  const sw = root.querySelector<HTMLElement>('[data-switch-tool]');
  if (sw) {
    picks(q(sw, '[data-switch-picks]'), SWITCHES.map((s) => s.name), SWITCHES[0].name, (v) => {
      const s = SWITCHES.filter((x) => x.name === v)[0];
      q(sw, '[data-switch-g]').innerHTML = stripSvg(s);
      q(sw, '[data-switch-status]').textContent = `${s.name}: ${say(s.last)} was followed by ${say(s.first)}. ${s.note} ${fmt(skipped(s))} days were left out.`;
    });
  }
}
