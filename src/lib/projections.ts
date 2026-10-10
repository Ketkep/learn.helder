// Map maths for the maps page. Used by the page at build time and by the scripts in the browser.
// Every projection takes longitude and latitude in radians and gives flat x and y (y up).
// The Earth is treated as a sphere with a radius of 6,371 km, which is close enough for a map.

export const R_KM = 6371;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export interface Projection {
  id: string;
  name: string;
  /** One line for the reader: what this map keeps and what it gives up. */
  note: string;
  fwd: (lam: number, phi: number) => [number, number];
  /** The map is cut off at this latitude (degrees), because Mercator never reaches the poles. */
  maxLat: number;
}

const mollweide = (lam: number, phi: number): [number, number] => {
  // Solve 2t + sin 2t = pi sin(phi) by Newton steps
  let t = phi;
  if (Math.abs(phi) < Math.PI / 2 - 1e-9) {
    for (let i = 0; i < 12; i++) {
      const f = 2 * t + Math.sin(2 * t) - Math.PI * Math.sin(phi);
      const d = 2 + 2 * Math.cos(2 * t);
      if (Math.abs(d) < 1e-9) break;
      t -= f / d;
    }
  }
  return [((2 * Math.sqrt(2)) / Math.PI) * lam * Math.cos(t), Math.sqrt(2) * Math.sin(t)];
};

// Equal Earth (Savric, Patterson and Jenny, 2018)
const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const equalEarth = (lam: number, phi: number): [number, number] => {
  const t = Math.asin((Math.sqrt(3) / 2) * Math.sin(phi));
  const t2 = t * t;
  const t6 = t2 * t2 * t2;
  const x = (2 * Math.sqrt(3) * lam * Math.cos(t)) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
  const y = t * (A1 + A2 * t2 + A3 * t6 + A4 * t6 * t2);
  return [x, y];
};

export const projections: Projection[] = [
  { id: 'mercator', name: 'Mercator', note: 'Keeps shapes and compass directions, but stretches sizes towards the poles.', fwd: (l, p) => [l, Math.log(Math.tan(Math.PI / 4 + p / 2))], maxLat: 80 },
  { id: 'plate', name: 'Plate carrée', note: 'Latitude and longitude as a plain grid. Shapes and sizes both go wrong.', fwd: (l, p) => [l, p], maxLat: 90 },
  { id: 'cea', name: 'Cylindrical equal-area', note: 'Keeps sizes true. Shapes are squashed near the poles and stretched near the equator.', fwd: (l, p) => [l, Math.sin(p)], maxLat: 90 },
  { id: 'sinusoidal', name: 'Sinusoidal', note: 'Keeps sizes true. Shapes lean over badly near the edges.', fwd: (l, p) => [l * Math.cos(p), p], maxLat: 90 },
  { id: 'mollweide', name: 'Mollweide', note: 'Keeps sizes true in an oval. Shapes are bent near the edges.', fwd: mollweide, maxLat: 90 },
  { id: 'equalearth', name: 'Equal Earth', note: 'Keeps sizes true, with shapes that look more natural than most equal-area maps.', fwd: equalEarth, maxLat: 90 },
];

export const getProjection = (id: string) => projections.find((p) => p.id === id) ?? projections[0];

export type LonLat = [number, number];

/** A map drawn at a fixed width: turns longitude and latitude (degrees) into SVG coordinates. */
export interface View {
  w: number;
  h: number;
  pt: (lon: number, lat: number) => [number, number];
  maxLat: number;
}

