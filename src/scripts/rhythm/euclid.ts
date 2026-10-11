// Board 3: hits spread as evenly as possible.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { asText, euclid, nameFor, ringPoint } from '../../lib/rhythm';
import { playButton, setPlaying, startLoop, stopLoop } from './clock';

const STEP_MS = 190;

export function initEuclid(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-euclid-tool]');
  if (!tool) return;
  const kIn = q<HTMLInputElement>(tool, '[data-euclid-k]');
  const nIn = q<HTMLInputElement>(tool, '[data-euclid-n]');
  const dots = q(tool, '[data-euclid-dots]');
  const status = q<HTMLElement>(tool, '[data-euclid-status]');
  const play = q<HTMLButtonElement>(tool, '[data-euclid-play]');
  let pattern = euclid(Number(kIn.value), Number(nIn.value));

  function ring(active = -1) {
    const n = pattern.length;
    dots.innerHTML = pattern.map((h, i) => { const [x, y] = ringPoint(i, n, 84); return `<circle class="${h ? 'hit' : 'rest'}${i === active ? ' now' : ''}" cx="${x}" cy="${y}" r="${h ? 9 : 5}"/>`; }).join('');
  }

  function draw() {
    let [k, n] = [Number(kIn.value), Number(nIn.value)];
    if (k > n) {
      k = n;
      kIn.value = String(k);
    }
    kIn.max = String(n);
    fillRange(kIn);
    fillRange(nIn);
    q(tool!, '[data-euclid-k-out]').textContent = String(k);
    q(tool!, '[data-euclid-n-out]').textContent = String(n);
    pattern = euclid(k, n);
    ring();
    const name = nameFor(k, n);
    status.textContent = `${k} hit${k === 1 ? '' : 's'} in ${n} steps. ${name ? `${name.text} ` : ''}Pattern: ${asText(pattern)}`;
  }

  function start() {
    stopLoop();
    setPlaying(play, true);
    startLoop(
      STEP_MS * pattern.length,
      pattern.map((_, i) => ({
        at: i * STEP_MS,
        fn: () => {
          ring(i);
          if (pattern[i]) sound.play('thud');
        },
      })),
      () => {
        setPlaying(play, false);
        ring();
      },
    );
  }

  playButton(play, start);
  for (const r of [kIn, nIn])
    r.addEventListener('input', () => {
      draw();
      if (play.getAttribute('aria-pressed') === 'true') start();
    });
  draw();
}
