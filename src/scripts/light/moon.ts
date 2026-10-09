// Call 1: a pulse to the mirror on the Moon and back.

import { fillRange, q } from '../util';
import { fmtTime, seconds } from '../../lib/light';
import { send } from './beam';

export function initMoon(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-moon-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-moon-range]');
  const out = q<HTMLOutputElement>(tool, '[data-moon-out]');
  const sum = q<HTMLElement>(tool, '[data-moon-sum]');
  const status = q<HTMLElement>(tool, '[data-moon-status]');

  const km = () => Number(range.value);
  function draw() {
    fillRange(range);
    const t = seconds(km());
    out.textContent = `${km().toLocaleString('en-US')} km`;
    sum.textContent = `${km().toLocaleString('en-US')} km: ${fmtTime(t)} out, ${fmtTime(t * 2)} out and back.`;
  }
  range.addEventListener('input', draw);
  draw();

  q(tool, '[data-moon-send]').addEventListener('click', () => {
    send({
      name: 'Mirror on the Moon',
      km: km(),
      legs: 2,
      done: (total) => {
        status.textContent = `The pulse took ${fmtTime(total)} out and back. Half of that, ${fmtTime(total / 2)}, times the speed of light is ${km().toLocaleString('en-US')} km. That is how the distance is measured.`;
      },
    });
  });
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-moon-set]')) {
    b.addEventListener('click', () => {
      range.value = b.dataset.moonSet!;
      draw();
    });
  }
}
