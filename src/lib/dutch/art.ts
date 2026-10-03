// Small drawing helpers for the Dutch page. Each one returns a piece of SVG as text,
// so a scene can be put together from houses, windmills, ships and people.
// Everything shares one outline color (deep navy) and a small set of flat fills.

export const P = {
  ink: '#14213d',
  cream: '#fff3dc',
  paper: '#fffaf0',
  blue: '#2B4F9E',
  blueL: '#8397bd',
  blueM: '#6681b4',
  blueD: '#1c3670',
  blueP: '#cfe2f1',
  brick: '#b5543a',
  brickD: '#8a3b28',
  orange: '#e4501a',
  gold: '#d9a441',
  green: '#8fae6e',
  greenD: '#5f7f4a',
  water: '#5f8fc2',
  waterD: '#3d6ea8',
  wood: '#b88b52',
  woodD: '#8a6234',
  skin: '#e8b98a',
  stone: '#c9c2b3',
};

/** The outline: the same everywhere, so pieces from different helpers sit together. */
export const line = (w = 3) => `stroke="${P.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

const f = (n: number) => Math.round(n * 10) / 10;

// ---------------------------------------------------------------- windmill

interface MillOptions {
  body?: string;
  roof?: string;
  /** The starting angle of the blades, in degrees. */
  angle?: number;
}

/**
 * A tapering Dutch windmill. The blades are one group with class "blades" and the centre
 * written in data-cx and data-cy, so a script can turn them with a rotate(angle cx cy).
 */
export function windmill(cx: number, ground: number, h: number, o: MillOptions = {}) {
  const body = o.body ?? P.cream;
  const roof = o.roof ?? P.brick;
  const angle = o.angle ?? 18;
  const bw = h * 0.5;
  const tw = h * 0.27;
  const top = ground - h * 0.7;
  const reach = h * 0.6;

  const arm = (a: number) =>
    `<g transform="rotate(${a} ${f(cx)} ${f(top)})">` +
    `<rect x="${f(cx - 2.5)}" y="${f(top - reach)}" width="5" height="${f(reach - 6)}" fill="${P.woodD}" ${line(2)}/>` +
    `<rect x="${f(cx + 2.5)}" y="${f(top - reach)}" width="${f(reach * 0.17)}" height="${f(reach * 0.74)}" fill="${P.cream}" ${line(2.5)}/>` +
    `<path d="M${f(cx + 2.5)} ${f(top - reach * 0.75)}H${f(cx + 2.5 + reach * 0.17)}M${f(cx + 2.5)} ${f(top - reach * 0.5)}H${f(cx + 2.5 + reach * 0.17)}M${f(cx + 2.5 + reach * 0.085)} ${f(top - reach)}V${f(top - reach * 0.26)}" fill="none" ${line(1.6)}/>` +
    `</g>`;

  return (
    `<path d="M${f(cx - bw / 2)} ${f(ground)}L${f(cx - tw / 2)} ${f(top)}H${f(cx + tw / 2)}L${f(cx + bw / 2)} ${f(ground)}Z" fill="${body}" ${line()}/>` +
    `<path d="M${f(cx - tw / 2 - 4)} ${f(top)}Q${f(cx)} ${f(top - h * 0.22)} ${f(cx + tw / 2 + 4)} ${f(top)}Z" fill="${roof}" ${line()}/>` +
    `<path d="M${f(cx - bw * 0.1)} ${f(ground)}V${f(ground - h * 0.12)}Q${f(cx)} ${f(ground - h * 0.17)} ${f(cx + bw * 0.1)} ${f(ground - h * 0.12)}V${f(ground)}Z" fill="${P.woodD}" ${line(2.5)}/>` +
    `<rect x="${f(cx - 5)}" y="${f(top + h * 0.1)}" width="10" height="${f(h * 0.1)}" rx="2" fill="${P.blueD}" ${line(2)}/>` +
    `<g class="blades" data-cx="${f(cx)}" data-cy="${f(top)}" transform="rotate(${angle} ${f(cx)} ${f(top)})">${arm(0)}${arm(90)}${arm(180)}${arm(270)}</g>` +
    `<circle cx="${f(cx)}" cy="${f(top)}" r="${f(h * 0.035 + 2)}" fill="${P.ink}"/>`
  );
}

// ---------------------------------------------------------------- canal house

export type Gable = 'step' | 'bell' | 'neck' | 'spout' | 'flat';

/** The outline of a gable, drawn from the top of the wall going up (so y values are negative). */
export function gablePath(gable: Gable, w: number, s: number): string {
  const g: Record<Gable, string> = {
    step: `M0 0V${f(-s * 0.34)}H${f(w * 0.14)}V${f(-s * 0.68)}H${f(w * 0.28)}V${f(-s)}H${f(w * 0.72)}V${f(-s * 0.68)}H${f(w * 0.86)}V${f(-s * 0.34)}H${f(w)}V0Z`,
    bell: `M0 0V${f(-s * 0.3)}C0 ${f(-s * 0.7)} ${f(w * 0.3)} ${f(-s * 0.55)} ${f(w * 0.3)} ${f(-s * 0.95)}C${f(w * 0.3)} ${f(-s * 1.35)} ${f(w * 0.46)} ${f(-s * 1.25)} ${f(w * 0.5)} ${f(-s * 1.55)}C${f(w * 0.54)} ${f(-s * 1.25)} ${f(w * 0.7)} ${f(-s * 1.35)} ${f(w * 0.7)} ${f(-s * 0.95)}C${f(w * 0.7)} ${f(-s * 0.55)} ${f(w)} ${f(-s * 0.7)} ${f(w)} ${f(-s * 0.3)}V0Z`,
    neck: `M0 0V${f(-s * 0.25)}H${f(w * 0.2)}V${f(-s * 1.1)}H${f(w * 0.28)}L${f(w * 0.5)} ${f(-s * 1.55)}L${f(w * 0.72)} ${f(-s * 1.1)}H${f(w * 0.8)}V${f(-s * 0.25)}H${f(w)}V0Z`,
    spout: `M0 0V${f(-s * 0.15)}L${f(w * 0.5)} ${f(-s * 1.3)}L${f(w)} ${f(-s * 0.15)}V0Z`,
    flat: `M0 0V${f(-s * 0.18)}H${f(w)}V0Z`,
  };
  return g[gable];
}

interface HouseOptions {
  wall?: string;
  trim?: string;
  gable?: Gable;
  /** How many floors of windows. Worked out from the height when left out. */
  floors?: number;
}

/** A tall narrow house with one of the famous gable shapes. (x, ground) is the bottom left corner. */
export function house(x: number, ground: number, w: number, h: number, o: HouseOptions = {}) {
  const wall = o.wall ?? P.brick;
  const trim = o.trim ?? P.cream;
  const gable = o.gable ?? 'step';
  const s = Math.max(14, w * 0.3);
  const cols = w < 62 ? 2 : 3;
  const floors = o.floors ?? Math.max(1, Math.floor((h - 30) / 46));
  const ww = 13;
  const wh = 22;

  // Windows in rows and columns, and a door in the middle of the bottom row
  let windows = '';
  const gap = (w - cols * ww) / (cols + 1);
  for (let r = 0; r < floors; r++) {
    for (let c = 0; c < cols; c++) {
      const wx = gap + c * (ww + gap);
      const wy = -h + 16 + r * 46;
      windows += `<rect x="${f(wx)}" y="${f(wy)}" width="${ww}" height="${wh}" rx="2" fill="${P.blueP}" ${line(2.2)}/><path d="M${f(wx + ww / 2)} ${f(wy)}V${f(wy + wh)}M${f(wx)} ${f(wy + wh / 2)}H${f(wx + ww)}" fill="none" ${line(1.2)}/>`;
    }
  }
  const dx = w / 2 - 8;

  return (
    `<g transform="translate(${f(x)} ${f(ground)})">` +
    `<path d="${gablePath(gable, w, s)}" transform="translate(0 ${f(-h)})" fill="${wall}" ${line()}/>` +
    `<rect x="0" y="${f(-h)}" width="${f(w)}" height="${f(h)}" fill="${wall}" ${line()}/>` +
    `<path d="M0 ${f(-h + 7)}H${f(w)}" fill="none" stroke="${trim}" stroke-width="3" opacity="0.9"/>` +
    windows +
    `<path d="M${f(dx)} 0V-20Q${f(dx + 8)} -30 ${f(dx + 16)} -20V0Z" fill="${P.woodD}" ${line(2.2)}/>` +
    `</g>`
  );
}

// ---------------------------------------------------------------- ship

/**
 * A ship with three masts, drawn once as a symbol so a scene can use it many times:
 * <use href="#nl-ship" x y width height />. The sails say VOC, the Dutch East India Company.
 */
export function shipSymbol() {
  const sail = (d: string) => `<path d="${d}" fill="${P.cream}" ${line(2.4)}/>`;
  return (
    `<symbol id="nl-ship" viewBox="-80 -122 170 156" overflow="visible">` +
    `<rect x="-37" y="-100" width="3" height="84" fill="${P.ink}"/><rect x="3" y="-117" width="3" height="101" fill="${P.ink}"/><rect x="40" y="-92" width="3" height="76" fill="${P.ink}"/>` +
    sail('M-52 -88Q-35.5 -82 -19 -88L-19 -60Q-35.5 -54 -52 -60Z') +
    sail('M-55 -56Q-35.5 -49 -16 -56L-16 -26Q-35.5 -19 -55 -26Z') +
    sail('M26 -80Q41.5 -75 57 -80L57 -56Q41.5 -51 26 -56Z') +
    sail('M23 -52Q41.5 -46 60 -52L60 -26Q41.5 -20 23 -26Z') +
    sail('M-24 -104Q4.5 -96 33 -104L33 -66Q4.5 -58 -24 -66Z') +
    sail('M-28 -60Q4.5 -50 37 -60L37 -24Q4.5 -14 -28 -24Z') +
    `<text x="4.5" y="-37" text-anchor="middle" font-size="14" font-weight="700" letter-spacing="1" fill="${P.blue}" font-family="sans-serif">VOC</text>` +
    `<path d="M6 -117L26 -112L6 -107Z" fill="${P.orange}" ${line(2)}/>` +
    `<path d="M-68 -22L-52 -18H60L76 -8C68 14 40 24 4 24C-34 24 -62 14 -70 -6Z" fill="${P.wood}" ${line(3)}/>` +
    `<path d="M-62 -3C-40 5 40 5 66 -4" fill="none" stroke="${P.cream}" stroke-width="3"/>` +
    `<circle cx="-36" cy="10" r="2.4" fill="${P.ink}"/><circle cx="-18" cy="12" r="2.4" fill="${P.ink}"/><circle cx="0" cy="13" r="2.4" fill="${P.ink}"/><circle cx="18" cy="12" r="2.4" fill="${P.ink}"/><circle cx="36" cy="10" r="2.4" fill="${P.ink}"/>` +
    `</symbol>`
  );
}

// ---------------------------------------------------------------- people

interface PersonOptions {
  coat?: string;
  /** "brim" is a black hat with a wide brim, "cap" a white cap, "none" is bare headed. */
  hat?: 'brim' | 'cap' | 'none';
  skin?: string;
}

/** A simple person: a head, a body and two legs. (x, y) is where the feet are. */
export function person(x: number, y: number, s = 1, o: PersonOptions = {}) {
  const coat = o.coat ?? P.blueM;
  const hat = o.hat ?? 'none';
  const skin = o.skin ?? P.skin;
  const h = 46 * s;
  let top = '';
  if (hat === 'brim') {
    top = `<ellipse cx="0" cy="${f(-h * 1.03)}" rx="${f(11 * s)}" ry="${f(3 * s)}" fill="${P.ink}"/><rect x="${f(-6 * s)}" y="${f(-h * 1.22)}" width="${f(12 * s)}" height="${f(h * 0.2)}" rx="${f(2 * s)}" fill="${P.ink}"/>`;
  } else if (hat === 'cap') {
    top = `<path d="M${f(-7.5 * s)} ${f(-h * 1.0)}Q0 ${f(-h * 1.3)} ${f(7.5 * s)} ${f(-h * 1.0)}Z" fill="${P.paper}" ${line(2 * s)}/>`;
  }
  return (
    `<g transform="translate(${f(x)} ${f(y)})">` +
    `<path d="M${f(-5 * s)} 0L${f(-4 * s)} ${f(-h * 0.4)}M${f(5 * s)} 0L${f(4 * s)} ${f(-h * 0.4)}" ${line(3 * s)} fill="none"/>` +
    `<rect x="${f(-9 * s)}" y="${f(-h * 0.85)}" width="${f(18 * s)}" height="${f(h * 0.48)}" rx="${f(5 * s)}" fill="${coat}" ${line(2.5 * s)}/>` +
    `<circle cx="0" cy="${f(-h * 0.98)}" r="${f(7 * s)}" fill="${skin}" ${line(2.5 * s)}/>` +
    top +
    `</g>`
  );
}

// ---------------------------------------------------------------- tulip

/** A tulip with two leaves. (x, y) is the bottom of the stem. */
export function tulip(x: number, y: number, s = 1, petal = P.orange, edge = P.cream) {
  return (
    `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">` +
    `<path d="M0 0V-46" stroke="${P.greenD}" stroke-width="3.4" stroke-linecap="round" fill="none"/>` +
    `<path d="M0 -4C12 -8 18 -20 16 -34C6 -28 1 -16 0 -4Z" fill="${P.green}" ${line(2)}/>` +
    `<path d="M0 -10C-11 -12 -17 -22 -15 -32C-6 -27 -1 -19 0 -10Z" fill="${P.green}" ${line(2)}/>` +
    `<path d="M0 -44C-10 -44 -13 -58 -9 -70C-5 -66 -1 -58 0 -50C1 -58 5 -66 9 -70C13 -58 10 -44 0 -44Z" fill="${petal}" ${line(2.4)}/>` +
    `<path d="M0 -44C-6 -52 -6 -64 0 -72C6 -64 6 -52 0 -44Z" fill="${edge}" ${line(2.4)}/>` +
    `</g>`
  );
}

// ---------------------------------------------------------------- ground

/**
 * The stone slab every scene stands on, like a little stage. It runs along the bottom of a
 * picture that is `w` wide and `h` tall. The top of the slab is at y = h - 36.
 */
export function slab(w: number, h: number) {
  const top = h - 36;
  let joints = '';
  for (let x = 38; x < w - 20; x += 46) joints += `M${x} ${top + 2}V${top + 18}`;
  return (
    `<rect x="6" y="${top}" width="${w - 12}" height="30" rx="5" fill="${P.stone}" ${line()}/>` +
    `<path d="${joints}M10 ${top + 18}H${w - 10}" fill="none" stroke="${P.ink}" stroke-width="1.8" opacity="0.55"/>`
  );
}
