// String 3: frequency = start frequency x square root of the tension / thickness.
// (The weight of a string per length goes with the square of its thickness.)

import * as sound from '../sound';
import { fillRange, q, reducedMotion } from '../util';
import { BASE_HZ, hz, noteName } from './music';

export function initTight(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-tight-tool]');
  if (!tool) return;
  const tension = q<HTMLInputElement>(tool, '[data-tight-t]');
  const thick = q<HTMLInputElement>(tool, '[data-tight-d]');
  const tOut = q<HTMLOutputElement>(tool, '[data-tight-t-out]');
  const dOut = q<HTMLOutputElement>(tool, '[data-tight-d-out]');
  const hzEl = q<HTMLElement>(tool, '[data-tight-hz]');
  const noteEl = q<HTMLElement>(tool, '[data-tight-note]');
  const status = q<HTMLElement>(tool, '[data-tight-status]');
  const peg = q<SVGLineElement>(tool, '[data-tight-peg]');
  const string = q<SVGPathElement>(tool, '[data-tight-string]');
  const label = q<HTMLElement>(tool, '[data-tight-label]');

  const times = (v: number) => `${Math.round(v * 100) / 100}×`;
  let frame = 0;

  function update(quiet = false) {
    const t = Number(tension.value) / 100;
    const d = Number(thick.value) / 100;
    const f = (BASE_HZ * Math.sqrt(t)) / d;
    fillRange(tension);
    fillRange(thick);
    tOut.textContent = times(t);
    dOut.textContent = times(d);
    hzEl.textContent = `${hz(f)} Hz`;
    noteEl.textContent = `closest note ${noteName(f)}`;
    label.textContent = `Tension ${times(t)}, thickness ${times(d)}`;
    // The peg turns a little for every doubling of the tension
    peg.setAttribute('transform', `rotate(${Math.log2(t) * 70})`);
    string.style.strokeWidth = String(2.5 + d * 3.5);
    const ratio = f / BASE_HZ;
    const octave = Math.abs(Math.log2(ratio) - Math.round(Math.log2(ratio))) < 0.02 && Math.round(Math.log2(ratio)) !== 0;
    const what = ratio > 1 ? 'higher' : ratio < 1 ? 'lower' : 'the same';
    status.textContent =
      ratio === 1
        ? `Same tension and thickness as the start: ${hz(f)} vibrations a second.`
        : `${hz(f)} vibrations a second, ${Math.round(ratio * 100) / 100} times as many as at the start. The note is ${what}${octave ? `: exactly ${Math.abs(Math.round(Math.log2(ratio))) === 1 ? 'one octave' : 'two octaves'} ${ratio > 1 ? 'up' : 'down'}` : ''}.`;
    if (!quiet) sound.play('tick');
  }

  function pluck() {
    const f = (BASE_HZ * Math.sqrt(Number(tension.value) / 100)) / (Number(thick.value) / 100);
    sound.pluck(f, [1, 0.4, 0.15], 2);
    if (reducedMotion()) return;
    cancelAnimationFrame(frame);
    const began = performance.now();
    const step = (now: number) => {
      const t = (now - began) / 1000;
      if (t > 1.2) return string.setAttribute('d', 'M148 95L885 95');
      const bend = 22 * Math.exp(-t * 3.2) * Math.cos(2 * Math.PI * 4 * t);
      let d = 'M148 95';
      for (let i = 1; i <= 40; i++) d += `L${(148 + (885 - 148) * (i / 40)).toFixed(1)} ${(95 + bend * Math.sin(Math.PI * (i / 40))).toFixed(1)}`;
      string.setAttribute('d', d);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  tension.addEventListener('input', () => update());
  thick.addEventListener('input', () => update());
  q<HTMLButtonElement>(tool, '[data-tight-pluck]').addEventListener('click', pluck);
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-tight-preset]')) {
    b.addEventListener('click', () => {
      const [t, d] = b.dataset.tightPreset!.split(',');
      tension.value = t;
      thick.value = d;
      update(true);
      pluck();
    });
  }
  update(true);
}
