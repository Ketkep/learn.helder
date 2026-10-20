// The rainbow page: four drops. This file starts each one.

import { fillRange, q } from '../util';
import { bowAngle, curveSvg, deviation, dropSvg, indexOf, skySvg } from '../../lib/rainbow';

const root = document.querySelector<HTMLElement>('[data-bow]');

if (root) {
  // Drop 1: one ray
  const drop = root.querySelector<HTMLElement>('[data-drop-tool]');
  if (drop) {
    const range = q<HTMLInputElement>(drop, '[data-drop-range]');
    const n = indexOf(589);
    const draw = () => {
      fillRange(range);
      const b = Number(range.value) / 100;
      q(drop, '[data-drop-out]').textContent = `${range.value}%`;
      q(drop, '[data-drop-g]').innerHTML = dropSvg(b, n, 1);
      q(drop, '[data-drop-curve]').innerHTML = curveSvg(b, n);
      q(drop, '[data-drop-status]').textContent = `A ray that hits ${range.value} per cent of the way to the edge turns by ${deviation(b, n, 1).toFixed(1)} degrees. The smallest possible turn is about 138 degrees, so the bow is at about 180 minus 138, which is 42 degrees.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Drop 2: the colours
  const col = root.querySelector<HTMLElement>('[data-colours-tool]');
  if (col) {
    const range = q<HTMLInputElement>(col, '[data-colours-range]');
    const draw = () => {
      fillRange(range);
      const nm = Number(range.value);
      q(col, '[data-colours-out]').textContent = `${nm} nm`;
      q(col, '[data-colours-status]').textContent = `Light of ${nm} nm is bent by a factor of ${indexOf(nm).toFixed(4)} in water, so its bow stands ${bowAngle(indexOf(nm), 1).toFixed(1)} degrees from the point opposite the Sun. Red, at 700 nm, stands at ${bowAngle(indexOf(700), 1).toFixed(1)} and violet, at 400 nm, at ${bowAngle(indexOf(400), 1).toFixed(1)}. The longer the wavelength, the further out the bow.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Drop 3: the sky
  const sky = root.querySelector<HTMLElement>('[data-sky-tool]');
  if (sky) {
    const range = q<HTMLInputElement>(sky, '[data-sky-range]');
    const draw = () => {
      fillRange(range);
      const alt = Number(range.value);
      q(sky, '[data-sky-out]').textContent = `${alt} degrees`;
      q(sky, '[data-sky-g]').innerHTML = skySvg(alt, false);
      const top = bowAngle(indexOf(700), 1) - alt;
      q(sky, '[data-sky-status]').textContent = top > 0
        ? `With the Sun ${alt} degrees above the horizon, the top of the bow is about ${top.toFixed(0)} degrees above the horizon. The bands are drawn wider than they are.`
        : `With the Sun ${alt} degrees above the horizon, the whole bow is below the horizon. You cannot see it from the ground.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Drop 4: the second bow
  const second = root.querySelector<HTMLElement>('[data-second-tool]');
  if (second) {
    const picks = second.querySelectorAll<HTMLElement>('[data-second-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const k = Number(b.getAttribute('data-second-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(second, '[data-second-g]').innerHTML = dropSvg(k === 1 ? 0.86 : 0.93, indexOf(589), k);
        q(second, '[data-second-status]').textContent = k === 1
          ? `One bounce: the first bow, from ${bowAngle(indexOf(400), 1).toFixed(1)} degrees for violet to ${bowAngle(indexOf(700), 1).toFixed(1)} degrees for red, with red on the outside.`
          : `Two bounces: the second bow, from ${bowAngle(indexOf(700), 2).toFixed(1)} degrees for red to ${bowAngle(indexOf(400), 2).toFixed(1)} degrees for violet, with red on the inside. It is fainter, and the strip between the two bows is darker.`;
      }),
    );
  }
}
