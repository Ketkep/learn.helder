// Look 3: the shortest route and the constant compass bearing route between two cities.

import { q } from '../util';
import { routeLayers } from '../../lib/maplayers';
import { bearings, cities, greatCircleKm, rhumbKm } from '../../lib/projections';
import { draw } from './draw';
import { getId, getName, watch } from './state';

const round10 = (n: number) => Math.round(n / 10) * 10;
const km = (n: number) => `${round10(n).toLocaleString('en-US')} km`;

export function initRoute(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-route-tool]');
  if (!tool) return;
  const twin = q<HTMLElement>(tool, '.twin');
  const fromSel = q<HTMLSelectElement>(tool, '[data-route-from]');
  const toSel = q<HTMLSelectElement>(tool, '[data-route-to]');
  const status = q<HTMLElement>(tool, '[data-route-status]');

  function refresh() {
    const [a, b] = [cities[Number(fromSel.value)], cities[Number(toSel.value)]];
    if (a === b) {
      status.textContent = 'Pick two different cities.';
      return;
    }
    draw(twin, routeLayers(getId(), a, b), getName());
    const [gc, rh] = [greatCircleKm(a, b), rhumbKm(a, b)];
    const extra = rh - gc;
    const bear = bearings(a, b);
    const same = extra < 25;
    status.textContent = `${a.name} to ${b.name}: the shortest way is ${km(gc)}. The constant bearing route is ${km(rh)}${same ? ', which is the same, because the route runs along the equator or almost due north and south' : `, which is ${km(extra)} longer (${((extra / gc) * 100).toFixed(1)} per cent)`}. On the shortest way you set off on a bearing of ${Math.round(bear.start)} degrees and the bearing keeps changing. On the other route it stays at ${Math.round(bear.rhumb)} degrees.${Math.abs(a.lon - b.lon) > 180 ? ' This trip crosses the date line, so on a flat map the lines leave one edge and come back on the other.' : ''}`;
  }
  for (const s of [fromSel, toSel]) s.addEventListener('change', refresh);
  watch(refresh);
  refresh();
}
