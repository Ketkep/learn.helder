// Span 1: a plank with a weight. The sag follows the standard formula, scaled so that a weight of 1 in the
// middle of a plank of depth 1 gives a sag of 1.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { moment, sag } from './model';

const X0 = 100;
const X1 = 700;
const TOP = 130; // the top of the plank when it is straight
const PER_UNIT = 22; // pixels of sag for 1 unit (drawn bigger than life so you can see it)

export function initBeam(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-beam-tool]');
  if (!tool) return;
  const pos = q<HTMLInputElement>(tool, '[data-beam-pos]');
  const load = q<HTMLInputElement>(tool, '[data-beam-load]');
  const depth = q<HTMLInputElement>(tool, '[data-beam-depth]');
  const posOut = q<HTMLOutputElement>(tool, '[data-beam-pos-out]');
  const loadOut = q<HTMLOutputElement>(tool, '[data-beam-weight-out]');
  const depthOut = q<HTMLOutputElement>(tool, '[data-beam-depth-out]');
  const status = q<HTMLElement>(tool, '[data-beam-status]');
  const plank = q<SVGPathElement>(tool, '[data-beam-plank]');
  const topBand = q<SVGPathElement>(tool, '[data-beam-top]');
  const bottomBand = q<SVGPathElement>(tool, '[data-beam-bottom]');
  const weight = q<SVGGElement>(tool, '[data-beam-weight]');
  const weightText = q<SVGTextElement>(tool, '[data-beam-weight-text]');
  const arrow = q<SVGLineElement>(tool, '[data-beam-arrow]');
  let lastBucket = -1;

  function update() {
    const a = Number(pos.value) / 100;
    const p = Number(load.value);
    const d = Number(depth.value);
    for (const el of [pos, load, depth]) fillRange(el);
    posOut.textContent = Math.abs(a - 0.5) < 0.02 ? 'middle' : `${Math.round(a * 100)}% across`;
    loadOut.textContent = String(p);
    depthOut.textContent = `${Math.round(d * 10) / 10}×`;
    weightText.textContent = String(p);

    const half = 7 + d * 9; // half the depth of the plank, in pixels
    const topLine: string[] = [];
    const botLine: string[] = [];
    const squeeze: string[] = [];
    const stretch: string[] = [];
    let worst = 0;
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = X0 + (X1 - X0) * t;
      const y = TOP + half + sag(t, a, p, d) * PER_UNIT; // the middle of the plank
      worst = Math.max(worst, sag(t, a, p, d));
      topLine.push(`${x.toFixed(1)} ${(y - half).toFixed(1)}`);
      botLine.push(`${x.toFixed(1)} ${(y + half).toFixed(1)}`);
      // The shaded bands are as thick as the bending there
      const m = Math.min((moment(t, a, p) / (d * d)) * 8, half * 0.95);
      squeeze.push(`${x.toFixed(1)} ${(y - half + m).toFixed(1)}`);
      stretch.push(`${x.toFixed(1)} ${(y + half - m).toFixed(1)}`);
    }
    plank.setAttribute('d', `M${topLine.join('L')}L${[...botLine].reverse().join('L')}Z`);
    topBand.setAttribute('d', `M${topLine.join('L')}L${[...squeeze].reverse().join('L')}Z`);
    bottomBand.setAttribute('d', `M${botLine.join('L')}L${[...stretch].reverse().join('L')}Z`);

    const wx = X0 + (X1 - X0) * a;
    const ground = TOP + half + sag(a, a, p, d) * PER_UNIT - half;
    weight.setAttribute('transform', `translate(${wx.toFixed(1)} ${(ground - 70).toFixed(1)})`);
    arrow.setAttribute('x1', String(wx));
    arrow.setAttribute('x2', String(wx));
    arrow.setAttribute('y1', String(ground - 42));
    arrow.setAttribute('y2', String(ground - 4));

    const where = Math.abs(a - 0.5) < 0.02 ? 'in the middle' : `${Math.round(a * 100)}% of the way across`;
    status.textContent = `The weight of ${p} is ${where} on a plank ${Math.round(d * 10) / 10} times as deep as the first one. The plank sags by ${worst.toFixed(2)} in the relative units of this page. It is squeezed along the top and stretched along the bottom, most under the weight.`;
    const bucket = Math.round(worst * 3);
    if (bucket !== lastBucket) sound.play('tick');
    lastBucket = bucket;
  }

  pos.addEventListener('input', update);
  load.addEventListener('input', update);
  depth.addEventListener('input', update);
  update();
}
