// Helpers for the Peru page: the shared ones, and the year labels for the gauge.

export { reducedMotion, clamp, fillRange, q } from '../util';

/** "Today", "AD 450" or "2600 BC": a year for the gauge, rounded to tens so it rolls nicely. */
export function formatYear(y: number): string {
  if (y >= 2000) return 'Today';
  const r = Math.round(y / 10) * 10;
  return r > 0 ? `AD ${r}` : `${Math.abs(r)} BC`;
}

/** A longer version for sentences: "AD 450" or "2600 BC". Same as formatYear, but never "Today". */
export function sayYear(y: number): string {
  const r = Math.round(y / 10) * 10;
  return r > 0 ? `AD ${r}` : r === 0 ? 'Year 0' : `${Math.abs(r)} BC`;
}
