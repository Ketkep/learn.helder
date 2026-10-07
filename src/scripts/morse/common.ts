// Message 3: the most common letters have the shortest codes. Shuffling the codes shows how much that saves.

import * as sound from '../sound';
import { clear, q } from '../util';
import { CODES, FREQUENCY, units } from './code';

const dots = (code: string) => [...code].map((c) => (c === '-' ? '−' : '·')).join('');
const letters = Object.keys(FREQUENCY);
const total = letters.reduce((sum, l) => sum + FREQUENCY[l], 0);

/** The average time in units for one letter of English, when `codes[l]` is the code of letter l. */
const average = (codes: Record<string, string>) => letters.reduce((sum, l) => sum + FREQUENCY[l] * units(codes[l]), 0) / total;

export function initCommon(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-common-tool]');
  if (!tool) return;
  const list = q<HTMLOListElement>(tool, '[data-common-bars]');
  const status = q<HTMLElement>(tool, '[data-common-status]');
  const sorts = [...tool.querySelectorAll<HTMLButtonElement>('[data-common-sort]')];
  const items = new Map(letters.map((l) => [l, q<HTMLElement>(list, `[data-letter="${l}"]`)]));
  let codes: Record<string, string> = { ...CODES };
  let order = 'freq';
  const real = average(CODES);

  function draw() {
    const sorted = [...letters].sort((a, b) =>
      order === 'abc' ? a.localeCompare(b) : order === 'len' ? units(codes[a]) - units(codes[b]) || FREQUENCY[b] - FREQUENCY[a] : FREQUENCY[b] - FREQUENCY[a],
    );
    clear(list);
    for (const l of sorted) {
      const item = items.get(l)!;
      q<HTMLElement>(item, '[data-code]').textContent = dots(codes[l]);
      list.appendChild(item);
    }
    const now = average(codes);
    const same = Object.keys(CODES).every((l) => codes[l] === CODES[l]);
    status.textContent = same
      ? `With the real codes, the average letter in English takes about ${now.toFixed(1)} units of time to send.`
      : `With these shuffled codes, the average letter takes about ${now.toFixed(1)} units. The real codes need ${real.toFixed(1)}, so a message would take about ${Math.round((now / real - 1) * 100)} per cent ${now > real ? 'longer' : 'less'} to send.`;
  }

  for (const b of sorts) {
    b.addEventListener('click', () => {
      order = b.dataset.commonSort!;
      for (const o of sorts) o.setAttribute('aria-pressed', String(o === b));
      draw();
      sound.play('tick');
    });
  }
  q<HTMLButtonElement>(tool, '[data-common-shuffle]').addEventListener('click', () => {
    const pool = letters.map((l) => CODES[l]);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    codes = {};
    letters.forEach((l, i) => (codes[l] = pool[i]));
    draw();
    sound.play('whoosh', 0.4);
  });
  q<HTMLButtonElement>(tool, '[data-common-real]').addEventListener('click', () => {
    codes = { ...CODES };
    draw();
    sound.play('pop');
  });
  draw();
}
