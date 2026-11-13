// The pictures of "The page that guessed your keys", as SVG text: the track of guesses and keys, the
// bars that compare the page's hits for you and for the coin, and the table of what the page learned.
// The server draws them first and the browser draws them again after every key. Fixed night colours,
// the same in light and dark mode.

import { type Lane, type Key, hits, learned, rate } from './model';

const INK = '#f3ead6';
const SOFT = '#9fb3c8';
const BG = '#0c1b2e';
const F = '#ffb257';
const J = '#7fd0c4';
const HIT = '#8fe3a0';
const MISS = '#ff7a7a';
const keyColour = (k: Key) => (k === 'F' ? F : J);

/** The last `count` presses as two rows: the page's guess above, your key below, a mark between them. */
export function trackView(lane: Lane, count: number, who: string): string {
  const W = 640;
  const cell = W / count;
  const size = Math.min(cell - 6, 56);
  const top = 34;
  const gap = 38;
  const row2 = top + size + gap;
  const H = row2 + size + 30;
  const total = lane.keys.length;
  const font = Math.max(12, size * 0.55);
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${aria(lane, count, who)}">`;
  s += `<rect width="${W}" height="${H}" rx="12" fill="${BG}"/>`;
  s += `<text x="12" y="23" fill="${SOFT}" font-size="16" font-family="system-ui, sans-serif">Page guesses</text>`;
  s += `<text x="12" y="${H - 9}" fill="${SOFT}" font-size="16" font-family="system-ui, sans-serif">${who}</text>`;
  for (let slot = 0; slot < count; slot++) {
    const x = W - (count - slot) * cell + (cell - size) / 2;
    const idx = total - count + slot;
    if (idx < 0) {
      s += `<rect x="${x}" y="${top}" width="${size}" height="${size}" rx="6" fill="none" stroke="#24405f" stroke-width="2" stroke-dasharray="3 4"/>`;
      s += `<rect x="${x}" y="${row2}" width="${size}" height="${size}" rx="6" fill="none" stroke="#24405f" stroke-width="2" stroke-dasharray="3 4"/>`;
      continue;
    }
    const g = lane.guesses[idx];
    const k = lane.keys[idx];
    s += `<rect x="${x}" y="${top}" width="${size}" height="${size}" rx="6" fill="none" stroke="${keyColour(g)}" stroke-width="3"/>`;
    s += `<text x="${x + size / 2}" y="${top + size / 2 + font * 0.35}" fill="${keyColour(g)}" font-size="${font}" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">${g}</text>`;
    s += `<rect x="${x}" y="${row2}" width="${size}" height="${size}" rx="6" fill="${keyColour(k)}"/>`;
    s += `<text x="${x + size / 2}" y="${row2 + size / 2 + font * 0.35}" fill="${BG}" font-size="${font}" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">${k}</text>`;
    const cx = x + size / 2;
    const my = top + size + gap / 2;
    s += g === k
      ? `<path d="M${cx - 8} ${my} l6 7 l11 -14" fill="none" stroke="${HIT}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M${cx - 7} ${my - 7} l14 14 M${cx + 7} ${my - 7} l-14 14" fill="none" stroke="${MISS}" stroke-width="4" stroke-linecap="round"/>`;
  }
  if (!total) s += `<text x="${W / 2}" y="${H / 2 + 6}" fill="${INK}" font-size="22" text-anchor="middle" font-family="system-ui, sans-serif">Press F or J to start</text>`;
  return s + '</svg>';
}

function aria(lane: Lane, count: number, who: string): string {
  const n = lane.keys.length;
  if (!n) return `The track is empty. Press F or J. Above, the page's guesses. Below, ${who.toLowerCase()}.`;
  return `Track of the last ${Math.min(count, n)} presses. The page guessed ${hits(lane)} of ${n} keys right so far.`;
}

/** Two bars, the share the page guessed right for you and for the coin, with a line at 50 per cent. */
export function bars(you: Lane, coin: Lane): string {
  const W = 420;
  const H = 150;
  const base = 120;
  const top = 22;
  const y = (p: number) => base - p * (base - top);
  const bar = (lane: Lane, x: number, colour: string, label: string) => {
    const n = lane.keys.length;
    const p = rate(lane);
    const txt = n >= 5 ? `${Math.round(p * 100)}%` : n ? 'a few more' : 'no keys yet';
    const h = n >= 5 ? base - y(p) : 0;
    return `<rect x="${x}" y="${base - h}" width="100" height="${h}" rx="4" fill="${colour}"/><text x="${x + 50}" y="${n >= 5 ? base - h - 6 : base - 8}" fill="${INK}" font-size="${n >= 5 ? 19 : 14}" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">${txt}</text><text x="${x + 50}" y="${base + 20}" fill="${INK}" font-size="15" text-anchor="middle" font-family="system-ui, sans-serif">${label} (${n})</text>`;
  };
  return (
    `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The share of keys the page guessed right: ${you.keys.length >= 5 ? Math.round(rate(you) * 100) + ' per cent' : 'not enough keys yet'} for your keys, ${coin.keys.length >= 5 ? Math.round(rate(coin) * 100) + ' per cent' : 'not enough keys yet'} for the coin. A line marks 50 per cent.">` +
    `<rect width="${W}" height="${H}" rx="12" fill="${BG}"/>` +
    `<path d="M20 ${y(0.5)} H${W - 20}" stroke="${SOFT}" stroke-width="2" stroke-dasharray="6 6"/>` +
    `<text x="${W - 14}" y="${y(0.5) + 17}" fill="${SOFT}" font-size="14" text-anchor="end" font-family="system-ui, sans-serif">50%</text>` +
    bar(you, 70, F, 'You') +
    bar(coin, 250, J, 'Coin') +
    '</svg>'
  );
}

/** The table of what the page learned in one lane: after each run of three keys, how often F and J came. */
export function learnedTable(lane: Lane): string {
  const rows = learned(lane);
  const max = Math.max(1, ...rows.map((r) => Math.max(r.F, r.J)));
  const bar = (n: number, colour: string) => `<span class="rm-bar" style="width:${Math.round((n / max) * 100)}%;background:${colour}"></span>`;
  return (
    '<table class="rm-table"><caption class="visually-hidden">After each run of three keys, how often F and how often J came next</caption>' +
    '<thead><tr><th scope="col">After</th><th scope="col">F came</th><th scope="col">J came</th></tr></thead><tbody>' +
    rows
      .map((r) => `<tr><th scope="row">${r.ctx}</th><td>${bar(r.F, F)}<span class="rm-n">${r.F}</span></td><td>${bar(r.J, J)}<span class="rm-n">${r.J}</span></td></tr>`)
      .join('') +
    '</tbody></table>'
  );
}
