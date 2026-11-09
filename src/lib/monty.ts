// Small sums and drawings for the Monty Hall page. The game in the browser uses Math.random and nothing is saved or sent anywhere.
// With n doors, one car, and a host who knows where it is and always opens n - 2 doors with goats, staying wins 1 in n and switching wins
// (n - 1) in n. The three hosts of the third test are worked out exactly by listing every case. The same text is made at build time (Astro)
// and in the browser.

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** The chance that staying wins with n doors, and the chance that switching does. */
export const stay = (n: number) => 1 / n;
export const swap = (n: number) => (n - 1) / n;

/** As a percentage with one decimal when it is small or close to 100. */
export const pct = (p: number) => (p === 0 ? '0%' : p === 1 ? '100%' : (p > 0.9995 || p < 0.001 ? fmt(p * 100, 2) : fmt(p * 100, p * 100 < 10 || p * 100 > 90 ? 1 : 0)) + '%');

export const HOSTS = [
  { id: 'knows', name: 'Knows and always opens a goat', note: 'The host knows where the car is. Whatever you pick, he opens a door with a goat and offers the switch.' },
  { id: 'random', name: 'Opens a door at random', note: 'The host does not know. He opens one of the other two doors at random. Here it happens to show a goat. If it had shown the car, the game would be over.' },
  { id: 'trick', name: 'Offers only if you picked the car', note: 'The host offers the switch only when you picked the car, to tempt you away from it. When you picked a goat, he just opens your door.' },
];

export interface Case {
  car: number; // the door with the car, 1 to 3. You always pick door 1.
  opened: number; // the door the host opens, 2 or 3
  weight: number; // how likely this case is out of 1
  live: boolean; // does this case fit what you saw: a goat shown and a switch offered
  stayWins: boolean;
}

/** Every case when you pick door 1. Each car place is 1 in 3, and a host who chooses between two doors picks each half of the time. */
export function cases(host: string): Case[] {
  const out: Case[] = [];
  for (const car of [1, 2, 3]) {
    if (host === 'knows') {
      const opens = car === 1 ? [2, 3] : [car === 2 ? 3 : 2];
      for (const opened of opens) out.push({ car, opened, weight: 1 / 3 / opens.length, live: true, stayWins: car === 1 });
    } else if (host === 'random') {
      for (const opened of [2, 3]) out.push({ car, opened, weight: 1 / 6, live: car !== opened, stayWins: car === 1 });
    } else {
      // The trick host opens a door and offers only when the car is behind door 1. Otherwise there is no offer.
      for (const opened of [2, 3]) {
        const offer = car === 1;
        out.push({ car, opened, weight: 1 / 6, live: offer, stayWins: car === 1 });
      }
    }
  }
  return out;
}

/** Of the cases that fit what you saw, how much weight is there, and how much of it is a win for staying. */
export function chances(host: string) {
  const live = cases(host).filter((c) => c.live);
  const total = live.reduce((a, c) => a + c.weight, 0);
  const stays = live.filter((c) => c.stayWins).reduce((a, c) => a + c.weight, 0);
  return { offered: total, stay: total ? stays / total : 0, swap: total ? 1 - stays / total : 0 };
}

const W = 420;

/** The cases as cards, two to a row: three doors each, your door outlined, the car marked, the opened door crossed. Cases that do not fit are faded. */
export function casesSvg(host: string) {
  const list = cases(host);
  const cw = W / 2;
  const ch = 112;
  let s = '';
  list.forEach((c, i) => {
    const x = (i % 2) * cw + 4;
    const y = Math.floor(i / 2) * (ch + 8) + 4;
    const w = cw - 8;
    const dw = (w - 20) / 3 - 6;
    s += `<g opacity="${c.live ? 1 : 0.35}"><rect class="card" x="${x}" y="${y}" width="${w}" height="${ch}" rx="6"/>`;
    for (let d = 1; d <= 3; d++) {
      const dx = x + 10 + (d - 1) * (dw + 6);
      s += `<rect class="door${d === 1 ? ' mine' : ''}${d === c.opened ? ' open' : ''}" x="${dx}" y="${y + 10}" width="${dw}" height="54" rx="3"/>`;
      s += `<text class="lab mid" x="${dx + dw / 2}" y="${y + 41}">${d === c.car ? 'Car' : d === c.opened ? 'Goat' : ''}</text>`;
      s += `<text class="lab mid small" x="${dx + dw / 2}" y="${y + 77}">Door ${d}</text>`;
    }
    s += `<text class="lab mid" x="${x + w / 2}" y="${y + 100}">${c.live ? (c.stayWins ? 'Stay wins' : 'Switch wins') : c.opened === c.car ? 'Car shown, game over' : 'No offer'}</text></g>`;
  });
  return { svg: s, h: Math.ceil(list.length / 2) * (ch + 8) + 4 };
}

/** n doors as small blocks: yours, the one the host left shut, and the ones he opened. */
export function doorsSvg(n: number) {
  const shown = Math.min(n, 100);
  const cols = shown <= 3 ? shown : shown <= 10 ? 5 : 20;
  const rows = Math.ceil(shown / cols);
  const cell = Math.min(60, (W - 16) / cols);
  const gap = Math.max(2, cell * 0.12);
  let s = '';
  for (let i = 0; i < shown; i++) {
    const x = 8 + (i % cols) * cell;
    const y = 8 + Math.floor(i / cols) * cell * 1.1;
    const cls = i === 0 ? 'door mine' : i === shown - 1 ? 'door left' : 'door open';
    s += `<rect class="${cls}" x="${x}" y="${y}" width="${cell - gap}" height="${cell * 1.05 - gap}" rx="2"/>`;
  }
  const h = 8 + rows * cell * 1.1 + 6;
  return { svg: s, h: Math.max(h, 70) };
}
