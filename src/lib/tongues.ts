// Maths and drawings for the languages page: words compared by spelling, a family tree built from the differences, sound shifts and loanwords.
// Spelling is a toy for how alike languages are. The real tree comes from sound changes and history, and the page says so.

export const langs = [
  { id: 'en', name: 'English' },
  { id: 'nl', name: 'Dutch' },
  { id: 'de', name: 'German' },
  { id: 'fr', name: 'French' },
  { id: 'es', name: 'Spanish' },
];

export interface Entry {
  meaning: string;
  words: Record<string, string>;
}

export const entries: Entry[] = [
  { meaning: 'water', words: { en: 'water', nl: 'water', de: 'Wasser', fr: 'eau', es: 'agua' } },
  { meaning: 'father', words: { en: 'father', nl: 'vader', de: 'Vater', fr: 'père', es: 'padre' } },
  { meaning: 'three', words: { en: 'three', nl: 'drie', de: 'drei', fr: 'trois', es: 'tres' } },
  { meaning: 'hand', words: { en: 'hand', nl: 'hand', de: 'Hand', fr: 'main', es: 'mano' } },
  { meaning: 'night', words: { en: 'night', nl: 'nacht', de: 'Nacht', fr: 'nuit', es: 'noche' } },
  { meaning: 'fish', words: { en: 'fish', nl: 'vis', de: 'Fisch', fr: 'poisson', es: 'pez' } },
  { meaning: 'apple', words: { en: 'apple', nl: 'appel', de: 'Apfel', fr: 'pomme', es: 'manzana' } },
  { meaning: 'house', words: { en: 'house', nl: 'huis', de: 'Haus', fr: 'maison', es: 'casa' } },
  { meaning: 'foot', words: { en: 'foot', nl: 'voet', de: 'Fuß', fr: 'pied', es: 'pie' } },
  { meaning: 'hundred', words: { en: 'hundred', nl: 'honderd', de: 'hundert', fr: 'cent', es: 'cien' } },
  { meaning: 'two', words: { en: 'two', nl: 'twee', de: 'zwei', fr: 'deux', es: 'dos' } },
  { meaning: 'name', words: { en: 'name', nl: 'naam', de: 'Name', fr: 'nom', es: 'nombre' } },
];

const f2 = (n: number) => Math.round(n * 100) / 100;

function plain(w: string): string {
  return w.toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/** 1 for the same spelling, 0 for nothing in common. */
export function similarity(a: string, b: string): number {
  const [x, y] = [plain(a), plain(b)];
  return 1 - editDistance(x, y) / Math.max(x.length, y.length);
}

export function pairSimilarity(e: Entry, a: string, b: string): number {
  return similarity(e.words[a], e.words[b]);
}

/** Average over every word in the list. */
export function averageSimilarity(a: string, b: string, list: Entry[] = entries): number {
  return list.reduce((n, e) => n + pairSimilarity(e, a, b), 0) / list.length;
}

export interface Join {
  a: number[];
  b: number[];
  dist: number;
}

/** Join the two closest groups again and again, comparing groups by the average distance (UPGMA). */
export function joins(list: Entry[] = entries): Join[] {
  const ids = langs.map((l) => l.id);
  const dist = (x: number[], y: number[]) => {
    let s = 0;
    for (const i of x) for (const j of y) s += 1 - averageSimilarity(ids[i], ids[j], list);
    return s / (x.length * y.length);
  };
  let groups: number[][] = ids.map((_, i) => [i]);
  const out: Join[] = [];
  while (groups.length > 1) {
    let best = { i: 0, j: 1, d: Infinity };
    for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
      const d = dist(groups[i], groups[j]);
      if (d < best.d - 1e-9) best = { i, j, d };
    }
    const [a, b] = [groups[best.i], groups[best.j]];
    out.push({ a, b, dist: f2(best.d) });
    groups = groups.filter((_, k) => k !== best.i && k !== best.j);
    groups.push([...a, ...b]);
  }
  return out;
}

export function joinLabel(g: number[]): string {
  return g.map((i) => langs[i].name).join(' and ');
}

