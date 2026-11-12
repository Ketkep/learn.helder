// Which edition belongs to a day, and how the streak is counted. Pure functions, used by the build
// and by the browser. No imports, no clock: the caller passes in the day.

export interface Slot {
  number: number;
  /** 'YYYY-MM-DD' in the publication time zone */
  date: string;
}

export type TodayPick<T extends Slot> =
  /** There is an edition for this day. */
  | { kind: 'today'; edition: T; next?: T }
  /** Nothing is scheduled for this day. Show the latest one, and say so plainly. */
  | { kind: 'gap'; latest: T; next?: T }
  /** The first edition has not opened yet. */
  | { kind: 'soon'; next: T }
  | { kind: 'empty' };

/** The editions are sorted by date. An edition is open from the start of its day. */
export function pickToday<T extends Slot>(list: T[], day: string): TodayPick<T> {
  const open = list.filter((e) => e.date <= day);
  const next = list.find((e) => e.date > day);
  const latest = open[open.length - 1];
  if (!latest) return next ? { kind: 'soon', next } : { kind: 'empty' };
  if (latest.date === day) return { kind: 'today', edition: latest, next };
  return { kind: 'gap', latest, next };
}

export const isOpen = (slot: Slot, day: string) => slot.date <= day;

export interface Finish {
  /** The day (publication time zone) the reader finished it. */
  completedDay?: string;
}

/**
 * The streak: how many editions in a row the reader finished on their own day, ending with the most
 * recent one. If today's edition is not finished yet, the streak still stands from yesterday's.
 * Days without an edition do not break it. Finishing an old edition from the archive marks it done,
 * but it does not count for the streak, because it was not finished on its day.
 */
export function streakOf<T extends Slot>(list: T[], done: Record<string, Finish | undefined>, day: string) {
  const open = list.filter((e) => e.date <= day);
  const onTheDay = (e: T) => done[e.number]?.completedDay === e.date;
  let i = open.length - 1;
  // Today's edition still has the rest of the day: an unfinished one does not end the streak
  if (i >= 0 && open[i].date === day && !onTheDay(open[i])) i--;
  let current = 0;
  for (; i >= 0 && onTheDay(open[i]); i--) current++;

  let best = 0;
  let run = 0;
  for (const e of open) {
    run = onTheDay(e) ? run + 1 : 0;
    best = Math.max(best, run);
  }
  const finished = open.filter((e) => done[e.number]?.completedDay).length;
  const finishedOnTheDay = open.filter(onTheDay).length;
  return { current, best, finished, finishedOnTheDay, open: open.length };
}
