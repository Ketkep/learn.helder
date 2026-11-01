// Maths and drawings for the blood types page. The inheritance of the ABO groups comes from the sources: three versions of one gene,
// A and B both showing up and O hidden by either. The families in the last tool are drawn from fixed seeds.
// The same text is made at build time (Astro) and in the browser. Nothing here is medical advice.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const GENOTYPES = ['AA', 'AO', 'BB', 'BO', 'AB', 'OO'];
export const TYPES = ['A', 'B', 'AB', 'O'];

/** The blood group a pair of alleles shows: A and B both show, and O only shows when there is no A or B. */
export function typeOf(g: string): string {
  const a = g.includes('A');
  const b = g.includes('B');
  return a && b ? 'AB' : a ? 'A' : b ? 'B' : 'O';
}

/** Alleles a parent can pass on, each with its chance. */
export function gametes(g: string): { allele: string; p: number }[] {
  return g[0] === g[1] ? [{ allele: g[0], p: 1 }] : [{ allele: g[0], p: 0.5 }, { allele: g[1], p: 0.5 }];
}

const tidy = (a: string, b: string) => [a, b].sort().join('');

/** The chance of each genotype in a child, and of each blood group. */
export function child(g1: string, g2: string): { genotypes: Record<string, number>; types: Record<string, number> } {
  const genotypes: Record<string, number> = {};
  const types: Record<string, number> = {};
  for (const x of gametes(g1)) {
    for (const y of gametes(g2)) {
      const g = tidy(x.allele, y.allele);
      genotypes[g] = (genotypes[g] ?? 0) + x.p * y.p;
    }
  }
  for (const [g, p] of Object.entries(genotypes)) types[typeOf(g)] = (types[typeOf(g)] ?? 0) + p;
  return { genotypes, types };
}

// ---------- Part 2: what is possible ----------

export interface Possible {
  type: string;
  min: number; // lowest chance over the genotypes the parents could have
  max: number; // highest chance
  possible: boolean;
}

/** For parents with these blood groups, which blood groups can a child have? A parent of group A may be AA or AO, so the chance depends on which. */
export function possible(t1: string, t2: string): Possible[] {
  const combos: [string, string][] = [];
  for (const a of GENOTYPES.filter((g) => typeOf(g) === t1)) for (const b of GENOTYPES.filter((g) => typeOf(g) === t2)) combos.push([a, b]);
  return TYPES.map((type) => {
    const ps = combos.map(([a, b]) => child(a, b).types[type] ?? 0);
    return { type, min: Math.min(...ps), max: Math.max(...ps), possible: Math.max(...ps) > 0 };
  });
}

// ---------- Part 3: a family ----------

/** Children of two parents, each child getting one allele from each parent by chance, from a fixed seed. */
export function family(g1: string, g2: string, n: number, seed: number): string[] {
  const r = seeded(seed);
  const pick = (g: string) => g[r() < 0.5 ? 0 : 1];
  return Array.from({ length: n }, () => tidy(pick(g1), pick(g2)));
}

const COLOUR: Record<string, string> = { A: '#e0564e', B: '#5ab4e8', AB: '#b07be0', O: '#f0b24a' };

/** The Punnett square for two parents as SVG text. */
export function punnettSvg(g1: string, g2: string): string {
  const x0 = 70;
  const y0 = 40;
  const cw = 100;
  const ch = 48;
  const a = [g1[0], g1[1]];
  const b = [g2[0], g2[1]];
  let s = `<text class="lab" x="${x0 + cw}" y="16" text-anchor="middle">${g1}, ${typeOf(g1)} parent</text><text class="lab" x="8" y="${y0 + ch}">${g2}</text><text class="lab" x="8" y="${y0 + ch + 12}">${typeOf(g2)} parent</text>`;
  a.forEach((al, i) => (s += `<text class="head" x="${x0 + i * cw + cw / 2}" y="${y0 - 6}" text-anchor="middle">${al}</text>`));
  b.forEach((al, j) => (s += `<text class="head" x="${x0 - 12}" y="${y0 + j * ch + ch / 2 + 5}" text-anchor="end">${al}</text>`));
  a.forEach((x, i) =>
    b.forEach((y, j) => {
      const g = tidy(x, y);
      const t = typeOf(g);
      s += `<rect class="cell" x="${x0 + i * cw}" y="${y0 + j * ch}" width="${cw}" height="${ch}" fill="${COLOUR[t]}"/><text class="cellt" x="${x0 + i * cw + cw / 2}" y="${y0 + j * ch + ch / 2 + 5}" text-anchor="middle">${g}, group ${t}</text>`;
    }),
  );
  return s;
}

/** A row of children, each a circle in the colour of the blood group with the genotype inside. */
export function familySvg(g1: string, g2: string, kids: string[]): string {
  const per = Math.min(kids.length, 8);
  const gap = 260 / Math.max(per, 1);
  let s = `<circle class="par" cx="110" cy="32" r="18" fill="${COLOUR[typeOf(g1)]}"/><text class="cellt" x="110" y="36" text-anchor="middle">${g1}</text><circle class="par" cx="190" cy="32" r="18" fill="${COLOUR[typeOf(g2)]}"/><text class="cellt" x="190" y="36" text-anchor="middle">${g2}</text><line class="join" x1="128" y1="32" x2="172" y2="32"/>`;
  kids.forEach((k, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const x = 20 + gap / 2 + col * gap;
    const y = 96 + row * 44;
    s += `<line class="join" x1="150" y1="32" x2="${f1(x)}" y2="${y - 16}"/><circle class="kid" cx="${f1(x)}" cy="${y}" r="15" fill="${COLOUR[typeOf(k)]}"/><text class="cellt" x="${f1(x)}" y="${y + 4}" text-anchor="middle">${k}</text>`;
  });
  return s;
}
