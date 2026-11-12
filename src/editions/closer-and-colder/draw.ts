// The pictures of the experiment, as SVG markup. The server draws the starting picture (so the page
// shows something useful without a script), and the browser redraws with the same code.
// Colours are fixed: the pictures sit on their own dark panel, the same in light and dark mode.

import { dailySunlight, dayLabel, daylight, noonHeight, spread, sunLatitude, year, type World, REAL } from './model';

const SUN = '#ffcf5a';
const RAY = '#ffd77a';
const SEA = '#3d7bb0';
const NIGHT = '#0c1b2e';
const LAND = '#e8d8a8';
const INK = '#f3ead6';
const SOFT = '#9fb3c8';
const MARK = '#ff7a45';

const r1 = (n: number) => Math.round(n * 10) / 10;

/**
 * The Earth at noon, cut through the place, seen from the side with the Sun far off to the left.
 * The equator leans by the Sun's latitude for the day, so in June the north leans towards the Sun.
 */
export function sideView(lat: number, day: number, w: World = REAL, place = 'Amsterdam'): string {
  const cx = 250;
  const cy = 150;
  const R = 108;
  const d = sunLatitude(day, w.tilt);
  const rad = (x: number) => (x * Math.PI) / 180;
  // The place sits on the sunward edge, lat - d degrees above the line to the Sun
  const a = rad(lat - d);
  const px = cx - R * Math.cos(a);
  const py = cy - R * Math.sin(a);
  // The axis: through the centre, tilted by d away from straight up towards the Sun
  const ax = Math.sin(rad(d));
  const ay = Math.cos(rad(d));
  const pole = (k: number) => `${r1(cx - ax * R * k)} ${r1(cy - ay * R * k)}`;
  const south = (k: number) => `${r1(cx + ax * R * k)} ${r1(cy + ay * R * k)}`;
  // The equator, at right angles to the axis
  const ex = Math.cos(rad(d));
  const ey = -Math.sin(rad(d));
  // The line of latitude through the place: the part left of the middle is in daylight
  const lx = R * Math.cos(rad(lat));
  const ly = R * Math.sin(rad(lat));
  const cxL = cx - ax * ly;
  const cyL = cy - ay * ly;
  const end1 = [cxL - ex * lx, cyL - ey * lx];
  const end2 = [cxL + ex * lx, cyL + ey * lx];
  const h = noonHeight(lat, day, w);
  const rays = [60, 105, 150, 195, 240]
    .map((y) => `<path d="M8 ${y}H${r1(cx - Math.sqrt(Math.max(0, R * R - (y - cy) ** 2)))}" stroke="${RAY}" stroke-width="2" stroke-dasharray="6 7" opacity="0.6"/>`)
    .join('');
  const up = h > 0;
  // The ground at the place, and the angle between it and the sunlight
  const gx = Math.sin(a);
  const gy = -Math.cos(a);
  const ground = `<path d="M${r1(px - gx * 34)} ${r1(py - gy * 34)}L${r1(px + gx * 34)} ${r1(py + gy * 34)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const label = up ? `Noon Sun ${Math.round(h)}° up` : 'The Sun stays down';
  const labelY = py < 70 ? py + 34 : py - 16;
  return `<svg viewBox="0 0 400 300" role="img" aria-label="The Earth seen from the side at noon in ${place} on ${dayLabel(day)}. ${label}." xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${NIGHT}"/>
  <circle cx="-30" cy="150" r="46" fill="${SUN}"/>
  ${rays}
  <clipPath id="cc-earth"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="${SEA}"/>
  <rect x="${cx}" y="${cy - R}" width="${R}" height="${2 * R}" fill="#06101d" opacity="0.62" clip-path="url(#cc-earth)"/>
  <path d="M${r1(cx - ex * R)} ${r1(cy - ey * R)}L${r1(cx + ex * R)} ${r1(cy + ey * R)}" stroke="${SOFT}" stroke-width="1.5" stroke-dasharray="3 5"/>
  <path d="M${r1(end1[0])} ${r1(end1[1])}L${r1(end2[0])} ${r1(end2[1])}" stroke="${LAND}" stroke-width="2" stroke-dasharray="2 4" opacity="0.8"/>
  <path d="M${pole(1.28)}L${south(1.28)}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  <text x="${r1(cx - ax * R * 1.36 + (ax > 0 ? -10 : 10))}" y="${r1(Math.max(18, cy - ay * R * 1.32 + 4))}" fill="${INK}" font-size="15" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">N</text>
  ${ground}
  <circle cx="${r1(px)}" cy="${r1(py)}" r="6.5" fill="${MARK}" stroke="${NIGHT}" stroke-width="2"/>
  <text x="${r1(px - 12)}" y="${r1(labelY)}" fill="${INK}" font-size="15" font-weight="700" text-anchor="end" font-family="system-ui, sans-serif">${place}</text>
  <text x="12" y="288" fill="${SOFT}" font-size="14" font-family="system-ui, sans-serif">sunlight from far away →</text>
  <text x="390" y="288" fill="${SOFT}" font-size="14" text-anchor="end" font-family="system-ui, sans-serif">dark half: night</text>
</svg>`;
}

/** One square metre of sunlight landing on flat ground, and the patch it lights. */
export function beamView(height: number): string {
  const groundY = 190;
  const width = 62;
  const W = 400;
  if (height <= 0) {
    return `<svg viewBox="0 0 ${W} 220" role="img" aria-label="The Sun does not rise, so no sunlight reaches the ground." xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="220" fill="${NIGHT}"/>
  <path d="M0 ${groundY}H${W}" stroke="${LAND}" stroke-width="3"/>
  <text x="200" y="110" fill="${INK}" font-size="17" text-anchor="middle" font-family="system-ui, sans-serif">The Sun does not rise today</text>
</svg>`;
  }
  const rad = (height * Math.PI) / 180;
  const len = Math.min(W - 20, width / Math.sin(rad));
  const x0 = W / 2 - len / 2;
  const x1 = W / 2 + len / 2;
  // The beam comes from the upper left at the Sun's height
  const back = 260;
  // When the patch is clipped at the edges, the drawn beam narrows to match it
  const bw = len * Math.sin(rad);
  const dx = Math.cos(rad) * back;
  const dy = Math.sin(rad) * back;
  const area = spread(height);
  const say = area > 30 ? 'more than 30' : area.toFixed(1);
  return `<svg viewBox="0 0 ${W} 220" role="img" aria-label="A beam of sunlight one square metre across lands on ${say} square metres of ground." xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="220" fill="${NIGHT}"/>
  <polygon points="${r1(x0 - dx)},${r1(groundY - dy)} ${r1(x0 - dx + bw * Math.sin(rad))},${r1(groundY - dy - bw * Math.cos(rad))} ${r1(x1)},${groundY} ${r1(x0)},${groundY}" fill="${RAY}" opacity="0.34"/>
  <path d="M${r1(x0 - dx)} ${r1(groundY - dy)}L${r1(x0)} ${groundY}M${r1(x0 - dx + bw * Math.sin(rad))} ${r1(groundY - dy - bw * Math.cos(rad))}L${r1(x1)} ${groundY}" stroke="${RAY}" stroke-width="2"/>
  <rect x="0" y="${groundY}" width="${W}" height="30" fill="#24384f"/>
  <path d="M0 ${groundY}H${W}" stroke="${LAND}" stroke-width="3"/>
  <rect x="${r1(x0)}" y="${groundY - 4}" width="${r1(x1 - x0)}" height="8" rx="3" fill="${MARK}"/>
  <text x="${W - 16}" y="30" fill="${INK}" font-size="16" font-weight="700" text-anchor="end" font-family="system-ui, sans-serif">1 m² of sunlight</text>
  <text x="${W - 16}" y="${groundY - 16}" fill="${INK}" font-size="16" font-weight="700" text-anchor="end" font-family="system-ui, sans-serif">lands on ${say} m²</text>
</svg>`;
}

/**
 * Sunlight per day through the year at one place. The dashed line is the real Earth, for comparison.
 * `narrow` draws it for a phone: fewer units across, so the same text comes out bigger.
 */
export function yearChart(lat: number, day: number, w: World = REAL, narrow = false): string {
  const VW = narrow ? 400 : 640;
  const VH = narrow ? 320 : 300;
  const F = narrow ? 15 : 13;
  const X0 = narrow ? 36 : 46;
  const X1 = VW - 16;
  const Y0 = VH - 50;
  const Y1 = 26;
  const MAX = 14;
  const x = (d: number) => X0 + ((d - 1) / 364) * (X1 - X0);
  const y = (v: number) => Y0 - (v / MAX) * (Y0 - Y1);
  const path = (values: number[]) => values.map((v, i) => `${i ? 'L' : 'M'}${r1(x(i + 1))} ${r1(y(v))}`).join('');
  const changed = w.tilt !== REAL.tilt || w.distance !== REAL.distance;
  const now = year(lat, w);
  const real = changed ? year(lat, REAL) : now;
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  const ticks = starts.map((s, i) => `<text x="${r1(x(s + 14))}" y="${Y0 + 20}" fill="${SOFT}" font-size="${F}" text-anchor="middle" font-family="system-ui, sans-serif">${months[i]}</text>`).join('');
  const grid = [0, 4, 8, 12].map((v) => `<path d="M${X0} ${r1(y(v))}H${X1}" stroke="#2a4260" stroke-width="1"/><text x="${X0 - 8}" y="${r1(y(v)) + 4}" fill="${SOFT}" font-size="${F}" text-anchor="end" font-family="system-ui, sans-serif">${v}</text>`).join('');
  const v = dailySunlight(lat, day, w);
  const hi = Math.max(...now);
  const lo = Math.min(...now);
  const near = x(3);
  const far = x(185);
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Sunlight per day through the year. Highest ${hi.toFixed(1)}, lowest ${lo.toFixed(1)} kilowatt hours per square metre. On ${dayLabel(day)}: ${v.toFixed(1)}." xmlns="http://www.w3.org/2000/svg">
  <rect width="${VW}" height="${VH}" fill="${NIGHT}"/>
  ${grid}
  <text x="${X0}" y="17" fill="${SOFT}" font-size="${F}" font-family="system-ui, sans-serif">kWh of sunlight per m² per day</text>
  <path d="M${r1(near)} ${Y0}V${Y1 + 10}" stroke="${SOFT}" stroke-width="1" stroke-dasharray="2 4"/>
  <path d="M${r1(far)} ${Y0}V${Y1 + 10}" stroke="${SOFT}" stroke-width="1" stroke-dasharray="2 4"/>
  <text x="${r1(near + 6)}" y="${Y1 + 22}" fill="${SOFT}" font-size="${F}" font-family="system-ui, sans-serif">${narrow ? 'closest' : 'closest to the Sun'}</text>
  <text x="${r1(far + 6)}" y="${Y1 + 22}" fill="${SOFT}" font-size="${F}" font-family="system-ui, sans-serif">farthest</text>
  ${changed ? `<path d="${path(real)}" fill="none" stroke="${SOFT}" stroke-width="2" stroke-dasharray="5 6"/>` : ''}
  <path d="${path(now)}" fill="none" stroke="${SUN}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M${r1(x(day))} ${Y0}V${r1(y(v))}" stroke="${MARK}" stroke-width="2"/>
  <circle cx="${r1(x(day))}" cy="${r1(y(v))}" r="7" fill="${MARK}" stroke="${NIGHT}" stroke-width="2.5"/>
  ${ticks}
  ${changed ? `<text x="${X1}" y="${Y0 + 42}" fill="${SOFT}" font-size="${F}" text-anchor="end" font-family="system-ui, sans-serif">dashed: the real Earth</text>` : ''}
</svg>`;
}

