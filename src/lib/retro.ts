// Maths and drawings for the retrograde page. The orbit sizes and periods come from the sources. The orbits are drawn as flat circles
// around the Sun, which is a simplification: real orbits are slightly oval and tilted, so real loops differ a little from these.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export interface Planet {
  name: string;
  a: number; // distance from the Sun in astronomical units
  period: number; // days for one orbit
}

export const EARTH: Planet = { name: 'Earth', a: 1, period: 365.25 };

export const PLANETS: Planet[] = [
  { name: 'Mercury', a: 0.387, period: 87.97 },
  { name: 'Venus', a: 0.723, period: 224.7 },
  { name: 'Mars', a: 1.524, period: 686.98 },
  { name: 'Jupiter', a: 5.203, period: 4332.59 },
];

export const MARS = PLANETS[2];

const TAU = Math.PI * 2;
const place = (p: Planet, t: number): [number, number] => [p.a * Math.cos((TAU * t) / p.period), p.a * Math.sin((TAU * t) / p.period)];

/** Days between one lining up with the Earth and the next. */
export const synodic = (p: Planet) => 1 / Math.abs(1 / EARTH.period - 1 / p.period);

/** The direction of the planet seen from Earth, in degrees, measured from the direction it had at day 0. */
export function longitude(p: Planet, t: number): number {
  const e = place(EARTH, t);
  const q = place(p, t);
  const e0 = place(EARTH, 0);
  const q0 = place(p, 0);
  const a = Math.atan2(q[1] - e[1], q[0] - e[0]);
  const a0 = Math.atan2(q0[1] - e0[1], q0[0] - e0[0]);
  let d = ((a - a0) * 180) / Math.PI;
  d = ((((d + 180) % 360) + 360) % 360) - 180;
  return d;
}

/** Distance from Earth in astronomical units. */
export function distance(p: Planet, t: number): number {
  const e = place(EARTH, t);
  const q = place(p, t);
  return Math.hypot(q[0] - e[0], q[1] - e[1]);
}

/** Is the planet moving backwards across the sky on this day? */
export const backwards = (p: Planet, t: number) => longitude(p, t + 0.25) < longitude(p, t - 0.25);

/** How the loop around day 0 looks: when it starts and ends, and how far back the planet moves. */
export function loop(p: Planet) {
  let start = 0;
  while (backwards(p, start - 0.5) && start > -synodic(p)) start -= 0.5;
  let end = 0;
  while (backwards(p, end + 0.5) && end < synodic(p)) end += 0.5;
  return { start, end, days: end - start, back: Math.abs(longitude(p, end) - longitude(p, start)) };
}

/** Half a cycle either side of day 0, in whole days. */
export const reach = (p: Planet) => Math.floor(synodic(p) / 2);

/** A window around day 0 that shows the loop and a little more, for the graph. */
export const window = (p: Planet) => Math.round(loop(p).days * 1.25);

// ---------- Drawing 1: from above ----------

const CX = 150;
const CY = 140;

/** The Sun, two orbits, the line of sight and the trail of where the planet seems to be. */
export function orbitSvg(p: Planet, t: number): string {
  const k = 112 / Math.max(p.a, 1);
  const px = (v: [number, number]): [number, number] => [CX + v[0] * k, CY - v[1] * k];
  const e = px(place(EARTH, t));
  const q = px(place(p, t));
  const ang = Math.atan2(e[1] - q[1], q[0] - e[0]); // screen angle of the line of sight
  let o = `<rect class="sky" x="1" y="1" width="298" height="278" rx="8"/>`;
  o += `<circle class="orbit" cx="${CX}" cy="${CY}" r="${f1(EARTH.a * k)}"/>`;
  o += `<circle class="orbit" cx="${CX}" cy="${CY}" r="${f1(p.a * k)}"/>`;
  // the line of sight, running on past the planet
  const far = 400;
  o += `<line class="sightline ${backwards(p, t) ? 'back' : 'fwd'}" x1="${f1(e[0])}" y1="${f1(e[1])}" x2="${f1(e[0] + far * Math.cos(ang))}" y2="${f1(e[1] - far * Math.sin(ang))}"/>`;
  // the fixed direction of the far stars, and the angle to the planet
  o += `<line class="stars" x1="${f1(e[0])}" y1="${f1(e[1])}" x2="${f1(e[0] + 46)}" y2="${f1(e[1])}"/>`;
  const L = longitude(p, t);
  const first = place(p, 0);
  const eFirst = place(EARTH, 0);
  const base = Math.atan2(first[1] - eFirst[1], first[0] - eFirst[0]);
  o += `<circle class="sun" cx="${CX}" cy="${CY}" r="7"/>`;
  o += `<circle class="earth" cx="${f1(e[0])}" cy="${f1(e[1])}" r="5"/>`;
  o += `<circle class="planet" cx="${f1(q[0])}" cy="${f1(q[1])}" r="4.5"/>`;
  o += `<text class="lab" x="12" y="20">Seen from above the Sun. Sight angle ${fmt(L)}°</text>`;
  o += `<text class="lab small" x="12" y="268">Dashed white: the fixed direction of the far stars</text>`;
  void base;
  return o;
}

// ---------- Drawing 2: the graph and the sky ----------

