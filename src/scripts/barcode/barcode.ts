// The barcode page: four scanner windows that share one code. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { barsSvg, decode, digitsOf, encode, flip, full, mistakes, passes, SAMPLE, smudges, sums } from '../../lib/barcode';

const root = document.querySelector<HTMLElement>('[data-barcode]');

if (root) {
  initSoundButton(root);

  let first11 = digitsOf(SAMPLE);
  const all = () => full(first11);

  const bars = root.querySelector<HTMLElement>('[data-bars-tool]');
  const check = root.querySelector<HTMLElement>('[data-check-tool]');
  const typo = root.querySelector<HTMLElement>('[data-typo-tool]');
  const scan = root.querySelector<HTMLElement>('[data-scan-tool]');

  // Window 3: the counts for the whole code
  const drawCounts = () => {
    if (!typo) return;
    const m = mistakes(all());
    q(typo, '[data-typo-singles]').textContent = String(m.singles);
    q(typo, '[data-typo-singles-caught]').textContent = String(m.singlesCaught);
    q(typo, '[data-typo-swaps]').textContent = String(m.swaps);
    q(typo, '[data-typo-swaps-caught]').textContent = String(m.swapsCaught);
  };

  // Window 4: the smudges
  let drawScan = () => {};
  if (scan) {
    const m1 = q<HTMLInputElement>(scan, '[data-scan-m1]');
    const m2 = q<HTMLInputElement>(scan, '[data-scan-m2]');
    const size = q<HTMLInputElement>(scan, '[data-scan-size]');
    const box = q<HTMLElement>(scan, '[data-scan-box]');
    drawScan = () => {
      [m1, m2, size].forEach(fillRange);
      const a = Number(m1.value);
      const b = Number(m2.value);
      q(scan, '[data-scan-out1]').textContent = a ? String(a) : 'none';
      q(scan, '[data-scan-out2]').textContent = b ? String(b) : 'none';
      q(scan, '[data-scan-outsize]').textContent = size.value;
      box.style.width = `${size.value}%`;
      const digits = all();
      let mods = encode(digits);
      const marked: number[] = [];
      for (const x of [a, b]) {
        if (x && !marked.includes(x)) {
          mods = flip(mods, x);
          marked.push(x);
        }
      }
      q(scan, '[data-scan-g]').innerHTML = barsSvg(mods, marked.length ? null : digits, marked);
      const status = q(scan, '[data-scan-status]');
      if (!marked.length) {
        const s = smudges(mods);
        status.textContent = `The scan reads ${digits.join('')} and the check passes. Of the ${s.pairs.toLocaleString('en-US')} ways to flip two slots, ${s.pairsUnreadable.toLocaleString('en-US')} cannot be read, ${s.pairsRejected} read as digits but fail the check, and ${s.pairsPassed === 0 ? 'none' : s.pairsPassed} pass as a wrong code.`;
        return;
      }
      const r = decode(mods);
      status.textContent = !r.ok ? `The scanner cannot read it. ${r.why}` : r.passes ? `It reads ${r.digits.join('')} and the check passes.` : `It reads ${r.digits.join('')}, but the check digit does not match, so the scanner rejects it.`;
    };
    [m1, m2, size].forEach((i) => i.addEventListener('input', drawScan));
    m1.addEventListener('change', () => sound.play('tick', 0.3));
  }

  const redraw = () => {
    const digits = all();
    if (bars) {
      q(bars, '[data-bars-g]').innerHTML = barsSvg(encode(digits), digits);
      q(bars, '[data-bars-status]').textContent = `The code ${digits.join('')} is 95 slots wide. The twelfth digit, ${digits[11]}, is the check digit.`;
    }
    if (check) {
      const s = sums(first11);
      const rows: [string, number][] = [
        ['Digits in places 1, 3, 5, 7, 9, 11 added', s.odd],
        ['That times 3', 3 * s.odd],
        ['Digits in places 2, 4, 6, 8, 10 added', s.even],
        ['Total', s.total],
        ['Last digit of the total', s.rest],
        ['Check digit', s.check],
      ];
      q(check, '[data-check-body]').innerHTML = rows.map(([l, v]) => `<tr><th scope="row">${l}</th><td>${v}</td></tr>`).join('');
      q(check, '[data-check-status]').textContent = `For ${first11.join('')} the total is ${s.total}, its last digit is ${s.rest}, so the check digit is ${s.check}.`;
    }
    drawCounts();
    drawScan();
  };

  // Window 1: type a code
  if (bars) {
    const input = q<HTMLInputElement>(bars, '[data-code-input]');
    input.addEventListener('input', () => {
      const t = input.value.replace(/\D/g, '');
      if (t !== input.value) input.value = t;
      if (t.length === 11) {
        first11 = digitsOf(t);
        redraw();
      } else {
        q(bars, '[data-bars-status]').textContent = `Type 11 digits. You have typed ${t.length}.`;
      }
    });
  }

  // Window 3: make a mistake
  if (typo) {
    const status = q(typo, '[data-typo-status]');
    const verdict = (changed: number[], what: string) => {
      const ok = passes(changed);
      status.textContent = `${what} The code is now ${changed.join('')}. ${ok ? 'The check digit still matches, so the mistake gets through.' : 'The check digit no longer matches, so the scanner rejects it.'}`;
      sound.play(ok ? 'bad' : 'good', 0.4);
    };
    q(typo, '[data-typo-change]').addEventListener('click', () => {
      const place = Number(q<HTMLSelectElement>(typo, '[data-typo-place]').value);
      const d = Number(q<HTMLSelectElement>(typo, '[data-typo-digit]').value);
      const t = all();
      if (t[place - 1] === d) {
        status.textContent = 'That is the digit already there. Pick another.';
        return;
      }
      t[place - 1] = d;
      verdict(t, `Digit ${place} is now ${d}.`);
    });
    q(typo, '[data-typo-do-swap]').addEventListener('click', () => {
      const p = Number(q<HTMLSelectElement>(typo, '[data-typo-swap]').value);
      const t = all();
      if (t[p - 1] === t[p]) {
        status.textContent = 'Those two digits are the same, so swapping changes nothing.';
        return;
      }
      [t[p - 1], t[p]] = [t[p], t[p - 1]];
      verdict(t, `Places ${p} and ${p + 1} are swapped.${Math.abs(t[p - 1] - t[p]) === 5 ? ' They differ by exactly 5.' : ''}`);
    });
  }

  redraw();
}
