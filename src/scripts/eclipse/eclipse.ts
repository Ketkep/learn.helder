// The eclipse page: three parts. This file starts each one.

import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { LIMIT, MOON_KM, SUN_KM, TILT, arcmin, discsSvg, fmt, height, kind, shadowSvg, share, tiltSvg, umbra } from '../../lib/eclipse';

const root = document.querySelector<HTMLElement>('[data-eclipse]');

if (root) {
  initSoundButton(root);

  // Part 1: the same size in the sky
  const si = root.querySelector<HTMLElement>('[data-sizes-tool]');
  if (si) {
    const m = q<HTMLInputElement>(si, '[data-sizes-m]');
    const s = q<HTMLInputElement>(si, '[data-sizes-s]');
    const draw = () => {
      [m, s].forEach(fillRange);
      const dm = Number(m.value);
      const ds = Number(s.value) * 1e6;
      q(si, '[data-sizes-m-out]').textContent = fmt(dm);
      q(si, '[data-sizes-s-out]').textContent = fmt(Number(s.value), 1);
      q(si, '[data-sizes-g]').innerHTML = discsSvg(dm, ds);
      const k = kind(dm, ds);
      q(si, '[data-sizes-status]').textContent = `The Moon looks ${fmt(arcmin(MOON_KM, dm), 1)} arcminutes wide and the Sun ${fmt(arcmin(SUN_KM, ds), 1)}, so ${k === 'total' ? 'the Moon covers the Sun: a total eclipse.' : 'the Moon is too small and leaves a ring of Sun: an annular eclipse.'}`;
    };
    [m, s].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Part 2: a shadow that only just reaches
  const sh = root.querySelector<HTMLElement>('[data-shadow-tool]');
  if (sh) {
    const m = q<HTMLInputElement>(sh, '[data-shadow-m]');
    const s = q<HTMLInputElement>(sh, '[data-shadow-s]');
    const draw = () => {
      [m, s].forEach(fillRange);
      const dm = Number(m.value);
      const ds = Number(s.value) * 1e6;
      q(sh, '[data-shadow-m-out]').textContent = fmt(dm);
      q(sh, '[data-shadow-s-out]').textContent = fmt(Number(s.value), 1);
      q(sh, '[data-shadow-g]').innerHTML = shadowSvg(dm, ds);
      const L = umbra(ds);
      q(sh, '[data-shadow-status]').textContent = `The shadow is ${fmt(L)} kilometres long and the Moon is ${fmt(dm)} kilometres away, so the tip ${L >= dm ? 'reaches the Earth and people in it see a total eclipse.' : `falls ${fmt(dm - L)} kilometres short of the Earth.`}`;
    };
    [m, s].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Part 3: why not every month
  const ti = root.querySelector<HTMLElement>('[data-tilt-tool]');
  if (ti) {
    const range = q<HTMLInputElement>(ti, '[data-tilt-range]');
    const draw = () => {
      fillRange(range);
      const a = Number(range.value);
      q(ti, '[data-tilt-out]').textContent = String(a);
      q(ti, '[data-tilt-g]').innerHTML = tiltSvg(a);
      const h = height(a);
      q(ti, '[data-tilt-status]').textContent = `${a} degrees from a node the Moon is ${fmt(Math.abs(h), 2)} degrees ${h >= 0 ? 'above' : 'below'} the Sun at new moon. With a tilt of ${TILT} degrees and a limit of ${LIMIT} degrees, ${Math.abs(h) <= LIMIT ? 'it is close enough to cross the Sun.' : 'it misses the Sun.'} About ${fmt(share * 100)}% of new moons are close enough.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
