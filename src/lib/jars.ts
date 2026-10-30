// Maths and drawings for the insurance page. The people, the chances and the sizes of the losses are made up for the page.
// The idea that pooling makes losses predictable comes from the sources. Years are drawn at random from fixed seeds, so the same picture
// appears every time. The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const CHANCE = 0.01; // the chance that a person has a loss in a year, made up
export const LOSS = 10000; // the size of one loss, in made up units
export const YEARS = 20;

// ---------- Years drawn at random ----------

/** Losses in each of the years, for n people who each have the chance p of a loss in a year. */
export function yearsOfLosses(n: number, p: number, seed: number, years = YEARS): number[] {
  const r = seeded(seed);
  return Array.from({ length: years }, () => {
    let k = 0;
    for (let i = 0; i < n; i++) if (r() < p) k++;
    return k;
  });
}

/** Losses in each year when one event hits everyone at once: all n, or nobody. */
export function sharedYears(n: number, p: number, seed: number, years = YEARS): number[] {
  const r = seeded(seed);
  return Array.from({ length: years }, () => (r() < p ? n : 0));
}

/** Claims as a share of the fair premium pool, which is the expected number of losses n times p. */
export const claimsRatio = (losses: number, n: number, p: number) => losses / (n * p);

const X0 = 28;
const X1 = 292;
const Y1 = 140;

/** A bar for each year: claims paid as a share of what was collected. The line is 100 per cent. */
export function yearsSvg(ratios: number[]): string {
  const top = 3;
  const w = (X1 - X0) / ratios.length;
  const y = (r: number) => Y1 - (Math.min(r, top) / top) * 120;
  let s = `<line class="axis" x1="${X0}" y1="${Y1}" x2="${X1}" y2="${Y1}"/>`;
  ratios.forEach((r, i) => {
    const h = Y1 - y(r);
    const off = r > top;
    s += `<rect class="bar${off ? ' off' : ''}" x="${f1(X0 + i * w + 2)}" y="${f1(y(r))}" width="${f1(w - 4)}" height="${f1(Math.max(h, 1.5))}" rx="2"/>`;
    if (off) s += `<path class="arrow" d="M${f1(X0 + i * w + w / 2)} ${f1(y(r) - 8)} l-4 7 h8 z"/>`;
  });
  s += `<line class="par" x1="${X0}" y1="${f1(y(1))}" x2="${X1}" y2="${f1(y(1))}"/><text class="lab" x="${X0 - 3}" y="${f1(y(1) + 3)}" text-anchor="end">100%</text><text class="lab" x="${X0 - 3}" y="${f1(y(3) + 3)}" text-anchor="end">300%</text><text class="lab" x="${X0}" y="${Y1 + 14}">year 1</text><text class="lab" x="${X1}" y="${Y1 + 14}" text-anchor="end">year ${ratios.length}</text>`;
  return s;
}

// ---------- Part 2: how steady is the pool ----------

/** The usual size of the swing in the number of losses, as a share of the expected number: one standard deviation of a count over its mean. */
export const spread = (n: number, p: number) => Math.sqrt((1 - p) / (n * p));

export function spreadSvg(p: number, at: number): string {
  const sizes = [10, 30, 100, 300, 1000, 3000, 10000, 30000, 100000];
  const bw = (X1 - X0) / sizes.length;
  const top = 3;
  const y = (r: number) => Y1 - (Math.min(r, top) / top) * 120;
  let s = `<line class="axis" x1="${X0}" y1="${Y1}" x2="${X1}" y2="${Y1}"/>`;
  sizes.forEach((n, i) => {
    const r = spread(n, p);
    const on = n === at;
    s += `<rect class="bar${on ? ' hot' : ''}${r > top ? ' off' : ''}" x="${f1(X0 + i * bw + 3)}" y="${f1(y(r))}" width="${f1(bw - 6)}" height="${f1(Y1 - y(r))}" rx="2"/><text class="lab" x="${f1(X0 + i * bw + bw / 2)}" y="${Y1 + 12}" text-anchor="middle">${n >= 1000 ? n / 1000 + 'k' : n}</text>`;
  });
  s += `<text class="lab" x="${X0 - 3}" y="${f1(y(1) + 3)}" text-anchor="end">100%</text><line class="par" x1="${X0}" y1="${f1(y(1))}" x2="${X1}" y2="${f1(y(1))}"/><text class="lab" x="${X0}" y="12">usual swing in losses, as a share of the expected number</text>`;
  return s;
}

// ---------- Part 3: can the pool pay ----------

let logFact: number[] = [0];
function lf(n: number): number {
  for (let i = logFact.length; i <= n; i++) logFact.push(logFact[i - 1] + Math.log(i));
  return logFact[n];
}

/** The chance of k losses or fewer among n people with the chance p each. */
export function chanceAtMost(n: number, p: number, k: number): number {
  let sum = 0;
  for (let j = 0; j <= Math.min(k, n); j++) {
    sum += Math.exp(lf(n) - lf(j) - lf(n - j) + j * Math.log(p) + (n - j) * Math.log(1 - p));
  }
  return Math.min(1, sum);
}

/** The chance that what was collected covers the claims in a year, when each person pays the fair premium plus a margin. */
export const chancePaid = (n: number, p: number, margin: number) => chanceAtMost(n, p, Math.floor(n * p * (1 + margin) + 1e-9));
