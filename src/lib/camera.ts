// Maths and drawings for the camera page: a pinhole, the f-number, the exposure and the pixels.
// The drawings are made here, so the same strings are used when the page is built and in the browser.
// The pinhole sums use a box 10 cm deep and green light. They are the page's own simple optics.

const f1 = (n: number) => Math.round(n * 10) / 10;
const f2 = (n: number) => Math.round(n * 100) / 100;

export const BOX_MM = 100;
export const LAMBDA_MM = 0.00055;

/** Width of the blur in millimetres: the hole itself plus the spreading of light at a small hole. */
export function pinholeBlur(holeMm: number): number {
  return holeMm + (2.44 * LAMBDA_MM * BOX_MM) / holeMm;
}

/** The best hole for a box of this depth. */
export function bestHole(): number {
  return Math.sqrt(2.44 * LAMBDA_MM * BOX_MM);
}

/** Light that gets in, against a hole of 1 mm. */
export const pinholeLight = (holeMm: number) => holeMm * holeMm;

/** A picture seen through the hole: an upside down arrow, blurred and dimmed. */
export function pinholeSvg(holeMm: number): string {
  const blur = pinholeBlur(holeMm);
  const sd = Math.min(8, blur * 2.2);
  const bright = Math.max(0.12, Math.min(1, 0.12 + 0.88 * Math.sqrt(pinholeLight(holeMm) / 4)));
  return `<defs><filter id="pinblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f1(sd)}"/></filter></defs><g filter="url(#pinblur)" opacity="${f2(bright)}"><path class="subject" d="M150 118L120 72H140V30H160V72H180Z"/><circle class="sun" cx="226" cy="44" r="14"/></g>`;
}

export const stops = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];

/** Light at an f-number, against f/1.4. */
const exact: Record<number, number> = { 1.4: Math.SQRT2, 2: 2, 2.8: 2 * Math.SQRT2, 4: 4, 5.6: 4 * Math.SQRT2, 8: 8, 11: 8 * Math.SQRT2, 16: 16 };
export const lightAt = (n: number) => 2 / ((exact[n] ?? n) ** 2);

/** A sharp subject in front and blurred lights behind. A wider aperture makes bigger blurs. */
export function apertureSvg(n: number): string {
  const r = Math.max(2, 22 / (n / 1.4) ** 0.8);
  const lights = [[40, 30], [90, 60], [210, 36], [260, 70], [60, 98], [240, 108], [170, 24]]
    .map(([x, y]) => `<circle class="bokeh" cx="${x}" cy="${y}" r="${f1(r)}"/>`)
    .join('');
  return `${lights}<circle class="near" cx="150" cy="84" r="20"/><path class="near" d="M130 120H170L160 100H140Z"/>`;
}

export const shutters = [1000, 500, 250, 125, 60, 30, 15];
export const isos = [100, 200, 400, 800, 1600, 3200, 6400];

/** How many stops brighter than the toy scene needs (0 is right, 1 is twice as bright). Base: f/4, 1/250 s, ISO 100. */
export function exposureStops(n: number, den: number, iso: number): number {
  const nn = exact[n] ?? n;
  const e = iso / den / (nn * nn);
  const base = 100 / 250 / 16;
  return Math.log2(e / base);
}

export function verdict(stopsOff: number): string {
  if (Math.abs(stopsOff) < 0.25) return 'about right';
  const s = Math.abs(stopsOff);
  const word = s >= 1.5 ? `${Math.round(s)} stops` : s >= 0.75 ? 'one stop' : 'half a stop';
  return stopsOff > 0 ? `too bright, by ${word}` : `too dark, by ${word}`;
}

/** The toy picture: its brightness, a moving ball smeared by the shutter, and noise from a high ISO. */
export function exposureSvg(n: number, den: number, iso: number): string {
  const off = exposureStops(n, den, iso);
  const level = Math.max(0.05, Math.min(1, 0.5 * 2 ** off));
  const smear = Math.min(150, 36000 / den / 12);
  const noise = Math.min(0.5, Math.log2(iso / 100) * 0.07);
  const grey = Math.round(level * 235);
  const scene = `<rect x="2" y="2" width="296" height="116" rx="8" fill="rgb(${grey},${grey},${Math.min(255, grey + 10)})"/>`;
  const ball = `<rect class="trail" x="${f1(150 - smear / 2)}" y="52" width="${f1(smear + 20)}" height="20" rx="10" opacity="${f2(level * 0.9)}"/><circle class="ballc" cx="${f1(150 + smear / 2 + 10)}" cy="62" r="10" opacity="${f2(level)}"/>`;
  const grain = `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/></filter><rect x="2" y="2" width="296" height="116" rx="8" filter="url(#grain)" opacity="${f2(noise)}"/>`;
  return `${scene}${ball}${grain}`;
}

/** A small picture of 16 by 16 squares, drawn as text. */
const art = [
  '................',
  '.....oooooo.....',
  '...oyyyyyyyyo...',
  '..oyyyyyyyyyyo..',
  '.oyyyyyyyyyyyyo.',
  '.oyyykyyyykyyyo.',
  '.oyyykyyyykyyyo.',
  'oyyyyyyyyyyyyyyo',
  'oyyyyyyyyyyyyyyo',
  '.oyykyyyyyykyyo.',
  '.oyyykyyyykyyyo.',
  '.oyyyykkkkyyyyo.',
  '..oyyyyyyyyyyo..',
  '...oyyyyyyyyo...',
  '.....oooooo.....',
  '................',
];
const colourOf: Record<string, [number, number, number]> = { '.': [236, 240, 245], o: [120, 80, 20], y: [246, 206, 60], k: [30, 30, 30] };

/** The same picture with a chosen number of squares along each side (1, 2, 4, 8 or 16). */
export function pixelsSvg(side: number): string {
  const [x0, y0, size] = [78, 4, 144];
  const cell = size / side;
  const block = 16 / side;
  let out = '';
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      let sum: [number, number, number] = [0, 0, 0];
      for (let y = 0; y < block; y++) for (let x = 0; x < block; x++) {
        const v = colourOf[art[r * block + y][c * block + x]];
        sum = [sum[0] + v[0], sum[1] + v[1], sum[2] + v[2]];
      }
      const n = block * block;
      out += `<rect x="${f1(x0 + c * cell)}" y="${f1(y0 + r * cell)}" width="${f1(cell + 0.3)}" height="${f1(cell + 0.3)}" fill="rgb(${Math.round(sum[0] / n)},${Math.round(sum[1] / n)},${Math.round(sum[2] / n)})"/>`;
    }
  }
  return out;
}

export const sides = [2, 4, 8, 16];

/** A picture with these pixels takes this many bytes when every pixel is kept as three numbers. */
export function rawBytes(w: number, h: number): number {
  return w * h * 3;
}

export function fmtBytes(b: number): string {
  if (b >= 1e6) return `${(b / 1e6).toFixed(b >= 1e8 ? 0 : 1)} megabytes`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(1)} kilobytes`;
  return `${b} bytes`;
}
