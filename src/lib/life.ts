// Maths and drawings for the Game of Life page. The rule (a live cell with 2 or 3 live neighbours stays alive, a dead cell with exactly
// 3 live neighbours comes alive, every other cell is dead next time) and the patterns come from the sources. The soups are drawn from
// fixed seeds. The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

export type Grid = Uint8Array;

export interface Board {
  w: number;
  h: number;
  cells: Grid;
}

export const make = (w: number, h: number): Board => ({ w, h, cells: new Uint8Array(w * h) });

/** Live neighbours of a cell. With wrap on, the edges join up like a doughnut. */
export function neighbours(b: Board, x: number, y: number, wrap: boolean): number {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      let xx = x + dx;
      let yy = y + dy;
      if (wrap) {
        xx = (xx + b.w) % b.w;
        yy = (yy + b.h) % b.h;
      } else if (xx < 0 || yy < 0 || xx >= b.w || yy >= b.h) continue;
      n += b.cells[yy * b.w + xx];
    }
  }
  return n;
}

/** What a cell does next, with the reason in words. */
export function fate(alive: boolean, n: number): { next: boolean; why: string } {
  if (alive) {
    if (n < 2) return { next: false, why: 'dies of loneliness: fewer than 2 live neighbours' };
    if (n > 3) return { next: false, why: 'dies of crowding: more than 3 live neighbours' };
    return { next: true, why: 'stays alive: 2 or 3 live neighbours' };
  }
  return n === 3 ? { next: true, why: 'comes alive: exactly 3 live neighbours' } : { next: false, why: 'stays empty: it needs exactly 3 live neighbours to come alive' };
}

export function step(b: Board, wrap: boolean): Board {
  const out = make(b.w, b.h);
  for (let y = 0; y < b.h; y++) {
    for (let x = 0; x < b.w; x++) out.cells[y * b.w + x] = fate(b.cells[y * b.w + x] === 1, neighbours(b, x, y, wrap)).next ? 1 : 0;
  }
  return out;
}

export const population = (b: Board) => b.cells.reduce((t, c) => t + c, 0);
export const same = (a: Board, b: Board) => a.cells.every((c, i) => c === b.cells[i]);

// Patterns as rows of text: # is a live cell
export interface Pattern {
  name: string;
  words: string;
  rows: string[];
}

export const PATTERNS: Pattern[] = [
  { name: 'Block', words: 'A still life: four squares in a block. Every live square has 3 neighbours, so it stays, and no empty square has exactly 3.', rows: ['##', '##'] },
  { name: 'Beehive', words: 'A still life of six squares. It never changes.', rows: ['.##.', '#..#', '.##.'] },
  { name: 'Blinker', words: 'An oscillator that repeats every 2 rounds: three squares in a row that turn between flat and upright.', rows: ['###'] },
  { name: 'Toad', words: 'An oscillator that repeats every 2 rounds, made of two rows of three squares.', rows: ['.###', '###.'] },
  { name: 'Glider', words: 'A spaceship: five squares that move one square diagonally every four rounds.', rows: ['.#.', '..#', '###'] },
  { name: 'R-pentomino', words: 'Five squares that change for a very long time. On an endless sheet it takes 1103 rounds to settle. On this small sheet that wraps round, it meets itself first.', rows: ['.##', '##.', '.#.'] },
];

/** A board with a pattern in the middle. */
export function withPattern(p: Pattern, w: number, h: number): Board {
  const b = make(w, h);
  const ph = p.rows.length;
  const pw = Math.max(...p.rows.map((r) => r.length));
  const ox = Math.floor((w - pw) / 2);
  const oy = Math.floor((h - ph) / 2);
  p.rows.forEach((r, y) => [...r].forEach((c, x) => c === '#' && (b.cells[(oy + y) * w + ox + x] = 1)));
  return b;
}

/** A random soup from a seed, with a share of live cells. */
export function soup(w: number, h: number, share: number, seed: number): Board {
  const r = seeded(seed);
  const b = make(w, h);
  for (let i = 0; i < b.cells.length; i++) b.cells[i] = r() < share ? 1 : 0;
  return b;
}

/** Runs a board on and gives the population each generation, and when it first repeats an earlier state of period 1 or 2. */
export function run(b: Board, gens: number, wrap: boolean) {
  const pop = [population(b)];
  let prev: Board | null = null;
  let cur = b;
  let settled = -1;
  for (let g = 1; g <= gens; g++) {
    const nxt = step(cur, wrap);
    pop.push(population(nxt));
    if (settled < 0 && (same(nxt, cur) || (prev && same(nxt, prev)))) settled = g;
    prev = cur;
    cur = nxt;
  }
  return { board: cur, pop, settled };
}

const f1 = (n: number) => n.toFixed(1);

/** A picture of a board, for the page before the script runs. */
export function boardSvg(b: Board, size = 300): string {
  const c = size / b.w;
  let o = `<rect class="field" x="0" y="0" width="${size}" height="${f1(c * b.h)}"/>`;
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) if (b.cells[y * b.w + x]) o += `<rect class="live" x="${f1(x * c + 0.6)}" y="${f1(y * c + 0.6)}" width="${f1(c - 1.2)}" height="${f1(c - 1.2)}"/>`;
  return o;
}

/** A line of the population over time. */
export function popSvg(pop: number[], max: number): string {
  const n = pop.length;
  let d = '';
  pop.forEach((v, i) => (d += `${i ? 'L' : 'M'}${f1(10 + (i / Math.max(1, n - 1)) * 280)} ${f1(72 - (v / Math.max(1, max)) * 44)} `));
  return `<rect class="field" x="1" y="1" width="298" height="78" rx="6"/><path class="popline" d="${d}"/>${n === 1 ? `<circle class="livedot" cx="10" cy="${f1(72 - (pop[0] / Math.max(1, max)) * 44)}" r="3"/>` : ''}<text class="lab small" x="12" y="14">Live squares, round by round (top = ${max})</text>`;
}
