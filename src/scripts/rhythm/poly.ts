// Board 4: two beats at once.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { gcd, lcm, ringPoint } from '../../lib/rhythm';
import { playButton, setPlaying, startLoop, stopLoop } from './clock';

const CYCLE_MS = 2400;

export function initPoly(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-poly-tool]');
  if (!tool) return;
  const aIn = q<HTMLInputElement>(tool, '[data-poly-a-range]');
  const bIn = q<HTMLInputElement>(tool, '[data-poly-b-range]');
  const gA = q(tool, '[data-poly-a]');
  const gB = q(tool, '[data-poly-b]');
  const status = q<HTMLElement>(tool, '[data-poly-status]');
  const play = q<HTMLButtonElement>(tool, '[data-poly-play]');

  const dots = (n: number, r: number, cls: string, active = -1) => Array.from({ length: n }, (_, i) => { const [x, y] = ringPoint(i, n, r); return `<circle class="${cls}${i === active ? ' now' : ''}" cx="${x}" cy="${y}" r="9"/>`; }).join('');
  const nums = () => [Number(aIn.value), Number(bIn.value)];

  function draw(activeA = -1, activeB = -1) {
    const [a, b] = nums();
    gA.innerHTML = dots(a, 84, 'hit', activeA);
    gB.innerHTML = dots(b, 52, 'hit two', activeB);
  }

  function text() {
    const [a, b] = nums();
    fillRange(aIn);
    fillRange(bIn);
    q(tool!, '[data-poly-a-out]').textContent = String(a);
    q(tool!, '[data-poly-b-out]').textContent = String(b);
    const meet = gcd(a, b);
    status.textContent = `${a} against ${b}: both lines start together at the top. ${meet === 1 ? `After that their hits never fall on the same moment until the cycle starts again, and the cycle fits ${lcm(a, b)} equal steps of both.` : `Because ${a} and ${b} share a factor of ${meet}, the two lines meet ${meet} times in each cycle, and the cycle fits ${lcm(a, b)} equal steps of both.`}`;
  }

  function start() {
    const [a, b] = nums();
    stopLoop();
    setPlaying(play, true);
    startLoop(
      CYCLE_MS,
      [
        ...Array.from({ length: a }, (_, i) => ({ at: (i / a) * CYCLE_MS, fn: () => { draw(i, -1); sound.play('thud'); } })),
        ...Array.from({ length: b }, (_, i) => ({ at: (i / b) * CYCLE_MS, fn: () => { draw(-1, i); sound.play('pop'); } })),
      ],
      () => {
        setPlaying(play, false);
        draw();
      },
    );
  }

  playButton(play, start);
  for (const r of [aIn, bIn])
    r.addEventListener('input', () => {
      draw();
      text();
      if (play.getAttribute('aria-pressed') === 'true') start();
    });
  draw();
  text();
}
