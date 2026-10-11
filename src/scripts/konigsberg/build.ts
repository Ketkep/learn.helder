// Try 3: build and remove bridges. The town is shared with the last panel, which finds a walk in it.

import * as sound from '../sound';
import { q } from '../util';
import { bridges, degrees, lands, oddLands, oldIds, connected } from '../../lib/konigsberg';
import { bridgeEl, bridgeName, landTag, pressable, toggle } from './map';

let town: number[] = [...oldIds];
const listeners: (() => void)[] = [];

export const getTown = () => town;
export const onTown = (fn: () => void) => listeners.push(fn);
const set = (ids: number[]) => {
  town = ids;
  for (const fn of listeners) fn();
};

/** Draws the town in a map: bridges that exist are solid, the others faint, and the odd lands are marked. */
export function paintTown(svg: Element) {
  const deg = degrees(town);
  for (const b of bridges) toggle(bridgeEl(svg, b.id), 'off', !town.includes(b.id));
  for (const l of lands) {
    toggle(landTag(svg, l), 'odd', deg[l] % 2 === 1);
    const c = svg.querySelector(`[data-count="${l}"]`);
    if (c) c.textContent = String(deg[l]);
  }
}

const list = (ls: string[]) => (ls.length <= 1 ? ls.join('') : `${ls.slice(0, -1).join(', ')} and ${ls[ls.length - 1]}`);

export function describe(ids: number[]): string {
  const odd = oddLands(ids);
  if (ids.length === 0) return 'There are no bridges to cross.';
  if (!connected(ids)) return 'The bridges are not all joined up: some of them cannot be reached from the others, so no single walk can cover them all.';
  if (odd.length === 0) return 'Every land has an even number of bridges, so there is a walk over every bridge. It can start anywhere and ends where it began.';
  if (odd.length === 2) return `Two lands, ${list(odd)}, have an odd number of bridges, so there is a walk over every bridge. It has to start at one of them and end at the other.`;
  return `${odd.length} lands (${list(odd)}) have an odd number of bridges. A walk over every bridge needs 0 or 2, so there is no such walk.`;
}

export function initBuild(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-build-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-town]');
  const status = q<HTMLElement>(tool, '[data-build-status]');
  let note = '';

  function refresh() {
    paintTown(svg);
    status.textContent = `${note}${town.length} bridge${town.length === 1 ? '' : 's'}. ${describe(town)}`;
    note = '';
  }
  onTown(refresh);

  for (const b of bridges) {
    pressable(bridgeEl(svg, b.id), `${bridgeName(b.id)}: build or remove`, () => {
      const on = town.includes(b.id);
      note = `${on ? 'Removed' : 'Built'} bridge ${b.id}. `;
      sound.play(on ? 'pop' : 'tick', 0.4);
      set(on ? town.filter((i) => i !== b.id) : [...town, b.id].sort((x, y) => x - y));
    });
  }
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-build-set]')) {
    b.addEventListener('click', () => {
      note = b.dataset.buildSet === 'old' ? 'Back to the old seven. ' : 'All bridges removed. ';
      set(b.dataset.buildSet === 'old' ? [...oldIds] : []);
    });
  }
  paintTown(svg);
}
