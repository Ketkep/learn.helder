// Tree ring maths for the rings page. Used by the page at build time and by the scripts in the browser.
// The weather is made up (a seeded random series), so the same stumps and the same patterns appear on every visit.

import { seeded } from './rand';

export const START = 1500;
export const END = 2020;

/** A made up growing season index for each year from START to END: 1 is average, above 1 is a good year, below 1 a poor one. */
export const climate: number[] = (() => {
  const r = seeded(33);
  const out: number[] = [];
  let x = 0;
  for (let y = START; y <= END; y++) {
    x = 0.45 * x + (r() * 2 - 1) * 0.5;
    out.push(Math.min(1.9, Math.max(0.25, 1 + x)));
  }
  return out;
})();

export const indexOf = (year: number) => year - START;

const f1 = (n: number) => Math.round(n * 10) / 10;

/** Widths (in picture units) of the rings of a tree that started at a year, from the middle outwards. Young trees grow fast and old trees slowly. */
export function ringWidths(first: number, last: number): number[] {
  const out: number[] = [];
  for (let y = first; y <= last; y++) {
    const age = y - first;
    out.push((9 / Math.sqrt(1 + age / 8)) * climate[indexOf(y)]);
  }
  return out;
}

/** A stump as SVG: pale rings with a dark line at the end of each year. `mark` shades one ring (1 is the middle). */
export function stumpSvg(widths: number[], mark = 0, size = 100): string {
  const total = widths.reduce((a, b) => a + b, 0);
  const scale = size / Math.max(total, 1);
  let r = 0;
  let out = `<circle class="bark" cx="110" cy="110" r="${f1(size + 6)}"/>`;
  const rings: string[] = [];
  widths.forEach((w, i) => {
    r += w * scale;
    rings.push(`<circle class="ringline${i + 1 === mark ? ' mark' : ''}" cx="110" cy="110" r="${f1(r)}"/>`);
  });
  // The last ring is the outside of the stump, so it is drawn first as a disc
  out += `<circle class="wood" cx="110" cy="110" r="${f1(r)}"/>`;
  out += rings.reverse().join('');
  out += `<circle class="pith" cx="110" cy="110" r="2.5"/>`;
  return out;
}

/** A sample of ring widths that a tree grew in a run of years, with some noise of its own. */
export function sample(first: number, last: number, seed: number, noise = 0.15): number[] {
  const r = seeded(seed);
  return Array.from({ length: last - first + 1 }, (_, i) => climate[indexOf(first + i)] * (1 + (r() * 2 - 1) * noise));
}

export function correlation(a: number[], b: number[]): number {
  const n = a.length;
  const [ma, mb] = [a.reduce((s, v) => s + v, 0) / n, b.reduce((s, v) => s + v, 0) / n];
  let [sab, saa, sbb] = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    sab += (a[i] - ma) * (b[i] - mb);
    saa += (a[i] - ma) ** 2;
    sbb += (b[i] - mb) ** 2;
  }
  return sab / Math.sqrt(saa * sbb);
}

/** How well a sample fits the long record if its first ring was grown in a year. */
export function fit(s: number[], startYear: number): number {
  return correlation(s, climate.slice(indexOf(startYear), indexOf(startYear) + s.length));
}

/** The year that fits best, and how well. */
export function bestStart(s: number[]): { year: number; r: number } {
  let best = { year: START, r: -2 };
  for (let y = START; y + s.length - 1 <= END; y++) {
    const r = fit(s, y);
    if (r > best.r) best = { year: y, r };
  }
  return best;
}

/** The sample timbers to date: when they really grew, and a seed for their own noise. */
export const timbers = [
  { first: 1650, last: 1709, seed: 7, name: 'Beam A' },
  { first: 1788, last: 1847, seed: 8, name: 'Beam B' },
  { first: 1572, last: 1631, seed: 9, name: 'Beam C' },
];

/** The record as a line chart (SVG text) from a year to a year, with the sample drawn over it at a start year. */
export function chartSvg(s: number[], start: number | null, from = START, to = END): string {
  const [x0, x1, y0, y1] = [10, 292, 14, 120];
  const X = (y: number) => f1(x0 + ((x1 - x0) * (y - from)) / (to - from));
  const Y = (v: number) => f1(y1 - ((y1 - y0) * Math.min(2, Math.max(0, v))) / 2);
  const line = (vals: number[], first: number) => vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${X(first + i)} ${Y(v)}`).join('');
  const ticks = [1500, 1600, 1700, 1800, 1900, 2000].map((t) => `<text class="lab" x="${X(t)}" y="${y1 + 14}" text-anchor="middle">${t}</text><line class="tickline" x1="${X(t)}" y1="${y1}" x2="${X(t)}" y2="${y1 + 3}"/>`).join('');
  const rec = `<path class="record" d="${line(climate, START)}"/>`;
  const smp = start === null ? '' : `<path class="sample" d="${line(s, start)}"/>`;
  return `${rec}${smp}${ticks}`;
}

/** Overlapping samples for the long record: each starts about 90 years earlier than the one before, so they overlap by about 20. */
export const samples = [
  { first: 1920, last: 2020, name: 'A living tree' },
  { first: 1840, last: 1940, name: 'A fallen tree' },
  { first: 1760, last: 1860, name: 'A beam in a barn' },
  { first: 1680, last: 1780, name: 'A beam in a church' },
  { first: 1600, last: 1700, name: 'Wood from a wreck' },
  { first: 1520, last: 1620, name: 'A very old beam' },
];

/** Bars for the first n samples, and how far back they take the record. */
export function chain(n: number): string {
  const [x0, x1] = [14, 290];
  const [from, to] = [1500, 2020];
  const X = (y: number) => f1(x0 + ((x1 - x0) * (y - from)) / (to - from));
  const bars = samples
    .slice(0, n)
    .map((s, i) => {
      const w = X(s.last) - X(s.first);
      const y = 14 + i * 24;
      // The label sits left of its bar, or right of it when the bar starts too near the edge
      const tw = s.name.length * 6.4 + 6;
      const left = X(s.first) - 5 >= tw;
      const lab = `<text class="barlab" x="${f1(left ? X(s.first) - 5 : X(s.last) + 5)}" y="${y + 12}"${left ? ' text-anchor="end"' : ''}>${s.name}</text>`;
      return `<rect class="bar" x="${X(s.first)}" y="${y}" width="${f1(w)}" height="16" rx="4"/>${lab}`;
    })
    .join('');
  const earliest = samples[n - 1].first;
  const ticks = [1500, 1600, 1700, 1800, 1900, 2000].map((t) => `<text class="lab" x="${X(t)}" y="162" text-anchor="middle">${t}</text>`).join('');
  return `<rect class="reach" x="${X(earliest)}" y="150" width="${f1(X(2020) - X(earliest))}" height="5" rx="2"/>${bars}${ticks}`;
}

export const reachBack = (n: number) => samples[n - 1].first;
