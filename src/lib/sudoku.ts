// Maths for the sudoku page: candidates, singles and a solution counter. Grids are strings of digits, with 0 for an empty cell.
// The big count of 9 by 9 grids comes from the sources. Everything else is worked out here, in the browser and at build time.

export interface Shape {
  n: number; // digits per row
  bw: number; // box width
  bh: number; // box height
}

export const SMALL: Shape = { n: 4, bw: 2, bh: 2 };
export const BIG: Shape = { n: 9, bw: 3, bh: 3 };

export const parse = (s: string): number[] => s.split('').map(Number);

const row = (i: number, sh: Shape) => Math.floor(i / sh.n);
const col = (i: number, sh: Shape) => i % sh.n;
const box = (i: number, sh: Shape) => Math.floor(row(i, sh) / sh.bh) * (sh.n / sh.bw) + Math.floor(col(i, sh) / sh.bw);

/** The cells that share a row, a column or a box with this one. */
export function peers(i: number, sh: Shape): number[] {
  const out: number[] = [];
  for (let j = 0; j < sh.n * sh.n; j++) {
    if (j !== i && (row(j, sh) === row(i, sh) || col(j, sh) === col(i, sh) || box(j, sh) === box(i, sh))) out.push(j);
  }
  return out;
}

/** The digits that can still go in an empty cell: the ones not yet in its row, column or box. */
export function candidates(g: number[], i: number, sh: Shape): number[] {
  if (g[i] !== 0) return [];
  const used = new Set(peers(i, sh).map((j) => g[j]));
  const out: number[] = [];
  for (let d = 1; d <= sh.n; d++) if (!used.has(d)) out.push(d);
  return out;
}

/** Empty cells that have only one candidate left (a naked single), with that digit. */
export function nakedSingles(g: number[], sh: Shape): { cell: number; digit: number }[] {
  const out: { cell: number; digit: number }[] = [];
  g.forEach((v, i) => {
    if (v !== 0) return;
    const c = candidates(g, i, sh);
    if (c.length === 1) out.push({ cell: i, digit: c[0] });
  });
  return out;
}

export type House = { kind: 'row' | 'column' | 'box'; index: number; cells: number[] };

export function houses(sh: Shape): House[] {
  const out: House[] = [];
  for (let k = 0; k < sh.n; k++) {
    out.push({ kind: 'row', index: k, cells: Array.from({ length: sh.n }, (_, c) => k * sh.n + c) });
    out.push({ kind: 'column', index: k, cells: Array.from({ length: sh.n }, (_, r) => r * sh.n + k) });
  }
  for (let b = 0; b < sh.n; b++) {
    const cells: number[] = [];
    for (let i = 0; i < sh.n * sh.n; i++) if (box(i, sh) === b) cells.push(i);
    out.push({ kind: 'box', index: b, cells });
  }
  return out;
}

/** Houses where the digit has only one cell it can go in (a hidden single). */
export function hiddenSingles(g: number[], d: number, sh: Shape): { house: House; cell: number }[] {
  const out: { house: House; cell: number }[] = [];
  for (const h of houses(sh)) {
    if (h.cells.some((i) => g[i] === d)) continue;
    const spots = h.cells.filter((i) => g[i] === 0 && candidates(g, i, sh).includes(d));
    if (spots.length === 1) out.push({ house: h, cell: spots[0] });
  }
  return out;
}

/** Cells that already hold a digit equal to another in the same row, column or box. */
export function clashes(g: number[], sh: Shape): Set<number> {
  const bad = new Set<number>();
  g.forEach((v, i) => {
    if (v === 0) return;
    if (peers(i, sh).some((j) => g[j] === v)) bad.add(i);
  });
  return bad;
}

/** How many ways the grid can be finished, counting up to `limit`. */
export function countSolutions(g: number[], sh: Shape, limit = Infinity): number {
  const grid = g.slice();
  let found = 0;
  const go = (): void => {
    if (found >= limit) return;
    let best = -1;
    let bestC: number[] = [];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] !== 0) continue;
      const c = candidates(grid, i, sh);
      if (best < 0 || c.length < bestC.length) {
        best = i;
        bestC = c;
        if (c.length <= 1) break;
      }
    }
    if (best < 0) {
      found++;
      return;
    }
    for (const d of bestC) {
      grid[best] = d;
      go();
      grid[best] = 0;
      if (found >= limit) return;
    }
  };
  if (clashes(grid, sh).size === 0) go();
  return found;
}

/** The first way of finishing the grid, or null. */
export function solve(g: number[], sh: Shape): number[] | null {
  const grid = g.slice();
  const go = (): boolean => {
    let best = -1;
    let bestC: number[] = [];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] !== 0) continue;
      const c = candidates(grid, i, sh);
      if (best < 0 || c.length < bestC.length) {
        best = i;
        bestC = c;
      }
    }
    if (best < 0) return true;
    for (const d of bestC) {
      grid[best] = d;
      if (go()) return true;
      grid[best] = 0;
    }
    return false;
  };
  return go() ? grid : null;
}

// ---------- The grids on the page ----------

/** A 4 by 4 grid, finished. */
export const SOLVED4 = '1234341221434321';
/** A 4 by 4 puzzle to start the first tool with. */
export const PUZZLE4 = '1030040020400001';

/** A 9 by 9 puzzle for the other tools. Made for this page and checked to have one solution. */
export const PUZZLE9 = '610080530080000406000614089350040608806059201000070000098003000000508000420000890';

export const GRIDS_9 = 6670903752021072936960; // by Felgenhauer and Jarvis, from the sources
export const GRIDS_4 = 288;
