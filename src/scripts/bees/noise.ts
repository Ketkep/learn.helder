// Look 4: many runs. Each dot is what one run suggests and the ring is their average.

import { fillRange, q } from '../util';
import { average, danceAngle, mapPoint, noisyRuns, runSeconds, typicalError } from '../../lib/bees';
import { draw } from './draw';

export function initNoise(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-noise-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-noise-range]');
  const status = q<HTMLElement>(tool, '[data-noise-status]');
  const [bearing, km, sun] = [120, 2, 180];
  const truth = mapPoint(bearing, km);
  const all = noisyRuns(bearing, km, 30);

  function refresh() {
    const n = Number(range.value);
    fillRange(range);
    q(tool!, '[data-noise-out]').textContent = String(n);
    const avg = average(all.slice(0, n), truth);
    const extra = avg.pts.map((p) => `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="3.5"/>`).join('') + `<circle class="avg" cx="${avg.point[0]}" cy="${avg.point[1]}" r="9"/>`;
    draw(tool!, { angle: danceAngle(bearing, sun), seconds: runSeconds(km), sun, bearing, km, extra });
    status.textContent = `After ${n} run${n === 1 ? '' : 's'} the average is ${avg.error.toFixed(2)} km from the flowers in this sample. Over many tries the typical error with ${n} run${n === 1 ? '' : 's'} is about ${typicalError(bearing, km, n).toFixed(2)} km.${n > 1 ? ` With 1 run it is about ${typicalError(bearing, km, 1).toFixed(2)} km.` : ''}`;
  }
  range.addEventListener('input', refresh);
  refresh();
}
