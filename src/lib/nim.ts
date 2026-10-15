// Maths for the Nim page: heaps of sticks, the nim-sum and the winning move.
// Normal play: whoever takes the last stick wins. Misere play: whoever takes the last stick loses.

import { seeded } from './rand';

export type Heaps = number[];
export interface Move {
  heap: number;
  take: number;
}

/** The nim-sum is the XOR of the heap sizes: add in binary, with no carrying. */
export function nimSum(h: Heaps): number {
  return h.reduce((a, b) => a ^ b, 0);
}

export function total(h: Heaps): number {
  return h.reduce((a, b) => a + b, 0);
}

/** The move that makes the nim-sum zero, or null if there is none (you are losing). */
export function normalMove(h: Heaps): Move | null {
  const s = nimSum(h);
  if (s === 0) return null;
  for (let i = 0; i < h.length; i++) {
    const to = h[i] ^ s;
    if (to < h[i]) return { heap: i, take: h[i] - to };
  }
  return null;
}

/** Misere play: the same as normal play, until only heaps of one stick are left to win with. */
export function misereMove(h: Heaps): Move | null {
  const big = h.filter((x) => x >= 2).length;
  const ones = h.filter((x) => x === 1).length;
  if (big >= 2) return normalMove(h);
  if (big === 1) {
    const i = h.findIndex((x) => x >= 2);
    // Leave an odd number of heaps of one stick
    const to = ones % 2 === 0 ? 1 : 0;
    return { heap: i, take: h[i] - to };
  }
  // Only heaps of one stick: any move leaves one fewer. Leaving an odd number wins.
  if (ones % 2 === 0 && ones > 0) return { heap: h.findIndex((x) => x === 1), take: 1 };
  return null;
}

export function bestMove(h: Heaps, misere: boolean): Move | null {
  return misere ? misereMove(h) : normalMove(h);
}

/** Any legal move, chosen by a seeded random number. */
export function anyMove(h: Heaps, r: number): Move {
  const legal: Move[] = [];
  h.forEach((n, heap) => {
    for (let take = 1; take <= n; take++) legal.push({ heap, take });
  });
  return legal[Math.floor(r * legal.length) % legal.length];
}

export function apply(h: Heaps, m: Move): Heaps {
  return h.map((n, i) => (i === m.heap ? n - m.take : n));
}


export const classic: Heaps = [1, 3, 5, 7];

/** Positions to practise on. Every one has a winning move. */
export function puzzles(n = 8): Heaps[] {
  const rnd = seeded(41);
  const out: Heaps[] = [];
  while (out.length < n) {
    const h = classic.map(() => Math.floor(rnd() * 8));
    if (total(h) >= 4 && nimSum(h) !== 0 && h.filter((x) => x > 0).length >= 2) out.push(h);
  }
  return out;
}

export function bits(x: number): string {
  return x.toString(2).padStart(3, '0');
}

export function columns(h: Heaps): number[] {
  return [4, 2, 1].map((b) => h.filter((x) => (x & b) !== 0).length);
}


