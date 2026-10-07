// The sun maths for the seasons page. Plain functions, angles in degrees unless the name says otherwise.

export const TILT = 23.44;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Where the Sun stands north (+) or south (-) of the equator, in degrees. `day` is the day of the year, 1 to 365. */
export const declination = (day: number, tilt = TILT) => tilt * Math.sin(rad((360 / 365) * (day - 81)));

/**
 * Hours between sunrise and sunset at a latitude, for a Sun at `decl` degrees. Sunrise counts when the middle of
 * the Sun is 0.833 degrees under the horizon (the Sun's own size and the bending of light in the air).
 * Returns 24 for a midnight sun and 0 for a polar night.
 */
export function dayLength(lat: number, decl: number) {
  const c = (Math.sin(rad(-0.833)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) / (Math.cos(rad(lat)) * Math.cos(rad(decl)));
  if (c <= -1) return 24;
  if (c >= 1) return 0;
  return (2 * deg(Math.acos(c))) / 15;
}

/** How high the Sun is above the horizon at noon, in degrees (negative: it stays below the horizon). */
export const noonElevation = (lat: number, decl: number) => 90 - Math.abs(lat - decl);

/** Distance from the Sun in millions of km. Closest around 3 January, farthest around 4 July. */
export const sunDistance = (day: number) => 149.6 * (1 - 0.0167 * Math.cos(rad((360 / 365.25) * (day - 3))));

/** The day of the year for a month and a day: (3, 20) is 79 in a normal year. */
export function dayOfYear(month: number, date: number) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return days.slice(0, month - 1).reduce((a, b) => a + b, 0) + date;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "21 June" for a day of the year. */
export function dateName(day: number) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let left = day;
  for (let m = 0; m < 12; m++) {
    if (left <= days[m]) return `${left} ${MONTHS[m]}`;
    left -= days[m];
  }
  return '31 December';
}

/** Hours as "16 h 48 min". */
export function hm(hours: number) {
  const total = Math.round(hours * 60);
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, '0')} min`;
}

/** The season in the northern hemisphere. The southern one is the opposite. */
export function season(day: number, north = true) {
  const n = day < 79 || day >= 355 ? 'winter' : day < 172 ? 'spring' : day < 265 ? 'summer' : 'autumn';
  if (north) return n;
  return { winter: 'summer', spring: 'autumn', summer: 'winter', autumn: 'spring' }[n];
}
