// Maths and drawings for the GPS page. The map is a toy: a flat 300 by 200 plane with three beacons.
// The same text is made at build time (Astro) and in the browser.

export interface Pt { x: number; y: number }

export const W = 300;
export const H = 200;
export const beacons: (Pt & { name: string; cls: string })[] = [
  { name: 'A', cls: 'a', x: 42, y: 38 },
  { name: 'B', cls: 'b', x: 262, y: 52 },
  { name: 'C', cls: 'c', x: 150, y: 176 },
];

export const dist = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y);

/** The points where two circles cross: none, one or two. */
export function crossings(a: Pt, ra: number, b: Pt, rb: number): Pt[] {
  const d = dist(a, b);
  if (d > ra + rb || d < Math.abs(ra - rb) || d === 0) return [];
  const l = (ra * ra - rb * rb + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, ra * ra - l * l));
  const mx = a.x + (l * (b.x - a.x)) / d;
  const my = a.y + (l * (b.y - a.y)) / d;
  const dx = (h * (b.y - a.y)) / d;
  const dy = (h * (b.x - a.x)) / d;
  return h < 1e-6 ? [{ x: mx, y: my }] : [{ x: mx + dx, y: my - dy }, { x: mx - dx, y: my + dy }];
}

const f = (n: number) => n.toFixed(1);

/** Tool 1: rings around the first n beacons, with the places where they cross. */
export function ringsSvg(you: Pt, n: number): string {
  const used = beacons.slice(0, n);
  let s = '';
  used.forEach((b) => (s += `<circle class="ring ${b.cls}" cx="${b.x}" cy="${b.y}" r="${f(dist(you, b))}" />`));
  const marks: Pt[] = [];
  if (n === 2) marks.push(...crossings(used[0], dist(you, used[0]), used[1], dist(you, used[1])));
  if (n === 3) marks.push(you);
  marks.forEach((m) => (s += `<circle class="cross" cx="${f(m.x)}" cy="${f(m.y)}" r="5" />`));
  used.forEach((b) => (s += beaconSvg(b)));
  s += `<circle class="you" cx="${f(you.x)}" cy="${f(you.y)}" r="5" /><text class="lab" x="${f(you.x + 8)}" y="${f(you.y - 7)}">you</text>`;
  return s;
}

function beaconSvg(b: Pt & { name: string; cls: string }): string {
  return `<g><rect class="sat ${b.cls}" x="${b.x - 8}" y="${b.y - 8}" width="16" height="16" rx="3" /><text class="satname" x="${b.x}" y="${b.y + 4.5}" text-anchor="middle">${b.name}</text></g>`;
}

/**
 * Tool 2: the three rings when the receiver clock is wrong by `bias` and the reader has taken `fix` off every ring.
 * Each ring is the true distance plus the secret bias, minus the fix.
 */
export function clockSvg(you: Pt, bias: number, fix: number): string {
  let s = '';
  beacons.forEach((b) => (s += `<circle class="ring ${b.cls}" cx="${b.x}" cy="${b.y}" r="${f(Math.max(0, dist(you, b) + bias - fix))}" />`));
  beacons.forEach((b) => (s += beaconSvg(b)));
  return s;
}

/** The best single point for three rings, and how far the rings are from it on average (the misfit). */
export function misfit(you: Pt, bias: number, fix: number): number {
  const r = beacons.map((b) => dist(you, b) + bias - fix);
  let p = { x: W / 2, y: H / 2 };
  for (let k = 0; k < 60; k++) {
    let gx = 0;
    let gy = 0;
    let hxx = 0;
    let hxy = 0;
    let hyy = 0;
    beacons.forEach((b, i) => {
      const d = Math.max(dist(p, b), 1e-6);
      const ux = (p.x - b.x) / d;
      const uy = (p.y - b.y) / d;
      const e = d - r[i];
      gx += ux * e;
      gy += uy * e;
      hxx += ux * ux;
      hxy += ux * uy;
      hyy += uy * uy;
    });
    const det = hxx * hyy - hxy * hxy + 1e-9;
    p = { x: p.x - (hyy * gx - hxy * gy) / det, y: p.y - (hxx * gy - hxy * gx) / det };
  }
  const sum = beacons.reduce((t, b, i) => t + (dist(p, b) - r[i]) ** 2, 0);
  return Math.sqrt(sum / beacons.length);
}

/** Tool 3: two bands of timing noise crossing at an angle. Returns the drawing and the size of the uncertain patch. */
export function spreadGeometry(angleDeg: number, noise: number) {
  const th = (angleDeg * Math.PI) / 180;
  const u1 = { x: 1, y: 0 };
  const u2 = { x: Math.cos(th), y: Math.sin(th) };
  const sol = (s1: number, s2: number): Pt => {
    // Solve p . u1 = s1 * noise and p . u2 = s2 * noise.
    const det = u1.x * u2.y - u1.y * u2.x;
    return { x: (s1 * noise * u2.y - s2 * noise * u1.y) / det, y: (u1.x * s2 * noise - u2.x * s1 * noise) / det };
  };
  const corners = [sol(1, 1), sol(1, -1), sol(-1, -1), sol(-1, 1)];
  const long = Math.max(dist(corners[0], corners[2]), dist(corners[1], corners[3]));
  return { u1, u2, corners, long, hdop: Math.SQRT2 / Math.sin(th) };
}

export function spreadSvg(angleDeg: number, noise: number): string {
  const g = spreadGeometry(angleDeg, noise);
  const cx = 150;
  const cy = 100;
  const k = 3;
  let s = '';
  [g.u1, g.u2].forEach((u, i) => {
    // A band lies along the direction at right angles to the satellite direction.
    const tx = -u.y;
    const ty = u.x;
    s += `<line class="band ${i ? 'b' : 'a'}" x1="${f(cx - tx * 300)}" y1="${f(cy - ty * 300)}" x2="${f(cx + tx * 300)}" y2="${f(cy + ty * 300)}" stroke-width="${f(noise * 2 * k)}" />`;
    s += `<line class="beam ${i ? 'b' : 'a'}" x1="${cx}" y1="${cy}" x2="${f(cx + u.x * 70)}" y2="${f(cy + u.y * 70)}" />`;
  });
  s += `<polygon class="patch" points="${g.corners.map((c) => `${f(cx + c.x * k)},${f(cy + c.y * k)}`).join(' ')}" />`;
  s += `<circle class="you" cx="${cx}" cy="${cy}" r="4" />`;
  return s;
}

/** Tool 4: the clock offsets of a satellite, in microseconds per day. The speed and gravity figures are from the sources. */
export const GRAVITY = 45;
export const SPEED = -7;
export const NET = GRAVITY + SPEED;
export const LIGHT = 299792.458; // km per second

/** Kilometres of range for a time error in microseconds. */
export const kmOf = (us: number) => (us * 1e-6 * LIGHT);

export const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
