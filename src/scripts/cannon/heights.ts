// Fire 3: speed and lap time at four heights.

import { q } from '../util';
import { circularSpeed, fmtTime, getPlanet, period, places } from '../../lib/orbit';

const EARTH = getPlanet('earth');

export function initHeights(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-heights-tool]');
  if (!tool) return;
  const ring = q(tool, '[data-heights-ring]');
  const dot = q(tool, '[data-heights-dot]');
  const status = q<HTMLElement>(tool, '[data-heights-status]');
  const picks = [...tool.querySelectorAll<HTMLButtonElement>('[data-heights-pick]')];

  function pick(id: string) {
    const place = places.find((p) => p.id === id)!;
    const r = EARTH.r + place.height;
    // The distances run from the ground to the Moon, so the rings are drawn on a log scale
    const radius = 40 + (38 * Math.log10(r / EARTH.r)) / Math.log10(60.3);
    ring.setAttribute('r', String(radius + 0.001));
    dot.setAttribute('cy', String(150 - radius));
    for (const b of picks) b.setAttribute('aria-pressed', String(b.dataset.heightsPick === id));
    status.textContent = `${place.name}, ${Math.round(place.height).toLocaleString('en-US')} km up: a circular orbit needs ${circularSpeed(EARTH, r).toFixed(2)} km/s, and one lap takes ${fmtTime(period(EARTH, r))}. The ring is drawn on a squeezed scale so all four fit.`;
  }
  for (const b of picks) b.addEventListener('click', () => pick(b.dataset.heightsPick!));
}
