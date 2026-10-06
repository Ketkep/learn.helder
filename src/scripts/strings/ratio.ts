// String 4: the sum of two vibrations. For a ratio a:b (in lowest terms) the sum repeats after b swings of the
// lower note and a swings of the higher one, that is, after b / lowFrequency seconds.

import * as sound from '../sound';
import { q } from '../util';
import { hz } from './music';

const NS = 'http://www.w3.org/2000/svg';
const LOW = 220;
const WINDOW = 0.06; // seconds drawn

export function initRatio(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-ratio-tool]');
  if (!tool) return;
  const x0 = Number(tool.dataset.x0);
  const xl = Number(tool.dataset.xl);
  const picks = [...tool.querySelectorAll<HTMLButtonElement>('[data-ratio-pick]')];
  const upper = q<SVGPathElement>(tool, '[data-ratio-upper]');
  const dead = q<SVGPathElement>(tool, '[data-ratio-dead]');
  const knob = q<SVGCircleElement>(tool, '[data-ratio-knob]');
  const upperLabel = q<HTMLElement>(tool, '[data-ratio-upper-label]');
  const sum = q<SVGPathElement>(tool, '[data-ratio-sum]');
  const marks = q<SVGGElement>(tool, '[data-ratio-marks]');
  const status = q<HTMLElement>(tool, '[data-ratio-status]');
  let a = 3;
  let b = 2;
  let name = 'Fifth';

  const xAt = (t: number) => x0 + ((xl - x0) * t) / WINDOW;

  function draw() {
    const high = (LOW * a) / b;
    // the higher string is b/a as long as the lower one
    const xb = x0 + (xl - x0) * (b / a);
    upper.setAttribute('d', `M${x0} 40L${xb} 40`);
    dead.setAttribute('d', `M${xb} 40L${xl} 40`);
    knob.setAttribute('cx', String(xb));
    upperLabel.textContent = `Higher note: ${hz(high)} vibrations a second`;

    let d = '';
    for (let i = 0; i <= 360; i++) {
      const t = (i / 360) * WINDOW;
      const y = 100 - 44 * (Math.sin(2 * Math.PI * LOW * t) + Math.sin(2 * Math.PI * high * t));
      d += `${i ? 'L' : 'M'}${xAt(t).toFixed(1)} ${y.toFixed(1)}`;
    }
    sum.setAttribute('d', d);

    // vertical lines where the pattern starts again
    while (marks.firstChild) marks.removeChild(marks.firstChild);
    const repeat = b / LOW;
    for (let k = 0; k * repeat <= WINDOW + 1e-9; k++) {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('class', 'repeat');
      line.setAttribute('x1', String(xAt(k * repeat)));
      line.setAttribute('x2', String(xAt(k * repeat)));
      line.setAttribute('y1', '6');
      line.setAttribute('y2', '194');
      marks.appendChild(line);
    }
    const ms = repeat * 1000;
    const inWindow = repeat <= WINDOW;
    status.textContent =
      `${name}, ${a} to ${b}: ${hz(high)} against ${LOW} vibrations a second. ` +
      `The sum repeats after ${b} swing${b > 1 ? 's' : ''} of the lower note and ${a} of the higher one, that is every ${ms < 10 ? ms.toFixed(1) : Math.round(ms)} thousandths of a second. ` +
      (inWindow ? `That fits ${Math.floor(WINDOW / repeat + 1e-9)} times in the picture.` : 'That is longer than the picture, so the line never gets to repeat. It looks ragged.');
  }

  for (const p of picks) {
    p.addEventListener('click', () => {
      const [x, y, n] = p.dataset.ratioPick!.split(',');
      a = Number(x);
      b = Number(y);
      name = n;
      for (const o of picks) o.setAttribute('aria-pressed', String(o === p));
      draw();
      sound.pluck(LOW, [1, 0.2], 1.4);
      sound.pluck((LOW * a) / b, [1, 0.2], 1.4);
    });
  }
  q<HTMLButtonElement>(tool, '[data-ratio-together]').addEventListener('click', () => {
    sound.pluck(LOW, [1, 0.2], 2);
    sound.pluck((LOW * a) / b, [1, 0.2], 2);
  });
  q<HTMLButtonElement>(tool, '[data-ratio-after]').addEventListener('click', () => {
    sound.pluck(LOW, [1, 0.2], 1.1);
    window.setTimeout(() => sound.pluck((LOW * a) / b, [1, 0.2], 1.1), 850);
  });
  draw();
}
