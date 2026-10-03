// The two background strips of the Dutch film: clouds and far windmills (slow), and a row of
// canal houses (a bit faster). Each is one tile that repeats sideways, built as an SVG and
// handed to CSS as a background image. The tile's left and right edges are empty on purpose,
// so the repeat has no seam.

import { gablePath, type Gable } from './art';
import { seeded } from '../rand';

export interface Tile {
  /** CSS value for background-image. */
  url: string;
  /** Width divided by height, so a script can work out the tile width at any size. */
  aspect: number;
}

const f = (n: number) => Math.round(n * 10) / 10;

function toTile(width: number, height: number, body: string): Tile {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${body}</svg>`;
  return { url: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, aspect: width / height };
}

/** A flat cloud: a base and three round puffs. */
function cloud(x: number, y: number, s: number) {
  return (
    `<ellipse cx="${f(x)}" cy="${f(y + 12 * s)}" rx="${f(92 * s)}" ry="${f(20 * s)}"/>` +
    `<circle cx="${f(x - 42 * s)}" cy="${f(y)}" r="${f(30 * s)}"/>` +
    `<circle cx="${f(x + 2 * s)}" cy="${f(y - 14 * s)}" r="${f(40 * s)}"/>` +
    `<circle cx="${f(x + 48 * s)}" cy="${f(y + 2 * s)}" r="${f(28 * s)}"/>`
  );
}

/** A small windmill in one flat shape, for the distance. */
function farMill(x: number, ground: number, h: number, turn: number) {
  const top = ground - h * 0.72;
  const reach = h * 0.62;
  let blades = '';
  for (let k = 0; k < 4; k++) {
    blades += `<rect x="${f(x - 2)}" y="${f(top - reach)}" width="4" height="${f(reach)}" transform="rotate(${turn + k * 90} ${f(x)} ${f(top)})"/>`;
  }
  return (
    `<path d="M${f(x - h * 0.22)} ${f(ground)}L${f(x - h * 0.12)} ${f(top)}H${f(x + h * 0.12)}L${f(x + h * 0.22)} ${f(ground)}Z"/>` +
    `<path d="M${f(x - h * 0.15)} ${f(top)}Q${f(x)} ${f(top - h * 0.16)} ${f(x + h * 0.15)} ${f(top)}Z"/>` +
    blades
  );
}

/** Clouds and windmills far away. Soft white and soft navy, so they work on any sky color. */
export function farTile(): Tile {
  const W = 1600;
  const H = 400;
  const clouds = [
    [150, 90, 1.1],
    [520, 150, 0.8],
    [800, 70, 1.3],
    [1180, 130, 0.9],
    [1440, 60, 0.7],
  ]
    .map(([x, y, s]) => cloud(x, y, s))
    .join('');
  const mills =
    farMill(300, H, 120, 12) + farMill(760, H, 150, 40) + farMill(1010, H, 100, 70) + farMill(1360, H, 130, 25);
  // A church tower between the mills
  const tower = `<path d="M560 ${H}V300H592V${H}Z"/><path d="M556 300L576 244L596 300Z"/>`;
  return toTile(
    W,
    H,
    `<g fill="#fff" opacity="0.55">${clouds}</g><g fill="#1c3670" opacity="0.2">${mills}${tower}</g>`,
  );
}

/** A row of canal houses, as one soft navy shape with lighter windows. */
export function midTile(): Tile {
  const W = 1400;
  const H = 300;
  const rnd = seeded(77);
  const kinds: Gable[] = ['step', 'bell', 'neck', 'spout', 'step', 'neck', 'bell', 'flat'];
  let x = 40;
  let houses = '';
  let windows = '';
  let i = 0;
  while (x < W - 130) {
    const w = 78 + Math.round(rnd() * 34);
    const h = 120 + Math.round(rnd() * 70);
    const s = Math.max(14, w * 0.3);
    const gap = 4 + Math.round(rnd() * 8);
    houses += `<g transform="translate(${x} ${H})"><rect x="0" y="${-h}" width="${w}" height="${h}"/><path d="${gablePath(kinds[i % kinds.length], w, s)}" transform="translate(0 ${-h})"/></g>`;
    const cols = w < 90 ? 2 : 3;
    const rows = Math.floor((h - 24) / 40);
    const g = (w - cols * 11) / (cols + 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        windows += `<rect x="${f(x + g + c * (11 + g))}" y="${f(H - h + 14 + r * 40)}" width="11" height="19" rx="2"/>`;
      }
    }
    x += w + gap;
    i++;
  }
  return toTile(W, H, `<g fill="#1c3670" opacity="0.3">${houses}</g><g fill="#fff3dc" opacity="0.4">${windows}</g>`);
}

/** The film strip's holes, as a tile 44 units wide: one square hole at the top and one at the bottom. */
export function holeTile(): Tile {
  return toTile(
    44,
    48,
    `<rect x="14" y="6" width="16" height="11" rx="3" fill="#fff3dc"/><rect x="14" y="31" width="16" height="11" rx="3" fill="#fff3dc"/>`,
  );
}
