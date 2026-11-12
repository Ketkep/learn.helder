// The pictures of "Twenty-three strangers", as SVG markup. The server draws the first picture of each,
// so the page works without a script, and the browser redraws with the same code.
// Colours are fixed: the pictures sit on their own cream card, the same in light and dark mode.
// The text in the pictures uses the page's own font (inline SVG inherits it).

import { DAYS, DAYS_IN, MY_DAY, anyMatch, dayLabel, meMatch, type Mode, type Room } from './model';
import { seeded } from '../../lib/rand';

export const PAPER = '#fbf3e6';
const INK = '#2a1d22';
const SOFT = '#6b5a5f';
const LINE = '#d9c7b8';
const DOT = '#8a7a70';
const WINE = '#8c2f4b';
const GOLD = '#e0a526';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** The point on the year wheel for a day of the year, at radius r. */
function onWheel(day: number, r: number, cx = 200, cy = 200): [number, number] {
  const a = -Math.PI / 2 + ((day - 0.5) / DAYS) * 2 * Math.PI;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** One room: every person is a dot on the year wheel, on their birthday. */
export function wheel(room: Room, mode: Mode): string {
  const R = 150;
  const n = room.days.length;
  let starts = 1;
  const months = 'JFMAMJJASOND'.split('').map((m, i) => {
    const [x1, y1] = onWheel(starts, R - 8);
    const [x2, y2] = onWheel(starts, R + 8);
    const [lx, ly] = onWheel(starts + DAYS_IN[i] / 2, R + 24);
    starts += DAYS_IN[i];
    return `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" stroke="${SOFT}" stroke-width="1.5"/><text x="${r1(lx)}" y="${r1(ly + 5)}" fill="${SOFT}" font-size="15" text-anchor="middle">${m}</text>`;
  });
  // People on the same day stack inwards
  const seen = new Map<number, number>();
  const dots = room.days.map((d, i) => {
    const k = seen.get(d) ?? 0;
    seen.set(d, k + 1);
    const [x, y] = onWheel(d, R - 16 - k * 13);
    const match = room.shared.includes(d);
    const you = mode === 'me' && i === 0;
    const fill = you ? GOLD : match ? WINE : DOT;
    return `<circle cx="${r1(x)}" cy="${r1(y)}" r="${match || you ? 6.5 : 5}" fill="${fill}" stroke="${you || match ? INK : PAPER}" stroke-width="${you || match ? 2 : 1}"/>`;
  });
  const youMark = (() => {
    if (mode !== 'me') return '';
    const [x, y] = onWheel(MY_DAY, R - 46);
    return `<text x="${r1(x)}" y="${r1(y + 5)}" fill="${INK}" font-size="15" font-weight="700" text-anchor="middle">you</text>`;
  })();
  const first = room.shared[0];
  let result: string;
  if (mode === 'any') {
    result = first ? (room.shared.length > 1 ? `${room.shared.length} shared birthdays` : `Two share ${dayLabel(first)}`) : 'No shared birthday';
  } else {
    result = first ? `Someone has your birthday` : 'Nobody has your birthday';
  }
  const say =
    mode === 'any'
      ? `A room of ${n} people, each a dot on their birthday around the year. ${first ? `Shared: ${room.shared.map(dayLabel).join(', ')}.` : 'Nobody shares a birthday.'}`
      : `A room of ${n} people, you among them, with your birthday on 13 November. ${first ? 'Someone else has your birthday.' : 'Nobody else has your birthday.'}`;
  return `<svg viewBox="-20 -20 440 440" role="img" aria-label="${say}" xmlns="http://www.w3.org/2000/svg">
  <rect x="-20" y="-20" width="440" height="440" fill="${PAPER}"/>
  <circle cx="200" cy="200" r="${R}" fill="none" stroke="${LINE}" stroke-width="2"/>
  ${months.join('')}
  ${dots.join('')}
  ${youMark}
  <text x="200" y="192" fill="${INK}" font-size="38" text-anchor="middle" font-family="Young Serif, Georgia, serif">${n} people</text>
  <text x="200" y="224" fill="${first ? WINE : SOFT}" font-size="17" font-weight="700" text-anchor="middle">${result}</text>
</svg>`;
}

/** 1,000 rooms as a grid of small squares: dark where the room had a match. */
export function grid(results: boolean[]): string {
  const cols = 40;
  const cell = 10;
  const hits: string[] = [];
  const misses: string[] = [];
  results.forEach((m, i) => {
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * cell;
    (m ? hits : misses).push(`M${x} ${y}h8v8h-8z`);
  });
  const rows = Math.ceil(results.length / cols) || 25;
  const count = results.filter(Boolean).length;
  return `<svg viewBox="-4 -4 ${cols * cell + 6} ${rows * cell + 6}" role="img" aria-label="${results.length} rooms. In ${count} of them there was a match." xmlns="http://www.w3.org/2000/svg">
  <rect x="-4" y="-4" width="${cols * cell + 6}" height="${rows * cell + 6}" fill="${PAPER}"/>
  <path d="${misses.join('')}" fill="${LINE}"/>
  <path d="${hits.join('')}" fill="${WINE}"/>
</svg>`;
}

export interface Run {
  n: number;
  mode: Mode;
  share: number;
}

const X0 = 52;
const X1 = 384;
const Y0 = 262;
const Y1 = 22;

/** The share of rooms with a match, one point per run of 1,000 rooms, by the size of the room. */
export function runsChart(runs: Run[], n: number): string {
  const x = (v: number) => X0 + ((v - 2) / 78) * (X1 - X0);
  const y = (v: number) => Y0 - v * (Y0 - Y1);
  const ticks = [2, 20, 40, 60, 80]
    .map((v) => `<path d="M${r1(x(v))} ${Y0}v6" stroke="${SOFT}"/><text x="${r1(x(v))}" y="${Y0 + 24}" fill="${SOFT}" font-size="15" text-anchor="middle">${v}</text>`)
    .join('');
  const grid = [0, 0.5, 1]
    .map((v) => `<path d="M${X0} ${r1(y(v))}H${X1}" stroke="${LINE}" stroke-width="1.5"${v === 0.5 ? ' stroke-dasharray="6 5"' : ''}/><text x="${X0 - 8}" y="${r1(y(v)) + 5}" fill="${SOFT}" font-size="15" text-anchor="end">${v * 100}%</text>`)
    .join('');
  const points = runs
    .map((r) =>
      r.mode === 'any'
        ? `<circle cx="${r1(x(r.n))}" cy="${r1(y(r.share))}" r="6.5" fill="${WINE}" stroke="${PAPER}" stroke-width="1.5"/>`
        : `<circle cx="${r1(x(r.n))}" cy="${r1(y(r.share))}" r="6" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>`,
    )
    .join('');
  const say = runs.length
    ? `Your runs: ${runs.map((r) => `${r.n} people, ${r.mode === 'any' ? 'any two' : 'your birthday'}: ${Math.round(r.share * 100)}%`).join('; ')}.`
    : 'No runs yet.';
  return `<svg viewBox="0 0 400 322" role="img" aria-label="${say}" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="322" fill="${PAPER}"/>
  ${grid}
  <path d="M${r1(x(n))} ${Y0}V${Y1}" stroke="${SOFT}" stroke-width="1.5" stroke-dasharray="2 4"/>
  ${ticks}
  <text x="${(X0 + X1) / 2}" y="316" fill="${SOFT}" font-size="15" text-anchor="middle">people in the room</text>
  ${points}
  ${runs.length ? '' : `<text x="${(X0 + X1) / 2}" y="${(Y0 + Y1) / 2 + 40}" fill="${SOFT}" font-size="16" text-anchor="middle">Run 1,000 rooms to add a point</text>`}
</svg>`;
}

/** The exact chances for both questions, up to 300 people. */
export function curves(): string {
  const MAX = 300;
  const x = (v: number) => X0 + ((v - 1) / (MAX - 1)) * (X1 - X0);
  const y = (v: number) => Y0 - v * (Y0 - Y1);
  const line = (f: (n: number) => number) =>
    Array.from({ length: MAX }, (_, i) => `${i ? 'L' : 'M'}${r1(x(i + 1))} ${r1(y(f(i + 1)))}`).join('');
  const ticks = [1, 100, 200, 300]
    .map((v) => `<path d="M${r1(x(v))} ${Y0}v6" stroke="${SOFT}"/><text x="${r1(x(v))}" y="${Y0 + 24}" fill="${SOFT}" font-size="15" text-anchor="middle">${v}</text>`)
    .join('');
  const grid = [0, 0.5, 1]
    .map((v) => `<path d="M${X0} ${r1(y(v))}H${X1}" stroke="${LINE}" stroke-width="1.5"${v === 0.5 ? ' stroke-dasharray="6 5"' : ''}/><text x="${X0 - 8}" y="${r1(y(v)) + 5}" fill="${SOFT}" font-size="15" text-anchor="end">${v * 100}%</text>`)
    .join('');
  return `<svg viewBox="0 0 400 322" role="img" aria-label="Two curves. The chance that any two people share a birthday passes one half at 23 people. The chance that someone shares your own birthday passes one half only at 254 people: you and 253 others." xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="322" fill="${PAPER}"/>
  ${grid}
  ${ticks}
  <text x="${(X0 + X1) / 2}" y="316" fill="${SOFT}" font-size="15" text-anchor="middle">people in the room</text>
  <path d="${line(meMatch)}" fill="none" stroke="${GOLD}" stroke-width="4"/>
  <path d="${line(anyMatch)}" fill="none" stroke="${WINE}" stroke-width="4"/>
  <circle cx="${r1(x(23))}" cy="${r1(y(0.5))}" r="6" fill="${WINE}" stroke="${INK}" stroke-width="2"/>
  <text x="${r1(x(23) + 12)}" y="${r1(y(0.5)) + 26}" fill="${INK}" font-size="15" font-weight="700">23: any two</text>
  <circle cx="${r1(x(254))}" cy="${r1(y(0.5))}" r="6" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
  <text x="${r1(x(254))}" y="${r1(y(0.5)) - 14}" fill="${INK}" font-size="15" font-weight="700" text-anchor="middle">you + 253</text>
</svg>`;
}

/** A room of n people as dots on a circle, with a line for every pair that is compared. */
export function pairsView(n: number, mode: Mode): string {
  const R = 150;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * 2 * Math.PI;
    return [200 + R * Math.cos(a), 200 + R * Math.sin(a)];
  });
  const lines: string[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (mode === 'me' && i !== 0) continue;
      lines.push(`M${r1(pts[i][0])} ${r1(pts[i][1])}L${r1(pts[j][0])} ${r1(pts[j][1])}`);
    }
  }
  const dots = pts.map(([x, y], i) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${mode === 'me' && i === 0 ? 9 : 6}" fill="${mode === 'me' && i === 0 ? GOLD : WINE}" stroke="${INK}" stroke-width="1.5"/>`).join('');
  const count = mode === 'any' ? (n * (n - 1)) / 2 : n - 1;
  return `<svg viewBox="0 0 400 400" role="img" aria-label="${n} people with a line for every pair that could share a birthday: ${count} lines." xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${PAPER}"/>
  <path d="${lines.join('')}" stroke="${mode === 'any' ? WINE : INK}" stroke-width="${mode === 'any' ? 0.9 : 1.6}" opacity="${mode === 'any' ? 0.5 : 0.8}"/>
  ${dots}
</svg>`;
}

/** The 32 squads of the 2014 World Cup: 16 with a shared birthday. The order is shuffled on purpose. */
export function squads(): string {
  const rand = seeded(2014);
  const marks = Array.from({ length: 32 }, (_, i) => i < 16);
  for (let i = marks.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [marks[i], marks[j]] = [marks[j], marks[i]];
  }
  const tiles = marks
    .map((m, i) => {
      const x = (i % 8) * 50 + 4;
      const y = Math.floor(i / 8) * 50 + 4;
      const body = m
        ? `<circle cx="${x + 15}" cy="${y + 21}" r="6" fill="${PAPER}"/><circle cx="${x + 27}" cy="${y + 21}" r="6" fill="${PAPER}"/><path d="M${x + 15} ${y + 21}h12" stroke="${PAPER}" stroke-width="3"/>`
        : '';
      return `<rect x="${x}" y="${y}" width="42" height="42" rx="6" fill="${m ? WINE : LINE}"/>${body}`;
    })
    .join('');
  return `<svg viewBox="0 0 400 200" role="img" aria-label="32 squares, one for each squad at the 2014 World Cup. 16 of them are dark: in those squads at least two players shared a birthday." xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="${PAPER}"/>
  ${tiles}
</svg>`;
}