export function makeView(proj: Projection, width = 600, pad = 6): View {
  const lim = proj.maxLat;
  // The outline of the map: the two edge meridians and the two edge parallels
  const edge: [number, number][] = [];
  for (let lat = -lim; lat <= lim; lat += 5) edge.push(proj.fwd(rad(-180), rad(lat)), proj.fwd(rad(180), rad(lat)));
  for (let lon = -180; lon <= 180; lon += 5) edge.push(proj.fwd(rad(lon), rad(-lim)), proj.fwd(rad(lon), rad(lim)));
  const xs = edge.map((e) => e[0]);
  const ys = edge.map((e) => e[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = (width - 2 * pad) / (x1 - x0);
  const h = Math.round((y1 - y0) * scale + 2 * pad);
  const pt = (lon: number, lat: number): [number, number] => {
    const [x, y] = proj.fwd(rad(lon), rad(Math.max(-lim, Math.min(lim, lat))));
    return [pad + (x - x0) * scale, pad + (y1 - y) * scale];
  };
  return { w: width, h, pt, maxLat: lim };
}

const f1 = (n: number) => (Math.round(n * 10) / 10).toString();

/** SVG path data for polylines, split where a line jumps across the map (the date line). */
export function pathData(view: View, lines: LonLat[][], close = false): string {
  const parts: string[] = [];
  for (const line of lines) {
    let seg: [number, number][] = [];
    const flush = () => {
      if (seg.length > 1) parts.push(`M${seg.map((s) => `${f1(s[0])} ${f1(s[1])}`).join('L')}${close ? 'Z' : ''}`);
      seg = [];
    };
    for (const [lon, lat] of line) {
      const p = view.pt(lon, lat);
      const last = seg[seg.length - 1];
      if (last && Math.abs(p[0] - last[0]) > view.w * 0.4) flush();
      seg.push(p);
    }
    flush();
  }
  return parts.join('');
}

/** Meridians and parallels every 30 degrees. */
export function graticule(view: View): LonLat[][] {
  const lines: LonLat[][] = [];
  const lim = view.maxLat;
  for (let lon = -180; lon <= 180; lon += 30) {
    const l: LonLat[] = [];
    for (let lat = -lim; lat <= lim; lat += 5) l.push([lon, lat]);
    lines.push(l);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const l: LonLat[] = [];
    for (let lon = -180; lon <= 180; lon += 5) l.push([lon, lat]);
    lines.push(l);
  }
  return lines;
}

/** The edge of the map, as one closed shape. */
export function outline(view: View): string {
  const lim = view.maxLat;
  const ring: LonLat[] = [];
  for (let lat = -lim; lat <= lim; lat += 5) ring.push([180, lat]);
  for (let lon = 180; lon >= -180; lon -= 5) ring.push([lon, lim]);
  for (let lat = lim; lat >= -lim; lat -= 5) ring.push([-180, lat]);
  for (let lon = -180; lon <= 180; lon += 5) ring.push([lon, -lim]);
  return `M${ring.map((r) => view.pt(r[0], r[1]).map(f1).join(' ')).join('L')}Z`;
}

/** A circle on the globe: every point is the same distance (an angle in degrees) from the centre. */
export function circle(lon: number, lat: number, radius: number, steps = 36): LonLat[] {
  const [lam, phi, th] = [rad(lon), rad(lat), rad(radius)];
  const out: LonLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const b = (i / steps) * 2 * Math.PI;
    const p2 = Math.asin(Math.sin(phi) * Math.cos(th) + Math.cos(phi) * Math.sin(th) * Math.cos(b));
    const l2 = lam + Math.atan2(Math.sin(b) * Math.sin(th) * Math.cos(phi), Math.cos(th) - Math.sin(phi) * Math.sin(p2));
    out.push([deg(l2), deg(p2)]);
  }
  return out;
}

/** The angle (degrees) of a circle on the globe that covers a given area in km squared. */
export const radiusForArea = (km2: number) => deg(Math.acos(1 - km2 / (2 * Math.PI * R_KM * R_KM)));

/** Area of a shape drawn on the map (in SVG units squared), by the shoelace sum. */
export function mapArea(view: View, ring: LonLat[]): number {
  const p = ring.map(([lon, lat]) => view.pt(lon, lat));
  let s = 0;
  for (let i = 0; i < p.length - 1; i++) s += p[i][0] * p[i + 1][1] - p[i + 1][0] * p[i][1];
  return Math.abs(s) / 2;
}

/** How much bigger a circle at this latitude looks than the same circle on the equator. */
export function sizeFactor(proj: Projection, lat: number, radius = 4): number {
  const view = makeView(proj, 600);
  return mapArea(view, circle(0, lat, radius, 72)) / mapArea(view, circle(0, 0, radius, 72));
}

// ---- Routes ----
export interface City {
  name: string;
  lat: number;
  lon: number;
}

export const cities: City[] = [
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'Reykjavik', lat: 64.15, lon: -21.94 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'Nairobi', lat: -1.29, lon: 36.82 },
  { name: 'Cape Town', lat: -33.92, lon: 18.42 },
  { name: 'Santiago', lat: -33.45, lon: -70.67 },
];

const vec = (lon: number, lat: number): [number, number, number] => [Math.cos(rad(lat)) * Math.cos(rad(lon)), Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat))];

