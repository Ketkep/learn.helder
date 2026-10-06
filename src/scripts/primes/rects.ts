// Drawer 2: dots in rectangles. A prime makes only the single row. Everything else makes more.

import * as sound from '../sound';
import { clear, fillRange, q } from '../util';
import { factor, grp, rectangles } from './math';

const NS = 'http://www.w3.org/2000/svg';

export function initRects(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-rects-tool]');
  if (!tool) return;
  const stage = q<HTMLElement>(tool, '[data-rects-stage]');
  const range = q<HTMLInputElement>(tool, '[data-rects-range]');
  const out = q<HTMLOutputElement>(tool, '[data-rects-out]');
  const status = q<HTMLElement>(tool, '[data-rects-status]');
  let last = 0;

  function draw(n: number) {
    clear(stage);
    const shapes = document.createElement('div');
    shapes.className = 'shapes';
    const list = rectangles(n);
    for (const [a, b] of list) {
      const fig = document.createElement('figure');
      fig.className = a === 1 && n > 1 ? 'shape single' : 'shape';
      fig.style.width = `${Math.max(b * 1.7, 5)}rem`;
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${b * 20} ${a * 20}`);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', `${a} by ${b}`);
      for (let i = 0; i < a * b; i++) {
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', String((i % b) * 20 + 10));
        dot.setAttribute('cy', String(Math.floor(i / b) * 20 + 10));
        dot.setAttribute('r', '7');
        svg.appendChild(dot);
      }
      const cap = document.createElement('figcaption');
      cap.textContent = `${a} × ${b}`;
      fig.appendChild(svg);
      fig.appendChild(cap);
      shapes.appendChild(fig);
    }
    stage.appendChild(shapes);
  }

  function set(n: number) {
    range.value = String(n);
    fillRange(range);
    out.textContent = String(n);
    draw(n);
    const count = rectangles(n).length;
    const parts = factor(n);
    if (n === 1) {
      status.textContent = '1 dot makes 1 rectangle, but 1 is not prime and not composite. It is left out so that every other number splits into primes in only one way.';
    } else if (count === 1) {
      status.textContent = `${n} dots make only 1 rectangle, a single row. So ${n} is prime.`;
    } else {
      const same = parts.length === 2 && parts[0] === parts[1] ? ' It makes a square.' : '';
      status.textContent = `${grp(n)} dots make ${count} rectangles, so ${n} is composite: ${n} = ${parts.join(' × ')}.${same}`;
    }
    if (n !== last && count === 1 && n > 1) sound.play('good');
    else if (n !== last) sound.play('tick');
    last = n;
  }

  range.addEventListener('input', () => set(Number(range.value)));
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-rects-jump]')) {
    b.addEventListener('click', () => set(Number(b.dataset.rectsJump)));
  }
  set(12);
}
