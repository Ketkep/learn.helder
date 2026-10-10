// Look 2: a patch as big as Greenland, slid north, next to a patch as big as Africa.

import { fillRange, q } from '../util';
import { apparentShare, sizeLayers, AFRICA_KM2, GREENLAND_KM2 } from '../../lib/maplayers';
import { draw } from './draw';
import { getId, getName, watch } from './state';

const TRUE_SHARE = Math.round((GREENLAND_KM2 / AFRICA_KM2) * 100);

export function initSize(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-size-tool]');
  if (!tool) return;
  const twin = q<HTMLElement>(tool, '.twin');
  const range = q<HTMLInputElement>(tool, '[data-size-range]');
  const out = q<HTMLOutputElement>(tool, '[data-size-out]');
  const status = q<HTMLElement>(tool, '[data-size-status]');

  function refresh() {
    const lat = Number(range.value);
    fillRange(range);
    out.textContent = `${lat} degrees north`;
    draw(twin, sizeLayers(getId(), lat), getName());
    const share = Math.round(apparentShare(getId(), lat) * 100);
    const verdict = share > TRUE_SHARE + 3 ? `That is ${(share / TRUE_SHARE).toFixed(1)} times too big.` : 'That is about right.';
    status.textContent = `On the globe the Greenland patch is ${TRUE_SHARE} per cent of the Africa patch. On this ${getName()} map, at ${lat} degrees north, it is ${share} per cent. ${verdict}`;
  }
  range.addEventListener('input', refresh);
  watch(refresh);
  refresh();
}
