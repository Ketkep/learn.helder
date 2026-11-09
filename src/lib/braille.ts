// Small sums and drawings for the braille page. A cell has six places, numbered 1 to 3 down the left and 4 to 6 down the right. Each place
// is raised or not, so there are 2 to the power 6 patterns: 64, or 63 if the empty cell is left out. The letters are English braille grade 1.
// The same text is made at build time (Astro) and in the browser.

export const fmt = (n: number) => n.toLocaleString('en-US');

/** The dots of each letter. a to j use only dots 1, 2, 4 and 5. k to t add dot 3. u, v, x, y and z add dots 3 and 6. w is j with dot 6. */
export const LETTERS: Record<string, number[]> = (() => {
  const base = [[1], [1, 2], [1, 4], [1, 4, 5], [1, 5], [1, 2, 4], [1, 2, 4, 5], [1, 2, 5], [2, 4], [2, 4, 5]];
  const out: Record<string, number[]> = {};
  'abcdefghij'.split('').forEach((l, i) => (out[l] = base[i]));
  'klmnopqrst'.split('').forEach((l, i) => (out[l] = [...base[i], 3]));
  'uvxyz'.split('').forEach((l, i) => (out[l] = [...base[i], 3, 6]));
  out.w = [2, 4, 5, 6];
  return out;
})();

export const CAPITAL = [6];
export const NUMBER = [3, 4, 5, 6];

export const key = (dots: number[]) => [...dots].sort((a, b) => a - b).join('');

/** The letter for a pattern, if there is one. */
export function letterOf(dots: number[]): string | undefined {
  const k = key(dots);
  return Object.keys(LETTERS).filter((l) => key(LETTERS[l]) === k)[0];
}

/** What a pattern means: a letter, a sign, the empty cell, or nothing on this page. */
export function meaning(dots: number[]): string {
  const k = key(dots);
  if (!k) return 'An empty cell. It is the space between words.';
  const l = letterOf(dots);
  if (l) {
    const n = 'jabcdefghi'.indexOf(l);
    return `The letter ${l.toUpperCase()}${n >= 0 ? `, or the number ${n} after a number sign` : ''}.`;
  }
  if (k === key(CAPITAL)) return 'The capital sign. It comes before a letter to make it a capital.';
  if (k === key(NUMBER)) return 'The number sign. Letters A to J after it are the numbers 1 to 9 and 0.';
  return 'No letter on this page. Other patterns are used for punctuation, short forms of common words and other signs.';
}

/** The text for a pattern: its dot numbers. */
export const say = (dots: number[]) => (dots.length ? `${dots.length === 1 ? 'dot' : 'dots'} ${key(dots).split('').join(', ')}` : 'no dots');

/** The cells for a text: a capital sign before each capital letter, and a number sign before a run of digits. Other characters are skipped. */
export function cellsFor(text: string): { dots: number[]; label: string }[] {
  const out: { dots: number[]; label: string }[] = [];
  let digits = false;
  for (const ch of text) {
    const lower = ch.toLowerCase();
    if (ch >= '0' && ch <= '9') {
      if (!digits) out.push({ dots: NUMBER, label: '#' });
      digits = true;
      const l = 'jabcdefghi'[Number(ch)];
      out.push({ dots: LETTERS[l], label: ch });
      continue;
    }
    digits = false;
    if (ch === ' ') out.push({ dots: [], label: ' ' });
    else if (LETTERS[lower]) {
      if (ch !== lower) out.push({ dots: CAPITAL, label: 'cap' });
      out.push({ dots: LETTERS[lower], label: lower });
    }
  }
  return out;
}

const DX = [0, 0, 0, 1, 1, 1];
const DY = [0, 1, 2, 0, 1, 2];

/** One cell drawn at x, y. Raised dots are filled, flat places are small rings. */
export function cellSvg(dots: number[], x: number, y: number, s = 1, fresh: number[] = []) {
  let out = '';
  for (let d = 1; d <= 6; d++) {
    const cx = x + (6 + DX[d - 1] * 14) * s;
    const cy = y + (6 + DY[d - 1] * 14) * s;
    out += dots.indexOf(d) >= 0 ? `<circle class="up${fresh.indexOf(d) >= 0 ? ' new' : ''}" cx="${cx}" cy="${cy}" r="${5 * s}"/>` : `<circle class="flat" cx="${cx}" cy="${cy}" r="${1.8 * s}"/>`;
  }
  return out;
}

const W = 420;

/** The three rows of the alphabet as cells, with the letters under them. With a row chosen, the other rows fade and its new dots are marked. */
export function rowsSvg(row = -1): string {
  const rows = ['abcdefghij', 'klmnopqrst', 'uvwxyz'];
  const fresh = [[], [3], [3, 6]];
  let out = '';
  rows.forEach((r, ri) => {
    const y = ri * 62 + 4;
    out += `<g opacity="${row < 0 || row === ri ? 1 : 0.3}">`;
    r.split('').forEach((l, i) => {
      const x = 8 + i * 40;
      out += cellSvg(LETTERS[l], x, y, 1, l === 'w' ? [6] : fresh[ri]);
      out += `<text class="lab mid" x="${x + 13}" y="${y + 52}">${l}</text>`;
    });
    out += '</g>';
  });
  return out;
}

/** A line of cells wrapped to rows of eight, as svg inside a width of 420. Returns the drawing and its height. */
export function writeSvg(text: string) {
  const cells = cellsFor(text);
  const per = 8;
  const rows = Math.max(1, Math.ceil(cells.length / per));
  let out = '';
  cells.forEach((c, i) => {
    const x = 10 + (i % per) * 50;
    const y = Math.floor(i / per) * 66 + 4;
    out += cellSvg(c.dots, x, y, 1);
    out += `<text class="lab mid small" x="${x + 13}" y="${y + 52}">${c.label === ' ' ? '' : c.label}</text>`;
  });
  return { svg: out, h: rows * 66 + 8, count: cells.length };
}
