// The model behind "The digit that checks the others": the check digit of a 13 digit barcode number
// (EAN-13, or GTIN-13 in GS1's words), as GS1 describes it. The first 12 digits are multiplied by
// 1, 3, 1, 3... from the left, the check digit by 1, and the total must end in 0.
// Real scanners also check the bar patterns themselves; this model looks only at the check digit.

/** The example number from GS1's own guide to working out a check digit by hand. */
export const PACK = [6, 2, 9, 1, 0, 4, 1, 5, 0, 0, 2, 1, 3];

/** The weight of each of the 13 places. */
export const WEIGHTS = Array.from({ length: 13 }, (_, i) => (i === 12 ? 1 : i % 2 === 0 ? 1 : 3));

/** The weighted total of all 13 digits. A good reading ends in 0. */
export const total = (digits: number[]) => digits.reduce((s, d, i) => s + d * WEIGHTS[i], 0);

export const accepted = (digits: number[]) => total(digits) % 10 === 0;

/** The digit that makes the total of the first 12 (plus itself) end in 0. */
export function checkDigit(first12: number[]): number {
  return (10 - (total([...first12, 0]) % 10)) % 10;
}

/** The places (0 to 12) where a reading differs from the code on the pack. */
export const differences = (a: number[], b: number[]) => a.map((d, i) => (d === b[i] ? -1 : i)).filter((i) => i >= 0);

/** Does swapping two neighbours with these values slip past the check? (Weights 1 and 3.) */
export const swapSlips = (a: number, b: number) => a !== b && (2 * (a - b)) % 10 === 0;

// ------------------------------------------------------------------ the bars
// Each digit is drawn as 7 thin columns, dark (1) or light (0). The left half uses two sets of
// patterns (L and G), and which set each digit uses depends on the first digit. That is how the
// first digit is stored without bars of its own. The right half uses the R set.
const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const R = L.map((p) => p.replace(/./g, (c) => (c === '1' ? '0' : '1')));
const G = R.map((p) => p.split('').reverse().join(''));
const FIRST = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

/** The 95 columns of an EAN-13 barcode, as a string of 0 and 1. */
export function bars(digits: number[]): string {
  const sets = FIRST[digits[0]];
  const left = digits
    .slice(1, 7)
    .map((d, i) => (sets[i] === 'L' ? L[d] : G[d]))
    .join('');
  const right = digits
    .slice(7)
    .map((d) => R[d])
    .join('');
  return `101${left}01010${right}101`;
}
