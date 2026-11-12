// The model behind "Twenty-three strangers": rooms of people with random birthdays.
// It is the textbook model: 365 days, each equally likely, no 29 February, no twins. Real births are
// a little uneven over the year, which makes a match slightly MORE likely, but not enough to move the
// answer away from 23 (see the sources on the page).

export const DAYS = 365;

/** "any": two people in the room share a birthday. "me": someone in the room shares YOUR birthday. */
export type Mode = 'any' | 'me';

/** Your birthday in the "me" mode, as a day of the year: 13 November, the day of this edition. */
export const MY_DAY = 317;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAYS_IN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** "14 Mar" for a day of the year, 1 to 365. */
export function dayLabel(day: number): string {
  let d = day;
  for (let m = 0; m < 12; m++) {
    if (d <= DAYS_IN[m]) return `${d} ${MONTHS[m]}`;
    d -= DAYS_IN[m];
  }
  return '31 Dec';
}

/** The exact chance that at least two of n people share a birthday, with `days` possible birthdays. */
export function anyMatch(n: number, days = DAYS): number {
  let none = 1;
  for (let k = 0; k < n; k++) none *= (days - k) / days;
  return 1 - none;
}

/** The exact chance that at least one of the OTHER people in a room of n shares your birthday. */
export function meMatch(n: number, days = DAYS): number {
  return 1 - ((days - 1) / days) ** Math.max(0, n - 1);
}

export const chance = (mode: Mode, n: number) => (mode === 'any' ? anyMatch(n) : meMatch(n));

/** How many pairs n people make. */
export const pairs = (n: number) => (n * (n - 1)) / 2;

/** The smallest group where a match is more likely than not. */
export function evenOdds(mode: Mode, days = DAYS): number {
  let n = 2;
  while ((mode === 'any' ? anyMatch(n, days) : meMatch(n, days)) < 0.5) n++;
  return n;
}

export interface Room {
  /** Each person's birthday. In the "me" mode the first person is you. */
  days: number[];
  /** The birthdays that are shared (in the "me" mode: only yours, if someone has it). */
  shared: number[];
}

/** One room of n people. `rand` returns numbers from 0 up to 1. */
export function room(n: number, mode: Mode, rand: () => number): Room {
  const days: number[] = [];
  if (mode === 'me') days.push(MY_DAY);
  while (days.length < n) days.push(1 + Math.floor(rand() * DAYS));
  const count = new Map<number, number>();
  days.forEach((d) => count.set(d, (count.get(d) ?? 0) + 1));
  const shared = [...count.entries()].filter(([d, c]) => c > 1 && (mode === 'any' || d === MY_DAY)).map(([d]) => d);
  return { days, shared };
}

/** Many rooms at once: which of them had a match. */
export function rooms(n: number, mode: Mode, count: number, rand: () => number): boolean[] {
  return Array.from({ length: count }, () => room(n, mode, rand).shared.length > 0);
}
