// Maths and drawings for the search engine page: a made up web of eight small pages.
// The same strings are used when the page is built and in the browser.

export interface Page {
  id: number;
  name: string;
  text: string;
  links: number[];
  x: number;
  y: number;
}

export const pages: Page[] = [
  { id: 0, name: 'Home', text: 'welcome to the garden club news and the garden shop', links: [1, 3, 4, 6], x: 150, y: 28 },
  { id: 1, name: 'Tomatoes', text: 'how to grow tomatoes in the garden: water the tomatoes and feed the tomatoes', links: [2, 5], x: 52, y: 92 },
  { id: 2, name: 'Compost', text: 'a compost heap feeds the garden, so add leaves to the compost', links: [1], x: 52, y: 164 },
  { id: 3, name: 'Bees', text: 'bees visit the garden flowers and the tomatoes', links: [1, 0], x: 150, y: 164 },
  { id: 4, name: 'Shop', text: 'the garden shop sells seeds and compost', links: [0, 1], x: 248, y: 92 },
  { id: 5, name: 'Weather', text: 'the weather for the garden: rain and sun', links: [0], x: 36, y: 28 },
  { id: 6, name: 'Blog', text: 'the club blog: our garden, our bees, our tomatoes', links: [0, 3, 1], x: 248, y: 164 },
  { id: 7, name: 'Old page', text: 'the old garden page with tomatoes', links: [0], x: 276, y: 28 },
];

const f1 = (n: number) => Math.round(n * 10) / 10;
const f3 = (n: number) => Math.round(n * 1000) / 1000;

export function words(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
}

/** The pages each word appears on: the index cards. */
export const index: Map<string, number[]> = (() => {
  const m = new Map<string, number[]>();
  for (const p of pages) for (const w of new Set(words(p.text))) m.set(w, [...(m.get(w) || []), p.id]);
  return m;
})();

export function lookup(query: string): { words: string[]; hits: number[] } {
  const ws = words(query);
  if (!ws.length) return { words: ws, hits: [] };
  let hits = index.get(ws[0]) || [];
  for (const w of ws.slice(1)) hits = hits.filter((id) => (index.get(w) || []).includes(id));
  return { words: ws, hits };
}

/** Breadth first crawl from the home page, one page at a time. */
export function crawlOrder(): number[] {
  const seen = [0];
  for (let i = 0; i < seen.length; i++) for (const l of pages[seen[i]].links) if (!seen.includes(l)) seen.push(l);
  return seen;
}

export function crawlState(step: number): { visited: number[]; queue: number[] } {
  const order = crawlOrder();
  const visited = order.slice(0, step);
  const queue: number[] = [];
  const known = new Set<number>(visited);
  if (step === 0) return { visited, queue: [0] };
  for (const v of visited) for (const l of pages[v].links) if (!known.has(l)) { known.add(l); queue.push(l); }
  // The queue is the pages we know about but have not visited, in the order we found them
  return { visited, queue: order.filter((id) => known.has(id) && !visited.includes(id)) };
}

/** Score of every page for a query, with or without weighing rare words more. */
export function scores(query: string, rare: boolean): { id: number; score: number }[] {
  const ws = words(query);
  const N = pages.length;
  return pages
    .map((p) => {
      const pw = words(p.text);
      let s = 0;
      for (const w of ws) {
        const tf = pw.filter((x) => x === w).length / pw.length;
        const df = (index.get(w) || []).length;
        const idf = rare && df ? Math.log(N / df) : 1;
        s += tf * idf;
      }
      return { id: p.id, score: f3(s) };
    })
    .sort((a, b) => b.score - a.score || a.id - b.id);
}

export const DAMPING = 0.85;

/** PageRank after a number of rounds, starting with an equal share for every page. */
export function pageRank(rounds: number, extra: boolean): number[] {
  const N = pages.length;
  const links = pages.map((p) => (extra && p.id === 6 ? [...p.links, 2] : p.links));
  let r = pages.map(() => 1 / N);
  for (let i = 0; i < rounds; i++) {
    const next = pages.map(() => (1 - DAMPING) / N);
    r.forEach((v, id) => links[id].forEach((to) => (next[to] += (DAMPING * v) / links[id].length)));
    r = next;
  }
  return r;
}

/** The web as a drawing. States: 'seen', 'queued' or nothing. Optional bars show a size for each page. */
export function graphSvg(state?: { visited: number[]; queue: number[] }, size?: number[], extra = false): string {
  const links = pages.flatMap((p) => (extra && p.id === 6 ? [...p.links, 2] : p.links).map((to) => [p.id, to] as const));
  const rad = (id: number) => (size ? f1(8 + size[id] * 45) : 11);
  const edges = links
    .map(([a, b]) => {
      const [p, q] = [pages[a], pages[b]];
      const [dx, dy] = [q.x - p.x, q.y - p.y];
      const len = Math.hypot(dx, dy);
      const [ux, uy] = [dx / len, dy / len];
      const [x1, y1, x2, y2] = [f1(p.x + ux * (rad(a) + 2)), f1(p.y + uy * (rad(a) + 2)), f1(q.x - ux * (rad(b) + 3)), f1(q.y - uy * (rad(b) + 3))];
      const head = `M${x2} ${y2}L${f1(x2 - ux * 8 - uy * 4)} ${f1(y2 - uy * 8 + ux * 4)}L${f1(x2 - ux * 8 + uy * 4)} ${f1(y2 - uy * 8 - ux * 4)}Z`;
      return `<line class="edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><path class="head" d="${head}"/>`;
    })
    .join('');
  const nodes = pages
    .map((p) => {
      const cls = state ? (state.visited.includes(p.id) ? 'node seen' : state.queue.includes(p.id) ? 'node queued' : 'node') : 'node';
      return `<circle class="${cls}" cx="${p.x}" cy="${p.y}" r="${rad(p.id)}"/><text class="nlab" x="${p.x}" y="${f1(p.y + rad(p.id) + 12)}" text-anchor="middle">${p.name}</text>`;
    })
    .join('');
  return `${edges}${nodes}`;
}

export function crawlStatus(step: number): string {
  const order = crawlOrder();
  const { visited, queue } = crawlState(step);
  const names = (ids: number[]) => ids.map((i) => pages[i].name).join(', ') || 'none';
  if (step === 0) return `The crawler starts at the home page. Pages to visit: ${names(queue)}.`;
  const done = step >= order.length;
  return `Visited so far: ${names(visited)}. ${done ? `The crawl is finished. ${order.length} of ${pages.length} pages were found. ${pages.filter((p) => !order.includes(p.id)).map((p) => p.name).join(', ')} was never found, because no page links to it.` : `Waiting in the queue: ${names(queue)}.`}`;
}
