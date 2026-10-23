// Maths and drawings for the river page. The shapes of the curves follow the sources. The numbers on the made up river and the made up curves are toys, and the page says so.
// The same text is made at build time (Astro) and in the browser.

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const f1 = (n: number) => n.toFixed(1);

// ---------- Station 1: the long profile ----------

export const RIVER = { heightM: 1000, lengthKm: 500 }; // a made up river

/** Height above the sea in metres at a share of the way from the source to the sea. A smooth concave curve, steep at first and flat at the end. */
export const height = (x: number) => RIVER.heightM * (1 - x) ** 2.4;

/** Slope in metres of fall per kilometre. */
export const slope = (x: number) => (RIVER.heightM * 2.4 * (1 - x) ** 1.4) / RIVER.lengthKm;

export type Course = 'upper' | 'middle' | 'lower';
export const courseOf = (x: number): Course => (x < 1 / 3 ? 'upper' : x < 2 / 3 ? 'middle' : 'lower');

export const COURSE_TEXT: Record<Course, string> = {
  upper: 'The upper course is steep. The river cuts downwards and carries large stones.',
  middle: 'The middle course is gentler. The river cuts sideways, carries finer material and begins to meander.',
  lower: 'The lower course is nearly level. The river is slow and wide and mostly drops what it carries. Deltas, levees and oxbow lakes belong here.',
};

/** The profile as a path in a 300 by 140 box, with a marker at x. */
export function profileSvg(x: number): string {
  const pts = Array.from({ length: 51 }, (_, i) => {
    const t = i / 50;
    return `${f1(10 + t * 280)},${f1(120 - (height(t) / RIVER.heightM) * 100)}`;
  });
  const mx = 10 + x * 280;
  const my = 120 - (height(x) / RIVER.heightM) * 100;
  return `<path class="land" d="M10,126 L${pts.join(' L')} L290,126 Z"/><path class="line" d="M${pts.join(' L')}"/><circle class="mark" cx="${f1(mx)}" cy="${f1(my)}" r="7"/><line class="sea" x1="10" y1="120" x2="290" y2="120"/>`;
}

// ---------- Station 2: grains and speed ----------

/** Grain size in millimetres from the slider, 0 to 100, on a log scale from 0.001 mm to 100 mm. */
export const sizeFromSlider = (i: number) => 10 ** (-3 + (5 * i) / 100);

/** A made up curve with the shape of the Hjulstrom curve: sand is easiest to lift, and clay and gravel need more speed. Centimetres per second. */
export const liftSpeed = (mm: number) => (mm >= 0.3 ? 30 * (mm / 0.3) ** 0.4 : 30 * (0.3 / mm) ** 0.35);

/** A made up speed below which a grain of this size settles out. The smaller the grain, the lower the speed. */
export const settleSpeed = (mm: number) => 3 * mm ** 0.5;

export type Zone = 'lifted' | 'carried' | 'dropped';
export const zoneOf = (mm: number, cmPerS: number): Zone => (cmPerS >= liftSpeed(mm) ? 'lifted' : cmPerS > settleSpeed(mm) ? 'carried' : 'dropped');

export const ZONE_TEXT: Record<Zone, string> = {
  lifted: 'The water is fast enough to pick these grains up from the bed, so the river erodes.',
  carried: 'The water cannot lift these grains from the bed, but it is fast enough to keep moving grains it already holds. They are carried.',
  dropped: 'The water is too slow to hold these grains. They settle on the bed.',
};

export function grainName(mm: number): string {
  if (mm < 0.004) return 'clay';
  if (mm < 0.0625) return 'silt';
  if (mm < 2) return 'sand';
  if (mm < 64) return 'gravel';
  return 'cobbles';
}

/** The three zones drawn on a log by log chart, 300 by 160, with the chosen grain and speed as a dot. */
export function chartSvg(mm: number, v: number): string {
  const X = (m: number) => 14 + ((Math.log10(m) + 3) / 5) * 272;
  const Y = (s: number) => 142 - ((Math.log10(Math.max(s, 0.1)) + 1) / 4) * 126;
  const sizes = Array.from({ length: 51 }, (_, i) => 10 ** (-3 + (5 * i) / 50));
  const lift = sizes.map((m) => `${f1(X(m))},${f1(Y(liftSpeed(m)))}`);
  const settle = sizes.map((m) => `${f1(X(m))},${f1(Y(settleSpeed(m)))}`);
  return `<path class="zone-lift" d="M${lift.join(' L')} L${f1(X(100))},14 L${f1(X(0.001))},14 Z"/><path class="zone-drop" d="M${settle.join(' L')} L${f1(X(100))},146 L${f1(X(0.001))},146 Z"/><path class="curve" d="M${lift.join(' L')}"/><path class="curve" d="M${settle.join(' L')}"/><text class="lab" x="150" y="30" text-anchor="middle">eroded</text><text class="lab" x="150" y="86" text-anchor="middle">carried</text><text class="lab" x="200" y="136" text-anchor="middle">dropped</text><circle class="mark" cx="${f1(X(mm))}" cy="${f1(Y(v))}" r="7"/>`;
}

