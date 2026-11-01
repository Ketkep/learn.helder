// Maths and drawings for the misleading charts page. All the data are made up for the page. The ideas come from the sources.
// The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Part 1: where the bars start ----------

export const A = 50; // made up values of two things being compared
export const B = 52;
export const TOP = 56;

/** How many times as tall the second bar looks as the first, if the axis starts at this value. */
export const looksLike = (start: number) => (B - start) / (A - start);

/** The real ratio of the two values. */
export const really = B / A;

export function barsSvg(start: number): string {
  const x0 = 60;
  const y0 = 140;
  const h = 110;
  const y = (v: number) => y0 - ((v - start) / (TOP - start)) * h;
  let s = `<line class="axis" x1="${x0 - 8}" y1="${y0}" x2="280" y2="${y0}"/>`;
  s += `<rect class="bar a" x="${x0 + 10}" y="${f1(y(A))}" width="70" height="${f1(y0 - y(A))}"/><rect class="bar b" x="${x0 + 110}" y="${f1(y(B))}" width="70" height="${f1(y0 - y(B))}"/>`;
  s += `<text class="lab" x="${x0 + 45}" y="${y0 + 14}" text-anchor="middle">Product A: ${A}</text><text class="lab" x="${x0 + 145}" y="${y0 + 14}" text-anchor="middle">Product B: ${B}</text>`;
  s += `<text class="lab" x="${x0 - 10}" y="${y0 + 3}" text-anchor="end">${start}</text><text class="lab" x="${x0 - 10}" y="${f1(y(TOP) + 3)}" text-anchor="end">${TOP}</text>`;
  return s;
}

// ---------- Part 2: choosing the window ----------

export const MONTHS = 24;

/** A made up series: a slow rise with ups and downs, from a fixed seed. */
export function series(seed = 10): number[] {
  const r = seeded(seed);
  const out: number[] = [];
  let v = 100;
  for (let i = 0; i < MONTHS; i++) {
    v += 0.6 + (r() - 0.5) * 18;
    out.push(Math.round(v * 10) / 10);
  }
  return out;
}

/** Change in per cent from the first to the last month of a window, counting from 0. */
export const change = (data: number[], from: number, to: number) => ((data[to] - data[from]) / data[from]) * 100;

/** The window of at least `min` months with the biggest rise (best) or the biggest fall (worst). */
export function extreme(data: number[], min: number, best: boolean): [number, number] {
  let pick: [number, number] = [0, min - 1];
  let score = best ? -Infinity : Infinity;
  for (let a = 0; a < data.length; a++) {
    for (let b = a + min - 1; b < data.length; b++) {
      const c = change(data, a, b);
      if (best ? c > score : c < score) {
        score = c;
        pick = [a, b];
      }
    }
  }
  return pick;
}

export function lineSvg(data: number[], from: number, to: number): string {
  const x0 = 34;
  const x1 = 288;
  const lo = Math.min(...data) - 4;
  const hi = Math.max(...data) + 4;
  const x = (i: number) => x0 + (i / (data.length - 1)) * (x1 - x0);
  const y = (v: number) => 140 - ((v - lo) / (hi - lo)) * 120;
  const pts = data.map((v, i) => `${f1(x(i))},${f1(y(v))}`);
  let s = `<line class="axis" x1="${x0}" y1="140" x2="${x1}" y2="140"/><rect class="window" x="${f1(x(from))}" y="14" width="${f1(x(to) - x(from))}" height="126"/>`;
  s += `<polyline class="faint" points="${pts.join(' ')}"/>`;
  s += `<polyline class="shown" points="${pts.slice(from, to + 1).join(' ')}"/>`;
  s += `<text class="lab" x="${x0}" y="154">month 1</text><text class="lab" x="${x1}" y="154" text-anchor="end">month ${data.length}</text>`;
  return s;
}

// ---------- Part 3: length or area ----------

/** If you scale the width and height of a shape by this factor, its area is scaled by the square. */
export const areaRatio = (factor: number) => factor * factor;

export function circlesSvg(value: number): string {
  const r1 = 14;
  const rBad = r1 * value;
  const rFair = r1 * Math.sqrt(value);
  let s = '';
  s += `<circle class="dot a" cx="48" cy="80" r="${r1}"/><text class="lab" x="48" y="118" text-anchor="middle">1</text>`;
  s += `<circle class="dot bad" cx="130" cy="80" r="${f1(Math.min(rBad, 62))}"/><text class="lab" x="130" y="150" text-anchor="middle">radius times ${fmt(value, 1)}</text>`;
  s += `<circle class="dot fair" cx="244" cy="80" r="${f1(Math.min(rFair, 62))}"/><text class="lab" x="244" y="150" text-anchor="middle">radius times ${fmt(Math.sqrt(value), 2)}</text>`;
  return s;
}
