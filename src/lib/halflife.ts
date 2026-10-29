// Maths and drawings for the rock age page. The half-lives come from the sources. The atoms that decay in the first tool are drawn at random.
// The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const CLOCKS = [
  { id: 'c14', name: 'Carbon-14', half: 5730, what: 'things that were once alive, such as wood and bone' },
  { id: 'u238', name: 'Uranium-238 (decays to lead)', half: 4.47e9, what: 'tiny crystals in old rocks and meteorites' },
];

/** Years as plain words: 5,730 years, 12 thousand years, 4.5 billion years. */
export function years(y: number): string {
  if (y >= 1e9) return `${fmt(y / 1e9, y >= 1e10 ? 0 : 2)} billion years`;
  if (y >= 1e6) return `${fmt(y / 1e6, y >= 1e7 ? 0 : 1)} million years`;
  if (y >= 1e4) return `${fmt(Math.round(y / 1000))} thousand years`;
  return `${fmt(Math.round(y))} years`;
}

// ---------- Part 1: atoms that decay ----------

/** How many atoms are left after each half-life step. Every atom has an even chance of decaying in a half-life. */
export function runDecay(n: number, steps: number, seed: number): number[] {
  const r = seeded(seed);
  const out = [n];
  let left = n;
  for (let s = 0; s < steps; s++) {
    let stay = 0;
    for (let i = 0; i < left; i++) if (r() < 0.5) stay++;
    left = stay;
    out.push(left);
  }
  return out;
}

export const expected = (n: number, step: number) => n / Math.pow(2, step);

/** The atoms as small squares, the ones that are left lit. Which ones decayed is a fixed shuffle. */
export function atomsSvg(n: number, left: number): string {
  const cols = n <= 16 ? 8 : n <= 100 ? 20 : 40;
  const cell = n <= 16 ? 26 : n <= 100 ? 12 : 6;
  const order = Array.from({ length: n }, (_, i) => i);
  const r = seeded(7 + n);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const alive = new Set(order.slice(0, left));
  const x0 = (300 - cols * cell) / 2;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + (i % cols) * cell;
    const y = 14 + Math.floor(i / cols) * cell;
    s += `<rect class="atom${alive.has(i) ? ' on' : ''}" x="${f1(x + 1)}" y="${f1(y + 1)}" width="${cell - 2}" height="${cell - 2}" rx="${n <= 16 ? 5 : 1}"/>`;
  }
  return s;
}

// ---------- Part 2: reading the clock ----------

/** The age of a sample from the share of the parent atoms that are left: the half-life times how many times the share has halved. */
export const ageFrom = (share: number, half: number) => half * Math.log2(1 / share);

/** The share of the parent atoms left after an age. */
export const shareAfter = (age: number, half: number) => Math.pow(0.5, age / half);

export function barSvg(share: number): string {
  const w = 250 * share;
  return `<rect class="track" x="25" y="40" width="250" height="34" rx="6"/><rect class="parent" x="25" y="40" width="${f1(w)}" height="34" rx="6"/><text class="lab" x="25" y="30">parent atoms left: ${fmt(share * 100, share < 0.01 ? 2 : 1)}%</text><text class="lab" x="275" y="92" text-anchor="end">turned into daughter atoms: ${fmt((1 - share) * 100, share < 0.01 ? 2 : 1)}%</text>`;
}

// ---------- Part 3: the right clock ----------

export const WORKS_FROM = 0.002; // a rule of thumb for this page: below 0.2% of the parent left, too little remains to measure well
export const TOO_YOUNG = 0.99; // above 99% left, too little has decayed to tell

export type Verdict = 'young' | 'ok' | 'old';

export function verdict(age: number, half: number): Verdict {
  const s = shareAfter(age, half);
  return s < WORKS_FROM ? 'old' : s > TOO_YOUNG ? 'young' : 'ok';
}

/** The oldest age a clock can read by the page's rule of thumb, and the youngest. */
export const oldest = (half: number) => ageFrom(WORKS_FROM, half);
export const youngest = (half: number) => ageFrom(TOO_YOUNG, half);

/** The age on the slider: 100 years at 0 up to 5 billion at 100. */
export const sliderAge = (p: number) => 100 * Math.pow(5e9 / 100, p / 100);
