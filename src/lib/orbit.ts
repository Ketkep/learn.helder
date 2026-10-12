// Orbit maths for the cannon page. Used by the page at build time and by the scripts in the browser.
// A cannon on a mountain fires sideways over a round planet with no air. Distances are in km and speeds in km per second.

export interface Planet {
  id: string;
  name: string;
  /** Radius in km. */
  r: number;
  /** Gravitational parameter (G times the mass) in km cubed per second squared. */
  gm: number;
}

export const planets: Planet[] = [
  { id: 'earth', name: 'Earth', r: 6371, gm: 398600 },
  { id: 'moon', name: 'The Moon', r: 1737.4, gm: 4902.8 },
  { id: 'mars', name: 'Mars', r: 3389.5, gm: 42828 },
  { id: 'jupiter', name: 'Jupiter', r: 69911, gm: 126686534 },
];

export const getPlanet = (id: string) => planets.find((p) => p.id === id) ?? planets[0];

/** Speed of a circular orbit at a distance from the centre. */
export const circularSpeed = (p: Planet, r: number) => Math.sqrt(p.gm / r);
/** Speed that just escapes at a distance from the centre. */
export const escapeSpeed = (p: Planet, r: number) => Math.sqrt((2 * p.gm) / r);
/** Time for one lap of a circular orbit, in seconds. */
export const period = (p: Planet, r: number) => (2 * Math.PI * r) / circularSpeed(p, r);

export type Outcome = 'falls' | 'orbit' | 'escape';

export interface Shot {
  outcome: Outcome;
  /** Points of the path, in km, with the planet's centre at (0, 0) and the cannon at (0, r0), firing to the right. */
  path: [number, number][];
  /** How far along the ground the ball lands (km), for a shot that falls. */
  range?: number;
  /** Closest and farthest distance from the centre for an orbit, in km. */
  perigee?: number;
  apogee?: number;
  /** Time for one lap of the orbit, in seconds. */
  lap?: number;
  /** Seconds in the air for a shot that falls. */
  flight?: number;
}

/** Fire a ball sideways from a height (km above the ground) at a speed (km/s). */
export function fire(p: Planet, height: number, speed: number): Shot {
  const r0 = p.r + height;
  const vc = circularSpeed(p, r0);
  const ve = escapeSpeed(p, r0);
  const k = (speed * speed) / (vc * vc);
  const outcome: Outcome = speed >= ve - 1e-9 ? 'escape' : speed >= vc - 1e-9 ? 'orbit' : (r0 * k) / (2 - k) < p.r ? 'falls' : 'orbit';
  // Step the motion with a small time step (velocity Verlet)
  const dt = period(p, r0) / 3000;
  let [x, y, vx, vy] = [0, r0, speed, 0];
  const acc = (px: number, py: number): [number, number] => {
    const d = Math.hypot(px, py);
    const a = -p.gm / (d * d * d);
    return [a * px, a * py];
  };
  let [ax, ay] = acc(x, y);
  const path: [number, number][] = [[x, y]];
  let t = 0;
  let angle = 0;
  const shot: Shot = { outcome, path };
  let apo = r0;
  let peri = r0;
  const limit = outcome === 'orbit' ? 1.02 * orbitLap(p, r0, speed) : Infinity;
  for (let i = 0; i < 40000; i++) {
    x += vx * dt + 0.5 * ax * dt * dt;
    y += vy * dt + 0.5 * ay * dt * dt;
    const [nx, ny] = acc(x, y);
    vx += 0.5 * (ax + nx) * dt;
    vy += 0.5 * (ay + ny) * dt;
    [ax, ay] = [nx, ny];
    t += dt;
    const d = Math.hypot(x, y);
    apo = Math.max(apo, d);
    peri = Math.min(peri, d);
    if (i % 6 === 0) path.push([x, y]);
    if (outcome === 'falls' && d < p.r) {
      path.push([x, y]);
      angle = Math.atan2(x, y);
      shot.range = angle * p.r;
      shot.flight = t;
      break;
    }
    if (outcome === 'escape' && d > 6 * p.r) break;
    if (outcome === 'orbit' && t > limit) break;
  }
  if (outcome === 'orbit') {
    shot.perigee = peri;
    shot.apogee = apo;
    shot.lap = orbitLap(p, r0, speed);
  }
  return shot;
}

