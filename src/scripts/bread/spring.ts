// Stop 3 (the oven): a loaf warming from the middle. The gas takes more room until the loaf sets.

import { fillRange, q } from '../util';
import { SET_AT, YEAST_DIES, gasRatio, loafSvg } from '../../lib/bread';

export function initSpring(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-spring-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-spring-range]');
  const loaf = q(tool, '[data-spring-loaf]');
  const status = q<HTMLElement>(tool, '[data-spring-status]');

  function draw() {
    const c = Number(range.value);
    fillRange(range);
    q(tool!, '[data-spring-out]').textContent = `${c} degrees`;
    loaf.innerHTML = loafSvg(c);
    const more = Math.round((gasRatio(c) - 1) * 100);
    const phase = c >= SET_AT ? 'The starch and protein have set, so the loaf keeps its shape and stops growing.' : c >= YEAST_DIES ? 'The yeast is dead but the loaf has not set yet, so the warm gas still pushes it up.' : 'The yeast is still alive and making gas, and the gas in the bubbles is warming.';
    status.textContent = `At ${c} degrees the gas takes up ${more} per cent more room than at 30 degrees. ${phase}`;
  }
  range.addEventListener('input', draw);
  draw();
}
