// Maths and drawings for the transit map page. The city is made up: Maplebury has twelve stations on three lines,
// with made up positions in kilometres and a made up diagram. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export interface Station {
  name: string;
  x: number; // kilometres east, made up
  y: number; // kilometres south, made up
  sx: number; // place on the diagram grid
  sy: number;
  dx: number; // label offset in pixels
  dy: number;
  end?: boolean; // label sits to the left of the dot
}

export const STATIONS: Station[] = [
  { name: 'Hillfoot', x: 1, y: 2.5, sx: 1, sy: 6, dx: 0, dy: -8 },
  { name: 'Mill', x: 5, y: 4.5, sx: 4, sy: 6, dx: 0, dy: -8 },
  { name: 'Cross', x: 9, y: 6.5, sx: 7, sy: 6, dx: -7, dy: -7, end: true },
  { name: 'Market', x: 11, y: 7.5, sx: 9, sy: 6, dx: 6, dy: -7 },
  { name: 'Dock', x: 15, y: 9, sx: 12, sy: 6, dx: 0, dy: -8 },
  { name: 'Marsh', x: 19, y: 12, sx: 14, sy: 8, dx: 0, dy: 14 },
  { name: 'Orchard', x: 2, y: 12.5, sx: 2, sy: 11, dx: 26, dy: 4 },
  { name: 'Park', x: 6, y: 9.5, sx: 4, sy: 9, dx: -7, dy: 4, end: true },
  { name: 'Quay', x: 10.5, y: 4.5, sx: 7, sy: 3, dx: 22, dy: 4 },
  { name: 'Ferry', x: 16, y: 2, sx: 10, sy: 0, dx: 0, dy: 14 },
  { name: 'Tower', x: 9.8, y: 8.6, sx: 6, sy: 9, dx: 0, dy: 14 },
  { name: 'Wharf', x: 13.5, y: 10.5, sx: 12, sy: 9, dx: 0, dy: 14 },
];

export const LINES = [
  { id: 'red', name: 'Red line', stops: ['Hillfoot', 'Mill', 'Cross', 'Market', 'Dock', 'Marsh'] },
  { id: 'blue', name: 'Blue line', stops: ['Orchard', 'Park', 'Cross', 'Quay', 'Ferry'] },
  { id: 'green', name: 'Green line', stops: ['Park', 'Tower', 'Market', 'Wharf'] },
];

const byName = (n: string) => STATIONS.find((s) => s.name === n)!;

// ---------- Positions ----------

const W = 300;
const H = 210;
const geoPx = (s: Station, x = s.x, y = s.y) => [18 + x * 13.2, 14 + y * 13.6];
const schPx = (s: Station) => [34 + s.sx * 16.5, 14 + s.sy * 16.5]; // the same step both ways, so a 45 degree line is 45 degrees on screen

/** Where a station is drawn when the picture is `t` of the way (0 to 1) from the real layout to the diagram. */
function place(s: Station, t: number): [number, number] {
  const [gx, gy] = geoPx(s);
  const [hx, hy] = schPx(s);
  return [gx + (hx - gx) * t, gy + (hy - gy) * t];
}

// ---------- Part 1: straightening ----------

