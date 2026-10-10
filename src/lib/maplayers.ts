// What each panel of the maps page draws, as SVG path data. The page uses it at build time for the first picture
// and the scripts use it again every time the reader picks another projection or moves something.

import {
  type City,
  type LonLat,
  circle,
  getProjection,
  globeGrid,
  globePath,
  graticule,
  greatCircle,
  makeView,
  mapArea,
  midpoint,
  outline,
  pathData,
  radiusForArea,
  rhumb,
} from './projections';

export interface Layers {
  w: number;
  h: number;
  flat: { outline: string; grid: string; a: string; b: string; c: string };
  globe: { grid: string; a: string; b: string; c: string };
}

const GRID = globeGrid();

function make(projId: string, focus: LonLat, a: LonLat[][], b: LonLat[][], c: LonLat[][]): Layers {
  const view = makeView(getProjection(projId), 600);
  const [lon0, lat0] = focus;
  return {
    w: view.w,
    h: view.h,
    flat: { outline: outline(view), grid: pathData(view, graticule(view)), a: pathData(view, a, true), b: pathData(view, b, true), c: pathData(view, c, true) },
    globe: { grid: globePath(GRID, lon0, lat0), a: globePath(a, lon0, lat0, 100, 110, 110, true), b: globePath(b, lon0, lat0, 100, 110, 110, true), c: globePath(c, lon0, lat0, 100, 110, 110, true) },
  };
}

/** Panel 1: the same small circle at 30 places. */
export const CIRCLE_RADIUS = 5;
export function circlesLayers(projId: string): Layers {
  const rings: LonLat[][] = [];
  for (const lat of [-60, -30, 0, 30, 60]) for (const lon of [-150, -90, -30, 30, 90, 150]) rings.push(circle(lon, lat, CIRCLE_RADIUS));
  return make(projId, [0, 25], rings, [], []);
}

/** Panel 2: a patch as big as Africa and a patch as big as Greenland that you can slide north. */
export const AFRICA_KM2 = 30370000;
export const GREENLAND_KM2 = 2166086;
const [AFRICA_R, GREENLAND_R] = [radiusForArea(AFRICA_KM2), radiusForArea(GREENLAND_KM2)];
const AFRICA_AT: LonLat = [20, 5];
const GREENLAND_LON = -42;

export function sizeLayers(projId: string, lat: number): Layers {
  const africa = circle(AFRICA_AT[0], AFRICA_AT[1], AFRICA_R, 72);
  const greenland = circle(GREENLAND_LON, lat, GREENLAND_R, 48);
  return make(projId, [-12, 24 + lat * 0.25], [africa], [greenland], []);
}

/** How big the Greenland patch looks next to the Africa patch on this map, as a share (0.07 is the true one). */
export function apparentShare(projId: string, lat: number): number {
  const view = makeView(getProjection(projId), 600);
  return mapArea(view, circle(GREENLAND_LON, lat, GREENLAND_R, 96)) / mapArea(view, circle(AFRICA_AT[0], AFRICA_AT[1], AFRICA_R, 96));
}

/** Panel 3: the shortest route and the constant bearing route between two cities. */
export function routeLayers(projId: string, from: City, to: City): Layers {
  const mid = midpoint(from, to);
  const marks = [circle(from.lon, from.lat, 2.2, 16), circle(to.lon, to.lat, 2.2, 16)];
  const layers = make(projId, [mid[0], Math.max(-55, Math.min(55, mid[1]))], [], [], marks);
  const view = makeView(getProjection(projId), 600);
  const gc = greatCircle(from, to);
  const rh = rhumb(from, to);
  layers.flat.a = pathData(view, [gc]);
  layers.flat.b = pathData(view, [rh]);
  layers.globe.a = globePath([gc], mid[0], Math.max(-55, Math.min(55, mid[1])));
  layers.globe.b = globePath([rh], mid[0], Math.max(-55, Math.min(55, mid[1])));
  return layers;
}
