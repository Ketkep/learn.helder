// Try 2: how many bridges touch each land.

import { q } from '../util';
import { degrees, landNames, lands, oldIds } from '../../lib/konigsberg';
import { bridgeEl, landLabel, landTag, pressable, toggle } from './map';

export function initCount(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-count-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-town]');
  const status = q<HTMLElement>(tool, '[data-count-status]');
  const deg = degrees(oldIds);

  function pick(l: (typeof lands)[number]) {
    const touching = oldIds.filter((id) => bridgeEl(svg, id).dataset.a === l || bridgeEl(svg, id).dataset.b === l);
    for (const id of oldIds) toggle(bridgeEl(svg, id), 'hot', touching.includes(id));
    for (const o of lands) toggle(landTag(svg, o), 'here', o === l);
    for (const b of tool!.querySelectorAll<HTMLButtonElement>('[data-count-pick]')) b.setAttribute('aria-pressed', String(b.dataset.countPick === l));
    status.textContent = `Land ${l}, ${landNames[l]}, has ${deg[l]} bridges: ${touching.join(', ')}. That is an ${deg[l] % 2 ? 'odd' : 'even'} number.`;
  }
  for (const l of lands) {
    pressable(q(svg, `[data-land="${l}"]`), `${landLabel(l)}: count its bridges`, () => pick(l));
    pressable(landTag(svg, l), `${landLabel(l)}: count its bridges`, () => pick(l));
  }
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-count-pick]')) b.addEventListener('click', () => pick(b.dataset.countPick as (typeof lands)[number]));
}
