// Cipher maths for the cipher page. Used by the page at build time and by the scripts in the browser.

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Shift every letter along the alphabet. Other characters stay as they are. Capital letters are used throughout. */
export function shift(text: string, by: number): string {
  const n = ((by % 26) + 26) % 26;
  return text
    .toUpperCase()
    .split('')
    .map((c) => {
      const i = ALPHABET.indexOf(c);
      return i < 0 ? c : ALPHABET[(i + n) % 26];
    })
    .join('');
}

/** A Vigenère cipher: each letter is shifted by the matching letter of a repeating keyword. */
export function vigenere(text: string, key: string, decode = false): string {
  const k = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!k) return text.toUpperCase();
  let j = 0;
  return text
    .toUpperCase()
    .split('')
    .map((c) => {
      const i = ALPHABET.indexOf(c);
      if (i < 0) return c;
      const s = ALPHABET.indexOf(k[j++ % k.length]);
      return ALPHABET[(i + (decode ? 26 - s : s)) % 26];
    })
    .join('');
}

/** How many times each letter appears, as a share (0 to 1) of all the letters. */
export function counts(text: string): number[] {
  const c = Array(26).fill(0) as number[];
  let total = 0;
  for (const ch of text.toUpperCase()) {
    const i = ALPHABET.indexOf(ch);
    if (i >= 0) {
      c[i]++;
      total++;
    }
  }
  return total ? c.map((n) => n / total) : c;
}

/** How often each letter is used in English text, in per cent (Lewand's table, rounded). */
export const ENGLISH = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.15, 0.77, 4.0, 2.4, 6.7, 7.5, 1.9, 0.095, 6.0, 6.3, 9.1, 2.8, 0.98, 2.4, 0.15, 2.0, 0.074];

/** The shift that makes a text look most like English, by comparing letter counts. Returns the shift to apply to decode. */
export function bestShift(text: string): number {
  const c = counts(text);
  let best = 0;
  let bestScore = -Infinity;
  for (let s = 0; s < 26; s++) {
    // Decoding by s means letter i of the cipher text is letter (i - s) of the plain text
    let score = 0;
    for (let i = 0; i < 26; i++) score += c[i] * Math.log(ENGLISH[(i - s + 26) % 26] / 100);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

/** A sample message to practise on. */
export const SAMPLE = 'MEET ME AT THE OLD BRIDGE WHEN THE BELLS RING NOON AND BRING THE LETTER WITH THE RED SEAL';

/** Number of keys of a shift cipher and of a general substitution cipher, where each letter has its own partner. */
export const keysShift = 25;
export const keysSubstitution = (() => {
  let f = 1;
  for (let i = 2; i <= 26; i++) f *= i;
  return f;
})();

/** A bar chart of letter shares as HTML. `marks` draws a second pattern (such as English) as small ticks over the bars. */
export function chartHtml(shares: number[], marks?: number[]): string {
  const top = 0.15;
  return shares
    .map((v, i) => {
      const h = Math.min(100, (v / top) * 100);
      const m = marks ? Math.min(100, ((marks[i] / 100) / top) * 100) : 0;
      return `<span class="col"><span class="bar" style="height:${h.toFixed(1)}%"></span>${marks ? `<span class="mark" style="bottom:${m.toFixed(1)}%"></span>` : ''}<span class="lab">${ALPHABET[i]}</span></span>`;
    })
    .join('');
}

/** A longer message for showing how flat the letter counts get with a keyword. */
export const LONG =
  'THE OLD BRIDGE OVER THE RIVER WAS BUILT BY THE TOWN LONG BEFORE ANYONE ALIVE CAN REMEMBER AND EVERY SPRING THE WATER RISES AGAINST ITS STONES BUT IT HAS NEVER MOVED WHEN THE BELLS RING AT NOON THE MARKET FILLS WITH PEOPLE AND THE BAKERS CARRY THEIR BREAD ACROSS THE WATER TO THE SQUARE WHERE THE CHILDREN WAIT';