/** Time for one lap of an orbit that starts sideways at a height with a speed, from the size of the ellipse. */
function orbitLap(p: Planet, r0: number, speed: number): number {
  const energy = (speed * speed) / 2 - p.gm / r0;
  const a = -p.gm / (2 * energy);
  return 2 * Math.PI * Math.sqrt((a * a * a) / p.gm);
}

/** How far the ground drops away over a sideways distance (km), in metres: the planet curves away from a straight line. */
export const curveDrop = (p: Planet, distanceKm: number) => (p.r * (1 - Math.cos(distanceKm / p.r))) * 1000;

/** How far a falling thing drops in some seconds, in metres, with the pull at the ground. */
export const fallDrop = (p: Planet, seconds: number) => 0.5 * ((p.gm / (p.r * p.r)) * 1000) * seconds * seconds;

export const surfacePull = (p: Planet) => (p.gm / (p.r * p.r)) * 1000;

export function fmtTime(s: number): string {
  if (s < 90) return `${Math.round(s)} seconds`;
  if (s < 7200) return `${Math.round(s / 60)} minutes`;
  if (s < 172800) return `${(s / 3600).toFixed(1)} hours`;
  return `${(s / 86400).toFixed(1)} days`;
}

/** Orbit heights to try on Earth (km above the ground). */
export const places = [
  { id: 'ground', name: 'Just above the ground', height: 0 },
  { id: 'iss', name: 'The International Space Station', height: 420 },
  { id: 'geo', name: 'A satellite that stays above one spot', height: 35786 },
  { id: 'moon', name: 'The Moon', height: 384400 - 6371 },
];

const f1 = (n: number) => Math.round(n * 10) / 10;

/** The same path in picture coordinates, for moving the ball along it. */
export function screenPath(p: Planet, height: number, shot: Shot): [number, number][] {
  const r0 = p.r + height;
  const reach = shot.apogee ?? (shot.outcome === 'escape' ? 3 * p.r : r0);
  const view = Math.min(3.2 * p.r, Math.max(1.3 * p.r, 1.12 * reach));
  const s = 138 / view;
  return shot.path.map((q) => [200 + q[0] * s, 150 - q[1] * s]);
}

/** The picture of a shot as SVG: the planet, the path, and the cannon on its mountain at the top. */
export function shotSvg(p: Planet, height: number, shot: Shot): string {
  const r0 = p.r + height;
  const reach = shot.apogee ?? (shot.outcome === 'escape' ? 3 * p.r : r0);
  const view = Math.min(3.2 * p.r, Math.max(1.3 * p.r, 1.12 * reach));
  const s = 138 / view;
  const [cx, cy] = [200, 150];
  const pt = (x: number, y: number) => `${f1(cx + x * s)} ${f1(cy - y * s)}`;
  const line = shot.path.map((q, i) => `${i === 0 ? 'M' : 'L'}${pt(q[0], q[1])}`).join('');
  const end = shot.path[shot.path.length - 1];
  return (
    `<circle class="planet" cx="${cx}" cy="${cy}" r="${f1(p.r * s)}"/>` +
    `<path class="trail ${shot.outcome}" d="${line}"/>` +
    `<circle class="cannon" cx="${f1(cx)}" cy="${f1(cy - r0 * s)}" r="5"/>` +
    (shot.outcome === 'falls' ? `<circle class="hit" cx="${f1(cx + end[0] * s)}" cy="${f1(cy - end[1] * s)}" r="4"/>` : '') +
    `<text class="mark" x="${f1(cx + 10)}" y="${f1(cy - r0 * s - 8)}">cannon</text>`
  );
}
