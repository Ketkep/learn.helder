// Maths and drawings for the calendar page. The Julian calendar has a leap year every 4 years, so its year is 365.25 days. The
// Gregorian calendar leaves out the leap day in three century years out of four, so its year is 365.2425 days. The dates of the
// changes come from the sources. Conversions go through the Julian day number. The same text is made at build time (Astro) and in
// the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Julian day number of a date in the Gregorian calendar. */
export function jdnGregorian(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

/** Julian day number of a date in the Julian calendar. */
export function jdnJulian(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083;
}

export interface Date3 {
  y: number;
  m: number;
  d: number;
}

export function fromGregorian(j: number): Date3 {
  const a = j + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return { d: e - Math.floor((153 * m + 2) / 5) + 1, m: m + 3 - 12 * Math.floor(m / 10), y: 100 * b + d - 4800 + Math.floor(m / 10) };
}

export function fromJulian(j: number): Date3 {
  const c = j + 32082;
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return { d: e - Math.floor((153 * m + 2) / 5) + 1, m: m + 3 - 12 * Math.floor(m / 10), y: d - 4800 + Math.floor(m / 10) };
}

export const weekday = (j: number) => DAYS[j % 7];

export const say = (x: Date3) => `${x.d} ${MONTHS[x.m - 1]} ${x.y}`;

/** How many days the Gregorian calendar is ahead of the Julian one on a Gregorian date. */
export const gap = (y: number, m: number, d: number) => jdnJulian(y, m, d) - jdnGregorian(y, m, d);

/** Days of drift in a number of years, for a calendar year length against the true year of about 365.2422 days. */
export const drift = (years: number, yearLength: number) => years * (yearLength - 365.2422);

export const JULIAN_YEAR = 365.25;
export const GREGORIAN_YEAR = 365.2425;

export interface Switch {
  name: string;
  last: Date3; // last day in the Julian calendar
  first: Date3; // first day in the Gregorian calendar
  note: string;
}

export const SWITCHES: Switch[] = [
  { name: 'Spain, Portugal and most Italian states', last: { y: 1582, m: 10, d: 4 }, first: { y: 1582, m: 10, d: 15 }, note: 'The date set by the pope in 1582.' },
  { name: 'Zeeland and Brabant', last: { y: 1582, m: 12, d: 14 }, first: { y: 1582, m: 12, d: 25 }, note: 'Most sources agree. Holland switched separately, in early 1583, and sources differ on the exact date.' },
  { name: 'Overijssel and Utrecht', last: { y: 1700, m: 11, d: 30 }, first: { y: 1700, m: 12, d: 12 }, note: 'Part of the Protestant Low Countries, which mostly switched around 1700 and 1701.' },
  { name: 'Great Britain and its colonies', last: { y: 1752, m: 9, d: 2 }, first: { y: 1752, m: 9, d: 14 }, note: 'Wednesday 2 September was followed by Thursday 14 September.' },
  { name: 'Russia', last: { y: 1918, m: 1, d: 31 }, first: { y: 1918, m: 2, d: 14 }, note: 'The Orthodox Church still uses the Julian calendar for its church year.' },
  { name: 'Greece', last: { y: 1923, m: 2, d: 15 }, first: { y: 1923, m: 3, d: 1 }, note: 'For civil use only. The sources give the date as 16 February 1923, which became 1 March.' },
];

/** The days skipped by a switch. */
export const skipped = (s: Switch) => jdnJulian(s.first.y, s.first.m, s.first.d) - jdnJulian(s.last.y, s.last.m, s.last.d) - 1;

/** A strip of days round a switch, with the missing ones marked. */
export function stripSvg(s: Switch): string {
  const n = skipped(s);
  const jl = jdnJulian(s.last.y, s.last.m, s.last.d);
  const jg = jdnGregorian(s.first.y, s.first.m, s.first.d);
  const cells = 3 + n + 3;
  const w = Math.min(34, 276 / cells);
  let o = `<rect class="page" x="1" y="1" width="298" height="138" rx="8"/>`;
  for (let i = 0; i < cells; i++) {
    const before = i < 3;
    const gone = i >= 3 && i < 3 + n;
    const num = before ? fromJulian(jl - (2 - i)).d : gone ? fromJulian(jl + 1 + (i - 3)).d : fromGregorian(jg + (i - 3 - n)).d;
    const x = 12 + i * w;
    o += `<rect class="${gone ? 'day gone' : 'day'}" x="${f1(x + 1)}" y="40" width="${f1(w - 2)}" height="44" rx="3"/>`;
    o += `<text class="${gone ? 'lab small mid gonetext' : 'lab small mid'}" x="${f1(x + w / 2)}" y="67">${num}</text>`;
  }
  o += `<text class="lab" x="12" y="18">${s.name}</text>`;
  o += `<text class="lab small" x="12" y="106">${say(s.last)} was followed by ${say(s.first)}</text>`;
  o += `<text class="lab small" x="12" y="124">${n} ${n === 1 ? 'day' : 'days'} left out (struck through), and the days of the week carried on</text>`;
  return o;
}
