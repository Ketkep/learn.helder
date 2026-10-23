// The error correcting codes page: four counters. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { bitsOf, circlesSvg, decode, encode, flipSome, fmt, intact, letterOf, NAMES, parityOf, selfTest, syndrome, tripleWrong } from '../../lib/ecc';

const root = document.querySelector<HTMLElement>('[data-ecc]');

function cells(box: HTMLElement, bits: number[], hit: boolean[] = [], extra = '') {
  box.innerHTML = bits.map((b, i) => `<span class="bit${hit[i] ? ' hit' : ''}${extra && i === bits.length - 1 ? ' check' : ''}">${b}</span>`).join('');
}

if (root) {
  initSoundButton(root);

  // Counter 1: the noisy wire
  const no = root.querySelector<HTMLElement>('[data-noise-tool]');
  if (no) {
    const range = q<HTMLInputElement>(no, '[data-noise-range]');
    const bits = bitsOf('H');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value) / 100;
      q(no, '[data-noise-out]').textContent = String(range.value);
      q(no, '[data-noise-status]').textContent = `With a chance of ${range.value}% for each bit, all eight bits arrive unharmed ${fmt(intact(p) * 100, 1)}% of the time.`;
    };
    range.addEventListener('input', draw);
    q(no, '[data-noise-send]').addEventListener('click', () => {
      const p = Number(range.value) / 100;
      const { out, hit } = flipSome(bits, p);
      cells(q(no, '[data-noise-got]'), out, hit);
      q(no, '[data-noise-got-letter]').textContent = letterOf(out);
      const n = hit.filter(Boolean).length;
      q(no, '[data-noise-status]').textContent = n
        ? `${n} bit${n === 1 ? '' : 's'} flipped. The letter H arrived as ${letterOf(out) === '?' ? 'something that is not a letter' : `"${letterOf(out)}"`}.`
        : 'No bit flipped this time. The letter arrived right.';
      sound.play(n ? 'bad' : 'good', 0.3);
    });
    draw();
  }

  // Counter 2: say it three times
  const tr = root.querySelector<HTMLElement>('[data-triple-tool]');
  if (tr) {
    const range = q<HTMLInputElement>(tr, '[data-triple-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value) / 100;
      q(tr, '[data-triple-out]').textContent = range.value;
      const plain = intact(p);
      const three = intact(tripleWrong(p));
      q<HTMLElement>(tr, '[data-triple-plain]').style.width = `${plain * 100}%`;
      q<HTMLElement>(tr, '[data-triple-three]').style.width = `${three * 100}%`;
      q(tr, '[data-triple-plain-num]').textContent = `${fmt(plain * 100, 1)}%`;
      q(tr, '[data-triple-three-num]').textContent = `${fmt(three * 100, 1)}%`;
      q(tr, '[data-triple-status]').textContent = `With a flip chance of ${range.value}%, a letter arrives right ${fmt(plain * 100, 1)}% of the time as it is, and ${fmt(three * 100, 1)}% of the time with three copies and a vote. A single bit goes wrong ${fmt(tripleWrong(p) * 100, 2)}% of the time instead of ${range.value}%. Three copies use 24 bits instead of 8.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Counter 3: one check bit
  const ck = root.querySelector<HTMLElement>('[data-check-tool]');
  if (ck) {
    const base = bitsOf('H').slice(1);
    const sent = [...base, parityOf(base)];
    let word = sent.slice();
    const box = q(ck, '[data-check-bits]');
    const draw = (text: string) => {
      box.innerHTML = word.map((b, i) => `<button type="button" class="bit${i === 7 ? ' check' : ''}${b !== sent[i] ? ' hit' : ''}" data-i="${i}" aria-label="Bit ${i + 1}${i === 7 ? ' (check bit)' : ''}: ${b}">${b}</button>`).join('');
      q(ck, '[data-check-status]').textContent = text;
    };
    const say = () => {
      const flips = word.filter((b, i) => b !== sent[i]).length;
      const ones = word.reduce((a, b) => a + b, 0);
      const ok = ones % 2 === 0;
      if (flips === 0) return 'Nothing flipped. The number of ones is even, so the check passes.';
      if (!ok) return `${flips} bit${flips === 1 ? '' : 's'} flipped. The number of ones is odd, so the check fails. The receiver knows something is wrong, but not which bit.`;
      return `${flips} bits flipped. The number of ones is even again, so the check passes and the mistake slips through.`;
    };
    box.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
      if (!t) return;
      const i = Number(t.getAttribute('data-i'));
      word[i] = 1 - word[i];
      draw(say());
      q<HTMLElement>(box, `[data-i="${i}"]`).focus();
      sound.play('tick', 0.3);
    });
    q(ck, '[data-check-reset]').addEventListener('click', () => {
      word = sent.slice();
      draw('Back to the word as sent. The check bit makes the number of ones even.');
    });
    draw('The word is the letter H and its check bit. Press a bit to flip it.');
  }

  // Counter 4: three circles
  const ci = root.querySelector<HTMLElement>('[data-circles-tool]');
  if (ci) {
    const test = selfTest();
    const dbtns = ci.querySelectorAll<HTMLElement>('[data-circles-d]');
    let d = [1, 0, 1, 1];
    let flips: number[] = [];
    let said = '';
    let decoded = false;
    const wire = () => encode(d).map((b, i) => (flips.includes(i + 1) ? 1 - b : b));
    const draw = () => {
      const w = decoded ? decode(wire()).fixed : wire();
      q(ci, '[data-circles-g]').innerHTML = circlesSvg(w, syndrome(w), decoded ? [] : flips);
      dbtns.forEach((b, i) => {
        b.setAttribute('aria-pressed', d[i] ? 'true' : 'false');
        b.textContent = `Message bit ${i + 1}: ${d[i]}`;
      });
      q(ci, '[data-circles-status]').textContent = said;
    };
    const describe = () => {
      const s = syndrome(wire());
      const failed = s.map((v, i) => (v ? i + 1 : 0)).filter(Boolean);
      if (!flips.length) return `The message ${d.join('')} is sent as seven bits. Every circle holds an even number of ones.`;
      return `${flips.length} bit${flips.length === 1 ? '' : 's'} flipped (${flips.map((f) => NAMES[f - 1]).join(', ')}). ${failed.length ? `Circle${failed.length === 1 ? '' : 's'} ${failed.join(' and ')} ${failed.length === 1 ? 'fails' : 'fail'}.` : 'No circle fails, so the mistake cannot be seen.'} Press Decode.`;
    };
    dbtns.forEach((b, i) =>
      b.addEventListener('click', () => {
        d[i] = 1 - d[i];
        decoded = false;
        said = describe();
        draw();
      }),
    );
    ci.querySelectorAll<HTMLElement>('[data-circles-flip]').forEach((b) =>
      b.addEventListener('click', () => {
        const pos = Number(b.getAttribute('data-circles-flip'));
        flips = flips.includes(pos) ? flips.filter((f) => f !== pos) : [...flips, pos];
        decoded = false;
        said = describe();
        sound.play('tick', 0.3);
        draw();
      }),
    );
    q(ci, '[data-circles-fix]').addEventListener('click', () => {
      const r = decode(wire());
      decoded = true;
      const right = r.data.join('') === d.join('');
      if (!r.at) said = flips.length ? `No circle fails, so the decoder changes nothing. The message comes out as ${r.data.join('')}, which is wrong. Hamming codes cannot see every set of flips.` : `No circle fails. The message is ${r.data.join('')}.`;
      else if (right) said = `The failed circles point at ${NAMES[r.at - 1]}. The decoder flips it back, and the message is ${r.data.join('')}, as sent.`;
      else said = `The failed circles point at ${NAMES[r.at - 1]}, but that is the wrong bit. The decoder flips it and the message comes out as ${r.data.join('')}, not ${d.join('')}. A Hamming code fixes one flip, not two.`;
      sound.play(right ? 'good' : 'bad', 0.4);
      draw();
    });
    q(ci, '[data-circles-reset]').addEventListener('click', () => {
      flips = [];
      decoded = false;
      said = describe();
      draw();
    });
    said = `The message ${d.join('')} is sent as seven bits. Every circle holds an even number of ones. Checked on this page: all ${test.right} of ${test.tried} single flips are put right, and ${test.twoRight} of ${test.twoTried} double flips.`;
    draw();
  }
}
