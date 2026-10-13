// Waggle dance maths for the bee page. Used by the page at build time and by the scripts in the browser.
// Angles are in degrees. A compass bearing is measured clockwise from north.

import { seeded } from './rand';

export const KM_PER_SECOND = 1;
/** How many SVG units one km is on the garden map. */
export const PX_PER_KM = 40;
export const CENTRE = 150;

const rad = (d: number) => (d * Math.PI) / 180;
const norm = (d: number) => ((d % 360) + 360) % 360;
const f1 = (n: number) => Math.round(n * 10) / 10;

export const compass = (bearing: number) => ['north', 'north east', 'east', 'south east', 'south', 'south west', 'west', 'north west'][Math.round(norm(bearing) / 45) % 8];

/** The compass direction of the sun, in degrees, for an hour of the day. A toy: the sun moves 15 degrees an hour and is south at noon. */
export const sunBearing = (hour: number) => 180 + 15 * (hour - 12);

/** The place on the map (SVG units) that is a distance (km) away in a direction (compass degrees) from the hive. */
export function mapPoint(bearing: number, km: number): [number, number] {
  return [f1(CENTRE + PX_PER_KM * km * Math.sin(rad(bearing))), f1(CENTRE - PX_PER_KM * km * Math.cos(rad(bearing)))];
}

/** The angle of the dance, to the right of straight up, that points at a flower when the sun is at a bearing. */
export const danceAngle = (flower: number, sun: number) => {
  const a = norm(flower - sun + 180) - 180;
  return a;
};

/** The direction a dance points in, from the angle of the dance and the bearing of the sun. */
export const flowerBearing = (angle: number, sun: number) => norm(sun + angle);

/** The seconds of waggling that tell of a distance. */
export const runSeconds = (km: number) => km / KM_PER_SECOND;
export const runKm = (seconds: number) => seconds * KM_PER_SECOND;

export function fmtAngle(a: number): string {
  const r = Math.round(a);
  if (r === 0) return 'straight up';
  if (Math.abs(r) === 180) return 'straight down';
  return `${Math.abs(r)} degrees to the ${r > 0 ? 'right' : 'left'} of straight up`;
}

/** The garden map as SVG: the hive in the middle, the direction of the sun at the edge, and the flower. */
export function gardenSvg(sun: number, flower: [number, number] | null, extra = ''): string {
  const [sx, sy] = [CENTRE + 128 * Math.sin(rad(sun)), CENTRE - 128 * Math.cos(rad(sun))];
  const rings = [1, 2, 3].map((k) => `<circle class="ring" cx="${CENTRE}" cy="${CENTRE}" r="${k * PX_PER_KM}"/><text class="ringlab" x="${CENTRE + 3}" y="${CENTRE - k * PX_PER_KM - 3}">${k} km</text>`).join('');
  const hive = `<path class="hive" d="M${CENTRE} ${CENTRE - 9}l8 4.6v9.2l-8 4.6l-8 -4.6v-9.2z"/>`;
  const sunMark = `<line class="sunline" x1="${CENTRE}" y1="${CENTRE}" x2="${f1(sx)}" y2="${f1(sy)}"/><circle class="sun" cx="${f1(sx)}" cy="${f1(sy)}" r="9"/>`;
  const fl = flower ? `<line class="trail" x1="${CENTRE}" y1="${CENTRE}" x2="${flower[0]}" y2="${flower[1]}"/><circle class="flower" cx="${flower[0]}" cy="${flower[1]}" r="7"/>` : '';
  return `${rings}<text class="north" x="${CENTRE}" y="14" text-anchor="middle">N</text>${sunMark}${fl}${hive}${extra}`;
}

/** The comb as SVG: a dancing bee whose waggle run is tilted from straight up, with a dashed line for up. */
export function combSvg(angle: number, seconds: number): string {
  const len = 30 + seconds * 12;
  const a = rad(angle);
  const [x2, y2] = [110 + len * Math.sin(a), 130 - len * Math.cos(a)];
  return (
    `<line class="up" x1="110" y1="130" x2="110" y2="${f1(130 - 118)}"/>` +
    `<text class="uplab" x="116" y="24">up</text>` +
    `<line class="run" x1="110" y1="130" x2="${f1(x2)}" y2="${f1(y2)}"/>` +
    `<g transform="translate(${f1(x2)} ${f1(y2)}) rotate(${f1(angle)})"><ellipse class="bee" cx="0" cy="0" rx="7" ry="11"/><path class="stripe" d="M-7 -3h14M-6.5 3h13"/><ellipse class="wing" cx="-7" cy="-4" rx="3" ry="6"/><ellipse class="wing" cx="7" cy="-4" rx="3" ry="6"/></g>`
  );
}

/** Noisy copies of one dance run, as seen by bees that each watch a run. The same seed gives the same runs. */
export function noisyRuns(bearing: number, km: number, count: number): { bearing: number; km: number }[] {
  const r = seeded(21);
  return Array.from({ length: count }, () => ({ bearing: bearing + (r() * 2 - 1) * 15, km: km * (1 + (r() * 2 - 1) * 0.15) }));
}

/** The average of several guesses, as a point on the map, and how far (km) it is from the true place. */
export function average(runs: { bearing: number; km: number }[], truth: [number, number]) {
  const pts = runs.map((p) => mapPoint(p.bearing, p.km));
  const mx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return { point: [f1(mx), f1(my)] as [number, number], error: Math.hypot(mx - truth[0], my - truth[1]) / PX_PER_KM, pts };
}

const cache = new Map<number, number>();
/** The typical error (km) of the average of n runs, over many tries, so one lucky or unlucky sample does not mislead. */
export function typicalError(bearing: number, km: number, n: number): number {
  const hit = cache.get(n);
  if (hit !== undefined) return hit;
  const r = seeded(5);
  const truth = mapPoint(bearing, km);
  let total = 0;
  const trials = 400;
  for (let t = 0; t < trials; t++) {
    const runs = Array.from({ length: n }, () => ({ bearing: bearing + (r() * 2 - 1) * 15, km: km * (1 + (r() * 2 - 1) * 0.15) }));
    total += average(runs, truth).error;
  }
  cache.set(n, total / trials);
  return total / trials;
}
