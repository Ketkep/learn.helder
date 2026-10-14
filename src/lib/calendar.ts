// Calendar maths for the leap year page. Used by the page at build time and by the scripts in the browser.

/** Days from one spring equinox to the next, on average. */
export const TROPICAL_YEAR = 365.2422;
export const JULIAN_YEAR = 365.25;
export const GREGORIAN_YEAR = 365.2425;

export const leapJulian = (y: number) => y % 4 === 0;
export const leapGregorian = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/**
 * How many days earlier (negative) or later (positive) the spring equinox falls in the calendar after some years,
 * for a calendar whose average year is `calendarYear` days long. The calendar starts with the equinox on 21 March.
 */
export const equinoxShift = (years: number, calendarYear: number) => years * (TROPICAL_YEAR - calendarYear);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The date of the equinox after a shift, counted from 21 March. */
export function equinoxDate(shift: number): string {
  const d = Math.round(shift);
  const day = 21 + d;
  // Walk through March and its neighbours
  const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let month = 2;
  let n = day;
  while (n < 1) {
    month = (month + 11) % 12;
    n += lengths[month];
  }
  while (n > lengths[month]) {
    n -= lengths[month];
    month = (month + 1) % 12;
  }
  return `${n} ${MONTHS[month]}`;
}

export function describeShift(shift: number): string {
  const d = Math.abs(shift);
  const amount = d < 0.95 ? 'less than a day' : `about ${Math.round(d)} day${Math.round(d) === 1 ? '' : 's'}`;
  if (d < 0.05) return 'The seasons stay where they are.';
  return `The spring equinox falls ${amount} ${shift < 0 ? 'earlier' : 'later'} in the calendar, around ${equinoxDate(shift)}.`;
}

/** The three rules as lines for a chart: the shift in days for each year from 0. */
export function shiftSeries(years: number) {
  const ys = Array.from({ length: years + 1 }, (_, i) => i);
  return {
    none: ys.map((y) => equinoxShift(y, 365)),
    julian: ys.map((y) => equinoxShift(y, JULIAN_YEAR)),
    gregorian: ys.map((y) => equinoxShift(y, GREGORIAN_YEAR)),
  };
}

export interface Rule {
  leap: boolean;
  why: string;
}

/** Whether a year is a leap year, and the reason in words, under the Julian and the Gregorian rule. */
export function checkYear(y: number): { julian: Rule; gregorian: Rule } {
  const by4 = y % 4 === 0;
  const by100 = y % 100 === 0;
  const by400 = y % 400 === 0;
  return {
    julian: { leap: by4, why: by4 ? `${y} divides by 4, so it is a leap year` : `${y} does not divide by 4, so it is not a leap year` },
    gregorian: {
      leap: leapGregorian(y),
      why: !by4 ? `${y} does not divide by 4, so it is not a leap year` : !by100 ? `${y} divides by 4 and not by 100, so it is a leap year` : by400 ? `${y} divides by 100 but also by 400, so it is a leap year` : `${y} divides by 100 but not by 400, so it is not a leap year`,
    },
  };
}

/** Days in the average year of a rule over a 400 year cycle, by counting. */
export function averageYear(rule: (y: number) => boolean, cycle = 400): number {
  let days = 0;
  for (let y = 1; y <= cycle; y++) days += rule(y) ? 366 : 365;
  return days / cycle;
}

export interface SkipPage {
  id: string;
  name: string;
  month: string;
  year: number;
  /** Weekday of the first day on the page, 0 for Monday. */
  startsOn: number;
  days: number;
  /** The days that were skipped. */
  skipped: [number, number];
  note: string;
}

export const skips: SkipPage[] = [
  { id: 'catholic', name: 'Catholic countries, 1582', month: 'October', year: 1582, startsOn: 0, days: 31, skipped: [5, 14], note: 'Thursday 4 October was followed by Friday 15 October. Ten days were dropped.' },
  { id: 'britain', name: 'Britain, 1752', month: 'September', year: 1752, startsOn: 1, days: 30, skipped: [3, 13], note: 'Wednesday 2 September was followed by Thursday 14 September. Eleven days were dropped.' },
];

const f1 = (n: number) => Math.round(n * 10) / 10;

/** A line chart of how many days the calendar is off after each of some years, as SVG text. */
export function driftSvg(values: number[], years: number, cls: string): string {
  const [x0, x1, y0, y1] = [44, 292, 14, 140];
  const top = Math.max(1, Math.max(...values.map(Math.abs))) * 1.08;
  const X = (i: number) => f1(x0 + ((x1 - x0) * i) / years);
  const Y = (v: number) => f1(y1 - ((y1 - y0) * Math.abs(v)) / top);
  const lab = (v: number) => (top < 6 ? v.toFixed(1) : Math.round(v).toString());
  const grid = [0, 0.5, 1].map((k) => `<line class="grid" x1="${x0}" y1="${Y(k * top)}" x2="${x1}" y2="${Y(k * top)}"/><text class="lab" x="${x0 - 5}" y="${Number(Y(k * top)) + 4}" text-anchor="end">${lab(k * top)}</text>`).join('');
  const step = years <= 120 ? 20 : years <= 2000 ? 400 : 2500;
  const ticks = Array.from({ length: Math.floor(years / step) + 1 }, (_, k) => k * step).map((t) => `<text class="lab" x="${X(t)}" y="${y1 + 14}" text-anchor="middle">${t.toLocaleString('en-US')}</text>`).join('');
  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${X(i)} ${Y(v)}`).join('');
  return `${grid}${ticks}<path class="${cls}" d="${path}"/><text class="lab" x="${(x0 + x1) / 2}" y="${y1 + 28}" text-anchor="middle">years</text><text class="lab" x="6" y="10">days off</text>`;
}

/** The month grid of a skip page as HTML: seven columns from Monday. The skipped days get no cells, so the weekdays stay true. */
export function monthHtml(p: SkipPage): string {
  const names = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const cells: string[] = names.map((n) => `<span class="dow">${n}</span>`);
  let col = p.startsOn;
  for (let i = 0; i < p.startsOn; i++) cells.push('<span class="day empty"></span>');
  const fill = () => {
    while (col % 7 !== 0) {
      cells.push('<span class="day empty"></span>');
      col++;
    }
  };
  for (let d = 1; d <= p.days; d++) {
    if (d === p.skipped[0]) {
      fill();
      cells.push(`<span class="gap">${p.skipped[1] - p.skipped[0] + 1} days never happened</span>`);
      // The next day carries on from the weekday after the last day before the gap
      col = (p.startsOn + (p.skipped[0] - 1)) % 7;
      for (let i = 0; i < col; i++) cells.push('<span class="day empty"></span>');
    }
    if (d >= p.skipped[0] && d <= p.skipped[1]) continue;
    cells.push(`<span class="day">${d}</span>`);
    col = (col + 1) % 7;
  }
  return cells.join('');
}
