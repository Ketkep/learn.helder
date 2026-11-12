// The daily discovery: the settings that hold for every edition, and the date maths.
// This file runs on the server (to build pages) and in the browser (to work out which day it is),
// so it has no imports and touches nothing but dates.
//
// Days are plain strings, 'YYYY-MM-DD', always meant in the publication time zone. A new day, and so
// a new edition, starts at midnight there for everyone, wherever they are.

export const DAILY = {
  /** The working name of the daily product. Change it here and it changes everywhere. */
  name: 'Learndle',
  /** Where a day starts and ends. */
  timeZone: 'Europe/Amsterdam',
  /** Shown in the share text. */
  site: 'learn.helderlabs.com',
} as const;

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: DAILY.timeZone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** The day it is at this moment in the publication time zone, as 'YYYY-MM-DD'. */
export function dayAt(moment: Date | number): string {
  const parts = dayFormat.formatToParts(new Date(moment));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

/** A day moved by a number of days. Works on the calendar, so summer time cannot get in the way. */
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Whole days from one day to another (negative when the second comes first). */
export function daysBetween(from: string, to: string): number {
  const t = (day: string) => {
    const [y, m, d] = day.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((t(to) - t(from)) / 86400000);
}

/**
 * The moment the next day starts in the publication time zone. Found by halving the gap between
 * now and a moment that is surely tomorrow, so it is right on the days the clocks change too.
 */
export function nextDayStart(now: Date | number): Date {
  const start = new Date(now).getTime();
  const today = dayAt(start);
  let lo = start;
  let hi = start + 26 * 3600000;
  while (hi - lo > 1000) {
    const mid = Math.floor((lo + hi) / 2);
    if (dayAt(mid) === today) lo = mid;
    else hi = mid;
  }
  return new Date(Math.ceil(hi / 1000) * 1000);
}

/** "Thursday 12 November", or with the year when asked. The day is a calendar day, not a moment. */
export function formatDay(day: string, opts: { weekday?: boolean; year?: boolean; short?: boolean } = {}): string {
  const [y, m, d] = day.split('-').map(Number);
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: opts.weekday === false ? undefined : opts.short ? 'short' : 'long',
    day: 'numeric',
    month: opts.short ? 'short' : 'long',
    year: opts.year ? 'numeric' : undefined,
  });
  return fmt.format(new Date(Date.UTC(y, m - 1, d))).replace(',', '');
}

/** "14 h 5 min", "35 min", "less than a minute": how long until a moment. */
export function formatWait(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return 'less than a minute';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

/** True for a real 'YYYY-MM-DD' day. */
export function isDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return addDays(value, 0) === value;
}
