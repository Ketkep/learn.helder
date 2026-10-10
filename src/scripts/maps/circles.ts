// Look 1: the same circle at 30 places, on the globe and on the chosen map.

import { q } from '../util';
import { circlesLayers } from '../../lib/maplayers';
import { getProjection, sizeFactor } from '../../lib/projections';
import { draw } from './draw';
import { getId, getName, watch } from './state';

export function initCircles(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-circles-tool]');
  if (!tool) return;
  const twin = q<HTMLElement>(tool, '.twin');
  const status = q<HTMLElement>(tool, '[data-circles-status]');

  const nature: Record<string, string> = {
    mercator: 'Every circle stays round, so small shapes and compass directions are right, but the circles grow towards the poles.',
    plate: 'The circles are stretched sideways towards the poles, so both shapes and sizes go wrong.',
    cea: 'Every circle has the same area, but the circles near the poles are flattened into thin ovals and the ones at the equator are stretched upwards.',
    sinusoidal: 'Every circle has the same area, but away from the middle they are leaned over into slanted ovals.',
    mollweide: 'Every circle has the same area, but they are bent into ovals near the edges.',
    equalearth: 'Every circle has the same area and the ovals are mild, which is why this map looks more natural.',
  };

  function refresh() {
    const proj = getProjection(getId());
    draw(twin, circlesLayers(proj.id), proj.name);
    const [a, b] = [sizeFactor(proj, 30), sizeFactor(proj, 60)];
    status.textContent = `${getName()}: ${nature[proj.id]} A circle at 30 degrees looks ${a.toFixed(1)} times as big as the same circle on the equator, and one at 60 degrees looks ${b.toFixed(1)} times as big.`;
  }
  watch(refresh);
  refresh();
}
