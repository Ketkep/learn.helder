// Maths and drawings for the earthquake page. The same strings are used when the page is built and in the browser.
// The wave speeds are a toy: P waves at 6.0 km/s and S waves at 24/7 km/s, which gives the rule of thumb of 8 km for every second between them.

import { seeded } from './rand';

export const VP = 6.0; // km per second
export const VS = 24 / 7; // km per second
export const KM_PER_SECOND_OF_GAP = 1 / (1 / VS - 1 / VP); // 8

const f1 = (n: number) => Math.round(n * 10) / 10;

export const pArrival = (km: number) => km / VP;
export const sArrival = (km: number) => km / VS;
export const gap = (km: number) => sArrival(km) - pArrival(km);

export function fmtSeconds(s: number): string {
  if (s < 90) return `${s.toFixed(1)} seconds`;
  return `${Math.floor(s / 60)} min ${Math.round(s % 60)} s`;
}

/** A seismogram: a line of ground movement against time, with the P and the S wave arriving. */
export function seismogramSvg(km: number, seconds = 700): string {
  const [x0, w, mid] = [10, 280, 50];
  const X = (t: number) => x0 + (w * t) / seconds;
  const rnd = seeded(5);
  const [tp, ts] = [pArrival(km), sArrival(km)];
  let d = '';
  for (let x = 0; x <= w; x += 1) {
    const t = (x / w) * seconds;
    let a = (rnd() - 0.5) * 2.2;
    if (t > tp) a += 7 * Math.exp(-(t - tp) / 60) * Math.sin(x * 1.7) * (0.7 + rnd() * 0.6);
    if (t > ts) a += 21 * Math.exp(-(t - ts) / 90) * Math.sin(x * 1.1) * (0.7 + rnd() * 0.6);
    d += `${x === 0 ? 'M' : 'L'}${f1(x0 + x)} ${f1(mid + a)}`;
  }
  const ticks = [0, 100, 200, 300, 400, 500, 600, 700].filter((t) => t <= seconds).map((t) => `<line class="tickline" x1="${X(t)}" y1="86" x2="${X(t)}" y2="91"/><text class="lab" x="${X(t)}" y="104" text-anchor="middle">${t}</text>`).join('');
  const mark = (t: number, name: string, up: boolean) => (t <= seconds ? `<line class="arrive" x1="${f1(X(t))}" y1="${up ? 14 : 22}" x2="${f1(X(t))}" y2="86"/><text class="lab strong" x="${f1(X(t)) + 4}" y="${up ? 22 : 30}">${name}</text>` : '');
  return `<path class="trace" d="${d}"/>${mark(tp, 'P', true)}${mark(ts, 'S', false)}${ticks}<text class="lab" x="${x0 + w}" y="119" text-anchor="end">seconds after the quake</text>`;
}

export interface Station {
  name: string;
  x: number;
  y: number;
}

/** A map of 300 by 200 pixels. One pixel is 4 km. */
export const KM_PER_PX = 4;
export const stations: Station[] = [
  { name: 'A', x: 60, y: 48 },
  { name: 'B', x: 240, y: 66 },
  { name: 'C', x: 150, y: 168 },
];

export const quakes = [
  { x: 138, y: 98 },
  { x: 108, y: 120 },
  { x: 190, y: 90 },
  { x: 150, y: 70 },
];

export function distanceKm(st: Station, q: { x: number; y: number }): number {
  return Math.hypot(st.x - q.x, st.y - q.y) * KM_PER_PX;
}

export function gaps(q: { x: number; y: number }): number[] {
  return stations.map((s) => gap(distanceKm(s, q)));
}

/** The map: stations, one circle for each station and, once found, the epicentre. */
export function mapSvg(radii: number[], q: { x: number; y: number }, found: boolean): string {
  const grid = [50, 100, 150, 200, 250].map((x) => `<line class="grid" x1="${x}" y1="0" x2="${x}" y2="200"/>`).join('') + [50, 100, 150].map((y) => `<line class="grid" x1="0" y1="${y}" x2="300" y2="${y}"/>`).join('');
  const circles = stations.map((s, i) => `<circle class="ring r${i}" cx="${s.x}" cy="${s.y}" r="${f1(radii[i] / KM_PER_PX)}"/>`).join('');
  const dots = stations.map((s) => `<circle class="station" cx="${s.x}" cy="${s.y}" r="5"/><text class="lab strong" x="${s.x + 8}" y="${s.y - 7}">${s.name}</text>`).join('');
  const epi = found ? `<circle class="epi" cx="${q.x}" cy="${q.y}" r="7"/><text class="lab strong" x="${q.x + 10}" y="${q.y + 16}">epicentre</text>` : '';
  const scale = `<line class="scale" x1="12" y1="190" x2="62" y2="190"/><text class="lab" x="66" y="194">${50 * KM_PER_PX} km</text>`;
  return `${grid}${circles}${dots}${epi}${scale}`;
}

export function foundIt(radii: number[], q: { x: number; y: number }): boolean {
  return stations.every((s, i) => Math.abs(radii[i] - distanceKm(s, q)) <= 15);
}

/** How much more a quake is than a reference one, for a magnitude step. */
export function amplitudeRatio(steps: number): number {
  return 10 ** steps;
}

export function energyRatio(steps: number): number {
  return 10 ** (1.5 * steps);
}

export function fmtTimes(r: number): string {
  if (r >= 1e6) return `${(r / 1e6).toFixed(1)} million times`;
  if (r < 10) return `${r.toFixed(1)} times`;
  const digits = Math.pow(10, Math.floor(Math.log10(r)) - 1); // three figures
  return `${(Math.round(r / digits) * digits).toLocaleString('en-US')} times`;
}

/** The inside of the Earth in a cut: the angle of a station from the quake decides which waves arrive. */
export function wavesAt(deg: number): { p: boolean; s: boolean; note: string } {
  if (deg <= 103) return { p: true, s: true, note: 'Both the P and the S waves arrive.' };
  if (deg < 142) return { p: false, s: false, note: 'This is the shadow zone. Neither wave arrives clearly.' };
  return { p: true, s: false, note: 'Only P waves arrive. The S waves cannot cross the liquid outer core.' };
}

export function earthSvg(deg: number): string {
  const [cx, cy, R] = [150, 100, 86];
  const pt = (a: number, r: number) => `${f1(cx + r * Math.sin((a * Math.PI) / 180))} ${f1(cy - r * Math.cos((a * Math.PI) / 180))}`;
  const arc = (a0: number, a1: number, r: number) => `M${pt(a0, r)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1, r)}`;
  const w = wavesAt(deg);
  const rim = (a0: number, a1: number, cls: string) => `<path class="${cls}" d="${arc(a0, a1, R + 8)}"/>`;
  const zones = rim(0, 103, 'zone both') + rim(103, 142, 'zone none') + rim(142, 180, 'zone ponly');
  const mirror = `<g transform="translate(300 0) scale(-1 1)">${zones}</g>`;
  const [sx, sy] = pt(deg, R).split(' ');
  return `<circle class="mantle" cx="${cx}" cy="${cy}" r="${R}"/><circle class="outer" cx="${cx}" cy="${cy}" r="${f1(R * 0.55)}"/><circle class="inner" cx="${cx}" cy="${cy}" r="${f1(R * 0.19)}"/><circle class="quakept" cx="${cx}" cy="${f1(cy - R)}" r="5"/><g>${zones}</g>${mirror}<line class="sight" x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}"/><circle class="${w.p || w.s ? 'station' : 'station off'}" cx="${sx}" cy="${sy}" r="6"/>`;
}
