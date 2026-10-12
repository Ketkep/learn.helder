// Leaf colour maths for the leaves page. Used by the page at build time and by the scripts in the browser.
// These are toy models with typical numbers, made for this page. Real leaves vary a lot.

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export interface Pigments {
  /** Green chlorophyll, 0 to 1. */
  chlorophyll: number;
  /** Yellow and orange carotenoids, 0 to 1. */
  carotenoid: number;
  /** Red and purple anthocyanins, 0 to 1. */
  anthocyanin: number;
}

/** The colour of a leaf from how much of each pigment it holds. Each pigment soaks up some colours and lets the rest through. */
export function leafColour(p: Pigments): [number, number, number] {
  const base = [250, 245, 225];
  const chl = [1 - 0.75 * p.chlorophyll, 1 - 0.1 * p.chlorophyll, 1 - 0.8 * p.chlorophyll];
  const car = [1, 1 - 0.2 * p.carotenoid, 1 - 0.9 * p.carotenoid];
  const ant = [1 - 0.1 * p.anthocyanin, 1 - 0.85 * p.anthocyanin, 1 - 0.5 * p.anthocyanin];
  // A real leaf is darker than a sheet of paper, and a green one is darker than a golden one
  const dim = 0.78 + 0.12 * (1 - p.chlorophyll);
  return base.map((b, i) => Math.round(b * chl[i] * car[i] * ant[i] * dim)) as [number, number, number];
}

export const rgb = (c: number[]) => `rgb(${c.join(', ')})`;

export function colourWord(c: [number, number, number]): string {
  const [r, g, b] = c.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let hue = 0;
  if (d > 0) hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  hue = (hue * 60 + 360) % 360;
  if (sat < 0.25) return 'pale brown';
  if (hue >= 90 && hue < 170) return 'green';
  if (hue >= 65 && hue < 90) return 'yellow green';
  if (hue >= 45 && hue < 65) return 'yellow';
  if (hue >= 25 && hue < 45) return l > 0.5 ? 'orange' : 'brown';
  if (hue < 25 || hue >= 330) return l < 0.45 && sat < 0.55 ? 'brown' : 'red';
  return 'purple';
}

// ---- The season ----
export const WEEKS = 8;

export interface Weather {
  /** Bright sunny days and cool nights that stay above freezing. */
  sunny: boolean;
  /** A hard frost in week 4 ends the show. */
  frost: boolean;
}

export const FROST_WEEK = 4;

/** The pigments of a leaf in some week after the end of summer. */
export function season(week: number, w: Weather): Pigments {
  // Chlorophyll is made less and broken down faster as the days shorten and the nights cool
  let chlorophyll = 1 / (1 + Math.exp((week - 3.5) * 1.4));
  if (w.frost && week > FROST_WEEK) chlorophyll *= Math.exp(-(week - FROST_WEEK) * 1.2);
  const carotenoid = 0.35 - 0.025 * week;
  // Anthocyanins are made in the autumn, more when the days are bright and sugar builds up in the leaf
  const amount = w.sunny ? 0.9 : 0.15;
  const stop = w.frost ? Math.min(week, FROST_WEEK) : week;
  const anthocyanin = amount * clamp((stop - 2) / 3);
  return { chlorophyll: clamp(chlorophyll), carotenoid: clamp(carotenoid), anthocyanin: clamp(anthocyanin) };
}

// ---- Paper chromatography ----
export interface Band {
  name: string;
  colour: string;
  /** How far up the paper it travels, 0 to 1. Solvents differ, so these are typical positions. */
  height: number;
}

export const bands: Band[] = [
  { name: 'Carotene', colour: '#e8a317', height: 0.92 },
  { name: 'Xanthophyll', colour: '#d8c43a', height: 0.7 },
  { name: 'Chlorophyll a', colour: '#2f9e8f', height: 0.55 },
  { name: 'Chlorophyll b', colour: '#7a9a2f', height: 0.38 },
];

/** How strong each band is in a summer leaf and in an autumn leaf, 0 to 1. */
export const strength = {
  summer: [0.45, 0.45, 1, 0.75],
  autumn: [0.45, 0.5, 0.12, 0.08],
};
