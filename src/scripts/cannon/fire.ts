// Fire 1: the cannon on the mountain.

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import { circularSpeed, escapeSpeed, fire, fmtTime, getPlanet, shotSvg, screenPath } from '../../lib/orbit';

export function initFire(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-fire-tool]');
  if (!tool) return;
  const pic = q(tool, '[data-fire-pic]');
  const ball = q(tool, '[data-fire-ball]');
  const planetSel = q<HTMLSelectElement>(tool, '[data-fire-planet]');
  const hIn = q<HTMLInputElement>(tool, '[data-fire-h]');
  const vIn = q<HTMLInputElement>(tool, '[data-fire-v]');
  const status = q<HTMLElement>(tool, '[data-fire-status]');
  let frame = 0;

  const km = (n: number) => Math.round(n).toLocaleString('en-US');

  function draw() {
    cancelAnimationFrame(frame);
    ball.setAttribute('cx', '-20');
    const p = getPlanet(planetSel.value);
    const [h, v] = [Number(hIn.value), Number(vIn.value)];
    fillRange(hIn);
    fillRange(vIn);
    q(tool!, '[data-fire-h-out]').textContent = `${h} km high`;
    q(tool!, '[data-fire-v-out]').textContent = `${v.toFixed(2)} km/s`;
    const shot = fire(p, h, v);
    pic.innerHTML = shotSvg(p, h, shot);
    const r0 = p.r + h;
    const hints = `From a ${h} km mountain on ${p.name} a circular orbit needs ${circularSpeed(p, r0).toFixed(2)} km/s and escape needs ${escapeSpeed(p, r0).toFixed(2)} km/s.`;
    if (shot.outcome === 'falls') status.textContent = `At ${v.toFixed(2)} km/s the ball falls back and lands ${km(shot.range ?? 0)} km away after ${fmtTime(shot.flight ?? 0)}. ${hints}`;
    else if (shot.outcome === 'orbit') status.textContent = `At ${v.toFixed(2)} km/s the ball never lands. It goes round ${p.name} in an orbit that comes as close as ${km((shot.perigee ?? 0) - p.r)} km and goes as far as ${km((shot.apogee ?? 0) - p.r)} km above the ground, and one lap takes ${fmtTime(shot.lap ?? 0)}. ${hints}`;
    else status.textContent = `At ${v.toFixed(2)} km/s the ball is going faster than escape speed, so it leaves ${p.name} and does not come back. ${hints}`;
  }

  planetSel.addEventListener('change', () => {
    // A new planet has a new size, so the slider ranges that make sense change with it
    const p = getPlanet(planetSel.value);
    const maxSpeed = Math.ceil(escapeSpeed(p, p.r) * 1.15);
    vIn.max = String(maxSpeed);
    vIn.value = String(Math.min(Number(vIn.value), maxSpeed));
    hIn.max = String(Math.round(p.r / 10));
    draw();
  });
  hIn.addEventListener('input', draw);
  vIn.addEventListener('input', draw);

  q(tool, '[data-fire-fly]').addEventListener('click', () => {
    const p = getPlanet(planetSel.value);
    const shot = fire(p, Number(hIn.value), Number(vIn.value));
    const pts = screenPath(p, Number(hIn.value), shot);
    cancelAnimationFrame(frame);
    const place = (i: number) => {
      ball.setAttribute('cx', String(pts[i][0]));
      ball.setAttribute('cy', String(pts[i][1]));
    };
    sound.play('pop', 0.5);
    if (reducedMotion()) {
      place(pts.length - 1);
      return;
    }
    const start = performance.now();
    const length = 3000;
    const step = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / length));
      place(Math.min(pts.length - 1, Math.floor(t * (pts.length - 1))));
      if (t < 1) frame = requestAnimationFrame(step);
      else if (shot.outcome === 'falls') sound.play('thud');
    };
    frame = requestAnimationFrame(step);
  });
  draw();
}
