// Bench 4: a toy tank. Natural period = 4 x length / wave speed. The closer it is to 12.42 hours,
// the more the tide grows inside. Friction is made up, so the toy shows a clear peak.

import * as sound from '../sound';
import { clamp, fillRange, q } from '../util';
import type { Staff } from './quay';
import { MAX_AMPLIFY, amplify, naturalPeriodH } from './model';

export function initBasin(root: HTMLElement, staff: Staff) {
  const tool = root.querySelector<HTMLElement>('[data-basin-tool]');
  let rang = false; // the chime plays once each time the tank is tuned
  if (!tool) return;
  const px0 = Number(tool.dataset.px0);
  const px1 = Number(tool.dataset.px1);
  const ptop = Number(tool.dataset.ptop);
  const pbot = Number(tool.dataset.pbot);
  const length = q<HTMLInputElement>(root, '[data-basin-length]');
  const depth = q<HTMLInputElement>(root, '[data-basin-depth]');
  const lengthOut = q<HTMLOutputElement>(root, '[data-basin-length-out]');
  const depthOut = q<HTMLOutputElement>(root, '[data-basin-depth-out]');
  const status = q<HTMLElement>(root, '[data-basin-status]');
  const bed = q<SVGPathElement>(tool, '[data-basin-bed]');
  const water = q<SVGPathElement>(tool, '[data-basin-water]');
  const band = q<SVGPathElement>(tool, '[data-basin-band]');
  const cursor = q<SVGLineElement>(tool, '[data-basin-cursor]');
  const dot = q<SVGCircleElement>(tool, '[data-basin-dot]');

  const plotX = (h: number) => px0 + ((px1 - px0) * Math.log(clamp(h, 1, 48))) / Math.log(48);

  function update(quiet = false) {
    const L = Number(length.value);
    const h = Number(depth.value);
    lengthOut.textContent = `${L} km`;
    depthOut.textContent = `${h} m`;
    fillRange(length);
    fillRange(depth);

    const T0 = naturalPeriodH(L, h);
    const gain = amplify(T0);

    // The tank: the sea bed gets deeper with the depth slider, and the closed end moves out with the length slider
    const x0 = 80;
    const x1 = 140 + (L / 1500) * 640;
    const top = 150;
    const floor = top + 40 + (h / 400) * 80;
    bed.setAttribute('d', `M20 ${floor + 34}L20 ${floor}L${x1} ${floor}L${x1} ${top - 60}L${x1 + 22} ${top - 60}L${x1 + 22} ${floor + 34}Z`);
    water.setAttribute('d', `M20 ${top}L${x1} ${top}L${x1} ${floor}L20 ${floor}Z`);

    // The dark band is how far the water rises and falls. It is the same size at the sea end in every tank,
    // and grows towards the closed end by the gain.
    const swing = (x: number) => {
      const k = Math.max(0, (x - x0) / (x1 - x0));
      return 9 * (1 + (gain - 1) * k * k);
    };
    let up = '';
    let down = '';
    for (let i = 0; i <= 48; i++) {
      const x = 20 + ((x1 - 20) * i) / 48;
      up += `${i ? 'L' : 'M'}${x.toFixed(1)} ${(top - swing(x)).toFixed(1)}`;
      down = `L${x.toFixed(1)} ${(top + swing(x)).toFixed(1)}` + down;
    }
    band.setAttribute('d', `${up}${down}Z`);

    const x = plotX(T0);
    const y = pbot - ((pbot - ptop) * gain) / (MAX_AMPLIFY * 1.05);
    cursor.setAttribute('x1', String(x));
    cursor.setAttribute('x2', String(x));
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));

    const periodText = T0 > 48 ? 'more than 48 hours' : `${T0 < 10 ? T0.toFixed(1) : Math.round(T0)} hours`;
    const n = gain < 10 ? gain.toFixed(1) : String(Math.round(gain));
    const compare = gain < 1.5 ? 'about the same as the tide in the open sea' : `about ${n} times the tide in the open sea`;
    const verdict =
      gain > 3 ? ' The beat and the tank are in step, so every push adds to the last. This is resonance.' : gain < 1.5 ? ' The tank sloshes at the wrong speed, so the Moon cannot build the tide up.' : '';
    status.textContent = `Natural period ${periodText}. The Moon pushes every 12.4 hours. The tide at the closed end is ${compare}.${verdict}`;
    const share = clamp(gain / MAX_AMPLIFY, 0, 1);
    staff.set('basin', { level: 0.5 + share / 2, range: share, text: `Tide here is ${n}x the open sea` });
    if (!quiet && gain > 3 && !rang) {
      rang = true;
      sound.play('good');
    }
    if (gain < 2) rang = false;
  }

  length.addEventListener('input', () => update());
  depth.addEventListener('input', () => update());
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-basin-preset]')) {
    b.addEventListener('click', () => {
      const [L, h] = b.dataset.basinPreset!.split(',').map(Number);
      length.value = String(L);
      depth.value = String(h);
      update();
      sound.play('pop');
    });
  }
  update(true);
}
