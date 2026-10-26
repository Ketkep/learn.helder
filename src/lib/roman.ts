// Maths for the Roman numerals page. Everything is computed here. The same text is made at build time (Astro) and in the browser.

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const VALUES: [string, number][] = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
export const LETTERS: [string, number][] = [['I', 1], ['V', 5], ['X', 10], ['L', 50], ['C', 100], ['D', 500], ['M', 1000]];
const val = (c: string) => LETTERS.find((l) => l[0] === c)?.[1] ?? 0;

/** The usual way to write a number from 1 to 3999. */
export function toRoman(n: number): string {
  let out = '';
  let rest = n;
  for (const [s, v] of VALUES) {
    while (rest >= v) {
      out += s;
      rest -= v;
    }
  }
  return out;
}

/** The value of a row of letters: a smaller letter before a bigger one is taken away, otherwise it is added. */
export function valueOf(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const v = val(s[i]);
    const next = val(s[i + 1] || '');
    total += next > v ? -v : v;
  }
  return total;
}

/** The pieces of a number by thousands, hundreds, tens and ones. */
export function pieces(n: number): { place: string; digit: number; roman: string }[] {
  const out: { place: string; digit: number; roman: string }[] = [];
  const places: [string, number][] = [['thousands', 1000], ['hundreds', 100], ['tens', 10], ['ones', 1]];
  places.forEach(([place, p]) => {
    const digit = Math.floor(n / p) % 10;
    if (digit) out.push({ place, digit, roman: toRoman(digit * p) });
  });
  return out;
}

/** What a row of letters means, and whether it is the standard way to write that number. */
export function judge(s: string): { value: number; standard: string; ok: boolean; reason: string } {
  const value = valueOf(s);
  if (!s) return { value: 0, standard: '', ok: false, reason: 'Nothing yet.' };
  if (value < 1) return { value, standard: '', ok: false, reason: 'This does not make a number above zero.' };
  if (value > 3999) return { value, standard: '', ok: false, reason: 'More than 3,999 cannot be written with the seven letters in the usual way.' };
  const standard = toRoman(value);
  return { value, standard, ok: standard === s, reason: standard === s ? 'This is the standard way to write it.' : `The standard way to write ${fmt(value)} is ${standard}.` };
}

// ---------- Length ----------

/** The number from 1 to 3999 with the most letters, and its length. */
export function longest(): { n: number; roman: string } {
  let best = { n: 1, roman: 'I' };
  for (let n = 1; n <= 3999; n++) {
    const r = toRoman(n);
    if (r.length > best.roman.length) best = { n, roman: r };
  }
  return best;
}

/** How many numbers from 1 to 3999 need each length. */
export function lengths(): number[] {
  const counts: number[] = Array(16).fill(0);
  for (let n = 1; n <= 3999; n++) counts[toRoman(n).length]++;
  return counts;
}

// ---------- Adding ----------

const SUB: [string, string][] = [['CM', 'DCCCC'], ['CD', 'CCCC'], ['XC', 'LXXXX'], ['XL', 'XXXX'], ['IX', 'VIIII'], ['IV', 'IIII']];

/** The letters written without taking anything away: IV becomes IIII. */
export function additive(s: string): string {
  let out = s;
  SUB.forEach(([a, b]) => (out = out.split(a).join(b)));
  return out;
}

const ORDER = ['M', 'D', 'C', 'L', 'X', 'V', 'I'];
const CARRY: [string, number, string][] = [['I', 5, 'V'], ['V', 2, 'X'], ['X', 5, 'L'], ['L', 2, 'C'], ['C', 5, 'D'], ['D', 2, 'M']];

/** Adding two numerals the old way: write all the letters of both together, sort them, then trade five of a kind for the next letter up. */
export function addSteps(a: number, b: number): string[] {
  const steps: string[] = [];
  const ra = toRoman(a);
  const rb = toRoman(b);
  steps.push(`${fmt(a)} is ${ra} and ${fmt(b)} is ${rb}.`);
  const ea = additive(ra);
  const eb = additive(rb);
  if (ea !== ra || eb !== rb) steps.push(`Write them without taking anything away: ${ea} and ${eb}.`);
  const counts: Record<string, number> = {};
  [...(ea + eb)].forEach((c) => (counts[c] = (counts[c] || 0) + 1));
  const row = () => ORDER.map((c) => c.repeat(counts[c] || 0)).join('');
  steps.push(`Put all the letters together and sort them: ${row()}.`);
  CARRY.forEach(([c, n, up]) => {
    const k = Math.floor((counts[c] || 0) / n);
    if (k > 0) {
      counts[c] -= k * n;
      counts[up] = (counts[up] || 0) + k;
      steps.push(`Trade ${n} ${c} for 1 ${up}${k > 1 ? ', ' + k + ' times' : ''}: ${row()}.`);
    }
  });
  const sum = a + b;
  steps.push(sum > 3999 ? `The sum is ${fmt(sum)}, more than the seven letters can write in the usual way.` : `Now write it in the usual way: ${toRoman(sum)}, which is ${fmt(sum)}.`);
  return steps;
}
