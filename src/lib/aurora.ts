// Maths and drawings for the aurora page. The latitude rule and the colours come from the sources. The altitudes of the colours
// differ between sources, and the page shows that. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Part 1: how far the oval spreads ----------

export const QUIET_EDGE = 66; // degrees of geomagnetic latitude at Kp 0, by NOAA
export const PER_KP = 2; // degrees the edge moves toward the equator for each step of Kp

/** The edge of the auroral oval nearest the equator, in degrees of geomagnetic latitude, from the Kp index. An average, not a promise. */
export const edgeLatitude = (kp: number) => QUIET_EDGE - PER_KP * kp;

/** A view of the Earth from above the north pole, with the oval as a ring and the edge at the latitude for this Kp. */
export function ovalSvg(kp: number): string {
  const cx = 150;
  const cy = 90;
  const R = 82; // the equator, at 0 degrees of latitude
  const r = (lat: number) => ((90 - lat) / 90) * R;
  let s = `<circle class="globe" cx="${cx}" cy="${cy}" r="${R}"/>`;
  for (const lat of [60, 30]) s += `<circle class="ring" cx="${cx}" cy="${cy}" r="${f1(r(lat))}"/><text class="lab" x="${cx + 3}" y="${f1(cy - r(lat) - 2)}">${lat}</text>`;
  const outer = r(edgeLatitude(kp));
  const inner = r(Math.min(edgeLatitude(kp) + 8, 88));
  s += `<circle class="oval" cx="${cx}" cy="${cy}" r="${f1((outer + inner) / 2)}" stroke-width="${f1(Math.max(outer - inner, 3))}"/>`;
  s += `<circle class="pole" cx="${cx}" cy="${cy}" r="3"/><text class="lab" x="${cx + 6}" y="${cy + 3}">north magnetic pole</text>`;
  return s;
}

// ---------- Part 2: colour by height ----------

export interface Band {
  id: string;
  name: string;
  from: number; // kilometres
  to: number;
  sure: boolean; // do the sources agree on this range
  colour: string;
  text: string;
}

export const BANDS: Band[] = [
  { id: 'n', name: 'Blue and purple edge', from: 60, to: 100, sure: true, colour: '#7d6bd6', text: 'Below about 100 km, where the air is thicker, molecular nitrogen gives blue and purple fringes. One source says so.' },
  { id: 'g', name: 'Green', from: 100, to: 150, sure: true, colour: '#4fd68a', text: 'From about 100 to 150 km, atomic oxygen gives the green light of 557.7 nanometres, the most common colour. One source stretches it up to 300 km.' },
  { id: 'gr', name: 'Green or red', from: 150, to: 300, sure: false, colour: '#c8a85a', text: 'Between about 150 and 300 km the sources differ. One keeps green up to 300 km. Another has red starting at 200 km.' },
  { id: 'r', name: 'Red', from: 300, to: 400, sure: true, colour: '#e0564e', text: 'Above about 300 km, atomic oxygen gives a faint red light of 630 nanometres. Sources put its start at 200 or 300 km.' },
];

export const bandAt = (km: number): Band => BANDS.find((b) => km >= b.from && km < b.to) ?? BANDS[BANDS.length - 1];

export function columnSvg(km: number): string {
  const y = (h: number) => 150 - ((h - 60) / 340) * 130;
  let s = '';
  BANDS.forEach((b) => {
    s += `<rect class="band${b.sure ? '' : ' unsure'}" x="60" y="${f1(y(b.to))}" width="90" height="${f1(y(b.from) - y(b.to))}" fill="${b.colour}"/><text class="lab" x="158" y="${f1((y(b.from) + y(b.to)) / 2 + 3)}">${b.name}</text>`;
  });
  for (const h of [100, 200, 300, 400]) s += `<line class="tick" x1="52" y1="${f1(y(h))}" x2="60" y2="${f1(y(h))}"/><text class="lab" x="48" y="${f1(y(h) + 3)}" text-anchor="end">${h}</text>`;
  s += `<text class="lab" x="48" y="${f1(y(60) + 3)}" text-anchor="end">60</text><text class="lab" x="8" y="14">km</text>`;
  s += `<line class="here" x1="54" y1="${f1(y(km))}" x2="156" y2="${f1(y(km))}"/><circle class="now" cx="105" cy="${f1(y(km))}" r="5"/>`;
  return s;
}

// ---------- Part 3: the light of an atom ----------

export const HC = 1239.84; // electronvolt nanometres: the energy of a photon is this divided by its wavelength in nanometres
export const LIGHT_SPEED = 299792.458; // nanometres times terahertz

/** Photon energy in electronvolts, for a wavelength in nanometres. */
export const energyEv = (nm: number) => HC / nm;

/** Frequency in terahertz. */
export const terahertz = (nm: number) => LIGHT_SPEED / nm;

export const LINES = [
  { name: 'Oxygen, green', nm: 557.7 },
  { name: 'Oxygen, red', nm: 630 },
];

/** A screen colour for a wavelength of visible light, from 380 to 700 nm. A rough drawing, not a colour standard. */
export function colourOf(nm: number): string {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else r = 1;
  const k = nm < 420 ? 0.4 + (0.6 * (nm - 380)) / 40 : nm > 700 ? 0.4 : nm > 645 ? 0.4 + (0.6 * (700 - nm)) / 55 : 1;
  const c = (v: number) => Math.round(255 * Math.pow(Math.max(0, v) * k, 0.8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}

export function spectrumSvg(nm: number): string {
  let s = '';
  const w = 260 / 32;
  for (let i = 0; i < 32; i++) {
    const n = 380 + (i / 31) * 320;
    s += `<rect x="${f1(20 + i * w)}" y="40" width="${f1(w + 0.5)}" height="40" fill="${colourOf(n)}"/>`;
  }
  const x = 20 + ((nm - 380) / 320) * 260;
  s += `<line class="here" x1="${f1(x)}" y1="30" x2="${f1(x)}" y2="90"/><text class="lab" x="20" y="108">380 nm, violet</text><text class="lab" x="280" y="108" text-anchor="end">700 nm, red</text><text class="lab" x="${f1(x)}" y="24" text-anchor="middle">${fmt(nm, nm % 1 ? 1 : 0)} nm</text>`;
  return s;
}
