// Maths and drawings for the Moon phases page. The same strings are used when the page is built and in the browser.
// The sky here is a toy: circular orbits, a Sun that rises at 06:00 and sets at 18:00, and no latitude or season.

export const SYNODIC = 29.530589; // new moon to new moon, in days
export const SIDEREAL = 27.321662; // back to the same star, in days
export const EARTH_DEG_PER_DAY = 360 / 365.2422; // how far the Sun's direction moves in a day
export const TILT = 5.145; // tilt of the Moon's orbit, in degrees
export const ECLIPSE_YEAR = 346.62; // the nodes meet the Sun again after this many days
const SOLAR_LIMIT = 1.5; // toy limit, in degrees above or below the plane
const LUNAR_LIMIT = 0.9; // toy limit for the Moon to touch Earth's dark shadow

const f1 = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const wrap = (d: number) => ((d % 360) + 360) % 360;

/** How far the Moon is from the Sun in the sky, in degrees: 0 new, 90 first quarter, 180 full, 270 last quarter. */
export function elongation(days: number): number {
  return wrap((days / SYNODIC) * 360);
}

export function litFraction(e: number): number {
  return (1 - Math.cos(rad(e))) / 2;
}

export const phases = [
  { name: 'New moon', e: 0 },
  { name: 'Waxing crescent', e: 45 },
  { name: 'First quarter', e: 90 },
  { name: 'Waxing gibbous', e: 135 },
  { name: 'Full moon', e: 180 },
  { name: 'Waning gibbous', e: 225 },
  { name: 'Last quarter', e: 270 },
  { name: 'Waning crescent', e: 315 },
];

export function phaseName(e: number): string {
  return phases[Math.round(wrap(e) / 45) % 8].name;
}

/** The Moon as we see it from the northern hemisphere. */
export function faceSvg(e: number, cx = 100, cy = 100, r = 80): string {
  const a = wrap(e);
  const w = a <= 180 ? a : 360 - a; // the same shape, mirrored when the Moon is waning
  const rx = f1(Math.abs(Math.cos(rad(w))) * r);
  const sweep = w < 90 ? 0 : 1;
  const lit = `M${cx} ${cy - r}A${r} ${r} 0 0 1 ${cx} ${cy + r}A${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r}Z`;
  const flip = a > 180 ? ` transform="translate(${2 * cx} 0) scale(-1 1)"` : '';
  const dark = `<circle class="m-dark" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const spots = `<g class="m-spots"><circle cx="${cx - 18}" cy="${cy - 22}" r="17"/><circle cx="${cx + 20}" cy="${cy - 4}" r="12"/><circle cx="${cx - 8}" cy="${cy + 26}" r="14"/><circle cx="${cx + 30}" cy="${cy + 30}" r="7"/></g>`;
  return `${dark}<g${flip}><path class="m-lit" d="${lit}"/></g>${spots}<circle class="m-rim" cx="${cx}" cy="${cy}" r="${r}"/>`;
}

/** Looking down on the Earth and the Moon, with sunlight coming in from the left. */
export function orbitSvg(e: number): string {
  const [cx, cy, R] = [170, 110, 78];
  const a = rad(e);
  const mx = f1(cx - R * Math.cos(a));
  const my = f1(cy + R * Math.sin(a));
  const rays = [70, 110, 150].map((y) => `<line class="ray" x1="52" y1="${y}" x2="${y === 110 ? 136 : 118}" y2="${y}"/><path class="rayhead" d="M${y === 110 ? 136 : 118} ${y - 4}l8 4l-8 4z"/>`).join('');
  const lit = `M${mx} ${f1(my - 10)}A10 10 0 0 0 ${mx} ${f1(my + 10)}Z`;
  return `<circle class="sun" cx="22" cy="110" r="22"/>${rays}<circle class="orbit" cx="${cx}" cy="${cy}" r="${R}"/><circle class="earth" cx="${cx}" cy="${cy}" r="14"/><line class="sight" x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}"/><circle class="m-dark" cx="${mx}" cy="${my}" r="10"/><path class="m-lit" d="${lit}" transform="rotate(${f1(180 - e)} ${mx} ${my})"/>`;
}

/** Hour of the day at which the Moon rises, in this toy sky. 0 is midnight. */
export function riseHour(e: number): number {
  return (6 + wrap(e) / 15) % 24;
}

