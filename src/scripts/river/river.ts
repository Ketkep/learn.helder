// The river page: four stops. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { chartSvg, COURSE_TEXT, courseOf, deltaSvg, fmt, grainName, height, liftSpeed, meanderSvg, profileSvg, settleSpeed, shapeOf, SHAPE_TEXT, sinuosity, sinuosityClass, sizeFromSlider, slope, ZONE_TEXT, zoneOf, type Shape } from '../../lib/river';

const root = document.querySelector<HTMLElement>('[data-river]');

if (root) {
  initSoundButton(root);

  // Stop 1: the long profile
  const pr = root.querySelector<HTMLElement>('[data-profile-tool]');
  if (pr) {
    const range = q<HTMLInputElement>(pr, '[data-profile-range]');
    const draw = () => {
      fillRange(range);
      const km = Number(range.value);
      const x = km / 500;
      q(pr, '[data-profile-out]').textContent = String(km);
      q(pr, '[data-profile-g]').innerHTML = profileSvg(x);
      q(pr, '[data-profile-status]').textContent = `At ${km} km the river is ${fmt(height(x))} m above the sea and falls ${fmt(slope(x), 1)} m for every km. ${COURSE_TEXT[courseOf(x)]}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stop 2: grains and speed
  const gr = root.querySelector<HTMLElement>('[data-grains-tool]');
  if (gr) {
    const grain = q<HTMLInputElement>(gr, '[data-grains-grain]');
    const speed = q<HTMLInputElement>(gr, '[data-grains-v]');
    let last = '';
    const draw = () => {
      fillRange(grain);
      fillRange(speed);
      const mm = sizeFromSlider(Number(grain.value));
      const v = Number(speed.value);
      const shown = mm >= 10 ? fmt(mm) : mm >= 1 ? mm.toFixed(1) : mm >= 0.01 ? mm.toFixed(2) : mm.toFixed(3);
      q(gr, '[data-grains-size]').textContent = shown;
      q(gr, '[data-grains-speed]').textContent = String(v);
      q(gr, '[data-grains-g]').innerHTML = chartSvg(mm, v);
      const z = zoneOf(mm, v);
      q(gr, '[data-grains-status]').textContent = `Grains of ${shown} mm are ${grainName(mm)}. The toy needs ${fmt(liftSpeed(mm))} cm/s to lift them and holds them down to ${settleSpeed(mm).toFixed(1)} cm/s. At ${v} cm/s: ${ZONE_TEXT[z]}`;
      if (z !== last) sound.play('tick', 0.25);
      last = z;
    };
    grain.addEventListener('input', draw);
    speed.addEventListener('input', draw);
    draw();
  }

  // Stop 3: a river that bends
  const be = root.querySelector<HTMLElement>('[data-bend-tool]');
  if (be) {
    const range = q<HTMLInputElement>(be, '[data-bend-range]');
    const draw = () => {
      fillRange(range);
      const amp = Number(range.value);
      q(be, '[data-bend-out]').textContent = String(amp);
      q(be, '[data-bend-g]').innerHTML = meanderSvg(amp);
      const si = sinuosity(amp);
      q(be, '[data-bend-status]').textContent = amp === 0
        ? 'A straight channel. The channel is as long as the valley, a sinuosity of 1.00.'
        : `The channel is ${si.toFixed(2)} times as long as the valley. A sinuosity of ${si.toFixed(2)} is called ${sinuosityClass(si)} in one common scheme.${amp > 4 ? ' The marks show the outer banks, where the water is fastest and eats the land.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stop 4: a delta
  const de = root.querySelector<HTMLElement>('[data-delta-tool]');
  if (de) {
    const keys = ['river', 'waves', 'tides'] as const;
    const inputs = keys.map((k) => q<HTMLInputElement>(de, `[data-delta-${k}]`));
    let shape: Shape = 'river';
    const draw = () => {
      inputs.forEach(fillRange);
      const [r, w, t] = inputs.map((i) => Number(i.value));
      keys.forEach((k, i) => (q(de, `[data-delta-out-${k}]`).textContent = inputs[i].value));
      const next = shapeOf(r, w, t);
      q(de, '[data-delta-g]').innerHTML = deltaSvg(next);
      const tie = [r, w, t].filter((v) => v === Math.max(r, w, t)).length > 1;
      q(de, '[data-delta-status]').textContent = `${tie ? 'Two forces are equal, so this drawing shows one of them. ' : ''}${SHAPE_TEXT[next]}`;
      if (next !== shape) sound.play('tick', 0.25);
      shape = next;
    };
    inputs.forEach((i) => i.addEventListener('input', draw));
    draw();
  }
}
