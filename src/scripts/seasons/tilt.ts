// Instrument 2: day length through the year for any tilt and any latitude.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { TILT, dayLength, declination, hm } from './sun';

export const latName = (lat: number) => (lat === 0 ? '0° (the equator)' : `${Math.abs(lat)}° ${lat > 0 ? 'N' : 'S'}`);

export function initTilt(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-tilt-tool]');
  if (!tool) return;
  const x0 = Number(tool.dataset.x0);
  const x1 = Number(tool.dataset.x1);
  const y0 = Number(tool.dataset.y0);
  const y1 = Number(tool.dataset.y1);
  const tilt = q<HTMLInputElement>(tool, '[data-tilt-range]');
  const lat = q<HTMLInputElement>(tool, '[data-tilt-lat]');
  const tiltOut = q<HTMLOutputElement>(tool, '[data-tilt-out]');
  const latOut = q<HTMLOutputElement>(tool, '[data-tilt-lat-out]');
  const status = q<HTMLElement>(tool, '[data-tilt-status]');
  const line = q<SVGPathElement>(tool, '[data-tilt-line]');
  const real = q<SVGPathElement>(tool, '[data-tilt-real]');
  const dotHi = q<SVGCircleElement>(tool, '[data-tilt-dot-hi]');
  const dotLo = q<SVGCircleElement>(tool, '[data-tilt-dot-lo]');

  const px = (day: number) => x0 + ((x1 - x0) * (day - 1)) / 364;
  const py = (h: number) => y1 - ((y1 - y0) * h) / 24;
  const path = (t: number, la: number) => {
    let d = '';
    for (let i = 0; i <= 182; i++) {
      const day = 1 + i * 2;
      d += `${i ? 'L' : 'M'}${px(day).toFixed(1)} ${py(dayLength(la, declination(day, t))).toFixed(1)}`;
    }
    return d;
  };

  function update(quiet = false) {
    const t = Number(tilt.value);
    const la = Number(lat.value);
    fillRange(tilt);
    fillRange(lat);
    tiltOut.textContent = `${t}°`;
    latOut.textContent = latName(la);
    line.setAttribute('d', path(t, la));
    real.setAttribute('d', path(TILT, la));
    real.style.opacity = Math.abs(t - TILT) < 0.3 ? '0' : '';

    // The longest and the shortest day of the year at this tilt and place
    let hi = 0;
    let lo = 24;
    let hiDay = 1;
    let loDay = 1;
    for (let day = 1; day <= 365; day++) {
      const h = dayLength(la, declination(day, t));
      if (h > hi) [hi, hiDay] = [h, day];
      if (h < lo) [lo, loDay] = [h, day];
    }
    dotHi.setAttribute('cx', String(px(hiDay)));
    dotHi.setAttribute('cy', String(py(hi)));
    dotLo.setAttribute('cx', String(px(loDay)));
    dotLo.setAttribute('cy', String(py(lo)));

    const place = `at ${latName(la)}`;
    if (t === 0) status.textContent = `With no tilt, every day is about 12 hours long ${place}. There are no seasons.`;
    else if (hi - lo < 0.2) status.textContent = `With a tilt of ${t}°, the days stay about ${hm(hi)} long ${place}.`;
    else
      status.textContent =
        `With a tilt of ${t}°, ${place} the longest day is ${hi >= 24 ? '24 hours (the Sun does not set)' : hm(hi)} and the shortest is ${lo <= 0 ? '0 hours (the Sun does not rise)' : hm(lo)}.` +
        (Math.abs(t - TILT) < 0.3 && Math.abs(la - 52.4) < 0.3 ? ' This is Amsterdam.' : '');
    if (!quiet) sound.play('tick');
  }

  tilt.addEventListener('input', () => update());
  lat.addEventListener('input', () => update());
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-tilt-jump]')) {
    b.addEventListener('click', () => {
      tilt.value = b.dataset.tiltJump!;
      update();
      sound.play('pop');
    });
  }
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-tilt-place]')) {
    b.addEventListener('click', () => {
      lat.value = b.dataset.tiltPlace!;
      update();
      sound.play('pop');
    });
  }
  update(true);
}