export function fmtHour(h: number): string {
  const m = Math.round(h * 60) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** A 24 hour strip: the dark of night, and the hours in which the Moon is above the horizon. */
export function dayStripSvg(e: number): string {
  const [x0, w, y] = [14, 272, 40];
  const X = (h: number) => f1(x0 + (w * h) / 24);
  const rise = riseHour(e);
  const set = (rise + 12) % 24;
  const band = (from: number, to: number, cls: string, yy: number, hh: number) =>
    from < to
      ? `<rect class="${cls}" x="${X(from)}" y="${yy}" width="${f1(X(to) - X(from))}" height="${hh}" rx="3"/>`
      : `<rect class="${cls}" x="${X(from)}" y="${yy}" width="${f1(X(24) - X(from))}" height="${hh}" rx="3"/><rect class="${cls}" x="${X(0)}" y="${yy}" width="${f1(X(to) - X(0))}" height="${hh}" rx="3"/>`;
  const ticks = [0, 6, 12, 18, 24].map((h) => `<text class="lab" x="${X(h)}" y="${y + 70}" text-anchor="middle">${String(h).padStart(2, '0')}</text><line class="tickline" x1="${X(h)}" y1="${y + 50}" x2="${X(h)}" y2="${y + 55}"/>`).join('');
  return `<rect class="night" x="${x0}" y="${y}" width="${w}" height="50" rx="4"/>${band(6, 18, 'daylight', y, 50)}${band(rise, set, 'moonup', y + 18, 14)}<text class="lab" x="${X(12)}" y="${y + 12}" text-anchor="middle">Sun up</text><text class="lab dark" x="${X(rise < set ? (rise + set) / 2 : (rise + set + 24) / 2 % 24)}" y="${y + 29}" text-anchor="middle">Moon up</text>${ticks}`;
}

/** Looking down from far above the north pole, with the stars fixed. A star is marked on the right. */
export function monthSvg(days: number): string {
  const [cx, cy, R] = [150, 100, 70];
  const moonDeg = (360 / SIDEREAL) * days;
  const sunDeg = EARTH_DEG_PER_DAY * days;
  const pt = (deg: number, r: number) => `${f1(cx + r * Math.cos(rad(deg)))} ${f1(cy - r * Math.sin(rad(deg)))}`;
  const [mx, my] = pt(moonDeg, R).split(' ');
  const [sx, sy] = pt(sunDeg, 96).split(' ');
  const arc = (from: number, to: number, r: number) => {
    const span = to - from;
    if (span < 0.5) return '';
    const big = span > 180 ? 1 : 0;
    return `<path class="arc" d="M${pt(from, r)}A${r} ${r} 0 ${big} 0 ${pt(to, r)}"/>`;
  };
  return `<circle class="orbit" cx="${cx}" cy="${cy}" r="${R}"/><line class="starline" x1="${cx}" y1="${cy}" x2="${cx + 112}" y2="${cy}"/><text class="lab" x="${cx + 114}" y="${cy + 4}">star</text><circle class="earth" cx="${cx}" cy="${cy}" r="12"/>${arc(0, sunDeg, 30)}<line class="sunline" x1="${cx}" y1="${cy}" x2="${sx}" y2="${sy}"/><circle class="sun" cx="${sx}" cy="${sy}" r="9"/><line class="sight" x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}"/><circle class="m-lit" cx="${mx}" cy="${my}" r="8"/>`;
}

export function monthStatus(days: number): string {
  const moonDeg = (360 / SIDEREAL) * days;
  const sunDeg = EARTH_DEG_PER_DAY * days;
  const e = wrap(moonDeg - sunDeg);
  const catchUp = e < 0.5 || e > 359.5 ? 'The Moon is in line with the Sun: a new moon.' : `The Moon is ${f1(e)} degrees from the Sun in the sky: ${phaseName(e).toLowerCase()}.`;
  return `After ${f1(days)} days the Moon has moved ${Math.round(moonDeg)} degrees round Earth against the stars, and the Sun's direction has moved ${f1(sunDeg)} degrees. ${catchUp}`;
}

/** Height of the Moon above (+) or below (-) the plane of Earth's orbit, in degrees, at the k-th new moon of a made up year. */
const START_ANGLE = 20; // made up: how far the Sun is from the node at the first new moon

export function sunNodeAngle(k: number, full: boolean): number {
  return wrap(START_ANGLE + k * SYNODIC * (360 / ECLIPSE_YEAR) + (full ? SYNODIC / 2 * (360 / ECLIPSE_YEAR) : 0));
}

export function moonHeight(k: number, full: boolean): number {
  // At new moon the Moon is on the Sun's side. At full moon it is opposite, so the height flips.
  return full ? -TILT * Math.sin(rad(sunNodeAngle(k, true))) : TILT * Math.sin(rad(sunNodeAngle(k, false)));
}

export function eclipseKind(k: number, full: boolean): 'none' | 'partial' | 'total' {
  const h = Math.abs(moonHeight(k, full));
  const limit = full ? LUNAR_LIMIT : SOLAR_LIMIT;
  if (h > limit) return 'none';
  return h < limit * 0.6 ? 'total' : 'partial';
}

export const MOONS = 13;

export function eclipseCount(full: boolean): number {
  let n = 0;
  for (let k = 0; k < MOONS; k++) if (eclipseKind(k, full) !== 'none') n++;
  return n;
}

/** A side view: the Sun on the left, Earth in the middle, the Moon above or below the line between them. */
export function sideSvg(k: number, full: boolean): string {
  const [cx, cy] = [150, 80];
  const h = moonHeight(k, full);
  const px = f1(h * 8); // drawn bigger than life
  const mx = full ? cx + 100 : cx - 100;
  const kind = eclipseKind(k, full);
  const line = `<line class="plane" x1="12" y1="${cy}" x2="288" y2="${cy}"/><text class="lab" x="12" y="20">Dashed line: the plane of Earth\u2019s orbit</text><text class="lab" x="12" y="148">Heights are drawn bigger than life</text>`;
  const sun = `<circle class="sun" cx="22" cy="${cy}" r="14"/>`;
  const shadow = full ? `<path class="shade" d="M${cx + 10} ${cy - 11}L${cx + 150} ${cy - 6}L${cx + 150} ${cy + 6}L${cx + 10} ${cy + 11}Z"/>` : '';
  const earth = `<circle class="earth" cx="${cx}" cy="${cy}" r="11"/>`;
  const my = f1(cy - px);
  const moon = `<circle class="${kind === 'none' ? 'm-lit' : 'm-hit'}" cx="${mx}" cy="${my}" r="9"/><line class="drop" x1="${mx}" y1="${cy}" x2="${mx}" y2="${my}"/>`;
  return `${line}${sun}${shadow}${earth}${moon}`;
}

export function eclipseStatus(k: number, full: boolean): string {
  const h = moonHeight(k, full);
  const kind = eclipseKind(k, full);
  const where = Math.abs(h) < 0.05 ? 'right on the plane' : `${f1(Math.abs(h))} degrees ${h > 0 ? 'above' : 'below'} the plane`;
  const verdict = {
    none: full ? 'The Moon misses Earth\u2019s shadow, so there is no eclipse.' : 'The Moon misses the Sun, so there is no eclipse.',
    partial: full ? 'The Moon clips the edge of Earth\u2019s shadow: a partial lunar eclipse in this toy.' : 'The Moon covers part of the Sun: a partial solar eclipse in this toy.',
    total: full ? 'The Moon goes deep into Earth\u2019s shadow: a total lunar eclipse in this toy.' : 'The Moon crosses right in front of the Sun: a central solar eclipse in this toy.',
  }[kind];
  return `${full ? 'Full' : 'New'} moon ${k + 1} of ${MOONS}: the Moon is ${where}. ${verdict} In this toy year ${eclipseCount(full)} of ${MOONS} ${full ? 'full' : 'new'} moons bring an eclipse.`;
}

export function yearStripSvg(k: number, full: boolean): string {
  const [x0, w] = [14, 272];
  const dots = Array.from({ length: MOONS }, (_, i) => {
    const x = f1(x0 + (w * (i + 0.5)) / MOONS);
    const kind = eclipseKind(i, full);
    const cls = `dot ${kind === 'none' ? 'no' : 'yes'}${i === k ? ' on' : ''}`;
    return `<circle class="${cls}" cx="${x}" cy="30" r="${i === k ? 8 : 6}"/><text class="lab" x="${x}" y="54" text-anchor="middle">${i + 1}</text>`;
  }).join('');
  return `<line class="plane" x1="${x0}" y1="30" x2="${x0 + w}" y2="30"/>${dots}`;
}
