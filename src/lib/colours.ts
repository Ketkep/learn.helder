// Maths and drawings for the four colours page. A map is a set of regions, and two regions that share a border, not just a point, must
// get different colours. The map here is made up. The searches (a greedy colouring and a full search) are run on the page and the counts
// come from running them. The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);

export const COLOURS = ['#E8B84A', '#6FB5E8', '#E87A8C', '#7FCB8E', '#B79AE0', '#F2A65A'];
export const COLOUR_NAMES = ['gold', 'blue', 'pink', 'green', 'lilac', 'orange'];
/** The four colours the reader paints with. The quick rule may need up to two more. */
export const PAINT = 4;

export interface Region {
  name: string;
  d: string;
  x: number;
  y: number;
}

export interface Layout {
  regions: Region[];
  edges: [number, number][];
}

const pt = (r: number, deg: number): [number, number] => [150 + r * Math.cos((deg * Math.PI) / 180), 150 + r * Math.sin((deg * Math.PI) / 180)];

/** A piece of a ring between two radii and two angles, as a path. */
function sector(r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = pt(r1, a0);
  const [x1, y1] = pt(r1, a1);
  const [x2, y2] = pt(r0, a1);
  const [x3, y3] = pt(r0, a0);
  return `M${f1(x0)} ${f1(y0)} A${r1} ${r1} 0 0 1 ${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)} A${r0} ${r0} 0 0 0 ${f1(x3)} ${f1(y3)} Z`;
}

const letter = (i: number) => String.fromCharCode(65 + i);

/** A hub with one ring of n pieces: the wheel. */
export function wheel(n: number): Layout {
  const regions: Region[] = [{ name: 'Hub', d: `M${150 + 40} 150 A40 40 0 1 1 ${150 - 40} 150 A40 40 0 1 1 ${150 + 40} 150 Z`, x: 150, y: 150 }];
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a0 = -90 + (i * 360) / n;
    const a1 = -90 + ((i + 1) * 360) / n;
    const [x, y] = pt(92, (a0 + a1) / 2);
    regions.push({ name: `Rim ${i + 1}`, d: sector(42, 136, a0, a1), x, y });
    edges.push([0, i + 1]);
    if (n > 2) edges.push([i + 1, ((i + 1) % n) + 1]);
  }
  return { regions, edges };
}

/** The made-up map: a hub, a ring of five and an outer ring of five turned half a step. */
export function island(): Layout {
  const regions: Region[] = [{ name: 'Hub', d: `M${150 + 30} 150 A30 30 0 1 1 ${150 - 30} 150 A30 30 0 1 1 ${150 + 30} 150 Z`, x: 150, y: 150 }];
  const edges: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const a0 = -90 + i * 72;
    const a1 = a0 + 72;
    const [x, y] = pt(58, a0 + 36);
    regions.push({ name: `Inner ${i + 1}`, d: sector(32, 84, a0, a1), x, y });
    edges.push([0, i + 1], [i + 1, ((i + 1) % 5) + 1]);
  }
  for (let i = 0; i < 5; i++) {
    const a0 = -90 + i * 72 + 36;
    const a1 = a0 + 72;
    const [x, y] = pt(110, a0 + 36);
    regions.push({ name: `Outer ${i + 1}`, d: sector(86, 136, a0, a1), x, y });
    const me = 6 + i;
    edges.push([me, 6 + ((i + 1) % 5)], [me, 1 + i], [me, 1 + ((i + 1) % 5)]);
  }
  return { regions, edges };
}

export const neighbours = (l: Layout) => {
  const n = l.regions.map(() => [] as number[]);
  l.edges.forEach(([a, b]) => {
    n[a].push(b);
    n[b].push(a);
  });
  return n;
};

/** Pairs that share a border and have the same colour. -1 means not coloured yet. */
export function clashes(l: Layout, col: number[]): number {
  return l.edges.filter(([a, b]) => col[a] >= 0 && col[a] === col[b]).length;
}

/** Colours the regions one at a time in a given order, each with the first colour its neighbours have not used. */
export function greedy(l: Layout, order: number[]): number[] {
  const nb = neighbours(l);
  const col = l.regions.map(() => -1);
  for (const r of order) {
    const used = new Set(nb[r].map((x) => col[x]));
    let c = 0;
    while (used.has(c)) c++;
    col[r] = c;
  }
  return col;
}

/** A full search: a colouring with at most k colours, or null if there is none. */
export function search(l: Layout, k: number): number[] | null {
  const nb = neighbours(l);
  const col = l.regions.map(() => -1);
  const go = (i: number): boolean => {
    if (i === col.length) return true;
    for (let c = 0; c < k; c++) {
      if (nb[i].some((x) => col[x] === c)) continue;
      col[i] = c;
      if (go(i + 1)) return true;
    }
    col[i] = -1;
    return false;
  };
  return go(0) ? col.slice() : null;
}

/** The fewest colours that work, found by trying 1, 2, 3 and so on. */
export function fewest(l: Layout): number {
  for (let k = 1; k <= 6; k++) if (search(l, k)) return k;
  return 6;
}

export const used = (col: number[]) => new Set(col.filter((c) => c >= 0)).size;

/** A shuffled order of the regions, from a seed. */
export function order(n: number, seed: number): number[] {
  const r = seeded(seed);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A drawing of a layout. Each region shows the number of its colour, so colour is not the only clue. */
export function mapSvg(l: Layout, col: number[], bad: number[] = [], interactive = false): string {
  let o = `<rect class="sea" x="1" y="1" width="298" height="298" rx="8"/>`;
  l.regions.forEach((r, i) => {
    const c = col[i];
    const clash = bad.includes(i);
    const attrs = interactive ? ` data-i="${i}" tabindex="0" role="button" aria-label="${r.name}, ${c >= 0 ? `colour ${c + 1}` : 'no colour'}"` : '';
    o += `<path class="land${clash ? ' clash' : ''}${interactive ? ' hit' : ''}"${attrs} d="${r.d}" fill="${c >= 0 ? COLOURS[c] : '#e9e4d4'}"/>`;
    o += `<text class="num" x="${f1(r.x)}" y="${f1(r.y + 4)}">${c >= 0 ? c + 1 : ''}</text>`;
  });
  return o;
}

export const label = (i: number) => letter(i);
