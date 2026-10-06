// Drawer 4: primes thin out. A window of the 100 numbers up to N, with the primes lit.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { grp, sieve } from './math';

const TOP = 1_000_000;

export function initDensity(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-density-tool]');
  if (!tool) return;
  const dots = [...tool.querySelectorAll<HTMLElement>('.dot')];
  const range = q<HTMLInputElement>(tool, '[data-density-range]');
  const out = q<HTMLOutputElement>(tool, '[data-density-out]');
  const status = q<HTMLElement>(tool, '[data-density-status]');
  const win = q<HTMLElement>(tool, '[data-density-window]');
  const flags = sieve(TOP);
  // running count of primes, so "how many up to N" is a lookup
  const upTo = new Uint32Array(TOP + 1);
  for (let i = 2; i <= TOP; i++) upTo[i] = upTo[i - 1] + flags[i];
  let last = -1;

  // The slider is a log scale: 0 is 100 and 100 is 1,000,000
  const fromSlider = (v: number) => Math.round(10 ** (2 + (4 * v) / 100));
  const toSlider = (n: number) => ((Math.log10(n) - 2) * 100) / 4;

  function set(n: number) {
    n = Math.min(Math.max(n, 100), TOP);
    range.value = String(Math.round(toSlider(n)));
    fillRange(range);
    out.textContent = grp(n);
    const start = n - 99;
    const found: number[] = [];
    dots.forEach((dot, i) => {
      const v = start + i;
      const prime = flags[v] === 1;
      dot.classList.toggle('lit', prime);
      if (prime) found.push(v);
    });
    win.setAttribute('aria-label', `A window of the 100 numbers from ${grp(start)} to ${grp(n)}. ${found.length} are prime, shown lit.`);
    const total = upTo[n];
    const chance = Math.round(n / total);
    const listed = found.length <= 14 ? `: ${found.map(grp).join(', ')}` : '';
    status.textContent =
      `The window shows ${grp(start)} to ${grp(n)}. ${found.length} of the 100 numbers are prime${listed}. ` +
      `Up to ${grp(n)} there are ${grp(total)} primes, about 1 number in ${chance}. The prime number theorem guesses 1 in ${Math.log(n).toFixed(1)}.`;
    if (found.length !== last) sound.play('tick');
    last = found.length;
  }

  range.addEventListener('input', () => set(fromSlider(Number(range.value))));
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-density-jump]')) {
    b.addEventListener('click', () => {
      set(Number(b.dataset.densityJump));
      sound.play('pop');
    });
  }
  set(1000);
}
