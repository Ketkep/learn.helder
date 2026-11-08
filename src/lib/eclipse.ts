// Maths and drawings for the eclipse page. The Moon is about 400 times smaller than the Sun and about 400 times nearer, so they look
// about the same size in the sky. The sizes and distances come from the sources. The length of the shadow follows from similar triangles.
// The limit of about 1.5 degrees in the last tool is a rough value worked out for this page and is not from a source. The same text is
// made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const SUN_KM = 1391400;
export const MOON_KM = 3474.8;
export const EARTH_KM = 12742;

export const MOON_NEAR = 363104;
export const MOON_FAR = 405696;
export const SUN_NEAR = 147.5e6;
export const SUN_FAR = 152.6e6;

/** Angular size in degrees of a ball of a given width at a given distance. */
export const angular = (width: number, dist: number) => (2 * Math.atan(width / 2 / dist) * 180) / Math.PI;

/** The same in minutes of arc. */
export const arcmin = (width: number, dist: number) => angular(width, dist) * 60;

/** Length in kilometres of the Moon's full shadow, from the Moon's size and the Sun's distance. */
export const umbra = (sunDist: number) => ((MOON_KM / 2) * sunDist) / (SUN_KM / 2 - MOON_KM / 2);

export function kind(moonDist: number, sunDist: number): 'total' | 'annular' {
  return angular(MOON_KM, moonDist) >= angular(SUN_KM, sunDist) ? 'total' : 'annular';
}

/** The Sun and the Moon one over the other, as they look in the sky, magnified. */
export function discsSvg(moonDist: number, sunDist: number): string {
  const k = 108; // pixels per degree
  const sun = (angular(SUN_KM, sunDist) / 2) * k;
  const moon = (angular(MOON_KM, moonDist) / 2) * k;
  let o = `<rect class="sky" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<circle class="sun" cx="150" cy="90" r="${f1(sun)}"/>`;
  o += `<circle class="moon" cx="150" cy="90" r="${f1(moon)}"/>`;
  o += `<text class="lab" x="12" y="20">${kind(moonDist, sunDist) === 'total' ? 'The Moon covers the Sun: total' : 'A ring of Sun is left: annular'}</text>`;
  o += `<text class="lab small" x="12" y="162">Sun ${fmt(arcmin(SUN_KM, sunDist), 1)} arcminutes, Moon ${fmt(arcmin(MOON_KM, moonDist), 1)} arcminutes</text>`;
  return o;
}

/** The shadow of the Moon pointing at the Earth, from the side. The Moon and the Earth are drawn much too big. */
export function shadowSvg(moonDist: number, sunDist: number): string {
  const L = umbra(sunDist);
  const k = 190 / MOON_FAR; // pixels per kilometre along the line
  const mx = 30;
  const ex = mx + moonDist * k;
  const apex = mx + L * k;
  let o = `<rect class="sky" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<circle class="moon" cx="${mx}" cy="86" r="10"/>`;
  o += `<path class="cone" d="M${mx} 76 L${f1(apex)} 86 L${mx} 96 Z"/>`;
  o += `<circle class="earth" cx="${f1(ex)}" cy="86" r="16"/>`;
  o += `<text class="lab" x="12" y="20">${apex >= ex ? 'The shadow reaches the Earth' : 'The shadow stops short of the Earth'}</text>`;
  o += `<text class="lab small" x="12" y="150">Shadow ${fmt(L)} km long, Moon ${fmt(moonDist)} km away</text>`;
  o += `<text class="lab small" x="12" y="162">The Moon and the Earth are drawn much too big</text>`;
  return o;
}

// ---------- Why not every month ----------

export const TILT = 5.14; // degrees, just over 5
export const LIMIT = 1.5; // degrees, a rough limit made up for this page

/** How far the Moon is above or below the line from the Earth to the Sun at new moon. Zero is at a node. */
export const height = (fromNode: number) => TILT * Math.sin((fromNode * Math.PI) / 180);

/** The share of all new moons for which the Moon is within the limit. */
export const share = (2 / Math.PI) * Math.asin(LIMIT / TILT);

export function tiltSvg(fromNode: number): string {
  const gx = (a: number) => 20 + (a / 360) * 262;
  const gy = (h: number) => 85 - (h / TILT) * 55;
  let d = '';
  for (let a = 0; a <= 360; a += 4) d += `${a ? 'L' : 'M'}${f1(gx(a))} ${f1(gy(height(a)))} `;
  const hot = Math.abs(height(fromNode)) <= LIMIT;
  let o = `<rect class="sky" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<rect class="band" x="20" y="${f1(gy(LIMIT))}" width="262" height="${f1(gy(-LIMIT) - gy(LIMIT))}"/>`;
  o += `<line class="axis" x1="20" y1="${gy(0)}" x2="282" y2="${gy(0)}"/>`;
  o += `<path class="curve" d="${d}"/>`;
  o += `<circle class="${hot ? 'dot hot' : 'dot'}" cx="${f1(gx(fromNode))}" cy="${f1(gy(height(fromNode)))}" r="6"/>`;
  o += `<text class="lab" x="12" y="18">Height of the Moon at new moon</text>`;
  o += `<text class="lab small" x="12" y="150">The pale band is where the Moon can cross the Sun</text>`;
  o += `<text class="lab small" x="12" y="164">Distance round the orbit from a node, 0 to 360 degrees</text>`;
  return o;
}