/** The direction of the planet against the stars over one cycle, with the backwards part in a second colour. */
export function graphSvg(p: Planet, t: number): string {
  const r = window(p);
  const W = 276;
  const X0 = 14;
  const gx = (d: number) => X0 + ((d + r) / (2 * r)) * W;
  let lo = 0;
  let hi = 0;
  for (let d = -r; d <= r; d += 1) {
    const v = longitude(p, d);
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  const span = Math.max(1, hi - lo);
  const gy = (v: number) => 122 - ((v - lo) / span) * 90;
  let fwd = '';
  let back = '';
  let seg = '';
  let was: boolean | null = null;
  const flush = () => {
    if (!seg) return;
    if (was) back += seg;
    else fwd += seg;
    seg = '';
  };
  for (let d = -r; d <= r; d += 1) {
    const isBack = backwards(p, d);
    if (isBack !== was) {
      flush();
      // start the new colour where the old one ended, so the line has no gap
      seg = `M${f1(gx(d - (was === null ? 0 : 1)))} ${f1(gy(longitude(p, d - (was === null ? 0 : 1))))} `;
      was = isBack;
    }
    seg += `L${f1(gx(d))} ${f1(gy(longitude(p, d)))} `;
  }
  flush();
  let o = `<rect class="sky" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<line class="axis" x1="${X0}" y1="136" x2="${X0 + W}" y2="136"/>`;
  for (const f of [-1, 0, 1]) {
    o += `<line class="tick" x1="${f1(gx(f * r))}" y1="136" x2="${f1(gx(f * r))}" y2="141"/><text class="lab small mid" x="${f1(gx(f * r))}" y="152">${f === 0 ? 'day 0' : fmt(f * r)}</text>`;
  }
  o += `<path class="trace fwd" d="${fwd}"/><path class="trace back" d="${back}"/>`;
  o += `<circle class="planet" cx="${f1(gx(t))}" cy="${f1(gy(longitude(p, t)))}" r="5"/>`;
  o += `<text class="lab" x="12" y="20">Direction in the sky, day by day</text>`;
  o += `<text class="lab small" x="12" y="164">Days from day 0, when Earth and ${p.name} line up</text>`;
  return o;
}

// ---------- Drawing 3: two stories for the same sky ----------

/** Left: Earth in the middle with a circle on a circle. Right: the Sun in the middle. Both point at the same place in the sky. */
export function storiesSvg(t: number): string {
  const p = MARS;
  const k = 29;
  const ex = 80;
  const sx = 240;
  const cy = 90;
  const angM = (TAU * t) / p.period;
  const angE = (TAU * t) / EARTH.period;
  let o = `<rect class="sky" x="1" y="1" width="318" height="178" rx="8"/>`;
  // Ptolemy: a circle on a circle around the Earth
  const dx = ex + p.a * k * Math.cos(angM);
  const dy = cy - p.a * k * Math.sin(angM);
  const px = dx - k * Math.cos(angE);
  const py = dy + k * Math.sin(angE);
  o += `<circle class="orbit" cx="${ex}" cy="${cy}" r="${f1(p.a * k)}"/>`;
  o += `<circle class="orbit small" cx="${f1(dx)}" cy="${f1(dy)}" r="${k}"/>`;
  o += `<line class="spoke" x1="${ex}" y1="${cy}" x2="${f1(dx)}" y2="${f1(dy)}"/>`;
  o += `<line class="spoke" x1="${f1(dx)}" y1="${f1(dy)}" x2="${f1(px)}" y2="${f1(py)}"/>`;
  o += `<line class="sightline ${backwards(p, t) ? 'back' : 'fwd'}" x1="${ex}" y1="${cy}" x2="${f1(px)}" y2="${f1(py)}"/>`;
  o += `<circle class="earth" cx="${ex}" cy="${cy}" r="5"/><circle class="planet" cx="${f1(px)}" cy="${f1(py)}" r="4.5"/>`;
  // Copernicus: the Sun in the middle
  const exx = sx + k * Math.cos(angE);
  const eyy = cy - k * Math.sin(angE);
  const mx = sx + p.a * k * Math.cos(angM);
  const my = cy - p.a * k * Math.sin(angM);
  o += `<circle class="orbit" cx="${sx}" cy="${cy}" r="${k}"/><circle class="orbit" cx="${sx}" cy="${cy}" r="${f1(p.a * k)}"/>`;
  o += `<line class="sightline ${backwards(p, t) ? 'back' : 'fwd'}" x1="${f1(exx)}" y1="${f1(eyy)}" x2="${f1(mx)}" y2="${f1(my)}"/>`;
  o += `<circle class="sun" cx="${sx}" cy="${cy}" r="6"/><circle class="earth" cx="${f1(exx)}" cy="${f1(eyy)}" r="5"/><circle class="planet" cx="${f1(mx)}" cy="${f1(my)}" r="4.5"/>`;
  o += `<text class="lab" x="12" y="20">Earth in the middle</text><text class="lab" x="172" y="20">Sun in the middle</text>`;
  o += `<text class="lab small" x="12" y="170">Ptolemy: a circle on a circle</text><text class="lab small" x="172" y="170">Copernicus: both go round the Sun</text>`;
  return o;
}
