// Redraws the comb and the garden map of a pair.

import { combSvg, gardenSvg, mapPoint } from '../../lib/bees';
import { q } from '../util';

export function draw(tool: HTMLElement, o: { angle: number; seconds: number; sun: number; bearing: number; km: number; extra?: string }) {
  q(tool, '[data-comb-g]').innerHTML = combSvg(o.angle, o.seconds);
  q(tool, '[data-garden-g]').innerHTML = gardenSvg(o.sun, mapPoint(o.bearing, o.km), o.extra ?? '');
}
