// Maths and drawings for the password page. The strength of a random password is the number of tries it would take, written in bits:
// the length times the base 2 logarithm of the size of the set it is drawn from. The speeds of the three attacks, the sizes of the sets of
// habits and the number of words in the word list are round numbers made up for this page or taken loosely from the sources, and the page
// says so. Nothing here is security advice. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const SETS = [
  { name: 'Digits', size: 10 },
  { name: 'Lowercase letters', size: 26 },
  { name: 'Upper and lowercase', size: 52 },
  { name: 'Letters and digits', size: 62 },
  { name: 'Letters, digits and symbols', size: 94 },
];

export const WORDS = 7776;

/** Speeds in guesses a second: made-up round numbers inspired by the sources. */
export const ATTACKS = [
  { name: 'A web login with limits', rate: 1 },
  { name: 'A stolen file, slow hash', rate: 10_000 },
  { name: 'A stolen file, fast hash', rate: 10_000_000_000 },
];

/** Bits of strength of a password drawn at random from a set. */
export const bits = (size: number, length: number) => length * Math.log2(size);

export const bitsOfWords = (n: number) => n * Math.log2(WORDS);

/** Seconds to try half of all possibilities, which is how long it takes on average to hit the right one. */
export const seconds = (b: number, rate: number) => Math.pow(2, b - 1) / rate;

/** A time in plain words. */
export function span(s: number): string {
  if (s < 1) return 'less than a second';
  if (s < 90) return `${fmt(s)} seconds`;
  if (s < 5400) return `${fmt(s / 60)} minutes`;
  if (s < 129600) return `${fmt(s / 3600)} hours`;
  if (s < 86400 * 400) return `${fmt(s / 86400)} days`;
  const y = s / (86400 * 365.25);
  if (y < 1000) return `${fmt(y)} years`;
  if (y < 1e6) return `${fmt(y / 1000)} thousand years`;
  if (y < 1e9) return `${fmt(y / 1e6)} million years`;
  if (y < 1e12) return `${fmt(y / 1e9)} billion years`;
  return 'more than a trillion years';
}

/** Habits: made-up sizes for the set of guesses an attacker would try first. */
export const HABITS = [
  { name: 'Random, 8 characters from 94', bits: bits(94, 8), note: 'Drawn at random from every key on the keyboard.' },
  { name: 'Four random words', bits: bitsOfWords(4), note: 'Four words picked at random from a list of 7776.' },
  { name: 'A common word, a capital, two digits and a symbol', bits: Math.log2(100000 * 2 * 100 * 10), note: 'Looks complicated, but the choices are few. The size of the set is made up: 100,000 words.' },
  { name: 'A birthday as digits', bits: Math.log2(366 * 100), note: 'A day and a year: about 36,600 choices.' },
];

/** A row of lock dials, one for each place in the password, filled to the length. */
export function dialsSvg(size: number, length: number): string {
  const n = Math.min(24, length);
  const w = 276 / 24;
  let o = `<rect class="door" x="1" y="1" width="298" height="118" rx="8"/>`;
  for (let i = 0; i < 24; i++) o += `<rect class="${i < n ? 'cell on' : 'cell'}" x="${f1(12 + i * w + 1)}" y="44" width="${f1(w - 3)}" height="40" rx="3"/>`;
  o += `<text class="lab" x="12" y="20">${length} places, ${size} choices for each</text>`;
  o += `<text class="lab small" x="12" y="108">Each place multiplies the number of tries by ${size}</text>`;
  return o;
}

/** A bar for strength in bits, with ticks. */
export function barSvg(rows: { name: string; bits: number }[]): string {
  const top = 110;
  let o = `<rect class="door" x="1" y="1" width="298" height="${24 + rows.length * 34}" rx="8"/>`;
  rows.forEach((r, i) => {
    const y = 30 + i * 34;
    o += `<text class="lab small" x="10" y="${y + 10}">${r.name}</text>`;
    o += `<rect class="bar" x="10" y="${y + 14}" width="${f1(Math.max(2, (Math.min(r.bits, top) / top) * 228))}" height="10" rx="3"/>`;
    o += `<text class="lab small" x="${f1(14 + (Math.min(r.bits, top) / top) * 228)}" y="${y + 23}">${fmt(r.bits, 1)}</text>`;
  });
  o += `<text class="lab" x="10" y="18">Strength in bits (longer bar, harder)</text>`;
  return o;
}
