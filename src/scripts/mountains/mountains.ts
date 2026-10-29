// The mountains page: four trays. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { CRUST_KM, floatSvg, fmt, foldSvg, kindSvg, KINDS, KM_PER_MYR_AT_1CM, raceSvg, rise, rootOf, thickerBy } from '../../lib/mountains';

const root = document.querySelector<HTMLElement>('[data-mountains]');

if (root) {
  initSoundButton(root);

  // Tray 1: squeeze the layers
  const fo = root.querySelector<HTMLElement>('[data-fold-tool]');
  if (fo) {
    const range = q<HTMLInputElement>(fo, '[data-fold-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(fo, '[data-fold-out]').textContent = String(p);
      q(fo, '[data-fold-g]').innerHTML = foldSvg(p / 100);
      q(fo, '[data-fold-status]').textContent = p === 0 ? 'No squeeze. The layers are flat and the stack is as thick as it started.' : `Squeezed by ${p}%, the stack has ${100 - p}% of its width, so with the same volume it is ${fmt(thickerBy(p / 100), 2)} times as thick.`;
    };
    range.addEventListener('input', draw);
    range.addEventListener('change', () => sound.play('scrape', 0.3));
    draw();
  }

  // Tray 2: a mountain floats
  const fl = root.querySelector<HTMLElement>('[data-float-tool]');
  if (fl) {
    const range = q<HTMLInputElement>(fl, '[data-float-range]');
    const draw = () => {
      fillRange(range);
      const h = Number(range.value) / 10;
      q(fl, '[data-float-out]').textContent = h.toFixed(1);
      q(fl, '[data-float-g]').innerHTML = floatSvg(h);
      const r = rootOf(h);
      q(fl, '[data-float-status]').textContent = h === 0 ? `No mountain. The crust is ${CRUST_KM} km thick in this toy.` : `A mountain ${h.toFixed(1)} km high has a root ${fmt(r, 1)} km deep in this model, so the crust under it is ${fmt(CRUST_KM + r + h, 1)} km thick.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Tray 3: lifting against wearing away
  const ra = root.querySelector<HTMLElement>('[data-race-tool]');
  if (ra) {
    const u = q<HTMLInputElement>(ra, '[data-race-u]');
    const e = q<HTMLInputElement>(ra, '[data-race-e]');
    const t = q<HTMLInputElement>(ra, '[data-race-t]');
    const draw = () => {
      [u, e, t].forEach(fillRange);
      const up = Number(u.value);
      const er = Number(e.value);
      const myr = Number(t.value) / 10;
      q(ra, '[data-race-outu]').textContent = String(up);
      q(ra, '[data-race-oute]').textContent = String(er);
      q(ra, '[data-race-outt]').textContent = myr.toFixed(1);
      q(ra, '[data-race-g]').innerHTML = raceSvg(up, er, myr);
      const net = up - er;
      q(ra, '[data-race-status]').textContent = `After ${myr.toFixed(1)} million years the peak is ${fmt(rise(up, er, myr), 1)} km higher, at a net rate of ${Math.max(0, net)} mm a year.${net < 0 ? ' Wearing away is faster than lifting, so the mountain shrinks and the drawing stops at zero.' : ''} ${rise(up, er, myr) > 8.849 ? ' That is higher than Everest, so in the real world the rates must change: they are not fixed.' : ''} A plate at 5 cm a year would have moved ${fmt(5 * KM_PER_MYR_AT_1CM * myr)} km.`;
    };
    [u, e, t].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Tray 4: three kinds
  const ki = root.querySelector<HTMLElement>('[data-kinds-tool]');
  if (ki) {
    const picks = ki.querySelectorAll<HTMLElement>('[data-kinds-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const k = Number(b.getAttribute('data-kinds-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(ki, '[data-kinds-g]').innerHTML = kindSvg(k);
        q(ki, '[data-kinds-svg]').setAttribute('aria-label', `A cross section of a ${KINDS[k].name.toLowerCase().replace('mountains', 'mountain')}.`);
        q(ki, '[data-kinds-status]').textContent = `${KINDS[k].name}, such as ${KINDS[k].example}. ${KINDS[k].how}`;
        sound.play('tick', 0.35);
      }),
    );
  }
}
