// The numbers behind the tide tools. Plain functions, so the same maths runs in every tool.

/** Hours between two high tides caused by the Moon (12 h 25 min). */
export const TIDE_H = 12.42;
/** One turn of the Earth relative to the Moon: the lunar day, 24 h 50 min. */
export const LUNAR_DAY_H = TIDE_H * 2;
/** Days from new moon to new moon. */
export const MONTH_D = 29.53;
/** How strong the Sun's tide is, compared with the Moon's. */
export const SUN_SHARE = 0.46;
/** Gravity, for the wave speed in shallow water. */
const G = 9.81;
/** How quickly a toy basin loses energy to friction. Made up, so the toy shows a clear peak. */
const FRICTION = 0.12;

/** Water height at a coast, from -1 (low) to 1 (high), `hours` after a high tide. */
export const heightAfterHigh = (hours: number) => Math.cos((2 * Math.PI * hours) / TIDE_H);

/** The same, when the Earth has turned `deg` degrees since the Moon was overhead. */
export const heightAtAngle = (deg: number) => Math.cos((2 * deg * Math.PI) / 180);

/** How big the combined tide is on a given day of the moon month, as a share of the biggest possible. */
export function rangeShare(ageDays: number) {
  const gap = (2 * Math.PI * ageDays) / MONTH_D; // angle between Sun and Moon, seen from Earth
  const size = Math.sqrt(1 + SUN_SHARE ** 2 + 2 * SUN_SHARE * Math.cos(2 * gap));
  return size / (1 + SUN_SHARE);
}

/** Times (hours from midnight) of the high tides on `day`, when high tides happen at `first` + n x 12.42 h. */
export function highTides(day: number, first: number) {
  const list: number[] = [];
  for (let k = Math.ceil((24 * day - first) / TIDE_H); ; k++) {
    const t = first + k * TIDE_H - 24 * day;
    if (t >= 24) break;
    list.push(t);
  }
  return list;
}

/** Water height, -1 to 1, at `hour` of `day`, with the same rhythm as highTides. */
export const heightOnDay = (day: number, hour: number, first: number) => heightAfterHigh(24 * day + hour - first);

/** Hours and minutes as "06:25". */
export function clock(hours: number) {
  const total = Math.round(hours * 60) % 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Natural sloshing period, in hours, of a basin that is open at one end: four lengths of wave. */
export function naturalPeriodH(lengthKm: number, depthM: number) {
  const speed = Math.sqrt(G * depthM); // metres per second
  return (4 * lengthKm * 1000) / speed / 3600;
}

/**
 * How many times bigger the tide gets at the closed end of a basin than in the open sea.
 * For a basin open at one end and closed at the other, the closed end rises 1 / cos(k L) times as far
 * as the mouth, where k L is a quarter turn of the wave when the natural period is one tide long.
 * Friction (made up) keeps the peak from reaching infinity.
 */
export function amplify(naturalH: number) {
  const a = (Math.PI / 2) * (naturalH / TIDE_H);
  const b = FRICTION * a;
  // Friction can make the closed end a little smaller than the mouth. The toy keeps it at 1 or more.
  return Math.max(1, 1 / Math.sqrt((Math.cos(a) * Math.cosh(b)) ** 2 + (Math.sin(a) * Math.sinh(b)) ** 2));
}

export const MAX_AMPLIFY = amplify(TIDE_H);
