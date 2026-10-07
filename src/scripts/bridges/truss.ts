// Span 4: a two-rafter truss with a weight at the top. Rafter = p / (2 sin angle), tie = p / (2 tan angle).

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { trussForces } from './model';

const BASE = 480;
const CX = 400;
const FLOOR = 300;

export function initTruss(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-truss-tool]');
  if (!tool) return;
  const heightInput = q<HTMLInputElement>(tool, '[data-truss-h]');
  const weightInput = q<HTMLInputElement>(tool, '[data-truss-p]');
  const hOut = q<HTMLOutputElement>(tool, '[data-truss-h-out]');
  const pOut = q<HTMLOutputElement>(tool, '[data-truss-p-out]');
  const status = q<HTMLElement>(tool, '[data-truss-status]');
  const left = q<SVGLineElement>(tool, '[data-truss-left]');
  const right = q<SVGLineElement>(tool, '[data-truss-right]');
  const tie = q<SVGLineElement>(tool, '[data-truss-tie]');
  const pinL = q<SVGCircleElement>(tool, '[data-truss-pin-l]');
  const pinR = q<SVGCircleElement>(tool, '[data-truss-pin-r]');
  const pinA = q<SVGCircleElement>(tool, '[data-truss-pin-a]');
  const weight = q<SVGGElement>(tool, '[data-truss-weight]');
  const weightText = q<SVGTextElement>(tool, '[data-truss-weight-text]');
  const fail = q<SVGTextElement>(tool, '[data-truss-fail]');
  const button = q<HTMLButtonElement>(tool, '[data-truss-switch]');
  let hasTie = true;
  let lastState = '';

  const set = (line: SVGLineElement, x1: number, y1: number, x2: number, y2: number, width: number) => {
    line.setAttribute('x1', x1.toFixed(1));
    line.setAttribute('y1', y1.toFixed(1));
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    line.style.strokeWidth = String(width);
  };

  function update(quiet = false) {
    const h = Number(heightInput.value) / 100;
    const p = Number(weightInput.value);
    fillRange(heightInput);
    fillRange(weightInput);
    hOut.textContent = `${h.toFixed(2)} of the base`;
    pOut.textContent = String(p);
    weightText.textContent = String(p);
    const f = trussForces(h, p);
    const rafterLength = Math.hypot(h, 0.5) * BASE;

    // Without the tie the rafters push their feet apart until the triangle lies nearly flat
    let half = BASE / 2;
    let apexY = FLOOR - h * BASE;
    if (!hasTie) {
      const lowered = 0.22 * rafterLength;
      half = Math.sqrt(rafterLength ** 2 - lowered ** 2);
      apexY = FLOOR - lowered;
    }
    const lx = CX - half;
    const rx = CX + half;
    const w = (force: number) => Math.min(5 + force * 4, 24);
    set(left, lx, FLOOR, CX, apexY, w(f.rafter));
    set(right, rx, FLOOR, CX, apexY, w(f.rafter));
    set(tie, lx, FLOOR, rx, FLOOR, w(f.tie));
    tie.style.opacity = hasTie ? '' : '0';
    pinL.setAttribute('cx', lx.toFixed(1));
    pinR.setAttribute('cx', rx.toFixed(1));
    pinA.setAttribute('cy', apexY.toFixed(1));
    weight.setAttribute('transform', `translate(${CX} ${(apexY - 54).toFixed(1)})`);
    fail.textContent = hasTie ? '' : 'Without the bottom bar the feet slide apart';

    let state: string;
    if (hasTie) {
      state = 'ok';
      const flat = h <= 0.22 ? ' The triangle is very flat, so the forces are large.' : h >= 0.6 ? ' The triangle is tall, so the forces are small.' : '';
      status.textContent = `Each rafter is squeezed with a force of ${f.rafter.toFixed(1)} and the bottom bar is stretched with a force of ${f.tie.toFixed(1)}, for a weight of ${p}.${flat}`;
    } else {
      state = 'fall';
      status.textContent = 'There is no bottom bar to hold the feet together, so the rafters push them apart and the roof falls flat. The bottom bar is what keeps the triangle a triangle.';
    }
    if (!quiet && state !== lastState) sound.play(state === 'fall' ? 'thud' : 'pop');
    lastState = state;
  }

  heightInput.addEventListener('input', () => update());
  weightInput.addEventListener('input', () => update());
  button.addEventListener('click', () => {
    hasTie = !hasTie;
    button.setAttribute('aria-pressed', String(hasTie));
    button.textContent = `Bottom bar: ${hasTie ? 'on' : 'off'}`;
    update();
  });
  update(true);
}
