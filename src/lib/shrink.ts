// Maths for the file compression page: three toy ways to shrink data and what each one costs in bits.
// The sizes are counted by these functions, so the page shows exactly what they give. Real formats mix these ideas and add more.

import { seeded } from './rand';

export interface Run {
  value: number;
  count: number;
}

/** A row of black and white cells as runs of the same colour. */
export function runs(cells: number[]): Run[] {
  const out: Run[] = [];
  for (const c of cells) {
    if (out.length && out[out.length - 1].value === c) out[out.length - 1].count++;
    else out.push({ value: c, count: 1 });
  }
  return out;
}

/** Plain: 1 bit a cell. Run lengths: 1 bit for the first colour and 6 bits for each run. */
export const pixelBits = (cells: number[]) => cells.length;
export const runBits = (cells: number[]) => 1 + 6 * runs(cells).length;

export const ROW = 32;
export const pixelRows: Record<string, number[]> = {
  stripes: Array.from({ length: ROW }, (_, i) => (Math.floor(i / 8) % 2 ? 0 : 1)),
  block: Array.from({ length: ROW }, (_, i) => (i >= 6 && i < 26 ? 1 : 0)),
  checker: Array.from({ length: ROW }, (_, i) => (i % 2 ? 0 : 1)),
  noise: (() => {
    const r = seeded(11);
    return Array.from({ length: ROW }, () => (r() < 0.5 ? 0 : 1));
  })(),
};

export interface Token {
  literal?: string;
  back?: number;
  len?: number;
}

/** Repeats: a piece of text that appeared before is replaced by "go back this far, copy this much". */
export function lz(text: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < text.length) {
    let bestLen = 0;
    let bestBack = 0;
    for (let j = Math.max(0, i - 255); j < i; j++) {
      let l = 0;
      while (l < 15 && i + l < text.length && text[j + l] === text[i + l]) l++;
      if (l > bestLen) {
        bestLen = l;
        bestBack = i - j;
      }
    }
    if (bestLen >= 3) {
      out.push({ back: bestBack, len: bestLen });
      i += bestLen;
    } else {
      out.push({ literal: text[i] });
      i++;
    }
  }
  return out;
}

/** A letter costs 9 bits (1 flag bit and 8 bits). A copy costs 13 bits (1 flag, 8 for how far back, 4 for how much). */
export const lzBits = (tokens: Token[]) => tokens.reduce((n, t) => n + (t.literal !== undefined ? 9 : 13), 0);
export const textBits = (text: string) => text.length * 8;

export interface Code {
  symbol: string;
  count: number;
  code: string;
}

interface Node {
  count: number;
  symbols: string;
  left?: Node;
  right?: Node;
}

/** Short codes: letters that are common get short codes. The two rarest are joined, again and again. */
export function huffman(text: string): { codes: Code[]; steps: string[]; bits: number; table: number } {
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) || 0) + 1);
  let nodes: Node[] = [...freq.entries()].map(([symbols, count]) => ({ symbols, count }));
  const steps: string[] = [];
  if (nodes.length === 1) return { codes: [{ symbol: nodes[0].symbols, count: nodes[0].count, code: '0' }], steps, bits: nodes[0].count, table: 12 };
  const label = (s: string) => s.split('').map((c) => (c === ' ' ? '_' : c)).join('');
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.count - b.count || (a.symbols < b.symbols ? -1 : 1));
    const [a, b] = nodes.splice(0, 2);
    steps.push(`Join ${label(a.symbols)} (${a.count}) and ${label(b.symbols)} (${b.count}) into one of ${a.count + b.count}.`);
    nodes.push({ count: a.count + b.count, symbols: a.symbols + b.symbols, left: a, right: b });
  }
  const codes: Code[] = [];
  const walk = (n: Node, prefix: string) => {
    if (!n.left || !n.right) codes.push({ symbol: n.symbols, count: n.count, code: prefix });
    else {
      walk(n.left, prefix + '0');
      walk(n.right, prefix + '1');
    }
  };
  walk(nodes[0], '');
  codes.sort((x, y) => y.count - x.count || (x.symbol < y.symbol ? -1 : 1));
  // The reader of the file also needs the table: 8 bits for the letter and 4 for the length of its code
  return { codes, steps, bits: codes.reduce((n, c) => n + c.count * c.code.length, 0), table: codes.length * 12 };
}

export function shown(ch: string): string {
  return ch === ' ' ? 'space' : ch;
}

/** Texts to try. The last one is made of random letters from a seed. */
export const samples: { id: string; name: string; text: string }[] = [
  { id: 'sentence', name: 'A sentence', text: 'the cat sat on the mat and the dog sat on the log' },
  { id: 'repeat', name: 'The same words again', text: 'la la la la la la la la la la la la la la la la' },
  { id: 'letters', name: 'One letter, many times', text: 'aaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbb' },
  {
    id: 'random',
    name: 'Random letters',
    text: (() => {
      const r = seeded(23);
      return Array.from({ length: 48 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(r() * 26)]).join('');
    })(),
  },
];

/** Plain letters as runs, for the comparison: a letter and a count of 8 bits each. */
export function textRunBits(text: string): number {
  let n = 0;
  for (let i = 0; i < text.length; ) {
    let j = i;
    while (j < text.length && text[j] === text[i]) j++;
    n += 16;
    i = j;
  }
  return n;
}

export interface Row {
  method: string;
  bits: number;
}

export function compare(text: string): Row[] {
  return [
    { method: 'Plain letters', bits: textBits(text) },
    { method: 'Run lengths', bits: textRunBits(text) },
    { method: 'Repeats', bits: lzBits(lz(text)) },
    { method: 'Short codes, with the table', bits: huffman(text).bits + huffman(text).table },
  ];
}

/** How many different messages exist with exactly n bits, and how many shorter ones there are. */
export function counts(n: number): { exact: number; shorter: number } {
  return { exact: 2 ** n, shorter: 2 ** n - 1 };
}

export function token(t: Token): string {
  return t.literal !== undefined ? (t.literal === ' ' ? '_' : t.literal) : `<${t.back},${t.len}>`;
}