/** A 24 hour bar with the daylight in the middle (sun time: noon is when the Sun is highest). */
export function dayBar(hours: number): string {
  const W = 400;
  const left = ((12 - hours / 2) / 24) * W;
  const width = (hours / 24) * W;
  const ticks = [0, 6, 12, 18, 24].map((t) => `<text x="${r1((t / 24) * W)}" y="44" fill="${SOFT}" font-size="12" text-anchor="${t === 0 ? 'start' : t === 24 ? 'end' : 'middle'}" font-family="system-ui, sans-serif">${t}:00</text>`).join('');
  return `<svg viewBox="0 0 ${W} 50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <rect y="6" width="${W}" height="20" rx="10" fill="#0a1626"/>
  <rect x="${r1(left)}" y="6" width="${r1(width)}" height="20" rx="${hours > 23.5 ? 10 : 6}" fill="${SUN}"/>
  ${ticks}
</svg>`;
}

export function readouts(lat: number, day: number, w: World = REAL) {
  const h = noonHeight(lat, day, w);
  return {
    date: dayLabel(day),
    height: h > 0 ? `${Math.round(h)}°` : 'below the horizon',
    spread: h > 0 ? `${spread(h) > 30 ? 'over 30' : spread(h).toFixed(1)} m²` : 'no sun',
    daylight: daylight(lat, day, w),
    energy: dailySunlight(lat, day, w),
  };
}
