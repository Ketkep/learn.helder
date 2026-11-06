// The ocean waves page: three stretches. This file starts each one.

import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { SPAN, beachSvg, clock, deepSpeed, deepSvg, depthAt, fmt, kmh, shallowSpeed, shallowSvg, travelTime } from '../../lib/waves';

const root = document.querySelector<HTMLElement>('[data-waves]');

if (root) {
  initSoundButton(root);

  // Stretch 1: in deep water, long waves are fast
  const de = root.querySelector<HTMLElement>('[data-deep-tool]');
  if (de) {
    const range = q<HTMLInputElement>(de, '[data-deep-range]');
    const draw = () => {
      fillRange(range);
      const l = Number(range.value);
      q(de, '[data-deep-out]').textContent = String(l);
      q(de, '[data-deep-g]').innerHTML = deepSvg(l);
      const c = deepSpeed(l);
      q(de, '[data-deep-status]').textContent = `A wave ${l} metres long goes ${fmt(c, 1)} metres a second (${fmt(kmh(c))} kilometres an hour) in deep water, and takes ${fmt(l / c, 1)} seconds between crests. It would cross 1000 kilometres in ${clock(1000000 / c)}. The water must be deeper than ${fmt(l / 2)} metres for this to hold.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stretch 2: a very long wave feels the sea floor
  const sh = root.querySelector<HTMLElement>('[data-shallow-tool]');
  if (sh) {
    const range = q<HTMLInputElement>(sh, '[data-shallow-range]');
    const draw = () => {
      fillRange(range);
      const d = Math.round(4 * 10 ** Number(range.value));
      q(sh, '[data-shallow-out]').textContent = fmt(d);
      q(sh, '[data-shallow-g]').innerHTML = shallowSvg(d);
      const c = shallowSpeed(d);
      q(sh, '[data-shallow-status]').textContent = `In ${fmt(d)} metres of water a long wave goes ${fmt(c, 1)} metres a second, which is ${fmt(kmh(c))} kilometres an hour. A tsunami counts as a long wave, because its length is far more than the depth.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stretch 3: coming in to the beach
  const be = root.querySelector<HTMLElement>('[data-beach-tool]');
  if (be) {
    const range = q<HTMLInputElement>(be, '[data-beach-range]');
    const draw = () => {
      fillRange(range);
      const km = Number(range.value);
      q(be, '[data-beach-out]').textContent = String(km);
      q(be, '[data-beach-g]').innerHTML = beachSvg(km * 1000);
      const d = depthAt(km * 1000);
      q(be, '[data-beach-status]').textContent = `${km} kilometres in, the water is ${fmt(d)} metres deep and the wave goes ${fmt(kmh(shallowSpeed(d)))} kilometres an hour. It took ${clock(travelTime(km * 1000))} to get here. The whole trip to the shore takes about ${clock(travelTime(SPAN))}, against about ${clock(SPAN / shallowSpeed(4000))} at the open-sea speed.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
