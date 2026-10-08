// Plate 1: the pendulum. T = 2 x pi x the square root of (length / g), nearly the same for any weight.

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import { SECONDS_LENGTH, driftPerHour, period } from './physics';

const PIVOT_X = 400;
const PIVOT_Y = 30;
const PER_METRE = 100; // pixels for 1 metre of rod

export function initPendulum(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-pend-tool]');
  if (!tool) return;
  const length = q<HTMLInputElement>(tool, '[data-pend-length]');
  const weight = q<HTMLInputElement>(tool, '[data-pend-weight]');
  const angle = q<HTMLInputElement>(tool, '[data-pend-angle]');
  const lengthOut = q<HTMLOutputElement>(tool, '[data-pend-length-out]');
  const weightOut = q<HTMLOutputElement>(tool, '[data-pend-weight-out]');
  const angleOut = q<HTMLOutputElement>(tool, '[data-pend-angle-out]');
  const periodEl = q<HTMLElement>(tool, '[data-pend-period]');
  const noteEl = q<HTMLElement>(tool, '[data-pend-note]');
  const status = q<HTMLElement>(tool, '[data-pend-status]');
  const rod = q<SVGLineElement>(tool, '[data-pend-rod]');
  const bob = q<SVGCircleElement>(tool, '[data-pend-bob]');
  const mark = q<SVGLineElement>(tool, '[data-pend-mark]');
  const markText = q<SVGTextElement>(tool, '[data-pend-mark-text]');
  const swing = q<HTMLButtonElement>(tool, '[data-pend-swing]');
  let frame = 0;

  const L = () => Number(length.value) / 100;
  const A = () => Number(angle.value);

  function draw(theta = 0) {
    const len = L() * PER_METRE;
    const x = PIVOT_X + len * Math.sin(theta);
    const y = PIVOT_Y + len * Math.cos(theta);
    rod.setAttribute('x2', x.toFixed(1));
    rod.setAttribute('y2', y.toFixed(1));
    bob.setAttribute('cx', x.toFixed(1));
    bob.setAttribute('cy', y.toFixed(1));
    bob.setAttribute('r', String(14 + Number(weight.value) * 4));
    const m = PIVOT_Y + SECONDS_LENGTH * PER_METRE;
    mark.setAttribute('y1', m.toFixed(1));
    mark.setAttribute('y2', m.toFixed(1));
    markText.setAttribute('y', (m + 6).toFixed(1));
  }

  function update(quiet = false) {
    fillRange(length);
    fillRange(weight);
    fillRange(angle);
    const l = L();
    const t = period(l, A());
    lengthOut.textContent = `${l.toFixed(2)} m`;
    weightOut.textContent = weight.value;
    angleOut.textContent = `${A()}°`;
    periodEl.textContent = `${t.toFixed(2)} s`;
    noteEl.textContent = 'for a full swing';
    const drift = driftPerHour(t);
    const amount = Math.abs(drift) < 90 ? `${Math.round(Math.abs(drift))} seconds` : `${Math.round(Math.abs(drift) / 60)} minutes`;
    const clock =
      Math.abs(drift) < 1
        ? ' A clock built for a 2 second swing would keep good time.'
        : ` A clock built for a 2 second swing would ${drift > 0 ? 'gain' : 'lose'} ${amount} in an hour with this pendulum.`;
    status.textContent = `A pendulum ${l.toFixed(2)} m long, swinging ${A()}° each way, takes ${t.toFixed(2)} seconds for a full swing. The weight does not change it.${clock}`;
    draw();
    if (!quiet) sound.play('tick');
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    swing.textContent = 'Swing';
    draw();
  }
  swing.addEventListener('click', () => {
    if (frame) return stop();
    if (reducedMotion()) {
      // No motion: show the bob at the side of its swing and say so
      draw((A() * Math.PI) / 180);
      status.textContent = `The pendulum is drawn at the far side of its ${A()}° swing. A full swing takes ${period(L(), A()).toFixed(2)} seconds.`;
      return;
    }
    swing.textContent = 'Stop';
    const began = performance.now();
    const t = period(L(), A());
    let lastHalf = 0;
    const step = (now: number) => {
      const el = (now - began) / 1000;
      const theta = ((A() * Math.PI) / 180) * Math.cos((2 * Math.PI * el) / t) * Math.exp(-el / 40);
      draw(theta);
      const half = Math.floor((2 * el) / t);
      if (half !== lastHalf) {
        sound.play('tick');
        lastHalf = half;
      }
      if (el > 30) return stop();
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  });

  for (const el of [length, weight, angle]) {
    el.addEventListener('input', () => {
      if (frame) stop();
      update();
    });
  }
  q<HTMLButtonElement>(tool, '[data-pend-seconds]').addEventListener('click', () => {
    length.value = String(Math.round(SECONDS_LENGTH * 100));
    angle.value = '2';
    update();
  });
  update(true);
}
