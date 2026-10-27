// Maths and drawings for the muscle page. The filament lengths come from the sources (frog muscle, in micrometres).
// The drawings are a toy copy: a real muscle has hundreds of heads on each thick filament. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const THICK = 1.6; // micrometres, a thick (myosin) filament
export const REACH = 1.025; // how far a thin (actin) filament reaches from its Z disc: half of the 2.05 given for the pair
export const BARE = 0.2; // the bare middle of a thick filament, with no heads
export const REST = 2.2; // a resting sarcomere

// ---------- Part 1: the length of a sarcomere ----------

const PER_SIDE = 7; // drawn heads on each half of a thick filament (a toy count)
const S = 66; // pixels for each micrometre
const X0 = 20;

/** Centres of the drawn heads along the thick filament, for a sarcomere of length L. */
function headCentres(L: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < PER_SIDE; i++) {
    out.push(L / 2 - THICK / 2 + 0.05 + 0.1 * i);
    out.push(L / 2 + BARE / 2 + 0.05 + 0.1 * i);
  }
  return out;
}

const covered = (x: number, L: number) => x <= REACH || x >= L - REACH;

/** How many of the drawn heads sit on a thin filament. */
export const headsInReach = (L: number) => headCentres(L).filter((x) => covered(x, L)).length;
export const HEADS = PER_SIDE * 2;

export function sarcomereSvg(L: number): string {
  const px = (um: number) => X0 + um * S;
  let s = '';
  // thin filaments from each Z disc, two rows
  for (const y of [38, 82]) {
    s += `<line class="thin" x1="${f1(px(0))}" y1="${y}" x2="${f1(px(REACH))}" y2="${y}"/><line class="thin" x1="${f1(px(L))}" y1="${y}" x2="${f1(px(L - REACH))}" y2="${y}"/>`;
  }
  // thick filament and its heads
  s += `<rect class="thick" x="${f1(px(L / 2 - THICK / 2))}" y="54" width="${f1(THICK * S)}" height="12" rx="4"/>`;
  for (const x of headCentres(L)) {
    const on = covered(x, L) ? ' on' : '';
    s += `<line class="head${on}" x1="${f1(px(x))}" y1="${on ? 40 : 46}" x2="${f1(px(x))}" y2="54"/><line class="head${on}" x1="${f1(px(x))}" y1="${on ? 80 : 74}" x2="${f1(px(x))}" y2="66"/>`;
  }
  s += `<line class="zdisc" x1="${f1(px(0))}" y1="22" x2="${f1(px(0))}" y2="98"/><line class="zdisc" x1="${f1(px(L))}" y1="22" x2="${f1(px(L))}" y2="98"/>`;
  s += `<text class="lab" x="${f1(px(0))}" y="116">Z disc</text><text class="lab" x="${f1(px(L))}" y="116" text-anchor="end">Z disc</text>`;
  return s;
}

// ---------- Part 2: one cycle of a head ----------

export const STEP_NM = 11; // one laser trap study found steps of about 11 nm. Others found 5 to 20 nm.

export const CYCLE = [
  { name: 'Ready', text: 'The head is cocked, holds the leftovers of the last ATP and is not yet on the thin filament.' },
  { name: 'Attach', text: 'The head binds to the thin filament.' },
  { name: 'Power stroke', text: 'The head lets go of the phosphate and swings, pulling the thin filament toward the middle of the sarcomere.' },
  { name: 'Release', text: 'A new ATP binds and the head lets go. Without ATP it stays stuck.' },
];

const PULL = 62; // pixels the thin filament moves in one stroke (not to scale: the real step is about 11 nm)

/** The x of the bead nearest the head's reach when the thin filament has moved `shift` pixels. */
const nearest = (shift: number) => 18 + 24 * Math.round((186 - 18 + shift) / 24) - shift;

