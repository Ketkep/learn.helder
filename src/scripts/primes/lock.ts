// Drawer 5: multiplying two primes is one step. Splitting the answer by trial division takes thousands to millions.

import * as sound from '../sound';
import { q } from '../util';
import { grp, isPrime } from './math';

/** A random prime with exactly `digits` digits. */
function randomPrime(digits: number) {
  const lo = 10 ** (digits - 1);
  const span = 9 * lo;
  for (;;) {
    const n = lo + Math.floor(Math.random() * span);
    if (isPrime(n)) return n;
  }
}

export function initLock(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-lock-tool]');
  if (!tool) return;
  const sizes = [...tool.querySelectorAll<HTMLButtonElement>('[data-lock-digits]')];
  const make = q<HTMLButtonElement>(tool, '[data-lock-make]');
  const split = q<HTMLButtonElement>(tool, '[data-lock-split]');
  const line = q<HTMLElement>(tool, '[data-lock-line]');
  const result = q<HTMLElement>(tool, '[data-lock-result]');
  const status = q<HTMLElement>(tool, '[data-lock-status]');
  const rows = new Map(sizes.map((b) => [Number(b.dataset.lockDigits), q<HTMLElement>(tool, `[data-lock-row="${b.dataset.lockDigits}"]`)]));
  let digits = 6;
  let current: { p: number; q: number; n: number } | null = null;

  const tries = new Map<number, number>();
  function bars() {
    // Bars use a log scale, so each digit pair shows up as the same step
    for (const [d, row] of rows) {
      const t = tries.get(d);
      const fill = q<HTMLElement>(row, '[data-bar]');
      const count = q<HTMLElement>(row, '[data-count]');
      if (t === undefined) {
        fill.style.width = '0';
        count.textContent = 'not tried yet';
      } else {
        fill.style.width = `${Math.min(100, Math.max(4, (Math.log10(t + 1) / 7) * 100))}%`;
        count.textContent = `${grp(t)} tries`;
      }
    }
  }

  for (const b of sizes) {
    b.addEventListener('click', () => {
      digits = Number(b.dataset.lockDigits);
      for (const x of sizes) x.setAttribute('aria-pressed', String(x === b));
      sound.play('tick');
    });
  }

  make.addEventListener('click', () => {
    const half = digits / 2;
    const p = randomPrime(half);
    let r = randomPrime(half);
    while (r === p) r = randomPrime(half);
    current = { p: Math.min(p, r), q: Math.max(p, r), n: p * r };
    line.textContent = `${grp(current.p)} × ${grp(current.q)} = ${grp(current.n)}`;
    result.textContent = ' ';
    split.disabled = false;
    status.textContent = `Multiplying took one step. Now the answer is ${grp(current.n)}. Pretend you do not know the two primes and press Split it again.`;
    sound.play('coin');
  });

  split.addEventListener('click', () => {
    if (!current) return;
    const { n } = current;
    const began = performance.now();
    let steps = 0;
    let found = 0;
    // Try 2, then every odd number
    steps++;
    if (n % 2 === 0) found = 2;
    for (let d = 3; !found && d * d <= n; d += 2) {
      steps++;
      if (n % d === 0) found = d;
    }
    const ms = Math.max(1, Math.round(performance.now() - began));
    result.textContent = `Found ${grp(found)} × ${grp(n / found)} after ${grp(steps)} tries`;
    tries.set(digits, steps);
    bars();
    status.textContent = `Splitting ${grp(n)} took ${grp(steps)} tries (about ${ms} ms on this device). Making it took one multiplication. Try a longer number and compare the bars.`;
    sound.play('good');
  });

  bars();
  status.textContent = 'Pick how long the number is, then press Make a number.';
}
