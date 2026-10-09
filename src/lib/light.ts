// Light travel maths for the light page. Used by the page at build time and by the scripts in the browser.

/** The speed of light in a vacuum, in km per second. It is exact: the metre is defined from it. */
export const C_KM_S = 299792.458;
/** One light-year in km: the distance light goes in 365.25 days. */
export const LY_KM = C_KM_S * 365.25 * 86400;

export interface Target {
  id: string;
  name: string;
  km: number;
  note: string;
}

// Distances are rounded, and the planets move, so every time is a typical value.
export const targets: Target[] = [
  { id: 'moon', name: 'The Moon', km: 384400, note: 'average distance' },
  { id: 'sun', name: 'The Sun', km: 149597871, note: 'one astronomical unit' },
  { id: 'mars-near', name: 'Mars, nearest', km: 54600000, note: 'closest it can come' },
  { id: 'mars-far', name: 'Mars, farthest', km: 401000000, note: 'far side of the Sun' },
  { id: 'jupiter-near', name: 'Jupiter, nearest', km: 588000000, note: 'about 4 AU' },
  { id: 'jupiter-far', name: 'Jupiter, farthest', km: 968000000, note: 'far side of the Sun' },
  { id: 'neptune', name: 'Neptune, nearest', km: 4306000000, note: 'NASA fact sheet range 4.31 to 4.69 billion km' },
  { id: 'voyager', name: 'Voyager 1 on 18 November 2026', km: C_KM_S * 86400, note: 'NASA says it reaches one light-day then' },
  { id: 'proxima', name: 'Proxima Centauri', km: 4.24 * LY_KM, note: 'the nearest star after the Sun' },
];

export const seconds = (km: number) => km / C_KM_S;

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/** A time in words, with the unit that fits its size. */
export function fmtTime(s: number): string {
  if (s < 10) return `${s.toFixed(2)} seconds`;
  if (s < 60) return `${Math.round(s)} seconds`;
  if (s < 3600) {
    const m = Math.floor(s / 60);
    const r = Math.round(s - m * 60);
    return r === 60 ? plural(m + 1, 'minute') : `${plural(m, 'minute')} ${plural(r, 'second')}`;
  }
  if (s < 86400 * 2) {
    const h = Math.floor(s / 3600);
    const m = Math.round((s - h * 3600) / 60);
    return m === 60 ? plural(h + 1, 'hour') : m === 0 ? plural(h, 'hour') : `${plural(h, 'hour')} ${plural(m, 'minute')}`;
  }
  const years = s / (365.25 * 86400);
  if (years < 2) return `${Math.round(s / 86400)} days`;
  if (years < 10) return `${years.toFixed(2)} years`;
  // Long trips are rounded to three figures, because the sums are rough
  if (years >= 1e9) return `${(years / 1e9).toPrecision(3)} billion years`;
  if (years >= 1e6) return `${(years / 1e6).toPrecision(3)} million years`;
  if (years >= 1000) return `${(Math.round(years / 100) * 100).toLocaleString('en-US')} years`;
  return `${Math.round(years).toLocaleString('en-US')} years`;
}

/** A distance in km, kept short for big numbers. */
export function fmtKm(km: number): string {
  if (km >= 1e12) return `${(km / 1e12).toFixed(1)} trillion km`;
  if (km >= 1e9) return `${(km / 1e9).toFixed(1)} billion km`;
  if (km >= 1e6) return `${Math.round(km / 1e6).toLocaleString('en-US')} million km`;
  return `${Math.round(km).toLocaleString('en-US')} km`;
}