/** The drawing of one head on a thin filament that has been pulled `strokes` times. State is 0 to 3. */
export function cycleSvg(state: number, strokes: number): string {
  const shift = PULL * strokes;
  let s = '<rect class="thick" x="40" y="136" width="220" height="14" rx="5"/><line class="thin" x1="10" y1="60" x2="290" y2="60"/>';
  for (let k = -8; k < 24; k++) {
    const x = 18 + 24 * k - shift;
    if (x > 12 && x < 288) s += `<circle class="bead" cx="${f1(x)}" cy="60" r="4"/>`;
  }
  const baseX = 150;
  const attached = state === 1 || state === 2;
  const before = nearest(PULL * Math.max(0, strokes - (state >= 2 ? 1 : 0)));
  const tip = state === 0 ? [nearest(shift), 92] : state === 1 ? [before, 65] : state === 2 ? [before - PULL, 65] : [before - PULL, 94];
  const lean = state === 2 || state === 3 ? -8 : 8;
  s += `<path class="arm${attached ? ' on' : ''}" d="M${baseX} 136 Q${f1((baseX + tip[0]) / 2 + lean)} ${f1((136 + tip[1]) / 2)} ${f1(tip[0])} ${tip[1]}"/><circle class="knob2${attached ? ' on' : ''}" cx="${f1(tip[0])}" cy="${tip[1]}" r="6"/>`;
  s += `<text class="lab" x="12" y="30">thin filament, pulled left</text><text class="lab" x="40" y="168">thick filament</text>`;
  return s;
}

/** Strokes one head would need to take a sarcomere of the resting length down by a share. Each half shortens by half of the change. */
export const strokesNeeded = (share: number, stepNm = STEP_NM) => Math.round((REST * 1000 * share * 0.5) / stepNm);

// ---------- Part 3: many sarcomeres in a row ----------

/** Sarcomeres in a row along a length in centimetres, at the resting length. */
export const countIn = (cm: number) => Math.round((cm * 10000) / REST);

export function chainSvg(share: number): string {
  const n = 6;
  const w = 270 / n;
  const len = w * (1 - share);
  const x0 = 15 + (270 - n * len) / 2;
  let s = '';
  for (let i = 0; i <= n; i++) {
    const x = x0 + i * len;
    s += `<line class="zdisc" x1="${f1(x)}" y1="36" x2="${f1(x)}" y2="84"/>`;
    if (i < n) s += `<rect class="thick" x="${f1(x + len * 0.28)}" y="54" width="${f1(len * 0.44)}" height="12" rx="4"/><line class="thin" x1="${f1(x)}" y1="44" x2="${f1(x + len * 0.42)}" y2="44"/><line class="thin" x1="${f1(x + len)}" y1="76" x2="${f1(x + len * 0.58)}" y2="76"/>`;
  }
  s += `<text class="lab" x="150" y="112" text-anchor="middle">six of thousands, end to end</text>`;
  return s;
}

// ---------- Part 4: the two switches ----------

export const STATES = [
  { id: 'go', name: 'Signal on, ATP present', text: 'The signal has made calcium available, so the binding sites on the thin filament are open. Heads bind, pull and let go again, and the muscle shortens.' },
  { id: 'rest', name: 'Signal off, ATP present', text: 'Without calcium the binding sites are covered. The heads cannot grab, and the muscle is relaxed.' },
  { id: 'rigor', name: 'Signal on, no ATP', text: 'The heads grab, but letting go needs a new ATP. They stay stuck on the thin filament, and the muscle is stiff. This is what happens in rigor mortis.' },
];

export function switchSvg(state: number): string {
  let s = '<rect class="thick" x="30" y="132" width="240" height="14" rx="5"/><line class="thin" x1="20" y1="60" x2="280" y2="60"/>';
  for (let i = 0; i < 5; i++) {
    const x = 60 + i * 48;
    s += `<circle class="site${state === 1 ? ' shut' : ''}" cx="${x}" cy="60" r="7"/>`;
    if (state === 1) s += `<rect class="cap" x="${x - 9}" y="48" width="18" height="8" rx="3"/>`;
    const up = state === 1 || (state === 0 && i % 2 === 1);
    const tipX = state === 2 ? x - 14 : x;
    const tipY = up ? 100 : 66;
    s += `<path class="arm${up ? '' : ' on'}" d="M${x} 132 Q${x + (up ? 0 : -6)} ${(132 + tipY) / 2} ${tipX} ${tipY}"/><circle class="knob2${up ? '' : ' on'}" cx="${tipX}" cy="${tipY}" r="5"/>`;
  }
  s += `<text class="lab" x="20" y="24">thin filament with its binding sites</text><text class="lab" x="30" y="166">thick filament</text>`;
  return s;
}