/** Great circle distance in km (haversine). */
export function greatCircleKm(a: City, b: City): number {
  const [p1, p2] = [rad(a.lat), rad(b.lat)];
  const dl = rad(b.lon - a.lon);
  const h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Points along the shortest route. */
export function greatCircle(a: City, b: City, n = 64): LonLat[] {
  const [u, v] = [vec(a.lon, a.lat), vec(b.lon, b.lat)];
  const dot = Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1] + u[2] * v[2]));
  const om = Math.acos(dot);
  const out: LonLat[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const [k1, k2] = om < 1e-9 ? [1 - t, t] : [Math.sin((1 - t) * om) / Math.sin(om), Math.sin(t * om) / Math.sin(om)];
    const p = [k1 * u[0] + k2 * v[0], k1 * u[1] + k2 * v[1], k1 * u[2] + k2 * v[2]];
    out.push([deg(Math.atan2(p[1], p[0])), deg(Math.atan2(p[2], Math.hypot(p[0], p[1])))]);
  }
  return out;
}

const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));
const unmerc = (y: number) => deg(2 * Math.atan(Math.exp(y)) - Math.PI / 2);
/** Longitude difference taken the short way round, in degrees. */
const dlon = (a: number, b: number) => ((((b - a + 180) % 360) + 360) % 360) - 180;

/** The constant compass bearing route: a straight line on a Mercator map. */
export function rhumb(a: City, b: City, n = 64): LonLat[] {
  const dl = dlon(a.lon, b.lon);
  const [y1, y2] = [merc(a.lat), merc(b.lat)];
  const out: LonLat[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // Keep the longitude between -180 and 180 so the line wraps round the map instead of leaving it
    out.push([((((a.lon + dl * t + 180) % 360) + 360) % 360) - 180, unmerc(y1 + (y2 - y1) * t)]);
  }
  return out;
}

/** Length in km of the constant compass bearing route. */
export function rhumbKm(a: City, b: City): number {
  const [p1, p2] = [rad(a.lat), rad(b.lat)];
  const dphi = p2 - p1;
  const dpsi = merc(b.lat) - merc(a.lat);
  const q = Math.abs(dpsi) > 1e-12 ? dphi / dpsi : Math.cos(p1);
  return R_KM * Math.hypot(dphi, q * rad(dlon(a.lon, b.lon)));
}

/** Compass bearing at the start of the shortest route and of the constant bearing route, in degrees. */
export function bearings(a: City, b: City): { start: number; rhumb: number } {
  const [p1, p2] = [rad(a.lat), rad(b.lat)];
  const dl = rad(b.lon - a.lon);
  const start = Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl));
  const r = Math.atan2(rad(dlon(a.lon, b.lon)), merc(b.lat) - merc(a.lat));
  return { start: (deg(start) + 360) % 360, rhumb: (deg(r) + 360) % 360 };
}

// ---- The globe ----
/** A view of the globe from space, centred on a point: orthographic. Returns null on the far side. */
export function globePoint(lon: number, lat: number, lon0: number, lat0: number, r: number, cx: number, cy: number): [number, number] | null {
  const [l, p, l0, p0] = [rad(lon), rad(lat), rad(lon0), rad(lat0)];
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
  if (cosc < 0) return null;
  const x = Math.cos(p) * Math.sin(l - l0);
  const y = Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0);
  return [cx + r * x, cy - r * y];
}

/** Path data for lines on the globe. A line is broken where it goes round the back. */
export function globePath(lines: LonLat[][], lon0: number, lat0: number, r = 100, cx = 110, cy = 110, close = false): string {
  const parts: string[] = [];
  for (const line of lines) {
    let seg: [number, number][] = [];
    const flush = () => {
      if (seg.length > 1) parts.push(`M${seg.map((s) => `${f1(s[0])} ${f1(s[1])}`).join('L')}${close && seg.length === line.length ? 'Z' : ''}`);
      seg = [];
    };
    for (const [lon, lat] of line) {
      const p = globePoint(lon, lat, lon0, lat0, r, cx, cy);
      if (p) seg.push(p);
      else flush();
    }
    flush();
  }
  return parts.join('');
}

/** The grid of the globe: meridians and parallels every 30 degrees, sampled finely. */
export function globeGrid(): LonLat[][] {
  const lines: LonLat[][] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const l: LonLat[] = [];
    for (let lat = -90; lat <= 90; lat += 4) l.push([lon, lat]);
    lines.push(l);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const l: LonLat[] = [];
    for (let lon = -180; lon <= 180; lon += 4) l.push([lon, lat]);
    lines.push(l);
  }
  return lines;
}

/** The point halfway along the shortest route, for turning the globe towards a route. */
export function midpoint(a: City, b: City): LonLat {
  const g = greatCircle(a, b, 2);
  return g[1];
}
