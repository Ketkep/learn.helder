// Maths and drawings for the compass page. The dipole formulas are standard. The strength of the magnet in the last table is made up.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
const rad = (d: number) => (d * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Stop 1: the field ----------

/** How steeply the field of a simple bar magnet Earth dips at a latitude: tan(dip) = 2 tan(latitude). Positive is downwards. */
export const dipAt = (lat: number) => (Math.abs(lat) >= 90 ? (lat > 0 ? 90 : -90) : deg(Math.atan(2 * Math.tan(rad(lat)))));

/** The strength of the horizontal pull on a compass needle compared with the equator: the cosine of the latitude. */
export const pullAt = (lat: number) => Math.cos(rad(lat));

/** The Earth in the page with a few field lines and a needle at a latitude (on the right side). */
export function fieldSvg(lat: number): string {
  const cx = 150;
  const cy = 100;
  const R = 34;
  let s = `<circle class="earth" cx="${cx}" cy="${cy}" r="${R}"/>`;
  [1.7, 2.4, 3.3].forEach((L) => {
    for (const side of [1, -1]) {
      const pts: string[] = [];
      for (let t = -88; t <= 88; t += 4) {
        const r = L * Math.cos(rad(t)) ** 2;
        if (r < 1) continue;
        pts.push(`${f1(cx + side * R * r * Math.cos(rad(t)))},${f1(cy - R * r * Math.sin(rad(t)))}`);
      }
      if (pts.length > 1) s += `<path class="line" d="M${pts.join(' L')}"/>`;
    }
  });
  const px = cx + R * Math.cos(rad(lat));
  const py = cy - R * Math.sin(rad(lat));
  const I = rad(dipAt(lat));
  // North along the surface is (-sin lat, cos lat) in the picture, and up is (cos lat, sin lat). The field points north and down.
  const dx = Math.cos(I) * -Math.sin(rad(lat)) - Math.sin(I) * Math.cos(rad(lat));
  const dy = Math.cos(I) * Math.cos(rad(lat)) - Math.sin(I) * Math.sin(rad(lat));
  s += `<line class="needle" x1="${f1(px - dx * 16)}" y1="${f1(py + dy * 16)}" x2="${f1(px + dx * 16)}" y2="${f1(py - dy * 16)}"/><circle class="pivot" cx="${f1(px)}" cy="${f1(py)}" r="4"/>`;
  s += `<text class="lab" x="${cx}" y="${cy - R - 8}" text-anchor="middle">N</text><text class="lab" x="${cx}" y="${cy + R + 16}" text-anchor="middle">S</text>`;
  return s;
}

// ---------- Stop 2: two norths ----------

/** How far to the side you end up after walking a distance with a compass that is wrong by the declination. */
export const missKm = (declination: number, km: number) => km * Math.tan(rad(Math.abs(declination)));

export function norths(decl: number): string {
  const x = 150 + 70 * Math.sin(rad(decl));
  const y = 120 - 70 * Math.cos(rad(decl));
  return `<circle class="dial" cx="150" cy="120" r="76"/><line class="true" x1="150" y1="120" x2="150" y2="44"/><text class="lab" x="150" y="36" text-anchor="middle">true north</text><line class="mag" x1="150" y1="120" x2="${f1(x)}" y2="${f1(y)}"/><circle class="tip" cx="${f1(x)}" cy="${f1(y)}" r="5"/>`;
}

// ---------- Stop 3: the wandering pole ----------

export const RATES = [
  { id: 'y2000', name: 'Around the year 2000', kmPerYear: 10 },
  { id: 'avg', name: 'The average of the 20 years before 2020', kmPerYear: 55 },
  { id: 'wmm', name: 'The forecast in 2020', kmPerYear: 40 },
];

// ---------- Stop 4: the magnet near the needle ----------

/** A made up magnet whose pull on the needle equals the pull of the Earth at 20 centimetres. A magnet's field falls with the cube of the distance. */
export const magnetPull = (cm: number) => (20 / cm) ** 3;

/** How far the needle is turned, in degrees, by a magnet to the east of it. */
export const turnBy = (cm: number) => deg(Math.atan(magnetPull(cm)));

export function needleSvg(cm: number): string {
  const t = rad(turnBy(cm));
  const x = 150 + 56 * Math.sin(t);
  const y = 100 - 56 * Math.cos(t);
  const mx = 216 + cm * 0.6;
  return `<circle class="dial" cx="150" cy="100" r="62"/><text class="lab" x="150" y="30" text-anchor="middle">N</text><line class="needle" x1="${f1(300 - x)}" y1="${f1(200 - y)}" x2="${f1(x)}" y2="${f1(y)}"/><circle class="pivot" cx="150" cy="100" r="4"/><rect class="magnet" x="${f1(mx)}" y="90" width="26" height="20" rx="3"/><text class="lab" x="${f1(mx + 13)}" y="84" text-anchor="middle">magnet</text>`;
}