// ---------- Station 3: the meander ----------

/** Length of the channel divided by the length of the valley. */
export function sinuosity(amp: number, wave = 100): number {
  let len = 0;
  const n = 400;
  let px = 0;
  let py = 0;
  for (let i = 1; i <= n; i++) {
    const x = (i / n) * wave * 3;
    const y = amp * Math.sin((2 * Math.PI * x) / wave);
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len / (wave * 3);
}

export function sinuosityClass(si: number): string {
  if (si < 1.05) return 'almost straight';
  if (si < 1.25) return 'winding';
  if (si < 1.5) return 'twisty';
  return 'meandering';
}

/** The river as a thick line across the valley, with the outer bank of each bend marked. */
export function meanderSvg(amp: number): string {
  const wave = 100;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * 300;
    const y = 70 + amp * Math.sin((2 * Math.PI * (x - 0)) / wave);
    pts.push(`${f1(x)},${f1(y)}`);
  }
  let marks = '';
  if (amp > 4) {
    for (const x of [25, 75, 125, 175, 225, 275]) {
      const sgn = Math.sin((2 * Math.PI * x) / wave) > 0 ? 1 : -1;
      const y = 70 + amp * sgn;
      marks += `<line class="outer" x1="${x}" y1="${f1(y + sgn * 9)}" x2="${x}" y2="${f1(y + sgn * 19)}"/>`;
    }
  }
  return `<line class="valley" x1="0" y1="70" x2="300" y2="70"/><path class="river" d="M${pts.join(' L')}"/>${marks}`;
}

// ---------- Station 4: the delta ----------

export type Shape = 'river' | 'waves' | 'tides';

export function shapeOf(river: number, waves: number, tides: number): Shape {
  const top = Math.max(river, waves, tides);
  return river === top ? 'river' : waves === top ? 'waves' : 'tides';
}

export const SHAPE_TEXT: Record<Shape, string> = {
  river: 'The river wins. Its mud builds long fingers out to sea, like a bird’s foot. The Mississippi is the usual example, and the Po and the Danube are often put in this group.',
  waves: 'The waves win. They push the mud back into a smooth curved front, like a fan. The Rhône and the São Francisco are put in this group. Sources also call the Nile a curved fan.',
  tides: 'The tides win. They stretch the mud into long islands along the flow of the tide, with a wide open mouth. The Ganges and Brahmaputra, the Fly and the Colorado are put in this group.',
};

export function deltaSvg(shape: Shape): string {
  const sea = '<rect class="sea" x="1" y="1" width="298" height="138" rx="8"/>';
  const chan = '<path class="chan" d="M150,0 V40"/>';
  if (shape === 'river') {
    return `${sea}<path class="land" d="M0,0 H300 V28 Q250,30 230,40 L246,86 L218,48 L190,40 L196,112 L178,52 L150,40 L134,100 L124,50 L100,40 L84,80 L74,44 L40,34 L0,28 Z"/>${chan}<path class="chan" d="M150,40 L196,112 M150,40 L134,100 M150,40 L84,80 M150,40 L246,86"/>`;
  }
  if (shape === 'waves') {
    return `${sea}<path class="land" d="M0,0 H300 V52 Q290,70 250,84 Q200,102 150,106 Q100,102 50,84 Q10,70 0,52 Z"/>${chan}<path class="chan" d="M150,40 V100 M150,40 L215,82 M150,40 L85,82"/>`;
  }
  return `${sea}<path class="land" d="M0,0 H300 V36 L270,60 L292,96 L240,70 L232,118 L210,64 L168,94 L150,62 L132,94 L90,64 L68,118 L60,70 L8,96 L30,60 L0,36 Z"/>${chan}<path class="chan" d="M150,40 V94 M150,40 L232,118 M150,40 L68,118"/>`;
}
