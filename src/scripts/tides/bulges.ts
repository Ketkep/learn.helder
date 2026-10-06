// Bench 1: two bulges. The Earth turns under water that stays lined up with the Moon.

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import type { Staff } from './quay';
import { LUNAR_DAY_H, TIDE_H, heightAtAngle } from './model';

const CX = 380;
const CY = 225;

const show = (el: Element, on: boolean) => el.classList.toggle('is-off', !on);

export function initBulges(root: HTMLElement, staff: Staff) {
  const tool = root.querySelector<HTMLElement>('[data-bulges-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(root, '[data-bulges-range]');
  const out = q<HTMLOutputElement>(root, '[data-bulges-out]');
  const status = q<HTMLElement>(root, '[data-bulges-status]');
  const play = q<HTMLButtonElement>(root, '[data-bulges-play]');
  const earth = q<SVGGElement>(tool, '[data-earth]');
  const pull = q<SVGGElement>(tool, '[data-arrows-pull]');
  const left = q<SVGGElement>(tool, '[data-arrows-left]');
  const modes = [...root.querySelectorAll<HTMLButtonElement>('[data-arrow-mode]')];
  let lastState = '';
  let timer = 0;

  function set(hours: number, quiet = false) {
    const t = Math.min(Math.max(hours, 0), LUNAR_DAY_H);
    range.value = t.toFixed(1);
    fillRange(range);
    out.textContent = `${t.toFixed(1)} h`;
    // The Earth turns anticlockwise seen from above, once in a lunar day
    const deg = (360 * t) / LUNAR_DAY_H;
    earth.setAttribute('transform', `translate(${CX} ${CY}) rotate(${-deg})`);

    const h = heightAtAngle(deg);
    const rising = heightAtAngle(deg + 4) > h;
    const state = h > 0.85 ? 'high' : h < -0.85 ? 'low' : rising ? 'rising' : 'falling';
    const words = {
      high: 'You are under a bulge. It is high tide.',
      low: 'You are at the side, between the bulges. It is low tide.',
      rising: 'The water is rising.',
      falling: 'The water is falling.',
    }[state];
    // Hours until the next high tide: highs are at 0, 12.42, 24.84
    const next = Math.ceil((t + 0.05) / TIDE_H) * TIDE_H - t;
    const wait = state === 'high' ? '' : ` The next high tide is in about ${next.toFixed(1)} hours.`;
    status.textContent = `${t.toFixed(1)} hours after the Moon was overhead. ${words}${wait}`;

    staff.set('bulges', {
      level: (h + 1) / 2,
      text: { high: 'High water', low: 'Low water', rising: 'Rising', falling: 'Falling' }[state],
    });
    if (!quiet && state !== lastState && (state === 'high' || state === 'low')) sound.play('thud', 0.6);
    lastState = state;
  }

  range.addEventListener('input', () => set(Number(range.value)));

  for (const b of modes) {
    b.addEventListener('click', () => {
      const mode = b.dataset.arrowMode;
      for (const m of modes) m.setAttribute('aria-pressed', String(m === b));
      show(pull, mode === 'pull');
      show(left, mode === 'left');
      sound.play('pop');
    });
  }

  // Playing a day is the reader's choice. With reduced motion there is no button, only the slider.
  const stop = () => {
    if (!timer) return;
    cancelAnimationFrame(timer);
    timer = 0;
    play.textContent = 'Play one day';
  };
  play.addEventListener('click', () => {
    if (timer) return stop();
    sound.play('whoosh', 0.5);
    play.textContent = 'Stop';
    const from = Number(range.value) >= LUNAR_DAY_H - 0.1 ? 0 : Number(range.value);
    const began = performance.now();
    const step = (now: number) => {
      const t = from + ((now - began) / 1000) * 2.6; // about 2.6 hours of tide per second
      if (t >= LUNAR_DAY_H) {
        set(LUNAR_DAY_H);
        timer = 0;
        play.textContent = 'Play one day';
        return;
      }
      set(t, true);
      timer = requestAnimationFrame(step);
    };
    timer = requestAnimationFrame(step);
  });
  range.addEventListener('pointerdown', stop);
  if (reducedMotion()) play.hidden = true;

  set(0, true);
}
