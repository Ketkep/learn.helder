// Maths and drawings for the mountains page. The densities, the crust thickness and the rates come from the sources.
// The drawings are toys: real mountains are not sine waves. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

const STRATA = ['#c9a066', '#a8744b', '#7e8f6a', '#8a8fa6', '#b9855a'];

// ---------- Part 1: squeezing layers ----------

/** A slab that is squeezed sideways to this share of its width must get this many times thicker, if its volume stays the same. */
export const thickerBy = (shorten: number) => 1 / (1 - shorten);

/** Five layers squeezed from the side. The folds are a drawing, not a model. */
export function foldSvg(shorten: number, label = true): string {
  const w = 260 * (1 - shorten);
  const x0 = 20 + (260 - w) / 2;
  const amp = 70 * shorten;
  const thick = 14 * (1 + shorten * 1.2);
  const curve = (k: number, x: number) => 150 - k * thick - amp * (1 - 0.1 * k) * Math.sin(((x - x0) / w) * Math.PI * 4);
  let s = '';
  for (let k = 0; k < 5; k++) {
    const xs: number[] = [];
    for (let i = 0; i <= 40; i++) xs.push(x0 + (w * i) / 40);
    const top = xs.map((x) => `${f1(x)},${f1(curve(k + 1, x))}`);
    const bottom = xs.map((x) => `${f1(x)},${f1(curve(k, x))}`).reverse();
    s += `<polygon fill="${STRATA[k]}" stroke="#241f1a" stroke-width="1.5" points="${top.join(' ')} ${bottom.join(' ')}"/>`;
  }
  if (label) s += `<text class="lab" x="${f1(x0)}" y="182">${fmt((1 - shorten) * 100)}% of the width</text>`;
  return s;
}

// ---------- Part 2: floating roots ----------

export const CRUST_KM = 35; // normal continental crust, about 35 to 40 km by different sources
export const RHO_CRUST = 2.7; // g per cubic centimetre
export const RHO_MANTLE = 3.3;

/** The root under a mountain of height h in kilometres, if it floats like an iceberg (Airy): h times crust density over the difference of the densities. */
export const rootOf = (h: number) => (h * RHO_CRUST) / (RHO_MANTLE - RHO_CRUST);

export function floatSvg(h: number): string {
  const k = 1.7;
  const y0 = 48;
  const r = rootOf(h);
  const top = y0 - h * k;
  const flat = y0 + CRUST_KM * k;
  const deep = y0 + (CRUST_KM + r) * k;
  let s = `<rect class="mantle" x="2" y="${f1(flat - 6)}" width="296" height="${f1(206 - flat + 6)}"/>`;
  s += `<polygon class="crust" points="20,${y0} 90,${y0} 115,${f1(top)} 195,${f1(top)} 220,${y0} 280,${y0} 280,${f1(flat)} 215,${f1(flat)} 195,${f1(deep)} 115,${f1(deep)} 95,${f1(flat)} 20,${f1(flat)}"/>`;
  s += `<line class="sea" x1="2" y1="${y0}" x2="298" y2="${y0}"/><text class="lab" x="6" y="${y0 - 5}">sea level</text><text class="lab" x="24" y="${f1(flat - 5)}">${CRUST_KM} km thick</text><text class="lab on-dark" x="6" y="200">mantle</text>`;
  if (h > 0.3) s += `<text class="lab" x="155" y="${f1((top + deep) / 2 + 4)}" text-anchor="middle">${fmt(h, 1)} km up, ${fmt(r, 1)} km root</text>`;
  return s;
}

// ---------- Part 3: a race ----------

export const KM_PER_MYR_AT_1CM = 10; // a plate at 1 cm a year moves 10 km in a million years
export const MAX_T = 5; // million years drawn

/** Net rise in kilometres after t million years. One millimetre a year for a million years is one kilometre. */
export const rise = (uplift: number, erosion: number, t: number) => Math.max(0, (uplift - erosion) * t);

export function raceSvg(uplift: number, erosion: number, t: number): string {
  const x = (m: number) => 28 + (m / MAX_T) * 256;
  const top = 12;
  const y = (km: number) => 150 - (Math.min(km, top) / top) * 130;
  let s = `<line class="axis" x1="28" y1="150" x2="284" y2="150"/><line class="axis" x1="28" y1="20" x2="28" y2="150"/>`;
  s += `<line class="ref" x1="28" y1="${f1(y(8.849))}" x2="284" y2="${f1(y(8.849))}"/><text class="lab" x="32" y="${f1(y(8.849) - 4)}">Everest today, 8.85 km</text>`;
  s += `<line class="plain" x1="${f1(x(0))}" y1="${f1(y(0))}" x2="${f1(x(MAX_T))}" y2="${f1(y(uplift * MAX_T))}"/>`;
  s += `<line class="net" x1="${f1(x(0))}" y1="${f1(y(0))}" x2="${f1(x(MAX_T))}" y2="${f1(y(rise(uplift, erosion, MAX_T)))}"/>`;
  s += `<circle class="now" cx="${f1(x(t))}" cy="${f1(y(rise(uplift, erosion, t)))}" r="5"/>`;
  s += `<text class="lab" x="28" y="168">0</text><text class="lab" x="284" y="168" text-anchor="end">${MAX_T} million years</text><text class="lab" x="156" y="168" text-anchor="middle">time</text>`;
  s += `<text class="lab" x="24" y="${f1(y(0) + 4)}" text-anchor="end">0</text><text class="lab" x="24" y="${f1(y(top) + 8)}" text-anchor="end">${top} km</text>`;
  return s;
}

// ---------- Part 4: three kinds ----------

export const KINDS = [
  { id: 'fold', name: 'Fold mountains', example: 'the Alps', how: 'Two plates push together and the layers between them buckle and pile up.' },
  { id: 'fault', name: 'Fault-block mountains', example: 'the Sierra Nevada', how: 'Big blocks of crust are lifted or tilted along cracks called faults.' },
  { id: 'volcano', name: 'Volcanic mountains', example: 'Mount Fuji', how: 'Melted rock reaches the surface and builds a cone, layer on layer.' },
];

export function kindSvg(kind: number): string {
  let s = '';
  if (kind === 0) {
    s += `<g transform="translate(0,-10)">${foldSvg(0.35, false)}</g>`;
  } else if (kind === 1) {
    s += `<polygon fill="${STRATA[0]}" stroke="#241f1a" stroke-width="1.5" points="20,150 20,120 100,120 100,150"/><polygon fill="${STRATA[1]}" stroke="#241f1a" stroke-width="1.5" points="100,150 100,120 200,50 280,50 280,150"/>`;
    s += `<line class="faultline" x1="100" y1="120" x2="100" y2="150"/><line class="faultline" x1="100" y1="120" x2="200" y2="50"/><text class="lab" x="34" y="140">block drops</text><text class="lab" x="206" y="42">block rises</text>`;
  } else {
    s += `<polygon fill="${STRATA[3]}" stroke="#241f1a" stroke-width="1.5" points="20,150 110,150 150,60 190,60 230,150 280,150 280,170 20,170"/><polygon fill="${STRATA[4]}" stroke="#241f1a" stroke-width="1.5" points="150,60 170,50 190,60"/><rect fill="#b3392b" x="161" y="62" width="18" height="100"/><text class="lab" x="40" y="164">magma rises</text>`;
  }
  return s;
}
