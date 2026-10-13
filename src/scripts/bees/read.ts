// Look 1: read a dance.

import { fillRange, q } from '../util';
import { compass, flowerBearing, fmtAngle, runKm } from '../../lib/bees';
import { draw } from './draw';

export function initRead(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-read-tool]');
  if (!tool) return;
  const sunSel = q<HTMLSelectElement>(tool, '[data-read-sun]');
  const angleIn = q<HTMLInputElement>(tool, '[data-read-angle]');
  const secIn = q<HTMLInputElement>(tool, '[data-read-sec]');
  const status = q<HTMLElement>(tool, '[data-read-status]');
  const sunName: Record<string, string> = { '90': 'east', '180': 'south', '270': 'west' };

  function refresh() {
    const [angle, sec, sun] = [Number(angleIn.value), Number(secIn.value), Number(sunSel.value)];
    fillRange(angleIn);
    fillRange(secIn);
    q(tool!, '[data-read-angle-out]').textContent = angle === 0 ? 'straight up' : `${Math.abs(angle)} degrees ${angle > 0 ? 'right' : 'left'}`;
    q(tool!, '[data-read-sec-out]').textContent = `${sec.toFixed(1)} seconds`;
    const bearing = flowerBearing(angle, sun);
    const km = runKm(sec);
    draw(tool!, { angle, seconds: sec, sun, bearing, km });
    status.textContent = `The run points ${fmtAngle(angle)} and lasts ${sec.toFixed(1)} seconds. The sun is in the ${sunName[sunSel.value]}, so the flowers lie to the ${compass(bearing)} of the hive (${Math.round(bearing)} degrees from north), about ${km.toFixed(1)} km away.`;
  }
  for (const el of [angleIn, secIn]) el.addEventListener('input', refresh);
  sunSel.addEventListener('change', refresh);
  refresh();
}
