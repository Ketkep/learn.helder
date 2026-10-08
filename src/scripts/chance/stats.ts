// The chance maths and the random helpers for the notebook page.

/** A whole number from 1 to `n`, picked with the browser's random numbers. */
export const pick = (n: number) => 1 + Math.floor(Math.random() * n);

/** How many of the 36 outcomes of two dice add up to `sum` (2 to 12). */
export const ways = (sum: number) => 6 - Math.abs(sum - 7);

/** The chance that at least two of `n` people share a birthday, with 365 equal days. */
export function sharedBirthday(n: number) {
  let none = 1;
  for (let i = 0; i < n; i++) none *= (365 - i) / 365;
  return 1 - none;
}

const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Day 1 to 365 as "14 March". */
export function dayName(day: number) {
  let left = day;
  for (let m = 0; m < 12; m++) {
    if (left <= DAYS[m]) return `${left} ${MONTHS[m]}`;
    left -= DAYS[m];
  }
  return '31 December';
}

/** A share as "16.7%". */
export const pct = (x: number, digits = 1) => `${(x * 100).toFixed(digits)}%`;
