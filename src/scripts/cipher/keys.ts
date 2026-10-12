// Try 3: how long it takes to try every key, at a made up speed.

import { fillRange, q } from '../util';
import { keysShift, keysSubstitution } from '../../lib/cipher';

const YEAR = 365.25 * 86400;
const AGE_OF_UNIVERSE_YEARS = 13.8e9;

const words: Record<number, string> = { 3: '1 thousand', 4: '10 thousand', 5: '100 thousand', 6: '1 million', 7: '10 million', 8: '100 million', 9: '1 billion', 10: '10 billion', 11: '100 billion', 12: '1 trillion' };

function fmt(s: number): string {
  if (s < 1) return 'less than a second';
  if (s < 3600) return `${Math.round(s / 60)} minutes`;
  if (s < 86400 * 365) return `${(s / 86400).toFixed(1)} days`;
  const y = s / YEAR;
  if (y < 1e6) return `${Math.round(y).toLocaleString('en-US')} years`;
  if (y < 1e9) return `${(y / 1e6).toFixed(1)} million years`;
  if (y < 1e12) return `${(y / 1e9).toFixed(1)} billion years`;
  return `${y.toExponential(1).replace('e+', ' × 10 to the power of ')} years`;
}

export function initKeys(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-keys-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-keys-range]');
  const status = q<HTMLElement>(tool, '[data-keys-status]');

  function draw() {
    const p = Number(range.value);
    fillRange(range);
    q(tool!, '[data-keys-out]').textContent = words[p];
    const rate = 10 ** p;
    const half = keysSubstitution / 2 / rate;
    const years = half / YEAR;
    const compare = years > AGE_OF_UNIVERSE_YEARS ? ` That is ${(years / AGE_OF_UNIVERSE_YEARS).toFixed(1)} times the age of the universe.` : years > 1e6 ? ' That is longer than humans have existed.' : '';
    status.textContent = `At ${words[p]} guesses a second, trying every shift takes ${fmt(keysShift / rate)}. Trying half of the letter arrangements, on average, takes ${fmt(half)}.${compare} But counting letters breaks it without trying keys at all.`;
  }
  range.addEventListener('input', draw);
  draw();
}
