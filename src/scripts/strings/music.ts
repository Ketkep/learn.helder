// Small music helpers for the strings page.

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** The note closest to a frequency, with its octave: 220 gives "A3". A4 is 440 Hz. */
export function noteName(freq: number) {
  const steps = Math.round(12 * Math.log2(freq / 440)); // semitones above A4
  const midi = 69 + steps;
  return `${NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

/** A frequency in plain words: 109.97 becomes "110". */
export const hz = (f: number) => (f >= 100 ? Math.round(f) : Math.round(f * 10) / 10).toLocaleString('en-US');

/** The string with the whole length sounds this note: A2. */
export const BASE_HZ = 110;
