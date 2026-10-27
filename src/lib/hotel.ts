// Maths and drawings for the infinite hotel page. Everything here is computed, nothing is a measurement.
// The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

export const fmt = (n: number) => n.toLocaleString('en-US');

const ROOMS = 12; // rooms drawn in the corridor, the rest are "and so on"
const W = 300;
const GAP = 4;
const DOOR = (W - 20 - GAP * (ROOMS - 1)) / ROOMS;
const doorX = (i: number) => 10 + i * (DOOR + GAP);

/** One door with its room number above and the guest's label inside. kind is one of old, new, bus or empty. */
function door(i: number, room: number, label: string, kind: string): string {
  const x = doorX(i);
  return `<rect class="door ${kind}" x="${x.toFixed(1)}" y="40" width="${DOOR.toFixed(1)}" height="64" rx="3"/><text class="num" x="${(x + DOOR / 2).toFixed(1)}" y="32" text-anchor="middle">${room}</text><text class="who ${kind}" x="${(x + DOOR / 2).toFixed(1)}" y="78" text-anchor="middle">${label}</text>`;
}

const more = `<text class="dots" x="${W - 6}" y="130" text-anchor="end">and so on, with no last room</text>`;

// ---------- Floor 1: one more guest, or a few ----------

/** Room that old guest n moves to when k new guests arrive: every guest moves k doors along. */
export const shiftRoom = (n: number, k: number) => n + k;

export function shiftSvg(k: number): string {
  let s = '';
  for (let i = 0; i < ROOMS; i++) {
    const room = i + 1;
    s += room <= k ? door(i, room, 'new', 'new') : door(i, room, String(room - k), 'old');
  }
  return s + more;
}

// ---------- Floor 2: a bus with infinitely many seats ----------

/** Old guest n moves to room 2n. Bus passenger m takes room 2m minus 1. */
export const evenRoom = (n: number) => 2 * n;
export const oddRoom = (m: number) => 2 * m - 1;

/** stage 0: full hotel. 1: guests have doubled their room number. 2: the bus has boarded. */
export function busSvg(stage: number): string {
  let s = '';
  for (let i = 0; i < ROOMS; i++) {
    const room = i + 1;
    if (stage === 0) s += door(i, room, String(room), 'old');
    else if (room % 2 === 0) s += door(i, room, String(room / 2), 'old');
    else s += stage === 1 ? door(i, room, '', 'empty') : door(i, room, `B${(room + 1) / 2}`, 'bus');
  }
  return s + more;
}

// ---------- Floor 3: counting fractions ----------

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export const SUM_MAX = 9; // the grid holds fractions p/q with p + q up to this

export interface Cell {
  p: number;
  q: number;
  order: number; // place in the list, or 0 if the fraction is skipped
}

/** Fractions in the order of the zigzag: first those with p + q = 2, then 3, and so on. A fraction not in lowest terms is skipped. */
export function cells(): Cell[] {
  const out: Cell[] = [];
  let n = 0;
  for (let d = 2; d <= SUM_MAX; d++) {
    for (let p = 1; p < d; p++) {
      const q = d - p;
      out.push({ p, q, order: gcd(p, q) === 1 ? ++n : 0 });
    }
  }
  return out;
}

export const COUNTED = cells().filter((c) => c.order > 0).length;

/** The place of p/q in the list, found by walking the same order. Works for any p and q, but is slow for huge ones, so the page caps them. */
export function placeOf(p: number, q: number): { place: number; lowest: [number, number] } {
  const g = gcd(p, q);
  const lp = p / g;
  const lq = q / g;
  let n = 0;
  for (let d = 2; d <= lp + lq; d++) {
    for (let a = 1; a < d; a++) {
      if (gcd(a, d - a) !== 1) continue;
      n++;
      if (d === lp + lq && a === lp) return { place: n, lowest: [lp, lq] };
    }
  }
  return { place: n, lowest: [lp, lq] };
}

const GRID_X = 14;
const GRID_Y = 14;
const CELL = 30;

/** The staircase of fractions with the first `shown` list places lit and the walk drawn as a line. */
export function fractionsSvg(shown: number): string {
  const all = cells();
  let s = '';
  const path: string[] = [];
  for (const c of all) {
    const x = GRID_X + (c.p - 1) * CELL;
    const y = GRID_Y + (c.q - 1) * 26;
    const lit = c.order > 0 && c.order <= shown;
    const kind = c.order === 0 ? 'skip' : lit ? 'lit' : 'dim';
    s += `<rect class="cell ${kind}" x="${x}" y="${y}" width="${CELL - 2}" height="24" rx="3"/><text class="frac ${kind}" x="${x + (CELL - 2) / 2}" y="${y + 16}" text-anchor="middle">${c.p}/${c.q}</text>`;
    if (lit) path.push(`${x + (CELL - 2) / 2},${y + 12}`);
  }
  if (path.length > 1) s = `<polyline class="walk" points="${path.join(' ')}"/>` + s;
  return s;
}

// ---------- Floor 4: a list that always misses ----------

export const LEN = 8;

/** A list of LEN lines of LEN digits, each 0 or 1, from a seed. */
export function makeList(seed: number): number[][] {
  const r = seeded(seed);
  return Array.from({ length: LEN }, () => Array.from({ length: LEN }, () => (r() < 0.5 ? 0 : 1)));
}

/** The string that differs from line k at place k, for every k. */
export const diagonalFlip = (list: number[][]) => list.map((row, k) => 1 - row[k]);
