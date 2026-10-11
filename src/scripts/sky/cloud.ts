// Window 4: white clouds. The colour of the light scattered by particles of different sizes.

import { fillRange, q } from '../util';
import { exponent, rgb, scatterColour } from '../../lib/sky';

export function initCloud(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-cloud-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-cloud-range]');
  const swatch = q<HTMLElement>(tool, '[data-cloud-swatch]');
  const status = q<HTMLElement>(tool, '[data-cloud-status]');

  function draw() {
    // The slider covers 0.001 to 10 micrometres on a log scale
    const r = 10 ** (-3 + (Number(range.value) / 100) * 4);
    fillRange(range);
    const label = r < 0.01 ? r.toFixed(3) : r < 0.1 ? r.toFixed(2) : r < 1 ? r.toFixed(2) : r.toFixed(1);
    q(tool!, '[data-cloud-out]').textContent = `${label} micrometres`;
    swatch.style.background = rgb(scatterColour(r));
    const n = exponent(r);
    const what = n > 3.5 ? 'About the size of a gas molecule: short waves are scattered far more than long ones, so the light is blue.' : n > 1 ? 'Smoke or haze: the particles are bigger, so the blue is weaker and the light turns pale.' : n > 0.05 ? 'Mist: nearly all colours are scattered about equally, so the light is almost white.' : 'About the size of a cloud drop: every colour is scattered about equally, so the light is white.';
    status.textContent = `Radius ${label} micrometres. ${what} (The colour drops with the wavelength to the power ${n.toFixed(1)}.)`;
  }
  range.addEventListener('input', draw);
  draw();
}
