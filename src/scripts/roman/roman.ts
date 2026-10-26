// The Roman numerals page: four carvings. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { addSteps, fmt, judge, lengths, toRoman } from '../../lib/roman';

const root = document.querySelector<HTMLElement>('[data-roman]');

if (root) {
  initSoundButton(root);

  // Carving 1: convert
  const co = root.querySelector<HTMLElement>('[data-convert-tool]');
  if (co) {
    const n = q<HTMLInputElement>(co, '[data-convert-n]');
    const r = q<HTMLInputElement>(co, '[data-convert-r]');
    const status = q(co, '[data-convert-status]');
    n.addEventListener('input', () => {
      const v = Number(n.value.replace(/\D/g, ''));
      if (!v) {
        r.value = '';
        status.textContent = 'Type a number from 1 to 3,999.';
      } else if (v > 3999) {
        r.value = '';
        status.textContent = `${fmt(v)} is more than 3,999. With the usual rules the seven letters cannot write it.`;
      } else {
        r.value = toRoman(v);
        status.textContent = `${fmt(v)} is ${toRoman(v)}. This is the standard way to write it.`;
      }
    });
    r.addEventListener('input', () => {
      const s = r.value.toUpperCase().replace(/[^IVXLCDM]/g, '');
      const j = judge(s);
      if (s) n.value = j.value > 0 ? String(j.value) : '';
      status.textContent = s ? `${s} is read as ${fmt(j.value)}. ${j.reason}` : 'Type a numeral, with the letters I, V, X, L, C, D and M.';
    });
  }

  // Carving 2: build a numeral
  const bu = root.querySelector<HTMLElement>('[data-build-tool]');
  if (bu) {
    let row = '';
    const draw = () => {
      q(bu, '[data-build-row]').textContent = row || '(empty)';
      const j = judge(row);
      q(bu, '[data-build-status]').textContent = row ? `${row} is read as ${fmt(j.value)}. ${j.reason}${row === 'IIII' ? ' Clocks often keep IIII.' : ''}` : 'Add a letter to start.';
    };
    bu.querySelectorAll<HTMLElement>('[data-build-add]').forEach((b) =>
      b.addEventListener('click', () => {
        if (row.length < 16) row += b.getAttribute('data-build-add');
        sound.play('tick', 0.3);
        draw();
      }),
    );
    q(bu, '[data-build-back]').addEventListener('click', () => {
      row = row.slice(0, -1);
      draw();
    });
    q(bu, '[data-build-clear]').addEventListener('click', () => {
      row = '';
      draw();
    });
    row = 'IIII';
    draw();
  }

  // Carving 3: how long can it get
  const le = root.querySelector<HTMLElement>('[data-length-tool]');
  if (le) {
    const range = q<HTMLInputElement>(le, '[data-length-range]');
    const counts = lengths();
    const draw = () => {
      fillRange(range);
      const v = Number(range.value);
      const s = toRoman(v);
      q(le, '[data-length-out]').textContent = fmt(v);
      le.querySelectorAll('[data-len]').forEach((li) => li.classList.toggle('on', Number(li.getAttribute('data-len')) === s.length));
      q(le, '[data-length-status]').textContent = `${fmt(v)} is ${s}, with ${s.length} letter${s.length === 1 ? '' : 's'}. ${counts[s.length] === 1 ? 'It is the only number from 1 to 3,999 with that many.' : `${fmt(counts[s.length])} of the numbers from 1 to 3,999 have that many.`}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Carving 4: adding the old way
  const ad = root.querySelector<HTMLElement>('[data-add-tool]');
  if (ad) {
    const ra = q<HTMLInputElement>(ad, '[data-add-ra]');
    const rb = q<HTMLInputElement>(ad, '[data-add-rb]');
    const draw = () => {
      [ra, rb].forEach(fillRange);
      const a = Number(ra.value);
      const b = Number(rb.value);
      q(ad, '[data-add-a]').textContent = fmt(a);
      q(ad, '[data-add-b]').textContent = fmt(b);
      q(ad, '[data-add-steps]').innerHTML = addSteps(a, b).map((s) => `<li>${s}</li>`).join('');
      q(ad, '[data-add-status]').textContent = `${toRoman(a)} + ${toRoman(b)}: ${a + b <= 3999 ? `${toRoman(a + b)}, which is ${fmt(a + b)}.` : 'too big for the usual rules.'}`;
    };
    ra.addEventListener('input', draw);
    rb.addEventListener('input', draw);
    draw();
  }
}
