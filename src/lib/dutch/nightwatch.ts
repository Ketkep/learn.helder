// The picture for "Light the room": a simple drawing of a militia company in a dark room, in the
// spirit of Rembrandt's Night Watch (not a copy). It is drawn twice with the same shapes: once
// in dim colors and once in full colors. The lamp reveals the full-color one.

const f = (n: number) => Math.round(n * 10) / 10;

export interface Sitter {
  id: string;
  /** The middle of the person, for pointing the lamp at them. */
  x: number;
  y: number;
}

export const places: Sitter[] = [
  { id: 'captain', x: 300, y: 236 },
  { id: 'lieutenant', x: 420, y: 254 },
  { id: 'guard', x: 520, y: 262 },
];

export function room(lit: boolean) {
  const wall = lit ? '#8a6a48' : '#2b211c';
  const floor = lit ? '#5c4430' : '#1c1512';
  const arch = lit ? '#a78457' : '#37291f';
  return (
    `<rect width="720" height="400" fill="${wall}"/>` +
    `<path d="M250 372V150Q250 60 360 60Q470 60 470 150V372Z" fill="${arch}" opacity="0.7"/>` +
    `<rect y="372" width="720" height="28" fill="${floor}"/>`
  );
}

export function figures(lit: boolean) {
  const c = (l: string, d: string) => (lit ? l : d);
  const ink = c('#14213d', '#0d0a09');
  const stroke = `stroke="${ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const skin = c('#e8b98a', '#6a5040');
  const wood = c('#8a6234', '#3a2c20');
  const steel = c('#c9d3dc', '#5a5a5c');
  const white = c('#fffaf0', '#6a6058');
  const hatCol = c('#15141a', '#241e1b');

  const head = (x: number, y: number, r: number) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${skin}" ${stroke}/>`;
  const hat = (x: number, y: number, w: number, h: number) =>
    `<rect x="${f(x - w * 0.45)}" y="${f(y - h)}" width="${f(w * 0.9)}" height="${h}" rx="4" fill="${hatCol}" ${stroke}/>` +
    `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(w * 0.2)}" fill="${hatCol}" ${stroke}/>`;
  const pole = (x: number, top: number, bottom = 372) => `<path d="M${f(x)} ${bottom}V${top}" stroke="${wood}" stroke-width="5" stroke-linecap="round"/>`;

  let out = '';

  // Guards at the back: dark coats, hats, pikes
  const guard = (x: number, s: number, coat: string) =>
    pole(x + 22 * s, 70 + (1 - s) * 80) +
    `<path d="M${f(x - 24 * s)} 372L${f(x - 18 * s)} ${f(372 - 120 * s)}Q${f(x)} ${f(372 - 140 * s)} ${f(x + 18 * s)} ${f(372 - 120 * s)}L${f(x + 24 * s)} 372Z" fill="${coat}" ${stroke}/>` +
    head(x, 372 - 152 * s, 14 * s) +
    hat(x, 372 - 162 * s, 26 * s, 20 * s);
  out += guard(196, 0.86, c('#2a3a52', '#2a2927'));
  out += guard(520, 0.9, c('#3a4a3a', '#262925'));
  out += guard(572, 0.8, c('#2a3a52', '#2a2927'));

  // The flag bearer on the left
  out +=
    `<path d="M120 372L130 64" stroke="${wood}" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M132 70Q196 52 252 86L248 176Q196 152 128 170Z" fill="${c('#2B4F9E', '#2b3350')}" ${stroke}/>` +
    `<path d="M133 112Q196 96 250 128L249 146Q196 122 132 136Z" fill="${c('#e4501a', '#5a3a2a')}" ${stroke}/>` +
    `<path d="M95 372L100 252Q118 238 140 252L146 372Z" fill="${c('#4a4f66', '#2a2b33')}" ${stroke}/>` +
    head(118, 230, 15) +
    hat(118, 216, 28, 22);

  // The drummer on the right
  out +=
    `<path d="M602 372L608 254Q632 240 658 254L664 372Z" fill="${c('#8a3b28', '#43302a')}" ${stroke}/>` +
    `<rect x="604" y="294" width="58" height="42" rx="8" fill="${c('#b88b52', '#4a3a2a')}" ${stroke}/>` +
    `<ellipse cx="633" cy="294" rx="29" ry="8" fill="${white}" ${stroke}/>` +
    `<path d="M610 302L620 334M628 302L633 334M646 302L640 334M656 302L646 334" stroke="${ink}" stroke-width="2" fill="none"/>` +
    `<path d="M600 276L584 252M666 276L682 250" stroke="${wood}" stroke-width="5" stroke-linecap="round"/>` +
    head(632, 232, 16) +
    hat(632, 218, 30, 24);

  // The captain: black coat, red sash, white collar, and a hand held out
  out +=
    `<path d="M262 372L270 204Q300 184 332 204L340 372Z" fill="${c('#1b1a20', '#2d2622')}" ${stroke}/>` +
    `<path d="M270 210L338 306L330 322L266 230Z" fill="${c('#b3202a', '#4a2625')}" ${stroke}/>` +
    `<path d="M276 200Q300 222 324 200L320 190Q300 204 280 190Z" fill="${c('#f4efe6', '#5a4f47')}" ${stroke}/>` +
    `<path d="M330 216L392 266L384 280L322 236Z" fill="${c('#1b1a20', '#2d2622')}" ${stroke}/>` +
    `<circle cx="392" cy="272" r="10" fill="${skin}" ${stroke}/>` +
    `<path d="M380 262L392 252L402 262L394 270Z" fill="${white}" ${stroke}/>` +
    head(300, 170, 20) +
    `<path d="M286 182Q300 204 314 182Q300 192 286 182Z" fill="${c('#5a3a24', '#3a2a20')}"/>` +
    hat(300, 152, 44, 42) +
    `<path d="M330 126Q352 110 360 140Q346 132 330 140Z" fill="${c('#a73a2a', '#3d2622')}" ${stroke}/>`;

  // The lieutenant: bright yellow coat, white sash, a plume and a partisan
  out +=
    `<path d="M466 372V86" stroke="${wood}" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M466 84L455 112L466 102L477 112Z" fill="${steel}" ${stroke}/>` +
    `<path d="M388 372L396 220Q420 202 446 220L454 372Z" fill="${c('#e8c64a', '#5f5030')}" ${stroke}/>` +
    `<path d="M396 226L452 312L446 328L392 246Z" fill="${white}" ${stroke}/>` +
    `<path d="M402 212Q420 232 440 212L436 202Q420 216 406 202Z" fill="${white}" ${stroke}/>` +
    `<path d="M446 232L466 268L458 276L440 244Z" fill="${c('#e8c64a', '#5f5030')}" ${stroke}/>` +
    `<circle cx="463" cy="270" r="8" fill="${skin}" ${stroke}/>` +
    head(420, 188, 18) +
    hat(420, 172, 38, 36) +
    `<path d="M440 138Q470 112 482 152Q462 142 442 150Z" fill="${white}" ${stroke}/>`;

  return out;
}
