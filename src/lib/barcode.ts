// Maths and drawings for the barcode page. The patterns and the check digit rule come from the sources (UPC-A).
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);

/** Left half patterns for the digits 0 to 9, as 7 modules each: 1 is a bar, 0 is a space. */
export const LEFT = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
/** Right half patterns are the left ones turned inside out. */
export const RIGHT = LEFT.map((p) => p.replace(/[01]/g, (c) => (c === '1' ? '0' : '1')));

export const START = '101';
export const MIDDLE = '01010';
export const END = '101';
export const MODULES = 95; // 3 + 6 x 7 + 5 + 6 x 7 + 3
export const SAMPLE = '03600029145'; // the first 11 digits of a code used as an example

// ---------- The check digit ----------

export const digitsOf = (s: string) => s.split('').map(Number);

export interface Sums {
  odd: number; // digits 1, 3, 5, 7, 9 and 11, from the left
  even: number; // digits 2, 4, 6, 8 and 10
  total: number; // 3 times the odd sum, plus the even sum
  rest: number; // the total modulo 10
  check: number;
}

export function sums(first11: number[]): Sums {
  const odd = first11.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0);
  const even = first11.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0);
  const total = 3 * odd + even;
  const rest = total % 10;
  return { odd, even, total, rest, check: (10 - rest) % 10 };
}

export const checkDigit = (first11: number[]) => sums(first11).check;

/** Does the twelfth digit match the first eleven? */
export const passes = (all12: number[]) => checkDigit(all12.slice(0, 11)) === all12[11];

export const full = (first11: number[]) => [...first11, checkDigit(first11)];

// ---------- Mistakes ----------

export interface Mistakes {
  singles: number; // all ways to change one digit
  singlesCaught: number;
  swaps: number; // neighbouring pairs that differ, so swapping changes the number
  swapsCaught: number;
}

/** Every one-digit slip and every swap of two neighbours, tried against the check. */
export function mistakes(all12: number[]): Mistakes {
  let singles = 0;
  let singlesCaught = 0;
  for (let i = 0; i < 12; i++) {
    for (let d = 0; d < 10; d++) {
      if (d === all12[i]) continue;
      const t = all12.slice();
      t[i] = d;
      singles++;
      if (!passes(t)) singlesCaught++;
    }
  }
  let swaps = 0;
  let swapsCaught = 0;
  for (let i = 0; i < 11; i++) {
    if (all12[i] === all12[i + 1]) continue;
    const t = all12.slice();
    [t[i], t[i + 1]] = [t[i + 1], t[i]];
    swaps++;
    if (!passes(t)) swapsCaught++;
  }
  return { singles, singlesCaught, swaps, swapsCaught };
}

// ---------- Bars ----------

/** The 95 modules of a code: guard, six left digits, middle guard, six right digits, guard. */
export function encode(all12: number[]): string {
  return START + all12.slice(0, 6).map((d) => LEFT[d]).join('') + MIDDLE + all12.slice(6).map((d) => RIGHT[d]).join('') + END;
}

export type Reading =
  | { ok: false; why: string }
  | { ok: true; digits: number[]; passes: boolean };

/** Reads 95 modules back into digits, the way a scanner does once it has the widths. */
export function decode(mods: string): Reading {
  if (mods.slice(0, 3) !== START) return { ok: false, why: 'The start guard is damaged.' };
  if (mods.slice(45, 50) !== MIDDLE) return { ok: false, why: 'The middle guard is damaged.' };
  if (mods.slice(92, 95) !== END) return { ok: false, why: 'The end guard is damaged.' };
  const digits: number[] = [];
  for (let i = 0; i < 12; i++) {
    const at = i < 6 ? 3 + i * 7 : 50 + (i - 6) * 7;
    const group = mods.slice(at, at + 7);
    const k = (i < 6 ? LEFT : RIGHT).indexOf(group);
    if (k < 0) return { ok: false, why: `Digit ${i + 1} is not a valid pattern (${group}).` };
    digits.push(k);
  }
  return { ok: true, digits, passes: passes(digits) };
}

/** Turns a module into its opposite: a smudge on a space, or a gap in a bar. */
export function flip(mods: string, index: number): string {
  if (index < 1 || index > MODULES) return mods;
  const i = index - 1;
  return mods.slice(0, i) + (mods[i] === '1' ? '0' : '1') + mods.slice(i + 1);
}

const QUIET = 9; // empty modules on each side
const VIEW = 300;
const UNIT = VIEW / (MODULES + 2 * QUIET);

/** The bars as SVG text. Guards reach lower than the digit bars. A flipped module is marked. */
export function barsSvg(mods: string, digits: number[] | null = null, marked: number[] = []): string {
  let s = '';
  let i = 0;
  while (i < mods.length) {
    if (mods[i] === '0') {
      i++;
      continue;
    }
    let j = i;
    while (j < mods.length && mods[j] === '1') j++;
    const guard = i < 3 || (i >= 45 && j <= 50) || i >= 92;
    const x = (QUIET + i) * UNIT;
    s += `<rect class="bar" x="${f1(x)}" y="14" width="${f1((j - i) * UNIT)}" height="${guard ? 84 : 76}"/>`;
    i = j;
  }
  for (const m of marked) {
    const x = (QUIET + m - 1) * UNIT;
    s += `<rect class="mark" x="${f1(x)}" y="10" width="${f1(UNIT)}" height="92"/>`;
  }
  if (digits) {
    digits.forEach((d, k) => {
      const at = k < 6 ? 3 + k * 7 : 50 + (k - 6) * 7;
      s += `<text class="dig" x="${f1((QUIET + at + 3.5) * UNIT)}" y="116" text-anchor="middle">${d}</text>`;
    });
  }
  return s;
}

export interface Smudges {
  singles: number; // every way to flip one module
  singlesBad: number; // flips that give a pattern that is not a digit, or break a guard
  pairs: number; // every way to flip two modules
  pairsUnreadable: number;
  pairsRejected: number; // read as digits but the check fails
  pairsPassed: number; // read as digits and the check passes: a wrong code accepted
}

/** Tries every one and two module smudge on a code and sorts what the scanner would do. */
export function smudges(mods: string): Smudges {
  const out: Smudges = { singles: 0, singlesBad: 0, pairs: 0, pairsUnreadable: 0, pairsRejected: 0, pairsPassed: 0 };
  const original = decode(mods);
  const same = (r: Reading) => original.ok && r.ok && r.digits.join('') === original.digits.join('');
  for (let i = 1; i <= MODULES; i++) {
    const one = decode(flip(mods, i));
    out.singles++;
    if (!one.ok || !one.passes) out.singlesBad++;
    for (let j = i + 1; j <= MODULES; j++) {
      const r = decode(flip(flip(mods, i), j));
      out.pairs++;
      if (!r.ok) out.pairsUnreadable++;
      else if (!r.passes) out.pairsRejected++;
      else if (!same(r)) out.pairsPassed++;
    }
  }
  return out;
}
