// The pictures of "The digit that checks the others", as SVG markup: the barcode of a reading, and the
// grid of every swap of two neighbours. The server draws the first ones, the browser redraws them.
// Colours are fixed: they sit on a white label, the same in light and dark mode.

import { bars, swapSlips } from './model';

export const LABEL = '#ffffff';
const INK = '#14201a';
const SOFT = '#4d5b53';
const GOOD = '#2f6b4f';
const GOOD_WASH = '#cfe5d8';
const BAD = '#b3261e';
const SAME = '#e4e7e5';

/**
 * An EAN-13 barcode with its digits underneath. `marked` are the places (0 to 12) to show in red,
 * `check` draws a box around the check digit.
 */
export function barcode(digits: number[], marked: number[] = [], check = false): string {
  const unit = 3;
  const x0 = 33;
  const top = 10;
  const tall = 100;
  const code = bars(digits);
  const guards = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);
  let rects = '';
  for (let i = 0; i < code.length; i++) {
    if (code[i] !== '1') continue;
    let w = 1;
    while (code[i + w] === '1' && guards.has(i + w) === guards.has(i)) w++;
    rects += `<rect x="${x0 + i * unit}" y="${top}" width="${w * unit}" height="${guards.has(i) ? tall + 12 : tall}" fill="${INK}"/>`;
    i += w - 1;
  }
  // Where each digit is printed: the first one outside the bars, then two groups of six
  const xs = digits.map((_, i) => (i === 0 ? x0 - 14 : i < 7 ? x0 + (3 + (i - 1) * 7 + 3.5) * unit : x0 + (50 + (i - 7) * 7 + 3.5) * unit));
  const text = digits
    .map((d, i) => {
      const red = marked.includes(i);
      return `<text x="${xs[i]}" y="${top + tall + 26}" fill="${red ? BAD : INK}" font-size="22" font-weight="${red ? 800 : 500}" text-anchor="middle" font-family="ui-monospace, Menlo, Consolas, monospace">${d}</text>`;
    })
    .join('');
  const box = check ? `<rect x="${xs[12] - 11}" y="${top + tall + 5}" width="22" height="28" rx="4" fill="none" stroke="${GOOD}" stroke-width="3"/>` : '';
  return `<svg viewBox="0 0 340 150" role="img" aria-label="A barcode for the digits ${digits[0]} ${digits.slice(1, 7).join('')} ${digits.slice(7).join('')}." xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="150" fill="${LABEL}"/>
  ${rects}
  ${text}
  ${box}
</svg>`;
}

/** Every swap of two neighbouring digits a and b: caught (green), no change (grey), or missed (red). */
export function swapGrid(): string {
  const c = 30;
  const x0 = 44;
  const y0 = 44;
  let cells = '';
  for (let a = 0; a < 10; a++) {
    for (let b = 0; b < 10; b++) {
      const x = x0 + b * c;
      const y = y0 + a * c;
      const fill = a === b ? SAME : swapSlips(a, b) ? BAD : GOOD_WASH;
      cells += `<rect x="${x + 1}" y="${y + 1}" width="${c - 2}" height="${c - 2}" rx="3" fill="${fill}"/>`;
      if (swapSlips(a, b)) {
        cells += `<path d="M${x + 9} ${y + 9}l12 12M${x + 21} ${y + 9}l-12 12" stroke="${LABEL}" stroke-width="3" stroke-linecap="round"/>`;
      }
    }
  }
  const labels = Array.from({ length: 10 }, (_, i) => `<text x="${x0 + i * c + c / 2}" y="${y0 - 10}" fill="${SOFT}" font-size="16" text-anchor="middle">${i}</text><text x="${x0 - 12}" y="${y0 + i * c + c / 2 + 6}" fill="${SOFT}" font-size="16" text-anchor="middle">${i}</text>`).join('');
  return `<svg viewBox="0 0 360 360" role="img" aria-label="A 10 by 10 grid of every pair of neighbouring digits. 80 swaps are caught. 10 slip through: 0 and 5, 1 and 6, 2 and 7, 3 and 8, 4 and 9, each way round. On the diagonal the digits are equal, so a swap changes nothing." xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="360" fill="${LABEL}"/>
  <text x="${x0 + 5 * c}" y="16" fill="${INK}" font-size="15" font-weight="700" text-anchor="middle">second digit</text>
  <text x="14" y="${y0 + 5 * c}" fill="${INK}" font-size="15" font-weight="700" text-anchor="middle" transform="rotate(-90 14 ${y0 + 5 * c})">first digit</text>
  ${labels}
  ${cells}
</svg>`;
}
