// Maths and drawings for the lungs page. The gas law and the breathing numbers are standard. The size of the model lung is made up.
// The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Jar 1: the syringe ----------

export const START_ML = 50;

/** Boyle's law: at the same temperature, pressure times volume stays the same. The start is 1.00 at 50 millilitres. */
export const pressureAt = (ml: number) => START_ML / ml;

const dots = (() => {
  const r = seeded(7);
  return Array.from({ length: 28 }, () => ({ u: r(), v: r() }));
})();

/** A syringe with the plunger at a volume. The same 28 dots of gas are squeezed or spread out. */
export function syringeSvg(ml: number): string {
  const x0 = 30;
  const w = ml * 2.4;
  const x1 = x0 + w;
  let s = `<rect class="barrel" x="${x0}" y="50" width="${f1(w)}" height="60" rx="3"/>`;
  dots.forEach((d) => (s += `<circle class="gas" cx="${f1(x0 + 6 + d.u * (w - 12))}" cy="${f1(56 + d.v * 48)}" r="2.6"/>`));
  s += `<rect class="plunger" x="${f1(x1)}" y="44" width="8" height="72" rx="2"/><line class="rod" x1="${f1(x1 + 8)}" y1="80" x2="292" y2="80"/><path class="nozzle" d="M${x0},72 L10,78 L10,82 L${x0},88"/>`;
  return s;
}

export function syringeText(ml: number): string {
  const p = pressureAt(ml);
  const change = ml === START_ML ? 'The gas is at the starting pressure of 1.00.' : ml > START_ML ? `The gas has more room, so it is thinner and its pressure drops to ${p.toFixed(2)}, below the outside pressure of 1.00. Air would flow in.` : `The gas is squeezed, so it is denser and its pressure rises to ${p.toFixed(2)}, above the outside pressure of 1.00. Air would flow out.`;
  return `${ml} millilitres. 1.00 × 50 = ${p.toFixed(2)} × ${ml}. ${change}`;
}

// ---------- Jar 2: the chest ----------

/** A made up model lung of 2.5 litres at rest. Pulling the sheet down adds up to 0.5 litres, the size of a resting breath. */
export const REST_L = 2.5;
export const BREATH_L = 0.5;

export const addedL = (pull: number) => (pull / 100) * BREATH_L;

/** If the airway were blocked, the pressure inside would fall. */
export const sealedPressure = (pull: number) => REST_L / (REST_L + addedL(pull));

export function jarSvg(pull: number): string {
  const add = addedL(pull);
  const r = 26 + (add / BREATH_L) * 9; // the balloon grows
  const sheet = 150 + (pull / 100) * 16; // the rubber sheet is pulled down
  return `<path class="jar" d="M90,30 H210 Q216,30 216,36 V${f1(sheet - 4)} H84 V36 Q84,30 90,30 Z"/><path class="tube" d="M150,10 V62"/><circle class="lung" cx="150" cy="98" r="${f1(r)}"/><path class="sheet" d="M80,${f1(sheet)} Q150,${f1(sheet + 14)} 220,${f1(sheet)}"/><line class="knob-rod" x1="150" y1="${f1(sheet + 10)}" x2="150" y2="${f1(sheet + 24)}"/>`;
}

export function jarText(pull: number, open: boolean): string {
  const add = addedL(pull);
  if (!pull) return 'At rest. The sheet is up and the balloon holds 2.5 litres of air at the outside pressure.';
  if (open) return `The sheet is pulled down and the space grows by ${add.toFixed(2)} litres. The tube is open, so ${add.toFixed(2)} litres of air flows in at once and the pressure stays almost the same as outside. This is breathing in.`;
  return `The sheet is pulled down and the space grows by ${add.toFixed(2)} litres. The tube is blocked, so no air can come in and the pressure falls to ${sealedPressure(pull).toFixed(2)} of the outside pressure. Open the tube and the air rushes in.`;
}

// ---------- Jar 3: breaths and litres ----------

export const perMinute = (rate: number, litres: number) => rate * litres;
export const perDay = (rate: number, litres: number) => rate * litres * 60 * 24;

// ---------- Jar 4: air in, air out ----------

export const AIR = {
  inhaled: { name: 'Air breathed in', oxygen: 21, carbon: 0.04, nitrogen: 78 },
  exhaled: { name: 'Air breathed out', oxygen: 16, carbon: 4, nitrogen: 78 },
};

export type Which = keyof typeof AIR;

export const pctText = (n: number) => (n < 1 ? n.toFixed(2) : String(n)) + '%';
