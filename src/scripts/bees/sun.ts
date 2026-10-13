// Look 3: the sun moves through the day and the dance changes with it.

import { fillRange, q } from '../util';
import { danceAngle, fmtAngle, sunBearing, compass } from '../../lib/bees';
import { draw } from './draw';

export function initSun(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-sun-tool]');
  if (!tool) return;
  const hIn = q<HTMLInputElement>(tool, '[data-sun-h]');
  const status = q<HTMLElement>(tool, '[data-sun-status]');
  const bearing = 100;
  const km = 1.5;

  function refresh() {
    const h = Number(hIn.value);
    fillRange(hIn);
    const clock = `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;
    q(tool!, '[data-sun-h-out]').textContent = clock;
    const sun = sunBearing(h);
    const angle = danceAngle(bearing, sun);
    draw(tool!, { angle, seconds: km, sun, bearing, km });
    status.textContent = `At ${clock} the sun is in the ${compass(sun)} (${Math.round(sun)} degrees). The flowers stay at ${bearing} degrees from north, so the bee waggles ${fmtAngle(angle)}.`;
  }
  hIn.addEventListener('input', refresh);
  refresh();
}
