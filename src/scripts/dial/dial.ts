// The sundial page: three slabs. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { clock, dateOf, eot, eotSvg, fmt, lineAngle, plateSvg, readTime, sideSvg } from '../../lib/dial';

const root = document.querySelector<HTMLElement>('[data-dial]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

if (root) {
  initSoundButton(root);

  // Slab 1: the shadow over a flat dial
  const pl = root.querySelector<HTMLElement>('[data-plate-tool]');
  if (pl) {
    const hour = q<HTMLInputElement>(pl, '[data-plate-hour]');
    const lat = q<HTMLInputElement>(pl, '[data-plate-lat]');
    const draw = () => {
      [hour, lat].forEach(fillRange);
      const h = Number(hour.value);
      const l = Number(lat.value);
      q(pl, '[data-plate-hour-out]').textContent = clock(h);
      q(pl, '[data-plate-lat-out]').textContent = String(l);
      q(pl, '[data-plate-g]').innerHTML = plateSvg(l, h);
      const a = lineAngle(l, h);
      q(pl, '[data-plate-status]').textContent =
        l === 0
          ? 'At the equator the sine of the latitude is zero, so every hour line falls on the noon line, and a flat dial cannot tell the time.'
          : Math.abs(a) < 0.05
            ? `At ${clock(h)} and ${l} degrees of latitude the shadow lies on the noon line.`
            : `At ${clock(h)} and ${l} degrees of latitude the shadow lies ${fmt(Math.abs(a), 1)} degrees ${a < 0 ? 'west' : 'east'} of the noon line.`;
    };
    [hour, lat].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Slab 2: why the edge must tilt
  const ti = root.querySelector<HTMLElement>('[data-tilt-tool]');
  if (ti) {
    let lat = 52;
    const tilt = q<HTMLInputElement>(ti, '[data-tilt-range]');
    const hour = q<HTMLInputElement>(ti, '[data-tilt-hour]');
    const draw = () => {
      [tilt, hour].forEach(fillRange);
      const a = Number(tilt.value);
      const h = Number(hour.value);
      q(ti, '[data-tilt-out]').textContent = String(a);
      q(ti, '[data-tilt-hour-out]').textContent = clock(h);
      q(ti, '[data-tilt-g]').innerHTML = sideSvg(lat, a);
      const r = readTime(lat, a, h);
      const off = Math.round(Math.abs(r - h) * 60);
      q(ti, '[data-tilt-status]').textContent = `At ${lat} degrees of latitude with the edge tilted at ${a} degrees, the dial reads ${clock(r)} when the true time is ${clock(h)}. ${off === 0 ? 'It is right.' : `It is ${off} minutes off.`}`;
    };
    picks(q(ti, '[data-tilt-picks]'), ['30°', '40°', '52°', '64°'], '52°', (v) => {
      lat = Number(v.replace('°', ''));
      draw();
    });
    [tilt, hour].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Slab 3: sundial and clock
  const cl = root.querySelector<HTMLElement>('[data-clock-tool]');
  if (cl) {
    const range = q<HTMLInputElement>(cl, '[data-clock-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(cl, '[data-clock-out]').textContent = dateOf(d);
      q(cl, '[data-clock-g]').innerHTML = eotSvg(d);
      const e = eot(d);
      q(cl, '[data-clock-status]').textContent = `On ${dateOf(d)} the sundial is about ${fmt(Math.abs(e), 1)} minutes ${e >= 0 ? 'ahead of' : 'behind'} the clock.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
