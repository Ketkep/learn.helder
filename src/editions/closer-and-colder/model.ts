// The model behind "Closer to the Sun, colder outside": how much sunlight reaches one square metre
// of flat ground at a place, on a day of the year, at the top of the air (before clouds and air take
// their share). It uses the standard formulas for the Sun's position and daily sunlight. Two switches
// change the real Earth: `tilt` (degrees) and `distance` (false keeps the Earth at its average
// distance all year). The Sun's direction always comes from the real orbit, so only the switched
// cause changes.
//
// Checked against almanac day lengths for Amsterdam (longest about 16 h 48 min, shortest about
// 7 h 40 min) and NASA's orbit figures. It is a model: no weather, no air, no hills.

export const EARTH = {
  /** Axial tilt, degrees (NASA Earth fact sheet: 23.44) */
  tilt: 23.44,
  /** Orbit eccentricity (NASA: 0.0167) */
  ecc: 0.0167,
  /** Average distance, million km */
  a: 149.598,
  /** Day of the year of the closest point (3 January) */
  periDay: 3,
  /** Direction of the closest point, measured like the Sun's longitude, degrees */
  periLongitude: 282.94,
  /** Sunlight at the average distance, W per square metre (about 1361) */
  solar: 1361,
};

export const PLACES = [
  { id: 'amsterdam', name: 'Amsterdam', lat: 52.37 },
  { id: 'quito', name: 'Quito, on the equator', lat: -0.18 },
  { id: 'sydney', name: 'Sydney', lat: -33.87 },
] as const;

export interface World {
  tilt: number;
  distance: boolean;
}

export const REAL: World = { tilt: EARTH.tilt, distance: true };

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** "12 Nov" for a day of the year (1 to 365, a year without 29 February). */
export function dayLabel(day: number): string {
  let d = day;
  for (let m = 0; m < 12; m++) {
    if (d <= DAYS_IN[m]) return `${d} ${MONTHS[m]}`;
    d -= DAYS_IN[m];
  }
  return '31 Dec';
}

/** Day of the year for a month (1 to 12) and a day. */
export function dayOfYear(month: number, day: number): number {
  return DAYS_IN.slice(0, month - 1).reduce((a, b) => a + b, 0) + day;
}

/** Where the Earth is on its orbit: the angle from the closest point, in radians. */
function trueAnomaly(day: number): number {
  const e = EARTH.ecc;
  const M = (2 * Math.PI * (day - EARTH.periDay)) / 365.256;
  return M + 2 * e * Math.sin(M) + 1.25 * e * e * Math.sin(2 * M);
}

/** Distance from the Earth to the Sun, million km. */
export function distance(day: number): number {
  const e = EARTH.ecc;
  return (EARTH.a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly(day)));
}

/** How far north (+) or south (-) of the equator the Sun stands overhead at noon, degrees. */
export function sunLatitude(day: number, tilt: number): number {
  const longitude = trueAnomaly(day) + rad(EARTH.periLongitude);
  return deg(Math.asin(Math.sin(rad(tilt)) * Math.sin(longitude)));
}

/** Height of the Sun above the horizon at noon, degrees (negative: it does not rise). */
export function noonHeight(lat: number, day: number, w: World = REAL): number {
  return 90 - Math.abs(lat - sunLatitude(day, w.tilt));
}

/** Hours between sunrise and sunset, counting the Sun's edge and the bending of light, as almanacs do. */
export function daylight(lat: number, day: number, w: World = REAL): number {
  const d = rad(sunLatitude(day, w.tilt));
  const p = rad(lat);
  const c = (Math.sin(rad(-0.833)) - Math.sin(p) * Math.sin(d)) / (Math.cos(p) * Math.cos(d));
  if (c <= -1) return 24;
  if (c >= 1) return 0;
  return (2 * deg(Math.acos(c))) / 15;
}

/** Sunlight on one square metre of flat ground over the whole day, top of the air, kWh. */
export function dailySunlight(lat: number, day: number, w: World = REAL): number {
  const d = rad(sunLatitude(day, w.tilt));
  const p = rad(lat);
  const h0 = Math.acos(clamp(-Math.tan(p) * Math.tan(d), -1, 1));
  const near = w.distance ? (EARTH.a / distance(day)) ** 2 : 1;
  const watts = (EARTH.solar / Math.PI) * near * (h0 * Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.sin(h0));
  return Math.max(0, (watts * 24) / 1000);
}

/** One square metre of sunlight lands on this much ground when the Sun is this high. */
export function spread(height: number): number {
  return height <= 0 ? Infinity : 1 / Math.sin(rad(height));
}

/** The year for one place: sunlight per day for every day. */
export function year(lat: number, w: World = REAL): number[] {
  return Array.from({ length: 365 }, (_, i) => dailySunlight(lat, i + 1, w));
}

/** "8 h 41 min" */
export function hoursLabel(hours: number): string {
  const total = Math.round(hours * 60);
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, '0')} min`;
}
