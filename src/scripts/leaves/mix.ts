// Panel 1: mix the three colours of a leaf.

import { fillRange, q } from '../util';
import { colourWord, leafColour, rgb } from '../../lib/leaves';

export function initMix(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-mix-tool]');
  if (!tool) return;
  const c = q<HTMLInputElement>(tool, '[data-mix-c]');
  const k = q<HTMLInputElement>(tool, '[data-mix-k]');
  const a = q<HTMLInputElement>(tool, '[data-mix-a]');
  const leaf = q<SVGElement>(tool, '[data-mix-leaf]');
  const status = q<HTMLElement>(tool, '[data-mix-status]');

  function draw() {
    const p = { chlorophyll: Number(c.value) / 100, carotenoid: Number(k.value) / 100, anthocyanin: Number(a.value) / 100 };
    for (const r of [c, k, a]) fillRange(r);
    q(tool!, '[data-mix-c-out]').textContent = c.value;
    q(tool!, '[data-mix-k-out]').textContent = k.value;
    q(tool!, '[data-mix-a-out]').textContent = a.value;
    const col = leafColour(p);
    leaf.style.fill = rgb(col);
    const word = colourWord(col);
    const why = p.chlorophyll > 0.6 ? 'The strong green hides the yellow and orange.' : p.chlorophyll > 0.15 ? 'The green is fading, so some yellow shows through.' : p.anthocyanin > 0.3 ? 'With little green left, the red anthocyanins and the orange carotenoids mix.' : 'With almost no green left, the yellow and orange carotenoids show.';
    status.textContent = `With these amounts the leaf is ${word}. ${why}`;
  }
  for (const r of [c, k, a]) r.addEventListener('input', draw);
  draw();
}
