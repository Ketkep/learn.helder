// Drawer 1: the sieve of Eratosthenes. The reader picks the smallest number that is not struck out.

import * as sound from '../sound';
import { q } from '../util';

export function initSieve(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-sieve-tool]');
  if (!tool) return;
  const cells = [...tool.querySelectorAll<HTMLButtonElement>('[data-n]')];
  const status = q<HTMLElement>(tool, '[data-sieve-status]');
  const nextBtn = q<HTMLButtonElement>(tool, '[data-sieve-next]');
  const resetBtn = q<HTMLButtonElement>(tool, '[data-sieve-reset]');
  const struck = new Set<number>();
  const primes: number[] = [];

  const smallest = () => {
    for (let n = 2; n <= 100; n++) if (!struck.has(n) && !primes.includes(n)) return n;
    return 0;
  };

  function paint() {
    const next = smallest();
    for (const c of cells) {
      const n = Number(c.dataset.n);
      c.className = 'cell';
      if (n === 1 || struck.has(n)) c.classList.add('struck');
      else if (primes.includes(n)) c.classList.add('ring');
      else if (n === next && n <= 7) c.classList.add('next');
      c.disabled = false;
      c.setAttribute('aria-label', n === 1 ? '1, not a prime' : struck.has(n) ? `${n}, struck out` : primes.includes(n) ? `${n}, prime` : String(n));
    }
    nextBtn.disabled = next === 0 || next > 7;
  }

  function pick(n: number) {
    primes.push(n);
    let gone = 0;
    for (let m = n * n; m <= 100; m += n) {
      if (!struck.has(m)) {
        struck.add(m);
        gone++;
      }
    }
    sound.play(gone ? 'crack' : 'pop');
    // Everything below the square of the next prime is settled, so once 7 is done the rest are prime
    const next = smallest();
    paint();
    if (next === 0 || next > 7) {
      for (let m = 2; m <= 100; m++) if (!struck.has(m) && !primes.includes(m)) primes.push(m);
      paint();
      status.textContent = `Done. Every number that is left is a prime: ${primes.length} of them below 100. You could stop at ${n} because the next prime, ${next || 11}, times itself is already more than 100.`;
      sound.play('good');
    } else {
      status.textContent = `${n} is prime. You struck out ${gone} of its multiples (${n} times ${n}, ${n} times ${n + 1} and so on). The smallest number left is ${next}.`;
    }
  }

  function reset() {
    struck.clear();
    primes.length = 0;
    paint();
    status.textContent = 'Click 2, the smallest number that is not struck out. 1 is not prime, so it starts struck out.';
  }

  for (const c of cells) {
    c.addEventListener('click', () => {
      const n = Number(c.dataset.n);
      const next = smallest();
      if (n === 1) {
        status.textContent = '1 is not a prime, so it is out from the start.';
      } else if (struck.has(n)) {
        status.textContent = `${n} is struck out already. It is a multiple of a smaller prime, so it can be split.`;
        sound.play('bad', 0.5);
      } else if (primes.includes(n)) {
        status.textContent = `${n} is already ringed.`;
      } else if (next > 7 || next === 0) {
        status.textContent = 'The sieve is finished. Press start again to try it once more.';
      } else if (n === next) {
        pick(n);
      } else {
        status.textContent = `Not yet. Take the smallest number that is not struck out. That is ${next}.`;
        sound.play('bad', 0.5);
      }
    });
  }
  nextBtn.addEventListener('click', () => {
    const n = smallest();
    if (n && n <= 7) pick(n);
  });
  resetBtn.addEventListener('click', () => {
    reset();
    sound.play('pop');
  });
  reset();
}
