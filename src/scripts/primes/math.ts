// The number work for the primes page. Plain functions, no page code.

/** Prime or not, by trying every divisor up to the square root. Fine for numbers up to about 10^14. */
export function isPrime(n: number) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

/** The prime factors of n, smallest first: 12 gives [2, 2, 3]. */
export function factor(n: number) {
  const out: number[] = [];
  let rest = n;
  for (let d = 2; d * d <= rest; d += d === 2 ? 1 : 2) {
    while (rest % d === 0) {
      out.push(d);
      rest /= d;
    }
  }
  if (rest > 1) out.push(rest);
  return out;
}

/** All the ways to write n as a x b with a at most b: 12 gives [[1, 12], [2, 6], [3, 4]]. */
export function rectangles(n: number) {
  const out: [number, number][] = [];
  for (let a = 1; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]);
  return out;
}

/** A list of flags, true for every prime up to and including `max`. */
export function sieve(max: number) {
  const flags = new Uint8Array(max + 1).fill(1);
  flags[0] = 0;
  flags[1] = 0;
  for (let i = 2; i * i <= max; i++) if (flags[i]) for (let j = i * i; j <= max; j += i) flags[j] = 0;
  return flags;
}

/** The first `count` primes. */
export function firstPrimes(count: number) {
  const out: number[] = [];
  for (let n = 2; out.length < count; n++) if (isPrime(n)) out.push(n);
  return out;
}

/** A whole number with thousands separators: 30031 becomes "30,031". */
export const grp = (n: number) => n.toLocaleString('en-US');

/** A list in words: [2, 3, 5] becomes "2, 3 and 5". */
export function andList(items: string[]) {
  return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
