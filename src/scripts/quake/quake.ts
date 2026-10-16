// The earthquake page: four things to try. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { amplitudeRatio, distanceKm, earthSvg, energyRatio, fmtSeconds, fmtTimes, foundIt, gap, gaps, mapSvg, pArrival, quakes, sArrival, seismogramSvg, stations, wavesAt } from '../../lib/quake';

const root = document.querySelector<HTMLElement>('[data-quake]');

if (root) {
  // Strip 1: the gap
  const gapTool = root.querySelector<HTMLElement>('[data-gap-tool]');
  if (gapTool) {
    const range = q<HTMLInputElement>(gapTool, '[data-gap-range]');
    const draw = () => {
      fillRange(range);
      const km = Number(range.value);
      q(gapTool, '[data-gap-out]').textContent = `${km} km`;
      q(gapTool, '[data-gap-g]').innerHTML = seismogramSvg(km);
      q(gapTool, '[data-gap-status]').textContent = `At ${km} km the P wave arrives after ${fmtSeconds(pArrival(km))} and the S wave after ${fmtSeconds(sArrival(km))}. The gap is ${fmtSeconds(gap(km))}, which is ${(km / gap(km)).toFixed(1)} km for each second.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Strip 2: three circles
  const circles = root.querySelector<HTMLElement>('[data-circles-tool]');
  if (circles) {
    const ranges = circles.querySelectorAll<HTMLInputElement>('[data-circles-range]');
    const status = q<HTMLElement>(circles, '[data-circles-status]');
    let n = 0;
    let wasFound = false;
    const table = () => {
      const g = gaps(quakes[n]);
      q(circles, '[data-circles-body]').innerHTML = stations.map((s, i) => `<tr><th scope="row">${s.name}</th><td>${g[i].toFixed(1)} s</td><td>${Math.round(g[i] * 8)} km</td></tr>`).join('');
    };
    const draw = () => {
      const radii = Array.from(ranges).map((r) => Number(r.value));
      ranges.forEach((r, i) => {
        fillRange(r);
        q(circles, `[data-circles-out="${i}"]`).textContent = `${radii[i]} km`;
      });
      const found = foundIt(radii, quakes[n]);
      q(circles, '[data-circles-g]').innerHTML = mapSvg(radii, quakes[n], found);
      if (found && !wasFound) sound.play('good', 0.5);
      wasFound = found;
      status.textContent = found
        ? `All three circles meet at one point. That is the epicentre.`
        : radii.every((r) => r === 0)
          ? 'Multiply each gap in the table by 8 to get a distance. Then set the radius of each circle to that distance.'
          : 'The circles do not meet at one point yet. Check each distance against the table.';
    };
    ranges.forEach((r) => r.addEventListener('input', draw));
    q(circles, '[data-circles-next]').addEventListener('click', () => {
      n = (n + 1) % quakes.length;
      ranges.forEach((r) => (r.value = '0'));
      wasFound = false;
      table();
      draw();
    });
    table();
    draw();
  }

  // Strip 3: magnitude
  const size = root.querySelector<HTMLElement>('[data-size-tool]');
  if (size) {
    const range = q<HTMLInputElement>(size, '[data-size-range]');
    const bar = (el: HTMLElement, r: number) => (el.style.width = `${Math.max(0.4, r * 100)}%`);
    const draw = () => {
      fillRange(range);
      const m = Number(range.value);
      q(size, '[data-size-out]').textContent = m.toFixed(1);
      bar(q(size, '[data-size-h]'), amplitudeRatio(m - 9));
      bar(q(size, '[data-size-e]'), energyRatio(m - 9));
      const d = m - 5;
      const cmp = Math.abs(d) < 0.05 ? 'The same as magnitude 5.' : d > 0 ? `A line ${fmtTimes(amplitudeRatio(d))} taller than one of magnitude 5, and about ${fmtTimes(energyRatio(d))} the energy.` : `A line ${fmtTimes(1 / amplitudeRatio(d))} smaller than one of magnitude 5, and about ${fmtTimes(1 / energyRatio(d))} less energy.`;
      q(size, '[data-size-status]').textContent = `A quake of magnitude ${m.toFixed(1)}: ${cmp}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Strip 4: the inside of the Earth
  const inside = root.querySelector<HTMLElement>('[data-inside-tool]');
  if (inside) {
    const range = q<HTMLInputElement>(inside, '[data-inside-range]');
    const draw = () => {
      fillRange(range);
      const deg = Number(range.value);
      q(inside, '[data-inside-out]').textContent = `${deg} degrees`;
      q(inside, '[data-inside-g]').innerHTML = earthSvg(deg);
      q(inside, '[data-inside-status]').textContent = `A station ${deg} degrees from the quake: ${wavesAt(deg).note}`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
