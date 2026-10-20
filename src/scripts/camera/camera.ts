// The camera page: four shots. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { apertureSvg, bestHole, exposureStops, exposureSvg, fmtBytes, isos, lightAt, pinholeBlur, pinholeLight, pinholeSvg, pixelsSvg, rawBytes, shutters, sides, stops, verdict } from '../../lib/camera';

const root = document.querySelector<HTMLElement>('[data-camera]');

if (root) {
  // Shot 1: a pinhole
  const pin = root.querySelector<HTMLElement>('[data-pinhole-tool]');
  if (pin) {
    const range = q<HTMLInputElement>(pin, '[data-pinhole-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(pin, '[data-pinhole-out]').textContent = `${d.toFixed(2)} mm`;
      q(pin, '[data-pinhole-g]').innerHTML = pinholeSvg(d);
      q(pin, '[data-pinhole-status]').textContent = `A hole of ${d.toFixed(2)} mm lets in ${pinholeLight(d).toFixed(2)} times the light of a 1 mm hole, and blurs the picture over about ${pinholeBlur(d).toFixed(1)} mm. In this toy box the sharpest picture comes from a hole of about ${bestHole().toFixed(2)} mm.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Shot 2: the f-number
  const ap = root.querySelector<HTMLElement>('[data-aperture-tool]');
  if (ap) {
    const picks = ap.querySelectorAll<HTMLElement>('[data-aperture-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const n = Number(b.getAttribute('data-aperture-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(ap, '[data-aperture-g]').innerHTML = apertureSvg(n);
        q(ap, '[data-aperture-status]').textContent = `At f/${n} the opening lets in ${lightAt(n).toFixed(2)} times the light of f/1.4. ${n <= 2.8 ? 'A wide opening blurs the background more.' : 'A small opening keeps more of the scene sharp.'}`;
        sound.play('tick', 0.3);
      }),
    );
  }

  // Shot 3: balance the light
  const ex = root.querySelector<HTMLElement>('[data-exposure-tool]');
  if (ex) {
    const [a, s, i] = ['a', 's', 'i'].map((k) => q<HTMLInputElement>(ex, `[data-exposure-${k}]`));
    let was = '';
    const draw = () => {
      [a, s, i].forEach(fillRange);
      const [n, den, iso] = [stops[Number(a.value)], shutters[Number(s.value)], isos[Number(i.value)]];
      q(ex, '[data-exposure-a-out]').textContent = `f/${n}`;
      q(ex, '[data-exposure-s-out]').textContent = `1/${den} s`;
      q(ex, '[data-exposure-i-out]').textContent = String(iso);
      q(ex, '[data-exposure-g]').innerHTML = exposureSvg(n, den, iso);
      const v = verdict(exposureStops(n, den, iso));
      q(ex, '[data-exposure-status]').textContent = `f/${n}, 1/${den} s and ISO ${iso}: the picture is ${v}. This toy scene needs f/4, 1/250 s and ISO 100.`;
      if (v === 'about right' && was !== v) sound.play('good', 0.4);
      was = v;
    };
    [a, s, i].forEach((el) => el.addEventListener('input', draw));
    draw();
  }

  // Shot 4: pixels
  const px = root.querySelector<HTMLElement>('[data-pixels-tool]');
  if (px) {
    const range = q<HTMLInputElement>(px, '[data-pixels-range]');
    const draw = () => {
      fillRange(range);
      const side = sides[Number(range.value) - 1];
      q(px, '[data-pixels-out]').textContent = String(side);
      q(px, '[data-pixels-g]').innerHTML = pixelsSvg(side);
      q(px, '[data-pixels-status]').textContent = `${side} by ${side} is ${side * side} pixels. Each is three numbers, so the list has ${side * side * 3} numbers. A phone photo of 4,000 by 3,000 pixels has ${(4000 * 3000).toLocaleString('en-US')} pixels and, kept this way, takes ${fmtBytes(rawBytes(4000, 3000))}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
