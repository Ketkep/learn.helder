// Maths and drawings for the lighthouse page. The range formula, the light patterns and their chart names come from the sources.
// The lens numbers are a toy model (flat-sided lens, glass with an index of 1.5, rings of equal width). The patterns are examples,
// not real lighthouses. The same text is made at build time (Astro) and in the browser.

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const f1 = (n: number) => n.toFixed(1);

// ---------- Room 1: how far the light goes ----------

export const KM_PER_NM = 1.852;

/** Geographic range in nautical miles from the height of the light and of the eye, both in metres. */
export const geoRange = (light: number, eye: number) => 2.08 * (Math.sqrt(light) + Math.sqrt(eye));

export const WEATHER = [
  { id: 'clear', label: 'Clear', lamp: 25 },
  { id: 'haze', label: 'Haze', lamp: 12 },
  { id: 'fog', label: 'Fog', lamp: 3 },
];

/** The range you can use: the smaller of what the curve allows and what the lamp can reach. */
export function seen(light: number, eye: number, lamp: number) {
  const geo = geoRange(light, eye);
  return { geo, lamp, range: Math.min(geo, lamp), limit: geo <= lamp ? 'the curve of the sea' : 'how far the lamp reaches' };
}

export function sees(light: number, eye: number, lamp: number, dist: number) {
  const s = seen(light, eye, lamp);
  if (dist <= s.range) return { ok: true, why: '' };
  return { ok: false, why: dist > s.geo ? 'The sea is in the way.' : 'The light is too faint to reach you.' };
}

// The Earth is drawn far too small, and the tower far too tall, so that the curve shows. Only the shape is true.
const CX = 200;
const CY = 620;
const R = 500;
const at = (phi: number, r: number): [number, number] => [CX + r * Math.sin(phi), CY - r * Math.cos(phi)];
const deg = (rad: number) => ((rad * 180) / Math.PI).toFixed(2);