/** The tree after a number of joins, drawn sideways: the tips are on the right, the oldest join is on the left. */
export function treeSvg(step: number, list: Entry[] = entries): string {
  const js = joins(list);
  const [x0, x1, y0, gapY] = [20, 190, 22, 32];
  const maxD = Math.max(...js.map((j) => j.dist), 0.01);
  const X = (d: number) => x1 - (x1 - x0 - 10) * (d / maxD) * 0.95;
  // Order the tips so groups sit together
  const order: number[] = [];
  const walk = (g: number[]) => {
    const j = js.find((k) => [...k.a, ...k.b].length === g.length && [...k.a, ...k.b].every((v) => g.includes(v)));
    if (!j) order.push(g[0]);
    else {
      walk(j.a);
      walk(j.b);
    }
  };
  walk([0, 1, 2, 3, 4]);
  const Y = (i: number) => y0 + order.indexOf(i) * gapY;
  let groups: { ids: number[]; y: number; x: number }[] = langs.map((_, i) => ({ ids: [i], y: Y(i), x: x1 }));
  let svg = '';
  for (let s = 0; s < step && s < js.length; s++) {
    const j = js[s];
    const ga = groups.find((g) => g.ids.length === j.a.length && g.ids.every((v) => j.a.includes(v)))!;
    const gb = groups.find((g) => g.ids.length === j.b.length && g.ids.every((v) => j.b.includes(v)))!;
    const x = X(j.dist);
    svg += `<path class="branch" d="M${ga.x} ${ga.y}H${x}V${gb.y}H${gb.x}"/>`;
    groups = groups.filter((g) => g !== ga && g !== gb);
    groups.push({ ids: [...j.a, ...j.b], y: (ga.y + gb.y) / 2, x });
  }
  const tips = langs.map((l, i) => `<circle class="tip" cx="${x1}" cy="${Y(i)}" r="4"/><text class="lab" x="${x1 + 9}" y="${Y(i) + 4}">${l.name}</text>`).join('');
  return `${svg}${tips}`;
}

export function treeStatus(step: number): string {
  const js = joins();
  if (step === 0) return 'Five languages, and no joins yet. Press the button to join the two closest.';
  const j = js[Math.min(step, js.length) - 1];
  const spoken = step >= js.length ? ' All five are joined. A real family tree comes from sound changes and history, not from spelling, but the shape is the same here: the Germanic languages together, and the Romance languages together.' : '';
  return `Join ${step} of ${js.length}: ${joinLabel(j.a)} with ${joinLabel(j.b)}, at a difference of ${j.dist.toFixed(2)}.${spoken}`;
}

export interface Shift {
  latin: string;
  first: string;
  english: string;
  dutch: string;
  german: string;
  rule: string;
  expect: string;
}

export const shifts: Shift[] = [
  { latin: 'pes', first: 'p', english: 'foot', dutch: 'voet', german: 'Fuß', rule: 'p becomes f', expect: 'f' },
  { latin: 'piscis', first: 'p', english: 'fish', dutch: 'vis', german: 'Fisch', rule: 'p becomes f', expect: 'f' },
  { latin: 'pater', first: 'p', english: 'father', dutch: 'vader', german: 'Vater', rule: 'p becomes f', expect: 'f' },
  { latin: 'tres', first: 't', english: 'three', dutch: 'drie', german: 'drei', rule: 't becomes th (and d in Dutch and German)', expect: 'th' },
  { latin: 'tenuis', first: 't', english: 'thin', dutch: 'dun', german: 'dünn', rule: 't becomes th (and d in Dutch and German)', expect: 'th' },
  { latin: 'cornu', first: 'c', english: 'horn', dutch: 'hoorn', german: 'Horn', rule: 'k becomes h', expect: 'h' },
  { latin: 'canis', first: 'c', english: 'hound', dutch: 'hond', german: 'Hund', rule: 'k becomes h', expect: 'h' },
  { latin: 'centum', first: 'c', english: 'hundred', dutch: 'honderd', german: 'hundert', rule: 'k becomes h', expect: 'h' },
];

export interface Loan {
  dutch: string;
  english: string;
  meaning: string;
}

export const loans: Loan[] = [
  { dutch: 'koekje', english: 'cookie', meaning: 'a small sweet biscuit' },
  { dutch: 'baas', english: 'boss', meaning: 'the person in charge' },
  { dutch: 'landschap', english: 'landscape', meaning: 'a view of land' },
  { dutch: 'schets', english: 'sketch', meaning: 'a quick drawing' },
  { dutch: 'ezel', english: 'easel', meaning: 'a stand for a painting' },
  { dutch: 'jacht', english: 'yacht', meaning: 'a sailing boat for pleasure' },
  { dutch: 'schipper', english: 'skipper', meaning: 'the captain of a boat' },
  { dutch: 'sloep', english: 'sloop', meaning: 'a small sailing ship' },
];

/** Three choices for a loan word: the right one and two other English words from the list. */
export function choices(i: number): string[] {
  const others = loans.filter((_, k) => k !== i).map((l) => l.english);
  const pick = [others[(i * 3) % others.length], others[(i * 3 + 2) % others.length]];
  const out = [loans[i].english, ...pick.filter((v, k, a) => v !== loans[i].english && a.indexOf(v) === k)];
  while (out.length < 3) out.push(others[(i + out.length * 5) % others.length]);
  return out.slice(0, 3).sort((a, b) => ((a.length * 7 + i) % 5) - ((b.length * 7 + i) % 5) || a.localeCompare(b));
}
