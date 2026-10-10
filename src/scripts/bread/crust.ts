// Stop 4 (the crust): the outside browns as it gets hotter. The inside stays near the boiling point of water.

import { fillRange, q } from '../util';
import { sliceSvg } from '../../lib/bread';

export function initCrust(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-crust-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-crust-range]');
  const slice = q(tool, '[data-crust-slice]');
  const status = q<HTMLElement>(tool, '[data-crust-status]');

  function draw() {
    const t = Number(range.value);
    fillRange(range);
    q(tool!, '[data-crust-out]').textContent = `${t} degrees`;
    slice.innerHTML = sliceSvg(t);
    const crust = t <= 100 ? 'The surface is still wet and pale, so nothing browns yet.' : t < 130 ? 'The surface is drying and has just begun to brown.' : t < 170 ? 'The crust is golden.' : t < 200 ? 'The crust is a deep brown.' : 'The crust is very dark and would taste bitter.';
    status.textContent = `At ${t} degrees: ${crust} The crumb stays near 100 degrees, because it is full of water, so it does not brown.`;
  }
  range.addEventListener('input', draw);
  draw();
}
