// Window 2: the sun sliding down the sky.

import { fillRange, q } from '../util';
import { airMass, rgb, skyColours } from '../../lib/sky';

export function initSun(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-sun-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-sun-range]');
  const scene = q<HTMLElement>(tool, '[data-sun-scene]');
  const disc = q<HTMLElement>(tool, '[data-sun-disc]');
  const status = q<HTMLElement>(tool, '[data-sun-status]');

  function draw() {
    const e = Number(range.value);
    fillRange(range);
    q(tool!, '[data-sun-out]').textContent = `${e} degrees up`;
    const c = skyColours(e);
    scene.style.background = `linear-gradient(to top, ${rgb(c.sky.map((v, i) => v * 0.6 + c.sun[i] * 0.4))}, ${rgb(c.sky)})`;
    disc.style.background = rgb(c.sun);
    disc.style.bottom = `${22 + (e / 90) * 62}%`;
    const look = e >= 30 ? 'The sun looks pale yellow and the sky is blue.' : e >= 12 ? 'The sun looks yellow to orange.' : e >= 4 ? 'The sun looks orange and the sky overhead is getting dark.' : 'The sun looks deep red, because almost all the blue has been scattered out of its light.';
    status.textContent = `With the sun ${e} degrees up, its light crosses ${airMass(e).toFixed(1)} times as much air as straight overhead. ${look}`;
  }
  range.addEventListener('input', draw);
  draw();
}
