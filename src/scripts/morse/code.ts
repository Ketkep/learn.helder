// The Morse alphabet and the timing rules. International Morse code: a dot is 1 unit, a dash is 3 units,
// the gap inside a letter is 1 unit, between letters 3 units, between words 7 units.

export const CODES: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};

const BY_CODE: Record<string, string> = {};
for (const letter of Object.keys(CODES)) BY_CODE[CODES[letter]] = letter;

/** The letter for a string of dots and dashes, or "" when there is none. */
export const decode = (code: string) => BY_CODE[code] ?? '';

/** Time in units for one letter's code: dots 1, dashes 3, and 1 between the signs. */
export function units(code: string) {
  let total = 0;
  for (const c of code) total += c === '-' ? 3 : 1;
  return total + code.length - 1;
}

/** A message as a list of [on, units]: a tone for dots and dashes, silence for the gaps. Unknown characters are skipped. */
export function segments(message: string) {
  const out: [boolean, number][] = [];
  const words = message.toUpperCase().split(/\s+/).map((w) => [...w].filter((c) => CODES[c]));
  const used = words.filter((w) => w.length > 0);
  used.forEach((word, wi) => {
    word.forEach((letter, li) => {
      const code = CODES[letter];
      [...code].forEach((c, ci) => {
        out.push([true, c === '-' ? 3 : 1]);
        if (ci < code.length - 1) out.push([false, 1]);
      });
      if (li < word.length - 1) out.push([false, 3]);
    });
    if (wi < used.length - 1) out.push([false, 7]);
  });
  return out;
}

/** The length of a message in units. */
export const totalUnits = (message: string) => segments(message).reduce((sum, s) => sum + s[1], 0);

/** English letter frequencies in per cent, from a standard table of English text. */
export const FREQUENCY: Record<string, number> = {
  A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702, F: 2.228, G: 2.015, H: 6.094, I: 6.966, J: 0.153,
  K: 0.772, L: 4.025, M: 2.406, N: 6.749, O: 7.507, P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056,
  U: 2.758, V: 0.978, W: 2.36, X: 0.15, Y: 1.974, Z: 0.074,
};
