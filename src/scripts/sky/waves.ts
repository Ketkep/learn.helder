// Window 1: slide through the colours.

import { fillRange, q } from '../util';
import { colourName, rgb, scatterVsRed, wavelengthColour } from '../../lib/sky';

export function initWaves(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-waves-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-waves-range]');
  const swatch = q<HTMLElement>(tool, '[data-waves-swatch]');
  const status = q<HTMLElement>(tool, '[data-waves-status]');

  function draw() {
    const nm = Number(range.value);
    fillRange(range);
    q(tool!, '[data-waves-out]').textContent = `${nm} nm`;
    swatch.style.background = rgb(wavelengthColour(nm));
    status.textContent = `${nm} nm is ${colourName(nm)} light. Air scatters it ${scatterVsRed(nm).toFixed(1)} times more strongly than red light at 700 nm.`;
  }
  range.addEventListener('input', draw);
  draw();
}
