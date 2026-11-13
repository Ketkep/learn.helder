// The sums behind "The page that guessed your keys". The page keeps a count of what came after each
// short run of keys, and before every key it guesses the one that came next most often so far.
// Simplifications, named on the page: the reader presses only two keys, F and J, the guesser looks back
// at most four keys, and when it has nothing to go on it flips a coin. It is a toy guesser, not a
// model of how the brain works. Nothing here leaves the browser.

export type Key = 'F' | 'J';
export const KEYS: Key[] = ['F', 'J'];
/** How many keys back the guesser looks, at most. */
export const DEPTH = 4;

export interface Lane {
  keys: Key[];
  guesses: Key[];
  /** counts[context][next]: how often each key followed a context, for contexts of 1 to DEPTH keys. */
  counts: Record<string, { F: number; J: number }>;
}

export const newLane = (): Lane => ({ keys: [], guesses: [], counts: {} });

/** The guess for the next key: the longest context with a clear winner, else a coin. */
export function guess(lane: Lane, coin: () => number = Math.random): Key {
  for (let k = Math.min(DEPTH, lane.keys.length); k >= 1; k--) {
    const c = lane.counts[lane.keys.slice(-k).join('')];
    if (c && c.F !== c.J) return c.F > c.J ? 'F' : 'J';
  }
  return coin() < 0.5 ? 'F' : 'J';
}

/** Records the page's guess and the real key, then learns from it. */
export function press(lane: Lane, key: Key, coin: () => number = Math.random): { guess: Key; hit: boolean } {
  const g = guess(lane, coin);
  for (let k = 1; k <= Math.min(DEPTH, lane.keys.length); k++) {
    const ctx = lane.keys.slice(-k).join('');
    const c = lane.counts[ctx] || (lane.counts[ctx] = { F: 0, J: 0 });
    c[key] += 1;
  }
  lane.guesses.push(g);
  lane.keys.push(key);
  return { guess: g, hit: g === key };
}

export const hits = (lane: Lane) => lane.keys.reduce((n, k, i) => n + (lane.guesses[i] === k ? 1 : 0), 0);

/** The share of keys guessed right, 0 to 1. */
export const rate = (lane: Lane) => (lane.keys.length ? hits(lane) / lane.keys.length : 0);

/** The longest run of the same key. */
export function longestRun(keys: Key[]): number {
  let best = 0;
  let run = 0;
  keys.forEach((k, i) => {
    run = i > 0 && keys[i - 1] === k ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}

/** How often the key changed from one press to the next, 0 to 1. A fair coin changes half of the time. */
export function switchRate(keys: Key[]): number {
  if (keys.length < 2) return 0;
  let n = 0;
  for (let i = 1; i < keys.length; i++) if (keys[i] !== keys[i - 1]) n++;
  return n / (keys.length - 1);
}

/** The chance that n fair coin flips hold a run of at least `len` of the same side. */
export function runChance(n: number, len: number): number {
  // state: length of the current run, 1 to len - 1, plus "done"
  let state = new Array(len).fill(0);
  state[1] = 1;
  let done = 0;
  for (let i = 1; i < n; i++) {
    const next = new Array(len).fill(0);
    for (let r = 1; r < len; r++) {
      next[1] += state[r] / 2;
      if (r + 1 >= len) done += state[r] / 2;
      else next[r + 1] += state[r] / 2;
    }
    state = next;
  }
  return done;
}

/** The chance that a random PIN of n digits has two equal digits side by side. */
export const pinRepeat = (n: number) => 1 - Math.pow(0.9, n - 1);

/** The rows of the table of what the page learned: each run of three keys and what followed it. */
export function learned(lane: Lane) {
  const rows: { ctx: string; F: number; J: number }[] = [];
  for (const a of KEYS) for (const b of KEYS) for (const c of KEYS) {
    const ctx = a + b + c;
    const v = lane.counts[ctx] || { F: 0, J: 0 };
    rows.push({ ctx, F: v.F, J: v.J });
  }
  return rows;
}
