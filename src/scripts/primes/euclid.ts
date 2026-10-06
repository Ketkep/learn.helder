// Drawer 3: Euclid's trick. The product of a list of primes, plus 1, is never divisible by any of them.

import * as sound from '../sound';
import { q } from '../util';
import { andList, factor, grp, isPrime } from './math';

export function initEuclid(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-euclid-tool]');
  if (!tool) return;
  const chips = [...tool.querySelectorAll<HTMLButtonElement>('[data-p]')];
  const product = q<HTMLElement>(tool, '[data-euclid-product]');
  const added = q<HTMLElement>(tool, '[data-euclid-new]');
  const split = q<HTMLElement>(tool, '[data-euclid-split]');
  const rest = q<HTMLElement>(tool, '[data-euclid-rest]');
  const status = q<HTMLElement>(tool, '[data-euclid-status]');

  function update() {
    const list = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => Number(c.dataset.p));
    const total = list.reduce((a, b) => a * b, 1);
    const n = total + 1;
    product.textContent = `${list.join(' × ')} = ${grp(total)}`;
    added.textContent = grp(n);
    rest.textContent = list.map((p) => `${grp(n)} ÷ ${p} leaves ${n % p}`).join(', ');
    if (isPrime(n)) {
      split.textContent = `${grp(n)} is prime already`;
      status.textContent = `${grp(n)} is a prime, and it is not on your list. Your list was missing a prime.`;
    } else {
      const parts = factor(n);
      split.textContent = parts.map(grp).join(' × ');
      const unique = [...new Set(parts)];
      status.textContent = `${grp(n)} is not prime, but ${andList(unique.map(grp))} ${unique.length > 1 ? 'are' : 'is'} not on your list. Your list was missing ${unique.length > 1 ? 'primes' : 'a prime'}.`;
    }
  }

  for (const c of chips) {
    c.addEventListener('click', () => {
      const on = c.getAttribute('aria-pressed') === 'true';
      const pressed = chips.filter((x) => x.getAttribute('aria-pressed') === 'true').length;
      if (on && pressed === 1) {
        status.textContent = 'Keep at least one prime on the list.';
        sound.play('bad', 0.5);
        return;
      }
      c.setAttribute('aria-pressed', String(!on));
      sound.play('tick');
      update();
    });
  }
  update();
}
