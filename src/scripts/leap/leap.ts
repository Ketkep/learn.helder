// The Leap page: four almanac pages. This file starts each one.

import { fillRange, q } from '../util';
import { JULIAN_YEAR, checkYear, describeShift, driftSvg, equinoxShift, monthHtml, shiftSeries, skips } from '../../lib/calendar';

const root = document.querySelector<HTMLElement>('[data-leap]');

function drift(tool: HTMLElement, name: string, max: number, key: 'none' | 'julian', cal: number, noun: string) {
  const range = q<HTMLInputElement>(tool, `[data-${name}-range]`);
  const g = q(tool, `[data-${name}-g]`);
  const status = q<HTMLElement>(tool, `[data-${name}-status]`);
  g.innerHTML = driftSvg(shiftSeries(max)[key], max, `line ${key}`);
  const draw = () => {
    const y = Number(range.value);
    fillRange(range);
    q(tool, `[data-${name}-out]`).textContent = `${y.toLocaleString('en-US')} years`;
    status.textContent = `After ${y.toLocaleString('en-US')} year${y === 1 ? '' : 's'} ${noun}. ${describeShift(equinoxShift(y, cal))}`;
  };
  range.addEventListener('input', draw);
  draw();
}

if (root) {
  const slip = root.querySelector<HTMLElement>('[data-slip-tool]');
  if (slip) drift(slip, 'slip', 100, 'none', 365, 'with no leap days');
  const julian = root.querySelector<HTMLElement>('[data-julian-tool]');
  if (julian) drift(julian, 'julian', 1600, 'julian', JULIAN_YEAR, `of an average year of ${JULIAN_YEAR} days`);

  const century = root.querySelector<HTMLElement>('[data-century-tool]');
  if (century) {
    const input = q<HTMLInputElement>(century, '[data-century-year]');
    const status = q<HTMLElement>(century, '[data-century-status]');
    const draw = () => {
      const y = Math.round(Number(input.value));
      if (!(y >= 1 && y <= 9999)) {
        status.textContent = 'Type a year from 1 to 9999.';
        return;
      }
      const c = checkYear(y);
      status.textContent = `${y}: the Julian rule says ${c.julian.leap ? 'leap year' : 'not a leap year'} (${c.julian.why}). The Gregorian rule says ${c.gregorian.leap ? 'leap year' : 'not a leap year'} (${c.gregorian.why}).`;
    };
    input.addEventListener('input', draw);
    draw();
  }

  const skip = root.querySelector<HTMLElement>('[data-skip-tool]');
  if (skip) {
    const grid = q(skip, '[data-skip-grid]');
    const title = q(skip, '[data-skip-title]');
    const status = q<HTMLElement>(skip, '[data-skip-status]');
    const picks = [...skip.querySelectorAll<HTMLButtonElement>('[data-skip-pick]')];
    for (const b of picks) {
      b.addEventListener('click', () => {
        const p = skips.find((s) => s.id === b.dataset.skipPick)!;
        grid.innerHTML = monthHtml(p);
        title.textContent = `${p.month} ${p.year}`;
        status.textContent = `${p.name}. ${p.note}`;
        for (const o of picks) {
          o.setAttribute('aria-pressed', String(o === b));
          o.classList.toggle('fill', o === b);
        }
      });
    }
  }
}
