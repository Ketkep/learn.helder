// Puts new path data into a globe and map pair.

import type { Layers } from '../../lib/maplayers';
import { q } from '../util';

export function draw(twin: HTMLElement, layers: Layers, projectionName: string) {
  q<SVGElement>(twin, '[data-flat]').setAttribute('viewBox', `0 0 ${layers.w} ${layers.h}`);
  for (const key of Object.keys(layers.flat) as (keyof Layers['flat'])[]) q(twin, `[data-f="${key}"]`).setAttribute('d', layers.flat[key]);
  for (const key of Object.keys(layers.globe) as (keyof Layers['globe'])[]) q(twin, `[data-g="${key}"]`).setAttribute('d', layers.globe[key]);
  q(twin, '[data-flat-caption]').textContent = `The map: a copy (${projectionName})`;
}
