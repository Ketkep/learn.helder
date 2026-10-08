// Plate 2: the escapement. One tooth of a 30 tooth wheel goes by for every half swing of the pendulum.

import * as sound from '../sound';
import { q, reducedMotion } from '../util';

const TEETH = 30;
const STEP = 360 / TEETH;
const CX = 400;
const CY = 235;

export function initEscapement(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-esc-tool]');
  if (!tool) return;
  const wheel = q<SVGGElement>(tool, '[data-esc-wheel]');
  const anchor = q<SVGGElement>(tool, '[data-esc-anchor]');
  const countEl = q<HTMLElement>(tool, '[data-esc-count]');
  const status = q<HTMLElement>(tool, '[data-esc-status]');
  const run = q<HTMLButtonElement>(tool, '[data-esc-run]');
  let count = 0;
  let timer = 0;

  function draw() {
    wheel.setAttribute('transform', `rotate(${((count % TEETH) * STEP).toFixed(1)} ${CX} ${CY})`);
    // The anchor rocks to the left on a tick and to the right on a tock
    anchor.setAttribute('transform', `rotate(${count % 2 ? -7 : 7} ${CX} ${CY - 170})`);
    countEl.textContent = String(count);
    const turns = Math.floor(count / TEETH);
    const sound1 = count % 2 ? 'tock' : 'tick';
    status.textContent =
      count === 0
        ? 'The wheel has 30 teeth. Press Swing and each half swing lets one tooth go by.'
        : `${count} ${count === 1 ? 'tooth has' : 'teeth have'} gone by. That was a ${sound1}. ${turns > 0 ? `The wheel has turned ${turns} time${turns === 1 ? '' : 's'}. ` : ''}With a pendulum that takes 2 seconds for a full swing, one tooth goes by each second, so 30 teeth take one minute: one turn of the wheel and one turn of a second hand.`;
  }

  function step() {
    count++;
    draw();
    sound.play(count % 2 ? 'tick' : 'snap', 0.9);
  }
  function stop() {
    window.clearInterval(timer);
    timer = 0;
    run.textContent = 'Run at one tick a second';
  }

  q<HTMLButtonElement>(tool, '[data-esc-step]').addEventListener('click', step);
  run.addEventListener('click', () => {
    if (timer) return stop();
    run.textContent = 'Stop';
    timer = window.setInterval(step, 1000);
  });
  if (reducedMotion()) run.hidden = true; // nothing runs by itself, and a running clock is a movement
  q<HTMLButtonElement>(tool, '[data-esc-reset]').addEventListener('click', () => {
    stop();
    count = 0;
    draw();
    sound.play('pop');
  });
  draw();
}
