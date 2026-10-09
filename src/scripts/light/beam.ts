// The beam fixed at the top of the page. A panel calls send() and the beam crosses the screen.
// The trip is sped up and squeezed so a four hour trip does not take four hours, but the clock shows the true time.

import * as sound from '../sound';
import { clamp, q, reducedMotion } from '../util';
import { C_KM_S, fmtKm, fmtTime } from '../../lib/light';

export interface Send {
  name: string;
  /** One way distance in km. */
  km: number;
  /** Speed in km per second. Light by default. */
  kmS?: number;
  /** How many one way legs the pulse makes: 1 goes there, 2 goes and comes back, 10 is five round trips. */
  legs?: number;
  /** Called when the beam has arrived, with the true time of the whole trip in seconds. */
  done?: (seconds: number) => void;
}

let els: { name: HTMLElement; km: HTMLElement; clock: HTMLElement; pulse: HTMLElement; far: HTMLElement } | null = null;
let frame = 0;

export function initBeam(root: HTMLElement) {
  const beam = root.querySelector<HTMLElement>('[data-beam]');
  if (!beam) return;
  els = {
    name: q(beam, '[data-beam-name]'),
    km: q(beam, '[data-beam-km]'),
    clock: q(beam, '[data-beam-clock]'),
    pulse: q(beam, '[data-beam-pulse]'),
    far: q(beam, '[data-beam-far]'),
  };
}

// 0 at Earth, 1 at the far end. The pulse goes back and forth once per two legs.
const place = (legs: number, p: number) => {
  const phase = (p * legs) % 2;
  return p >= 1 ? (legs % 2 === 1 ? 1 : 0) : phase <= 1 ? phase : 2 - phase;
};

export function send(trip: Send) {
  if (!els) return;
  const e = els;
  const legs = trip.legs ?? 1;
  const total = (trip.km / (trip.kmS ?? C_KM_S)) * legs;
  cancelAnimationFrame(frame);
  e.name.textContent = trip.name;
  e.km.textContent = fmtKm(trip.km);
  sound.play('beam', 0.5);

  const finish = () => {
    e.clock.textContent = fmtTime(total);
    e.pulse.style.left = `${place(legs, 1) * 100}%`;
    sound.play('pop', 0.5);
    trip.done?.(total);
  };
  if (reducedMotion()) return finish();

  const length = clamp(1.4 + 0.45 * Math.log10(total + 1), 1.4, 6) * 1000;
  const start = performance.now();
  const step = (now: number) => {
    const p = clamp((now - start) / length, 0, 1);
    e.pulse.style.left = `${place(legs, p) * 100}%`;
    e.clock.textContent = fmtTime(total * p);
    if (p < 1) frame = requestAnimationFrame(step);
    else finish();
  };
  frame = requestAnimationFrame(step);
}
