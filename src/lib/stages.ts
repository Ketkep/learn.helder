// Maths and drawings for the rocket stages page. The exhaust speeds come from engine figures in the sources, and the speed needed for orbit
// is the one the sources give. The share of a rocket that is structure and the payload share are made up for the page.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

const G0 = 9.80665; // metres a second squared, to turn a specific impulse in seconds into an exhaust speed

export const ENGINES = [
  { id: 'kero', name: 'Kerosene and oxygen', isp: 348, example: 'Merlin Vacuum' },
  { id: 'hydro', name: 'Hydrogen and oxygen', isp: 452.3, example: 'RS-25' },
];

/** Exhaust speed in kilometres a second, for a specific impulse in seconds. */
export const exhaust = (isp: number) => (isp * G0) / 1000;

export const NEED = 9.4; // kilometres a second to reach low orbit, losses included, by most of the sources
export const ORBIT = 7.8; // sideways speed in low orbit

/** The rocket equation: the change in speed is the exhaust speed times the natural log of launch mass over final mass. */
export const deltaV = (ve: number, ratio: number) => ve * Math.log(ratio);

// ---------- Part 1: fuel and speed ----------

/** Change in speed if this share of the launch mass is propellant and the rest is thrown away at the end, with no structure. */
export const fromFuel = (ve: number, share: number) => deltaV(ve, 1 / (1 - share));

/** The share of the launch mass that must be propellant to reach a change in speed. */
export const fuelNeeded = (ve: number, dv: number) => 1 - Math.exp(-dv / ve);

const X0 = 34;
const X1 = 290;
const Y0 = 14;
const Y1 = 140;

export function fuelSvg(ve: number, share: number): string {
  const top = 14;
  const x = (p: number) => X0 + p * (X1 - X0);
  const y = (v: number) => Y1 - (Math.min(v, top) / top) * (Y1 - Y0);
  const pts: string[] = [];
  for (let p = 0; p <= 0.995; p += 0.005) pts.push(`${f1(x(p))},${f1(y(fromFuel(ve, p)))}`);
  let s = `<line class="axis" x1="${X0}" y1="${Y1}" x2="${X1}" y2="${Y1}"/><line class="axis" x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}"/>`;
  s += `<line class="need" x1="${X0}" y1="${f1(y(NEED))}" x2="${X1}" y2="${f1(y(NEED))}"/><text class="lab" x="${X1}" y="${f1(y(NEED) - 4)}" text-anchor="end">needed for orbit, ${NEED} km/s</text>`;
  s += `<path class="curve" d="M${pts.join(' L')}"/>`;
  s += `<circle class="now" cx="${f1(x(share))}" cy="${f1(y(fromFuel(ve, share)))}" r="5"/>`;
  s += `<text class="lab" x="${X0}" y="${Y1 + 14}">0%</text><text class="lab" x="${X1}" y="${Y1 + 14}" text-anchor="end">100% fuel</text><text class="lab" x="6" y="10">km/s</text>`;
  return s;
}

// ---------- Part 2: one stage ----------

/** The best change in speed of one stage, with a share of its launch mass as structure and a share as payload. */
export const oneStage = (ve: number, structure: number, payload: number) => deltaV(ve, 1 / (structure + payload));

// ---------- Part 3: stages ----------

/** The change in speed of each stage, when n stages each have the same structure share and the same step in mass, for a payload share overall. */
export function stageGains(ve: number, n: number, structure: number, payload: number): number[] {
  const k = Math.pow(payload, -1 / n); // each stage is this many times as heavy as the one it carries
  return Array.from({ length: n }, () => deltaV(ve, 1 / (structure + 1 / k)));
}

export const total = (g: number[]) => g.reduce((a, b) => a + b, 0);

export function stagesSvg(gains: number[]): string {
  const top = 16;
  const w = (v: number) => (v / top) * 250;
  let x = 24;
  let s = '';
  gains.forEach((g, i) => {
    s += `<rect class="seg s${i % 4}" x="${f1(x)}" y="40" width="${f1(w(g))}" height="38" rx="3"/><text class="lab on" x="${f1(x + w(g) / 2)}" y="63" text-anchor="middle">${i + 1}</text>`;
    x += w(g);
  });
  const nx = 24 + w(NEED);
  s += `<line class="need" x1="${f1(nx)}" y1="22" x2="${f1(nx)}" y2="96"/><text class="lab" x="${f1(nx)}" y="16" text-anchor="middle">${NEED} km/s</text>`;
  s += `<text class="lab" x="24" y="112">total ${fmt(total(gains), 1)} km/s</text>`;
  return s;
}
