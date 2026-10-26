// Maths and drawings for the salty sea page. The ions and the numbers come from the sources. The bathtub in the first part is a toy with made up units.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const SEA = 35; // grams of salt in a kilogram of seawater, about 3.5 per cent

// ---------- Part 1: the bathtub ----------

export const STEPS = 60;

/** The salt of a toy sea after each step. Salt comes in at a steady rate and is taken out in proportion to how salty the sea is. At the start the sea is fresh. */
export function runTub(inflow: number, outflow: number): number[] {
  const out: number[] = [0];
  for (let i = 1; i <= STEPS; i++) {
    const s = out[i - 1];
    out.push(s + 3.5 * (inflow - (outflow * s) / SEA));
  }
  return out;
}

/** Where the toy sea settles: when what comes in matches what goes out. */
export const settles = (inflow: number, outflow: number) => (SEA * inflow) / outflow;

export function tubSvg(inflow: number, outflow: number): string {
  const run = runTub(inflow, outflow);
  const top = Math.max(60, ...run);
  const y = (v: number) => 130 - (v / top) * 110;
  const pts = run.map((v, i) => `${f1(20 + (i / STEPS) * 270)},${f1(y(v))}`);
  return `<line class="ref" x1="20" y1="${f1(y(SEA))}" x2="290" y2="${f1(y(SEA))}"/><text class="lab" x="24" y="${f1(y(SEA) - 5)}">today, 35</text><path class="curve" d="M${pts.join(' L')}"/><line class="axis" x1="20" y1="130" x2="290" y2="130"/><text class="lab" x="20" y="146">time</text><text class="lab" x="290" y="146" text-anchor="end">fresh at the start</text>`;
}

// ---------- Part 2: evaporating ----------

/** Grams of salt in a kilogram of water after a share of the water has gone, if no salt leaves. */
export const saltier = (share: number) => SEA / (1 - share);

export const PLACES = [
  { id: 'sea', name: 'The ocean', g: 35, note: 'About 3.5 per cent salt.' },
  { id: 'dead', name: 'The Dead Sea', g: 342, note: 'About 34 per cent, almost ten times the ocean. Sources give 33.7 or 34.2 per cent.' },
];

export function panSvg(share: number): string {
  const level = 100 * (1 - share);
  const crystals = Math.min(40, Math.round(share * 50));
  let s = `<rect class="pan" x="30" y="30" width="240" height="110" rx="10"/><rect class="water" x="34" y="${f1(138 - level)}" width="232" height="${f1(level)}" rx="6"/>`;
  for (let i = 0; i < crystals; i++) s += `<rect class="crystal" x="${f1(44 + (i * 53) % 210)}" y="${f1(124 + ((i * 7) % 12))}" width="6" height="6"/>`;
  return s;
}

// ---------- Part 3: what is in it ----------

export const IONS = [
  { name: 'Chloride', mgl: 18980 },
  { name: 'Sodium', mgl: 10556 },
  { name: 'Sulfate', mgl: 2649 },
  { name: 'Magnesium', mgl: 1262 },
  { name: 'Calcium', mgl: 400 },
  { name: 'Potassium', mgl: 380 },
];

export const TOTAL_MGL = 34483;

export const share = (mgl: number) => (mgl / TOTAL_MGL) * 100;

// ---------- Part 4: the salt on land ----------

export const LAYER_M = 166; // by some estimates, if all the salt were spread over the land

export const layerAt = (share01: number) => LAYER_M * share01;
