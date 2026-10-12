// Panel 2: a strip of paper that pulls the colours of a leaf apart.

import { fillRange, q } from '../util';
import { bands, strength } from '../../lib/leaves';

export function initPaper(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-paper-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-paper-svg]');
  const liquid = q(svg, '[data-paper-liquid]');
  const range = q<HTMLInputElement>(tool, '[data-paper-range]');
  const status = q<HTMLElement>(tool, '[data-paper-status]');
  const leaves = [...tool.querySelectorAll<HTMLButtonElement>('[data-paper-leaf]')];
  let leaf: 'summer' | 'autumn' = 'summer';

  function draw() {
    const t = Number(range.value) / 100;
    fillRange(range);
    q(tool!, '[data-paper-out]').textContent = `${Math.round(t * 100)} per cent`;
    // The liquid climbs from the bottom of the paper to the top. Each colour travels a share of that distance.
    liquid.setAttribute('y', String(240 - 220 * t));
    liquid.setAttribute('height', String(220 * t));
    bands.forEach((b, i) => {
      const el = q(svg, `[data-band="${i}"]`);
      const y = 216 - b.height * 190 * t - 5;
      el.setAttribute('y', String(y));
      (el as SVGElement).style.opacity = String(t === 0 ? 0.9 : strength[leaf][i]);
    });
    const text = leaf === 'summer' ? 'On the summer leaf the two chlorophyll bands are strong.' : 'On the autumn leaf the chlorophyll bands are faint. The yellow and orange bands are what is left.';
    status.textContent = `${text} ${t < 1 ? `The liquid is ${Math.round(t * 100)} per cent of the way up, and the colours are still on the way.` : 'Carotene, the yellow orange band, travelled farthest.'}`;
  }
  range.addEventListener('input', draw);
  for (const b of leaves) {
    b.addEventListener('click', () => {
      leaf = b.dataset.paperLeaf as 'summer' | 'autumn';
      for (const o of leaves) {
        o.setAttribute('aria-pressed', String(o === b));
        o.classList.toggle('fill', o === b);
      }
      draw();
    });
  }
  draw();
}
