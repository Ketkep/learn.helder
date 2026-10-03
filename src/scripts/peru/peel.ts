// Shot 4: peel the stone face off a terrace wall at Caral and see the bags of stones behind it.

import { fillRange, q } from './util';

const X = 120; // the left edge of the wall in the drawing
const W = 560; // its width

export function initPeel(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-peel-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(root, '[data-peel-range]');
  const rect = q<SVGRectElement>(tool, '[data-peel-rect]');
  const edge = q<SVGRectElement>(tool, '[data-peel-edge]');
  const status = q<HTMLElement>(root, '[data-peel-status]');
  const notes = [...tool.querySelectorAll<SVGGElement>('[data-note]')];

  const apply = () => {
    const f = Number(range.value) / 100;
    rect.setAttribute('x', String(X + f * W));
    rect.setAttribute('width', String(Math.max(0, W * (1 - f))));
    edge.setAttribute('x', String(X + f * W - 3));
    edge.style.opacity = f <= 0 || f >= 1 ? '0' : '0.55';
    fillRange(range);

    for (const n of notes) {
      const need = n.dataset.note === 'face' ? f < 0.9 && f > 0.1 : f > 0.4;
      n.classList.toggle('show', need);
    }

    if (f < 0.05) status.textContent = 'A wall of neat stone blocks. It looks solid. Slide to peel it open.';
    else if (f < 0.5) status.textContent = 'Behind the first stones there is no solid fill. There are bags, woven from reeds and grass.';
    else if (f < 0.95) status.textContent = 'Each bag is packed with stones. The bags were packed behind each retaining wall.';
    else status.textContent = 'All of it is bags of stone. The reeds stretch a little, so the stones can shift in a quake without bringing the wall down.';
  };

  range.addEventListener('input', apply);
  apply();
}
