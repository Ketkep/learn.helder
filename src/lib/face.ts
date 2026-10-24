// Maths and drawings for the Moon's face page. The periods and the distance come from the sources. The spin-down steps are a toy with made up time steps.
// The same text is made at build time (Astro) and in the browser.

export const ORBIT_DAYS = 27.32;
export const DIST_KM = 384400;
export const RECEDE_CM = 3.8;

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const rad = (d: number) => (d * Math.PI) / 180;

// ---------- Stage 1: spinning or not ----------

export type Mode = 'none' | 'locked' | 'double';

export const MODE_TEXT: Record<Mode, string> = {
  none: 'The Moon does not spin. It keeps pointing the same way among the stars, so as it goes round, the marked side faces Earth only once per orbit and every other side takes its turn.',
  locked: 'The Moon spins once for every trip round Earth. The two turns cancel, so the marked side always faces Earth. This is what the real Moon does.',
  double: 'The Moon spins twice for every trip round Earth. Different sides keep turning towards Earth.',
};

/** The direction the marked side points, in degrees, for an orbit angle in degrees. The Moon is at that angle seen from Earth. */
export function faceDirection(mode: Mode, orbit: number): number {
  if (mode === 'none') return 0;
  if (mode === 'locked') return orbit + 180; // towards Earth
  return 2 * orbit + 180;
}

/** Where the marked side points compared with Earth. */
export function facing(mode: Mode, orbit: number): 'towards Earth' | 'away from Earth' | 'sideways' {
  const toEarth = orbit + 180;
  let d = (((faceDirection(mode, orbit) - toEarth) % 360) + 540) % 360 - 180;
  d = Math.abs(d);
  return d < 35 ? 'towards Earth' : d > 145 ? 'away from Earth' : 'sideways';
}

export function viewSvg(mode: Mode, orbit: number): string {
  const cx = 150;
  const cy = 100;
  const R = 72;
  const mx = cx + R * Math.cos(rad(orbit));
  const my = cy - R * Math.sin(rad(orbit));
  const fd = faceDirection(mode, orbit);
  const px = mx + 14 * Math.cos(rad(fd));
  const py = my - 14 * Math.sin(rad(fd));
  return `<circle class="path" cx="${cx}" cy="${cy}" r="${R}"/><circle class="earth" cx="${cx}" cy="${cy}" r="16"/><line class="sight" x1="${cx}" y1="${cy}" x2="${f1(mx)}" y2="${f1(my)}"/><circle class="moon" cx="${f1(mx)}" cy="${f1(my)}" r="14"/><circle class="face" cx="${f1(px)}" cy="${f1(py)}" r="4.5"/>`;
}

// ---------- Stage 2: how tides lock it ----------

/** The made up start: the Moon spins once in 10 hours, which is 2.4 turns a day. */
export const START_TURNS_PER_DAY = 2.4;
export const ORBIT_TURNS_PER_DAY = 1 / ORBIT_DAYS;

/** The spin in turns a day after a number of toy steps. Each step the gap to the orbit rate shrinks by 40 per cent. */
export const spinAfter = (steps: number) => ORBIT_TURNS_PER_DAY + (START_TURNS_PER_DAY - ORBIT_TURNS_PER_DAY) * 0.6 ** steps;

export const periodDays = (steps: number) => 1 / spinAfter(steps);

export function periodText(days: number): string {
  return days < 2 ? `${fmt(days * 24, 1)} hours` : `${fmt(days, 2)} days`;
}

/** The Earth's pull on a bulge that is ahead of the line to Earth, drawn as a Moon seen from above. */
export function bulgeSvg(steps: number): string {
  const lag = Math.min(60, (spinAfter(steps) - ORBIT_TURNS_PER_DAY) * 40); // degrees the bulge is turned away from the line to Earth
  return `<circle class="earth" cx="60" cy="100" r="18"/><ellipse class="bulge" cx="190" cy="100" rx="38" ry="24" transform="rotate(${f1(-lag)} 190 100)"/><circle class="moon" cx="190" cy="100" r="22"/><line class="sight" x1="78" y1="100" x2="300" y2="100"/>`;
}

// ---------- Stage 3: moving away ----------

/** Distance in kilometres after a number of million years if the Moon kept moving away at 3.8 cm a year. It does not, so this is a rough picture. */
export const distanceAfter = (millionYears: number) => DIST_KM + RECEDE_CM * 1e-5 * millionYears * 1e6;

/** Kepler: the period grows as the distance to the power 1.5. */
export const orbitAfter = (millionYears: number) => ORBIT_DAYS * (distanceAfter(millionYears) / DIST_KM) ** 1.5;

// ---------- Stage 4: other worlds ----------

export const WORLDS = [
  { id: 'moon', name: 'The Moon', text: 'Locked to Earth, 1 turn for 1 orbit. Over time librations let us see about 59 per cent of its surface.' },
  { id: 'charon', name: 'Pluto and Charon', text: 'Each is locked to the other, so they always show each other the same face. This happens when the two are close in mass and not far apart.' },
  { id: 'mercury', name: 'Mercury', text: 'Mercury turns 3 times for every 2 orbits of the Sun. Some sources call this tidal locking and others keep the name for 1 to 1 only.' },
] as const;