function drawNet(pos: (s: Station) => [number, number], marks: { legs: Set<string>; cls: string }[] = []): string {
  let s = '';
  for (const l of LINES) {
    const pts = l.stops.map((n) => pos(byName(n)).map(f1).join(','));
    s += `<polyline class="ln ${l.id}" points="${pts.join(' ')}"/>`;
  }
  for (const m of marks) {
    for (const l of LINES) {
      for (let i = 1; i < l.stops.length; i++) {
        const a = l.stops[i - 1];
        const b = l.stops[i];
        if (m.legs.has(a + '|' + b) || m.legs.has(b + '|' + a)) {
          const [x1, y1] = pos(byName(a));
          const [x2, y2] = pos(byName(b));
          s += `<line class="${m.cls}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
        }
      }
    }
  }
  for (const st of STATIONS) {
    const [x, y] = pos(st);
    const joins = LINES.filter((l) => l.stops.includes(st.name)).length > 1;
    s += `<circle class="dot${joins ? ' join' : ''}" cx="${f1(x)}" cy="${f1(y)}" r="${joins ? 5 : 3.6}"/><text class="name" x="${f1(x + st.dx)}" y="${f1(y + st.dy)}" text-anchor="${st.end ? 'end' : 'middle'}">${st.name}</text>`;
  }
  return s;
}

export const straightSvg = (t: number) => drawNet((s) => place(s, t));

/** Segments between neighbouring stops that lie on a flat, upright or 45 degree line, at the given step of the change. */
export function tidySegments(t: number): { tidy: number; total: number } {
  let tidy = 0;
  let total = 0;
  for (const l of LINES) {
    for (let i = 1; i < l.stops.length; i++) {
      const [x1, y1] = place(byName(l.stops[i - 1]), t);
      const [x2, y2] = place(byName(l.stops[i]), t);
      const a = (Math.abs((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI) + 360) % 45;
      total++;
      if (Math.min(a, 45 - a) < 2.5) tidy++;
    }
  }
  return { tidy, total };
}

// ---------- Part 2: stretching the centre ----------

export const CENTRE = { x: 10, y: 6.8 };
const RMAX = 12;

/** Pushes the real layout out from the centre so the middle gets more room: a distance r becomes RMAX times (r over RMAX) to the power g. g of 1 changes nothing. */
function warp(s: Station, g: number): [number, number] {
  const dx = s.x - CENTRE.x;
  const dy = s.y - CENTRE.y;
  const r = Math.hypot(dx, dy) || 1e-9;
  const r2 = RMAX * Math.pow(Math.min(r, RMAX) / RMAX, g) * (r > RMAX ? r / RMAX : 1);
  const k = r2 / r;
  return geoPx(s, CENTRE.x + dx * k, CENTRE.y + dy * k) as [number, number];
}

export const warpSvg = (g: number) => drawNet((s) => warp(s, g));

const CORE = ['Cross', 'Market', 'Tower', 'Quay'];

/** How many times wider the box around the four middle stations is after the push. */
export function coreGrowth(g: number): number {
  const box = (pts: [number, number][]) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    return Math.sqrt((Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)));
  };
  const before = box(CORE.map((n) => geoPx(byName(n))) as [number, number][]);
  const after = box(CORE.map((n) => warp(byName(n), g)));
  return after / before;
}

// ---------- Part 3: finding a route ----------

export interface Route {
  stations: string[];
  stops: number;
  changes: number;
}

/** The route with the fewest stops, and among those the fewest changes. */
export function route(from: string, to: string): Route {
  type Node = { st: string; line: string };
  const key = (n: Node) => n.st + '/' + n.line;
  const start: Node[] = LINES.filter((l) => l.stops.includes(from)).map((l) => ({ st: from, line: l.id }));
  const dist = new Map<string, number>();
  const prev = new Map<string, Node | null>();
  const todo: { n: Node; d: number }[] = [];
  for (const n of start) {
    dist.set(key(n), 0);
    prev.set(key(n), null);
    todo.push({ n, d: 0 });
  }
  while (todo.length) {
    todo.sort((a, b) => a.d - b.d);
    const { n, d } = todo.shift()!;
    if (d > (dist.get(key(n)) ?? Infinity)) continue;
    const line = LINES.find((l) => l.id === n.line)!;
    const i = line.stops.indexOf(n.st);
    const moves: { n: Node; w: number }[] = [];
    for (const j of [i - 1, i + 1]) if (line.stops[j]) moves.push({ n: { st: line.stops[j], line: line.id }, w: 100 });
    for (const l of LINES) if (l.id !== n.line && l.stops.includes(n.st)) moves.push({ n: { st: n.st, line: l.id }, w: 1 });
    for (const m of moves) {
      const nd = d + m.w;
      if (nd < (dist.get(key(m.n)) ?? Infinity)) {
        dist.set(key(m.n), nd);
        prev.set(key(m.n), n);
        todo.push({ n: m.n, d: nd });
      }
    }
  }
  let best: Node | null = null;
  for (const l of LINES) {
    const n = { st: to, line: l.id };
    if (dist.has(key(n)) && (!best || dist.get(key(n))! < dist.get(key(best))!)) best = n;
  }
  const stations: string[] = [];
  let changes = 0;
  for (let n: Node | null = best; n; n = prev.get(key(n)) ?? null) {
    const p = prev.get(key(n)) ?? null;
    if (p && p.st === n.st) {
      changes++;
      continue;
    }
    stations.unshift(n.st);
  }
  return { stations, stops: stations.length - 1, changes };
}

/** As the crow flies, in kilometres. */
export function crow(a: string, b: string): number {
  const p = byName(a);
  const q = byName(b);
  return Math.hypot(p.x - q.x, p.y - q.y);
}

const legsOf = (r: Route) => {
  const legs = new Set<string>();
  for (let i = 1; i < r.stations.length; i++) legs.add(r.stations[i - 1] + '|' + r.stations[i]);
  return legs;
};

/** The diagram with one or two routes marked: the first in orange, the second in violet. */
export function routeSvg(first: Route | null, second: Route | null = null): string {
  const marks: { legs: Set<string>; cls: string }[] = [];
  if (first) marks.push({ legs: legsOf(first), cls: 'hot' });
  if (second) marks.push({ legs: legsOf(second), cls: 'hot2' });
  return drawNet((s) => place(s, 1), marks);
}

// ---------- Part 4: which is farther ----------

/** Pairs of trips. In each, the first trip has more stops but is shorter as the crow flies, so the diagram is misleading. Found with route() and crow(). */
export const TRIPS: [[string, string], [string, string]][] = [
  [['Cross', 'Tower'], ['Hillfoot', 'Mill']],
  [['Dock', 'Ferry'], ['Cross', 'Hillfoot']],
  [['Dock', 'Wharf'], ['Orchard', 'Park']],
  [['Mill', 'Tower'], ['Market', 'Marsh']],
  [['Marsh', 'Wharf'], ['Cross', 'Ferry']],
];

export const SIZE = { W, H };
