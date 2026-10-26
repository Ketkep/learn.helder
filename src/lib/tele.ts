// Maths and drawings for the telescope page. The formulas are standard. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Station 1: two lenses ----------

/** The magnification is the focal length of the big lens divided by the focal length of the eyepiece. */
export const magnification = (objectiveMm: number, eyepieceMm: number) => objectiveMm / eyepieceMm;

/** The Moon is about half a degree wide. Through the telescope it looks that many times wider. */
export const MOON_DEG = 0.5;
export const moonThrough = (m: number) => MOON_DEG * m;

/** Two lenses on a line, with three beams of light from a far star crossing at the focus. The drawing is not to scale. */
export function lensesSvg(objectiveMm: number, eyepieceMm: number): string {
  const x0 = 40;
  const objX = x0;
  const focus = x0 + 40 + (objectiveMm / 1500) * 160;
  const eyeX = focus + 14 + (eyepieceMm / 40) * 30;
  const end = Math.min(eyeX + 70, 290);
  let s = `<line class="axis" x1="10" y1="80" x2="292" y2="80"/>`;
  [-24, 0, 24].forEach((h) => {
    const y = 80 + h;
    const yAt = 80 - (h * (eyeX - focus)) / (focus - objX);
    s += `<path class="ray" d="M10,${y} L${f1(objX)},${y} L${f1(focus)},80 L${f1(eyeX)},${f1(yAt)} L${f1(end)},${f1(yAt)}"/>`;
  });
  s += `<ellipse class="lens" cx="${f1(objX)}" cy="80" rx="6" ry="40"/><ellipse class="lens small" cx="${f1(eyeX)}" cy="80" rx="4" ry="22"/><circle class="focus" cx="${f1(focus)}" cy="80" r="3.5"/>`;
  s += `<text class="lab" x="${f1(objX)}" y="134" text-anchor="middle">big lens</text><text class="lab" x="${f1(eyeX)}" y="116" text-anchor="middle">eyepiece</text>`;
  return s;
}

// ---------- Station 2: the light bucket ----------

export const EYE_MM = 5; // a dark adapted eye, as the source gives it

/** How many times more light than the eye the opening gathers: the square of the ratio of the widths. */
export const lightTimes = (apertureMm: number) => (apertureMm / EYE_MM) ** 2;

/** Circles whose areas are in the right proportion, with the eye as a small circle. */
export function bucketSvg(apertureMm: number): string {
  const rEye = 4;
  const rTele = Math.min(70, rEye * (apertureMm / EYE_MM));
  return `<circle class="eye" cx="60" cy="100" r="${rEye}"/><text class="lab" x="60" y="124" text-anchor="middle">eye</text><circle class="mirror" cx="190" cy="100" r="${f1(rTele)}"/><text class="lab" x="190" y="${f1(100 + rTele + 18)}" text-anchor="middle">opening</text>`;
}

export const SCOPES = [
  { id: 'small', name: 'A 50 mm telescope', mm: 50 },
  { id: 'back', name: 'A 150 mm garden telescope', mm: 150 },
  { id: 'hubble', name: 'Hubble, 2,400 mm', mm: 2400 },
  { id: 'webb', name: 'Webb, 6,500 mm', mm: 6500 },
];

// ---------- Station 3: the sharpest it can see ----------

/** The smallest angle a round opening can separate, in arcseconds, from the Rayleigh limit 1.22 times the wavelength over the width. */
export function rayleighArcsec(apertureMm: number, wavelengthNm = 550): number {
  const rad = (1.22 * wavelengthNm * 1e-9) / (apertureMm / 1000);
  return (rad * 180 * 3600) / Math.PI;
}

export const MOON_ARCSEC = MOON_DEG * 3600;

export function sharpSvg(apertureMm: number): string {
  const a = rayleighArcsec(apertureMm);
  // Two dots whose gap is the limit in this picture (magnified so the largest limit fits).
  const gap = Math.min(80, Math.max(2, (a / 6) * 60));
  const cx = 150;
  return `<circle class="star" cx="${f1(cx - gap / 2)}" cy="90" r="9"/><circle class="star" cx="${f1(cx + gap / 2)}" cy="90" r="9"/><line class="gapline" x1="${f1(cx - gap / 2)}" y1="122" x2="${f1(cx + gap / 2)}" y2="122"/><text class="lab" x="150" y="144" text-anchor="middle">the smallest gap it can show</text>`;
}

// ---------- Station 4: the history ----------

export const STEPS = [
  { name: 'Lippershey, 1608', text: 'On 2 October 1608 Hans Lippershey, a spectacle maker in Middelburg in the Netherlands, asked the States General in The Hague for a patent on a looker, a kijker, with about three times magnification. The patent was refused, because the idea was too easy to copy and others made claims too.', size: '3 times' },
  { name: 'Galileo, 1609 to 1610', text: 'Galileo heard of the Dutch looker and built his own. One of his first had 8 to 10 times magnification, and he improved it to about 20 times. In January 1610 he saw four moons going round Jupiter, and he published what he saw in Sidereus Nuncius in March 1610.', size: '8 to 20 times' },
  { name: 'Newton, 1668', text: 'Isaac Newton finished the first working reflecting telescope in late 1668. A curved mirror takes the place of the big lens, which avoids the coloured fringes of a lens. His mirror was about two inches wide.', size: 'a 2 inch mirror' },
  { name: 'Hubble, 1990', text: 'The Hubble Space Telescope was launched on 24 April 1990. Its mirror is 2.4 metres wide. It sits above the air, which blurs the light from the stars.', size: '2.4 m mirror' },
  { name: 'Webb', text: 'The James Webb Space Telescope has a main mirror 6.5 metres wide, made of 18 hexagonal segments that work as one mirror. NASA says it is more than six times bigger in area than Hubble’s main mirror.', size: '6.5 m mirror' },
];
