// Try 4: a keyword flattens the letter counts.

import { q } from '../util';
import { ENGLISH, LONG, chartHtml, counts, vigenere } from '../../lib/cipher';

export function initKeyword(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-keyword-tool]');
  if (!tool) return;
  const input = q<HTMLInputElement>(tool, '[data-keyword-input]');
  const flat = q(tool, '[data-keyword-flat]');
  const status = q<HTMLElement>(tool, '[data-keyword-status]');
  const top = (c: number[]) => Math.round(Math.max(...c) * 1000) / 10;
  const plain = counts(vigenere(LONG, 'D'));

  function draw() {
    const key = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    const c = counts(vigenere(LONG, key || 'A'));
    flat.innerHTML = chartHtml(c, ENGLISH);
    status.textContent = key
      ? `After a plain shift the tallest bar is ${top(plain)} per cent of the letters. With the keyword ${key} it is ${top(c)} per cent${top(c) < top(plain) - 1.5 ? ', so there is less of a tall bar to point to the key.' : '.'}${key.length === 1 ? ' A one letter keyword is just a plain shift.' : ''}`
      : 'Type a keyword of letters.';
  }
  input.addEventListener('input', draw);
  draw();
}
