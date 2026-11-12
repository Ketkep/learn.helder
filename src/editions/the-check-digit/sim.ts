// The experiment of "The digit that checks the others": a reading the reader can change, digit by digit
// or by swapping neighbours. Every change redraws the bars, the products, the total and the verdict.
// The goals go to the edition (flow.ts) as the reader does the things on the list.
// Nothing moves by itself, so there is nothing to stop for reduced motion.

import { PACK, WEIGHTS, accepted, differences, swapSlips, total } from './model';
import { barcode } from './draw';

const sim = document.querySelector<HTMLElement>('[data-cd-sim]');
if (sim) start(sim);

function start(sim: HTMLElement) {
  const $ = <T extends Element>(s: string) => sim.querySelector<T>(s);
  const inputs = [...sim.querySelectorAll<HTMLInputElement>('[data-cd-in]')];
  const verdict = $<HTMLElement>('[data-cd-verdict]');
  if (inputs.length !== 13 || !verdict) return;

  const read = [...PACK];
  let lastSwap: [number, number] | null = null;
  let swaps = 0;

  const goal = (id: string) => sim.dispatchEvent(new CustomEvent('learndle:goal', { detail: id, bubbles: true }));
  const text = (sel: string, t: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.textContent = t;
  };

  function draw(fromSwap = false) {
    const diff = differences(read, PACK);
    const sum = total(read);
    const ok = accepted(read);
    inputs.forEach((input, i) => {
      if (input.value !== String(read[i])) input.value = String(read[i]);
      input.closest('[data-cd-cell]')?.toggleAttribute('data-changed', diff.includes(i));
      const p = $<HTMLElement>(`[data-cd-p="${i}"]`);
      if (p) p.textContent = String(read[i] * WEIGHTS[i]);
    });
    const bars = $<HTMLElement>('[data-cd-bars]');
    if (bars) bars.innerHTML = barcode(read, diff);
    text('[data-cd-total]', String(sum));
    text('[data-cd-ends]', `it ends in ${sum % 10}`);

    let state: string;
    let say: string;
    if (!diff.length) {
      state = 'ok';
      say = '<strong>Accepted.</strong> This is the code on the pack.';
    } else if (!ok) {
      state = 'no';
      say = `<strong>Rejected.</strong> The total should end in 0, so the scanner knows it misread and tries again.`;
    } else {
      state = 'slip';
      const how =
        fromSwap && lastSwap && swapSlips(read[lastSwap[0]], read[lastSwap[1]])
          ? ` You swapped a ${read[lastSwap[1]]} and a ${read[lastSwap[0]]}: they are 5 apart.`
          : diff.length > 1
            ? ' The changes cancel each other out.'
            : '';
      say = `<strong>Accepted, but wrong.</strong> This is not the code on the pack. The mistake slipped through.${how}`;
    }
    verdict!.dataset.state = state;
    const sayEl = $<HTMLElement>('[data-cd-say]');
    if (sayEl) sayEl.innerHTML = say;

    if (diff.length === 1) goal('single');
    if (diff.length && ok) goal('slip');
  }

  inputs.forEach((input, i) => {
    input.addEventListener('focus', () => input.select());
    input.addEventListener('input', () => {
      // Keep only the last digit typed
      const digit = input.value.replace(/\D/g, '').slice(-1);
      if (digit !== '') read[i] = Number(digit);
      lastSwap = null;
      draw();
      input.select();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      read[i] = (read[i] + (e.key === 'ArrowUp' ? 1 : 9)) % 10;
      lastSwap = null;
      draw();
      input.select();
    });
  });

  const pair = $<HTMLSelectElement>('[data-cd-pair]');
  $('[data-cd-swap]')?.addEventListener('click', () => {
    if (!pair) return;
    const i = Number(pair.value);
    const a = read[i];
    const b = read[i + 1];
    read[i] = b;
    read[i + 1] = a;
    lastSwap = [i, i + 1];
    if (a !== b) {
      goal('swap');
      swaps++;
    }
    draw(true);
    // After a few swaps without luck, a hint about what to look for
    const hint = $<HTMLElement>('[data-cd-hint]');
    if (hint && swaps >= 3 && !swapSlips(a, b)) hint.hidden = false;
  });

  $('[data-cd-reset]')?.addEventListener('click', () => {
    PACK.forEach((d, i) => (read[i] = d));
    lastSwap = null;
    draw();
  });

  draw();
}
