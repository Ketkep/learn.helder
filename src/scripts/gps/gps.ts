// The GPS page: four channels. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { clockSvg, crossings, beacons, dist, fmt, GRAVITY, kmOf, misfit, NET, ringsSvg, SPEED, spreadGeometry, spreadSvg } from '../../lib/gps';

const root = document.querySelector<HTMLElement>('[data-gps]');

if (root) {
  initSoundButton(root);

  // Channel 1: rings
  const ri = root.querySelector<HTMLElement>('[data-rings-tool]');
  if (ri) {
    const picks = ri.querySelectorAll<HTMLElement>('[data-rings-n]');
    const rx = q<HTMLInputElement>(ri, '[data-rings-x]');
    const ry = q<HTMLInputElement>(ri, '[data-rings-y]');
    let n = 3;
    const draw = () => {
      fillRange(rx);
      fillRange(ry);
      const you = { x: Number(rx.value), y: Number(ry.value) };
      q(ri, '[data-rings-g]').innerHTML = ringsSvg(you, n);
      let text = '';
      if (n === 1) text = 'One ring. You are somewhere on it, and nothing says where.';
      else if (n === 2) {
        const c = crossings(beacons[0], dist(you, beacons[0]), beacons[1], dist(you, beacons[1]));
        text = c.length > 1 ? 'Two rings cross in two points. You are in one of them, and one of the two is usually a place you could not be, such as out in space.' : 'The two rings only touch, in one point.';
      } else text = 'Three rings cross in one point. That point is you.';
      q(ri, '[data-rings-status]').textContent = text;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        n = Number(b.getAttribute('data-rings-n'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        sound.play('tick', 0.4);
        draw();
      }),
    );
    rx.addEventListener('input', draw);
    ry.addEventListener('input', draw);
    draw();
  }

  // Channel 2: the clock
  const cl = root.querySelector<HTMLElement>('[data-clock-tool]');
  if (cl) {
    const bias = Number(cl.getAttribute('data-bias'));
    const range = q<HTMLInputElement>(cl, '[data-clock-range]');
    const you = { x: 140, y: 100 };
    let done = false;
    const draw = () => {
      fillRange(range);
      const fix = Number(range.value);
      q(cl, '[data-clock-out]').textContent = String(fix);
      q(cl, '[data-clock-g]').innerHTML = clockSvg(you, bias, fix);
      const m = misfit(you, bias, fix);
      const ok = m < 0.5;
      q(cl, '[data-clock-status]').textContent = ok
        ? 'The three rings meet in one point. The clock is fixed, and the point is you. This is a toy with made up units.'
        : `The rings do not meet. The best point misses the rings by ${m.toFixed(1)} on average. ${fix < bias ? 'The rings are still too big.' : 'Now the rings are too small.'}`;
      if (ok && !done) sound.play('good', 0.4);
      done = ok;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Channel 3: the spread
  const sp = root.querySelector<HTMLElement>('[data-spread-tool]');
  if (sp) {
    const range = q<HTMLInputElement>(sp, '[data-spread-range]');
    const draw = () => {
      fillRange(range);
      const a = Number(range.value);
      q(sp, '[data-spread-out]').textContent = String(a);
      q(sp, '[data-spread-g]').innerHTML = spreadSvg(a, 5);
      const g = spreadGeometry(a, 5);
      const kind = g.hdop < 1.6 ? 'A small patch.' : g.hdop < 2.6 ? 'A longer patch.' : 'A long, thin patch. The fix is poor along it.';
      q(sp, '[data-spread-status]').textContent = `Satellites ${a}° apart. The patch is ${g.long.toFixed(0)} metres across at its longest and the error is multiplied by ${g.hdop.toFixed(2)}. ${kind}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Channel 4: Einstein's clocks
  const ei = root.querySelector<HTMLElement>('[data-einstein-tool]');
  if (ei) {
    const range = q<HTMLInputElement>(ei, '[data-einstein-range]');
    const set = (key: string, us: number) => {
      q<HTMLElement>(ei, `[data-bar="${key}"]`).style.width = `${Math.min(100, (Math.abs(us) / 500) * 100)}%`;
    };
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(ei, '[data-einstein-out]').textContent = String(d);
      set('gravity', GRAVITY * d);
      set('speed', SPEED * d);
      set('net', NET * d);
      q(ei, '[data-num="gravity"]').textContent = `+${GRAVITY * d} µs`;
      q(ei, '[data-num="speed"]').textContent = `${SPEED * d} µs`;
      q(ei, '[data-num="net"]').textContent = `+${NET * d} µs`;
      q(ei, '[data-einstein-status]').textContent = `After ${d} day${d === 1 ? '' : 's'} the satellite clock would be ahead by ${NET * d} microseconds. Light travels ${fmt(kmOf(NET * d))} km in that time.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
