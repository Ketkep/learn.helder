// Decibel maths for the loudness page. Used by the page at build time and by the scripts in the browser.

/** How many times more intense a sound is than the quietest sound we can hear, for a level in decibels. */
export const intensityRatio = (db: number) => 10 ** (db / 10);

/** The level of two sounds played together, in decibels. Intensities add, levels do not. */
export const combine = (a: number, b: number) => 10 * Math.log10(10 ** (a / 10) + 10 ** (b / 10));

/** The level at a distance from a small source in open air, given its level at one metre. Each doubling of the distance loses about 6 decibels. */
export const atDistance = (levelAt1m: number, metres: number) => levelAt1m - 20 * Math.log10(metres);

/** Hours of exposure a day that NIOSH recommends at a level in dBA: 8 hours at 85, halved for every 3 more. */
export const niosh = (db: number) => 8 / 2 ** ((db - 85) / 3);

/** Hours a day that OSHA allows: 8 hours at 90, halved for every 5 more. */
export const osha = (db: number) => 8 / 2 ** ((db - 90) / 5);

export function fmtHours(h: number): string {
  const minutes = h * 60;
  if (minutes < 1) return 'less than a minute';
  if (minutes < 90) return `${Math.round(minutes)} minute${Math.round(minutes) === 1 ? '' : 's'}`;
  if (h < 24) return `${Math.round(h * 10) / 10} hours`;
  return 'all day';
}

export function fmtRatio(r: number): string {
  if (r < 1000) return `${Math.round(r).toLocaleString('en-US')} times`;
  const e = Math.floor(Math.log10(r));
  const m = r / 10 ** e;
  const words: Record<number, string> = { 3: 'thousand', 6: 'million', 9: 'billion', 12: 'trillion' };
  if (words[e] && Math.abs(m - 1) < 0.05) return `1 ${words[e]} times`;
  return `${m.toFixed(1)} × 10 to the power of ${e} times`;
}

/** Sounds with their levels, from sources: a typical level in decibels. */
export const examples: { db: number; name: string }[] = [
  { db: 0, name: 'the quietest sound a young ear can hear (the zero of the scale)' },
  { db: 30, name: 'a soft whisper' },
  { db: 60, name: 'a normal conversation' },
  { db: 110, name: 'a rock concert (sources give 110 to 140)' },
  { db: 130, name: 'a jet taking off, seen from 100 to 200 feet' },
  { db: 140, name: 'a jet engine close by' },
];

export function nearest(db: number) {
  return examples.reduce((best, e) => (Math.abs(e.db - db) < Math.abs(best.db - db) ? e : best));
}

export function zone(db: number): string {
  if (db <= 70) return 'quiet';
  if (db < 85) return 'loud';
  if (db < 100) return 'harmful over hours';
  return 'harmful in minutes';
}