export function horizonSvg(light: number, eye: number, lamp: number, dist: number): string {
  const tower = 10 + light * 0.14;
  const mast = 3 + eye * 0.2;
  const th = Math.acos(R / (R + tower));
  const sh = Math.acos(R / (R + mast));
  const s = seen(light, eye, lamp);
  const gap = Math.min((th + sh) * (dist / Math.max(0.1, s.geo)), 330 / R);
  const pt = -gap / 2;
  const ps = gap / 2;
  const a = at(pt, R + tower);
  const b = at(ps, R + mast);
  const ok = sees(light, eye, lamp, dist).ok;
  let o = '';
  o += `<rect class="sea-sky" x="1" y="1" width="398" height="168" rx="8"/>`;
  o += `<circle class="sea" cx="${CX}" cy="${CY}" r="${R}"/>`;
  // beams from the lamp
  for (const k of [-0.5, -0.25, 0.25, 0.5]) o += `<line class="ray" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(a[0] + Math.cos(k) * -34)}" y2="${f1(a[1] + Math.sin(k) * -34)}"/><line class="ray" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(a[0] + Math.cos(k) * 34)}" y2="${f1(a[1] + Math.sin(k) * 34)}"/>`;
  o += `<line class="sight ${ok ? 'ok' : 'no'}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
  o += `<g transform="rotate(${deg(pt)} ${CX} ${CY})"><path class="tower" d="M${CX - 4} ${CY - R + 1} L${CX - 2.5} ${CY - R - tower} h5 L${CX + 4} ${CY - R + 1} Z"/><circle class="lamp" cx="${CX}" cy="${CY - R - tower - 1}" r="2.6"/></g>`;
  o += `<g transform="rotate(${deg(ps)} ${CX} ${CY})"><path class="hull" d="M${CX - 9} ${CY - R - 2} h18 l-3 5 h-12 Z"/><line class="mastl" x1="${CX}" y1="${CY - R - 2}" x2="${CX}" y2="${CY - R - mast}"/><circle class="eye" cx="${CX}" cy="${CY - R - mast}" r="1.8"/></g>`;
  o += `<text class="lab" x="12" y="24">Light ${fmt(light)} m high</text>`;
  o += `<text class="lab" x="12" y="38">Eye ${fmt(eye)} m high</text>`;
  o += `<text class="lab small" x="12" y="160">Not to scale: the Earth is drawn far too small.</text>`;
  return o;
}

// ---------- Room 2: how a lamp becomes a beam ----------

const INDEX = 1.5; // crown glass, a round value for a toy model
const FOCAL = 1;
const HALF = 0.5; // half the width of the lens, in focal lengths
const EDGE = 0.02;

/** The glass in one half of a ring lens, as a share of a solid lens of the same width. */
export function glassShare(rings: number): number {
  const r = (INDEX - 1) * FOCAL;
  const solid = (HALF ** 3) / (6 * r) + EDGE * HALF;
  const w = HALF / rings;
  let area = 0;
  for (let k = 0; k < rings; k++) {
    const x0 = k * w;
    const x1 = x0 + w;
    area += (x1 ** 3 - x0 ** 3) / (6 * r) - (x0 * x0 * w) / (2 * r) + EDGE * w;
  }
  return area / solid;
}

/** The thickest part of the lens, in tenths of the lens width (a made up unit, to compare lenses). */
export function thickest(rings: number): number {
  const r = (INDEX - 1) * FOCAL;
  const w = HALF / rings;
  return ((w * (2 * HALF - w)) / (2 * r) + EDGE) / (2 * HALF);
}

export function lensSvg(rings: number): string {
  const S = 130; // pixels per focal length
  const x0 = 120;
  const mid = 85;
  const r = (INDEX - 1) * FOCAL;
  const sag = (x: number) => (x * x) / (2 * r);
  const w = HALF / rings;
  // the right face of the lens at a height x, for the ring lens
  const face = (x: number) => {
    const a = Math.min(Math.floor(x / w), rings - 1) * w;
    return x0 + (EDGE + sag(x) - sag(a)) * S;
  };
  let ghost = `M${x0} ${f1(mid - HALF * S)} `;
  for (let i = -24; i <= 24; i++) {
    const x = (HALF * i) / 24;
    ghost += `L${f1(x0 + (EDGE + sag(Math.abs(x))) * S)} ${f1(mid + x * S)} `;
  }
  ghost += `L${x0} ${f1(mid + HALF * S)} Z`;
  let o = `<rect class="sea-sky" x="1" y="1" width="298" height="168" rx="8"/>`;
  for (const f of [-0.9, -0.45, 0, 0.45, 0.9]) {
    const x = Math.abs(f) * HALF;
    const y = f1(mid + f * HALF * S);
    o += `<line class="ray" x1="27" y1="${mid}" x2="${x0}" y2="${y}"/><line class="ray" x1="${f1(face(x))}" y1="${y}" x2="285" y2="${y}"/>`;
  }
  o += `<path class="ghost" d="${ghost}"/>`;
  const half = (sign: number) => {
    let d = '';
    for (let k = 0; k < rings; k++) {
      const a = k * w;
      const b = a + w;
      const xr = (x: number) => x0 + (EDGE + sag(x) - sag(a)) * S;
      d += `M${x0} ${f1(mid + sign * a * S)} L${f1(xr(a))} ${f1(mid + sign * a * S)} L${f1(xr(b))} ${f1(mid + sign * b * S)} L${x0} ${f1(mid + sign * b * S)} Z `;
    }
    return d;
  };
  o += `<path class="glass" d="${half(1)}${half(-1)}"/>`;
  o += `<circle class="lamp" cx="22" cy="${mid}" r="5"/>`;
  o += `<text class="lab" x="12" y="16">Lamp</text><text class="lab" x="150" y="16">${fmt(rings)} ${rings === 1 ? 'ring' : 'rings'} on each side</text>`;
  return o;
}

// ---------- Room 3: how a light says who it is ----------

export interface Light {
  name: string;
  words: string;
  steps: [boolean, number][]; // light or dark, seconds
}

const L = (s: number) => [true, s] as [boolean, number];
const D = (s: number) => [false, s] as [boolean, number];

export const LIGHTS: Light[] = [
  { name: 'Fl 5s', words: 'Flashing, one flash every 5 seconds.', steps: [L(0.5), D(4.5)] },
  { name: 'Fl(2) 10s', words: 'Flashing, a group of 2 flashes every 10 seconds.', steps: [L(0.5), D(1.5), L(0.5), D(7.5)] },
  { name: 'Fl(3) 15s', words: 'Flashing, a group of 3 flashes every 15 seconds.', steps: [L(0.5), D(1.5), L(0.5), D(1.5), L(0.5), D(10.5)] },
  { name: 'Fl(2+1) 15s', words: 'Flashing, a group of 2 flashes and then 1 flash, every 15 seconds.', steps: [L(0.5), D(1.5), L(0.5), D(3), L(0.5), D(9)] },
  { name: 'Oc 6s', words: 'Occulting: the light is on longer than it is off. It goes dark for 1.5 seconds every 6 seconds.', steps: [L(4.5), D(1.5)] },
  { name: 'Iso 4s', words: 'Isophase: light and dark last the same time, 2 seconds each.', steps: [L(2), D(2)] },
];

export const period = (l: Light) => l.steps.reduce((t, s) => t + s[1], 0);

/** Is the lamp on at a moment in time? */
export function lit(l: Light, t: number): boolean {
  let x = t % period(l);
  for (const [on, d] of l.steps) {
    if (x < d) return on;
    x -= d;
  }
  return false;
}

const SPAN = 30;

/** A strip of 30 seconds: yellow where the lamp is on. */
export function stripSvg(l: Light, label: boolean): string {
  const W = 276;
  const x0 = 12;
  let o = `<rect class="sea-sky" x="1" y="1" width="298" height="78" rx="8"/>`;
  o += `<rect class="dark" x="${x0}" y="22" width="${W}" height="30" rx="3"/>`;
  let t = 0;
  while (t < SPAN) {
    for (const [on, d] of l.steps) {
      if (t >= SPAN) break;
      const len = Math.min(d, SPAN - t);
      if (on) o += `<rect class="on" x="${f1(x0 + (t / SPAN) * W)}" y="22" width="${f1((len / SPAN) * W)}" height="30"/>`;
      t += d;
    }
  }
  for (let s = 0; s <= SPAN; s += 5) {
    o += `<line class="tick" x1="${f1(x0 + (s / SPAN) * W)}" y1="52" x2="${f1(x0 + (s / SPAN) * W)}" y2="58"/><text class="lab small mid" x="${f1(x0 + (s / SPAN) * W)}" y="70">${s}</text>`;
  }
  o += `<text class="lab" x="12" y="15">${label ? l.name : 'Which light is this?'}</text>`;
  return o;
}

export function lampSvg(on: boolean): string {
  return `<circle class="lampbig ${on ? 'on' : ''}" cx="20" cy="20" r="12"/>`;
}
