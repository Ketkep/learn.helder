// Span 3: a square frame with loose corners folds into a leaning slab. A diagonal turns it into two triangles.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { racking } from './model';

const NS = 'http://www.w3.org/2000/svg';
const SIDE = 210; // the bars are this long
const FOOT_L = 300;
const FOOT_R = 500;
const GROUND = 330;

export function initFrame(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-frame-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-frame-range]');
  const out = q<HTMLOutputElement>(tool, '[data-frame-out]');
  const status = q<HTMLElement>(tool, '[data-frame-status]');
  const shape = q<SVGPathElement>(tool, '[data-frame-shape]');
  const diagonal = q<SVGLineElement>(tool, '[data-frame-diagonal]');
  const pinA = q<SVGCircleElement>(tool, '[data-frame-pin-a]');
  const pinB = q<SVGCircleElement>(tool, '[data-frame-pin-b]');
  const push = q<SVGGElement>(tool, '[data-frame-push]');
  const button = q<HTMLButtonElement>(tool, '[data-frame-diag]');
  let braced = true;
  let lastState = '';

  function update(quiet = false) {
    const force = Number(range.value);
    fillRange(range);
    out.textContent = force.toFixed(1);

    // Without a diagonal the top moves sideways and the bars keep their length, so the frame leans and gets lower.
    const dx = braced ? 0 : racking(force) * SIDE;
    const rise = Math.sqrt(SIDE * SIDE - dx * dx);
    const topY = GROUND - rise;
    const ax = FOOT_L + dx;
    const bx = FOOT_R + dx;
    shape.setAttribute('d', `M${FOOT_L} ${GROUND}L${ax.toFixed(1)} ${topY.toFixed(1)}L${bx.toFixed(1)} ${topY.toFixed(1)}L${FOOT_R} ${GROUND}Z`);
    pinA.setAttribute('cx', ax.toFixed(1));
    pinA.setAttribute('cy', topY.toFixed(1));
    pinB.setAttribute('cx', bx.toFixed(1));
    pinB.setAttribute('cy', topY.toFixed(1));
    diagonal.setAttribute('x1', String(FOOT_L));
    diagonal.setAttribute('y1', String(GROUND));
    diagonal.setAttribute('x2', bx.toFixed(1));
    diagonal.setAttribute('y2', topY.toFixed(1));
    diagonal.style.opacity = braced ? '' : '0';

    // The push arrow, as long as the push
    while (push.firstChild) push.removeChild(push.firstChild);
    if (force > 0) {
      const len = 30 + force * 28;
      const x1 = ax - 20 - len;
      const line = document.createElementNS(NS, 'line');
      push.appendChild(line);
      line.setAttribute('class', 'push');
      line.setAttribute('x1', String(x1));
      line.setAttribute('x2', String(ax - 24));
      line.setAttribute('y1', topY.toFixed(1));
      line.setAttribute('y2', topY.toFixed(1));
      const head = document.createElementNS(NS, 'path');
      head.setAttribute('class', 'push head');
      head.setAttribute('d', `M${ax - 12} ${topY} L${ax - 34} ${topY - 11} L${ax - 34} ${topY + 11}Z`);
      push.appendChild(head);
    }

    let state: string;
    if (braced) {
      state = 'held';
      status.textContent =
        force === 0
          ? 'The frame has a diagonal bar. Push it sideways and see what the bar does.'
          : `The diagonal bar is stretched with a force of about ${(force * Math.SQRT2).toFixed(1)}, a bit more than the push of ${force.toFixed(1)}. The frame stays square.`;
    } else if (dx > 0.8 * SIDE) {
      state = 'flat';
      status.textContent = 'Without a diagonal the frame has folded almost flat. The four bars are still the same length, but the corners have turned.';
    } else {
      state = dx > 0 ? 'leaning' : 'straight';
      status.textContent = dx > 0 ? `Without a diagonal the frame leans over. The top has moved ${Math.round((dx / SIDE) * 100)}% of a bar length.` : 'The frame has no diagonal. Push it sideways and see what happens.';
    }
    if (!quiet && state !== lastState && state !== 'straight') sound.play(state === 'flat' ? 'bad' : state === 'held' ? 'clink' : 'tick', 0.6);
    lastState = state;
  }

  range.addEventListener('input', () => update());
  button.addEventListener('click', () => {
    braced = !braced;
    button.setAttribute('aria-pressed', String(braced));
    button.textContent = `Diagonal bar: ${braced ? 'on' : 'off'}`;
    update();
    sound.play('pop');
  });
  update(true);
}
