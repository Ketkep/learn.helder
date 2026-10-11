// Graph maths for the Königsberg page. Used by the page at build time and by the scripts in the browser.
// The town has four pieces of land (A, B, C, D) and bridges between them. A walk that crosses every bridge once is an Euler path.

export type Land = 'A' | 'B' | 'C' | 'D';
export const lands: Land[] = ['A', 'B', 'C', 'D'];

export const landNames: Record<Land, string> = {
  A: 'the north bank',
  B: 'the south bank',
  C: 'the island in the middle',
  D: 'the east island',
};

export interface Bridge {
  id: number;
  a: Land;
  b: Land;
  /** The two ends of the drawn bridge: x1, y1, x2, y2 in SVG units. */
  at: [number, number, number, number];
  /** True for the seven bridges of old Königsberg. The others are extra places for a bridge. */
  old: boolean;
}

export const bridges: Bridge[] = [
  { id: 1, a: 'A', b: 'C', at: [115, 74, 115, 112], old: true },
  { id: 2, a: 'A', b: 'C', at: [165, 74, 165, 108], old: true },
  { id: 3, a: 'B', b: 'C', at: [115, 226, 115, 188], old: true },
  { id: 4, a: 'B', b: 'C', at: [165, 226, 165, 192], old: true },
  { id: 5, a: 'C', b: 'D', at: [188, 150, 252, 150], old: true },
  { id: 6, a: 'A', b: 'D', at: [290, 74, 290, 122], old: true },
  { id: 7, a: 'B', b: 'D', at: [290, 226, 290, 178], old: true },
  { id: 8, a: 'A', b: 'B', at: [34, 74, 34, 226], old: false },
  { id: 9, a: 'A', b: 'D', at: [340, 74, 340, 122], old: false },
  { id: 10, a: 'B', b: 'D', at: [340, 226, 340, 178], old: false },
  { id: 11, a: 'C', b: 'D', at: [188, 172, 252, 172], old: false },
];

export const oldIds = bridges.filter((b) => b.old).map((b) => b.id);

export const byId = (id: number) => bridges.find((b) => b.id === id)!;

export function degrees(ids: number[]): Record<Land, number> {
  const d: Record<Land, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const id of ids) {
    d[byId(id).a]++;
    d[byId(id).b]++;
  }
  return d;
}

export const oddLands = (ids: number[]): Land[] => lands.filter((l) => degrees(ids)[l] % 2 === 1);

/** Is every bridge reachable from every other? Lands with no bridge do not count. */
export function connected(ids: number[]): boolean {
  if (ids.length === 0) return true;
  const seen = new Set<Land>([byId(ids[0]).a]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const id of ids) {
      const { a, b } = byId(id);
      if (seen.has(a) !== seen.has(b)) {
        seen.add(a).add(b);
        grew = true;
      }
    }
  }
  return ids.every((id) => seen.has(byId(id).a));
}

export type Verdict = 'circuit' | 'path' | 'none';

/** A walk over every bridge once: 'circuit' if it can end where it began, 'path' if it can only end elsewhere. */
export function verdict(ids: number[]): Verdict {
  if (ids.length === 0 || !connected(ids)) return 'none';
  const odd = oddLands(ids).length;
  return odd === 0 ? 'circuit' : odd === 2 ? 'path' : 'none';
}

/** The land at the other end of a bridge. */
export const other = (id: number, from: Land): Land => (byId(id).a === from ? byId(id).b : byId(id).a);

/** One walk over every bridge starting at a land (Hierholzer), as the bridges in order. Null if there is none from there. */
export function walk(ids: number[], start: Land): number[] | null {
  if (verdict(ids) === 'none') return null;
  const odd = oddLands(ids);
  if (odd.length === 2 && !odd.includes(start)) return null;
  const left = new Set(ids);
  const stack: { land: Land; via: number | null }[] = [{ land: start, via: null }];
  const route: number[] = [];
  while (stack.length) {
    const top = stack[stack.length - 1];
    const next = [...left].find((id) => byId(id).a === top.land || byId(id).b === top.land);
    if (next === undefined) {
      stack.pop();
      if (top.via !== null) route.push(top.via);
    } else {
      left.delete(next);
      stack.push({ land: other(next, top.land), via: next });
    }
  }
  route.reverse();
  return route.length === ids.length ? route : null;
}

/** The lands visited by a route, as letters, starting at the first land. */
export function landsOn(route: number[], start: Land): Land[] {
  const out: Land[] = [start];
  for (const id of route) out.push(other(id, out[out.length - 1]));
  return out;
}
