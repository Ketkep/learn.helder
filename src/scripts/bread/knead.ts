// Stop 1 (the net): a slice of dough that gets stronger the longer it is kneaded.

import { fillRange, q } from '../util';
import { gasKept, glutenStrength, netSvg } from '../../lib/bread';

export function initKnead(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-knead-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-knead-range]');
  const net = q(tool, '[data-knead-net]');
  const status = q<HTMLElement>(tool, '[data-knead-status]');

  function draw() {
    const m = Number(range.value);
    fillRange(range);
    q(tool!, '[data-knead-out]').textContent = `${m} minute${m === 1 ? '' : 's'}`;
    const s = glutenStrength(m);
    net.innerHTML = netSvg(s);
    const note = s < 0.4 ? ' The net is weak: bubbles join up and burst (the dashed ones).' : s < 0.8 ? ' The net is getting stronger and holds more small bubbles.' : ' The net is strong and stretches into a thin film, so it holds many small bubbles.';
    status.textContent = `After ${m} minute${m === 1 ? '' : 's'} the gluten net is ${Math.round(s * 100)} per cent as strong as it will get, and the dough keeps about ${Math.round(gasKept(s) * 100)} per cent of the gas.${note}`;
  }
  range.addEventListener('input', draw);
  draw();
}
