// String 2: two strings in slow motion. The short one swings twice for every swing of the long one.

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import { BASE_HZ } from './music';

const Y_LONG = 75;
const Y_SHORT = 75;
const SWINGS_PER_SECOND = 0.8; // the long string, on screen. Real life is 110, so this is about 140 times slower.

export function initWave(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-wave-tool]');
  if (!tool) return;
  const x0 = Number(tool.dataset.x0);
  const xl = Number(tool.dataset.xl);
  const xs = Number(tool.dataset.xs);
  const range = q<HTMLInputElement>(tool, '[data-wave-range]');
  const out = q<HTMLOutputElement>(tool, '[data-wave-out]');
  const status = q<HTMLElement>(tool, '[data-wave-status]');
  const long = q<SVGPathElement>(tool, '[data-wave-long]');
  const short = q<SVGPathElement>(tool, '[data-wave-short]');
  const dotLong = q<SVGCircleElement>(tool, '[data-wave-dot-long]');
  const dotShort = q<SVGCircleElement>(tool, '[data-wave-dot-short]');
  const play = q<HTMLButtonElement>(tool, '[data-wave-play]');
  let frame = 0;
  let last = -1;

  const shape = (x1: number, y: number, swings: number) => {
    const bend = 40 * Math.cos(2 * Math.PI * swings);
    let d = `M${x0} ${y}`;
    for (let i = 1; i <= 50; i++) {
      const t = i / 50;
      d += `L${(x0 + (x1 - x0) * t).toFixed(1)} ${(y + bend * Math.sin(Math.PI * t)).toFixed(1)}`;
    }
    return { d, mid: y + bend };
  };

  function set(t: number) {
    range.value = t.toFixed(2);
    fillRange(range);
    out.textContent = t.toFixed(2);
    const a = shape(xl, Y_LONG, t);
    const b = shape(xs, Y_SHORT, 2 * t);
    long.setAttribute('d', a.d);
    short.setAttribute('d', b.d);
    dotLong.setAttribute('cy', String(a.mid));
    dotShort.setAttribute('cy', String(b.mid));
    const whole = Math.floor(t * 100 + 0.5) / 100;
    status.textContent = `The long string has swung ${whole.toFixed(2)} times and the short one ${(2 * whole).toFixed(2)} times. The short string always swings twice as often.`;
    const tick = Math.floor(2 * t); // a tick each half swing of the long string
    if (tick !== last && frame === 0) sound.play('tick');
    last = tick;
  }

  range.addEventListener('input', () => set(Number(range.value)));

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    play.textContent = 'Play slowly';
  };
  play.addEventListener('click', () => {
    if (frame) return stop();
    play.textContent = 'Stop';
    const from = Number(range.value) >= 1.99 ? 0 : Number(range.value);
    const began = performance.now();
    const step = (now: number) => {
      const t = from + ((now - began) / 1000) * SWINGS_PER_SECOND;
      if (t >= 2) {
        set(2);
        return stop();
      }
      set(t);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  });
  if (reducedMotion()) play.hidden = true;
  range.addEventListener('pointerdown', stop);

  q<HTMLButtonElement>(tool, '[data-wave-hear]').addEventListener('click', () => {
    sound.pluck(BASE_HZ, [1, 0.3]);
    sound.pluck(BASE_HZ * 2, [1, 0.3]);
  });
  set(0);
  last = 0;
}
