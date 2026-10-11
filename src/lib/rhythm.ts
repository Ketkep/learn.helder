// Rhythm maths for the rhythm page. Used by the page at build time and by the scripts in the browser.

/** The seconds one beat lasts at a tempo in beats per minute. */
export const beatSeconds = (bpm: number) => 60 / bpm;

/**
 * A pattern of k hits spread as evenly as possible over n steps, as booleans. This is the idea behind
 * Toussaint's Euclidean rhythms. The pattern is always the same up to where you start counting.
 */
export function euclid(k: number, n: number): boolean[] {
  return Array.from({ length: n }, (_, i) => (i * k) % n < k);
}

/** A pattern as text: x for a hit and a dot for a rest. */
export const asText = (p: boolean[]) => p.map((h) => (h ? 'x' : '.')).join('');

/** Rhythms with names, as (hits, steps). Several are the same rhythm turned: they start on a different step. */
export const named: { k: number; n: number; where: string; text: string }[] = [
  { k: 3, n: 8, where: 'Cuba, where it is called the tresillo, and the USA, where it is often called the habanera rhythm', text: 'This is the Cuban tresillo, often called the habanera rhythm in the USA.' },
  { k: 5, n: 8, where: 'Cuba, where Toussaint calls it the cinquillo, and West Africa, where some sources call it a bell pattern', text: 'Toussaint calls this the Cuban cinquillo, and some other sources call it a West African bell pattern.' },
  { k: 7, n: 12, where: 'Ewe drumming from Ghana, played on a bell', text: 'This is a West African bell pattern, played in Ewe drumming from Ghana.' },
  { k: 4, n: 9, where: 'Turkey, where it is the aksak rhythm, and Dave Brubeck’s Rondo a la Turk', text: 'This is the aksak rhythm of Turkey, and also the beat of Dave Brubeck’s Rondo a la Turk.' },
];

export const nameFor = (k: number, n: number) => named.find((r) => r.k === k && r.n === n);

/** Where each hit lies on a ring, as a point on a circle of radius r, starting at the top and going clockwise. */
export function ringPoint(i: number, n: number, r: number, cx = 110, cy = 110): [number, number] {
  const a = (i / n) * 2 * Math.PI - Math.PI / 2;
  return [Math.round((cx + r * Math.cos(a)) * 10) / 10, Math.round((cy + r * Math.sin(a)) * 10) / 10];
}

export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

/** Steps of a time signature pattern: the number of beats and how many are in a bar. */
export const signatures: { id: string; name: string; beats: number; note: string }[] = [
  { id: '2', name: '2/4', beats: 2, note: 'two beats in a bar, as in a march' },
  { id: '3', name: '3/4', beats: 3, note: 'three beats in a bar, as in a waltz' },
  { id: '4', name: '4/4', beats: 4, note: 'four beats in a bar, the most common in pop' },
  { id: '5', name: '5/4', beats: 5, note: 'five beats in a bar' },
];

/** Beats in the grid presets, 16 steps. */
export const presets: { id: string; name: string; steps: string }[] = [
  { id: 'floor', name: 'Four on the floor', steps: 'x...x...x...x...' },
  { id: 'tresillo', name: 'Tresillo, twice', steps: 'x..x..x.x..x..x.' },
  { id: 'offbeat', name: 'Offbeats', steps: '..x...x...x...x.' },
  { id: 'empty', name: 'Empty', steps: '................' },
];
