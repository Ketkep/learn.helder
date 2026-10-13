// Look 2: put flowers on the map and see the dance.

import { fillRange, q } from '../util';
import { CENTRE, PX_PER_KM, compass, danceAngle, fmtAngle, runSeconds } from '../../lib/bees';
import { draw } from './draw';

export function initSend(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-send-tool]');
  if (!tool) return;
  const sunSel = q<HTMLSelectElement>(tool, '[data-send-sun]');
  const bIn = q<HTMLInputElement>(tool, '[data-send-b]');
  const dIn = q<HTMLInputElement>(tool, '[data-send-d]');
  const status = q<HTMLElement>(tool, '[data-send-status]');
  const svg = q<SVGSVGElement>(tool, '[data-garden]');
  const sunName: Record<string, string> = { '90': 'east', '180': 'south', '270': 'west' };

  function refresh() {
    const [bearing, km, sun] = [Number(bIn.value), Number(dIn.value), Number(sunSel.value)];
    fillRange(bIn);
    fillRange(dIn);
    q(tool!, '[data-send-b-out]').textContent = `${Math.round(bearing)} degrees`;
    q(tool!, '[data-send-d-out]').textContent = `${km.toFixed(1)} km`;
    const angle = danceAngle(bearing, sun);
    draw(tool!, { angle, seconds: runSeconds(km), sun, bearing, km });
    status.textContent = `Flowers ${km.toFixed(1)} km to the ${compass(bearing)}, with the sun in the ${sunName[sunSel.value]}: the bee waggles ${fmtAngle(angle)} for about ${runSeconds(km).toFixed(1)} seconds.`;
  }

  // Pressing the map puts the flowers there
  svg.addEventListener('click', (e) => {
    const box = svg.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 300 - CENTRE;
    const y = CENTRE - ((e.clientY - box.top) / box.height) * 300;
    const km = Math.min(3.5, Math.max(0.2, Math.hypot(x, y) / PX_PER_KM));
    bIn.value = String(Math.round(((Math.atan2(x, y) * 180) / Math.PI + 360) % 360) % 360);
    dIn.value = String(Math.round(km * 10) / 10);
    refresh();
  });
  for (const el of [bIn, dIn]) el.addEventListener('input', refresh);
  sunSel.addEventListener('change', refresh);
  refresh();
}
