// Maths and drawings for the thermos page. The shape of cooling (an exponential fall toward the room temperature) comes from the sources.
// The rates in the toy flask are made up for the page. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Part 1: three ways heat travels ----------

export const WAYS = [
  { id: 'cond', name: 'Conduction', how: 'Heat passes through things that touch, such as the wall of a mug into your hand.', stop: 'A gap with nothing in it has nothing to carry heat across. A vacuum stops conduction across the gap.' },
  { id: 'conv', name: 'Convection', how: 'Heat is carried by moving air or liquid, such as warm air rising off a cup.', stop: 'A vacuum has no air to move, and a stopper keeps warm air from rising out of the top.' },
  { id: 'rad', name: 'Radiation', how: 'Hot things give off invisible heat light, called infrared, which crosses empty space.', stop: 'A vacuum does not stop it, because light crosses empty space. A shiny silvered wall reflects the heat light back.' },
];

// ---------- Part 2: build a flask ----------

export interface Feature {
  id: string;
  name: string;
  text: string;
}

export const FEATURES: Feature[] = [
  { id: 'vacuum', name: 'Vacuum between two walls', text: 'Takes the air out of the gap, so there is little conduction and no convection across it.' },
  { id: 'silver', name: 'Silvered walls', text: 'Makes the walls shiny, so they reflect heat light instead of giving it off.' },
  { id: 'stopper', name: 'Stopper in the top', text: 'Closes the opening, so warm air cannot rise out.' },
];

export interface Rates {
  cond: number; // per hour, made up
  conv: number;
  rad: number;
  total: number;
}

/** The toy loss rates, as a share of the temperature gap lost each hour. An open mug has all three. */
export function ratesFor(on: string[]): Rates {
  const vac = on.includes('vacuum');
  const sil = on.includes('silver');
  const stop = on.includes('stopper');
  const cond = 0.15 * (vac ? 0.25 : 1);
  const conv = 0.35 * (vac ? 0 : 1) * (stop ? 0.3 : 1);
  const rad = 0.1 * (sil ? 0.1 : 1);
  return { cond, conv, rad, total: cond + conv + rad };
}

/** Hours for the gap between the drink and the room to halve. */
export const halfTime = (rate: number) => Math.LN2 / rate;

export function flaskSvg(on: string[]): string {
  const r = ratesFor(on);
  const vac = on.includes('vacuum');
  const sil = on.includes('silver');
  const stop = on.includes('stopper');
  let s = `<rect class="outer" x="90" y="30" width="120" height="120" rx="14"/><rect class="gap${vac ? ' empty' : ''}" x="98" y="38" width="104" height="104" rx="10"/><rect class="drink" x="108" y="64" width="84" height="70" rx="6"/>`;
  s += `<rect class="wall${sil ? ' shiny' : ''}" x="104" y="44" width="92" height="94" rx="8" fill="none"/>`;
  if (stop) s += `<rect class="stopper" x="120" y="22" width="60" height="14" rx="4"/>`;
  const arrow = (x1: number, y1: number, x2: number, y2: number, v: number, cls: string) => {
    const w = 1.5 + v * 14;
    return `<line class="arrow ${cls}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke-width="${f1(w)}"/>`;
  };
  s += arrow(210, 100, 236, 100, r.cond, 'cond') + arrow(150, 28, 150, -2, r.conv, 'conv') + arrow(210, 70, 236, 57, r.rad, 'rad');
  s += `<text class="lab" x="240" y="104">conduction</text><text class="lab" x="240" y="61">radiation</text><text class="lab" x="158" y="12">convection</text>`;
  return s;
}

// ---------- Part 3: the cooling curve ----------

/** The temperature of the drink after some hours: the gap to the room shrinks by the same share every hour. */
export const temperature = (hours: number, start: number, room: number, rate: number) => room + (start - room) * Math.exp(-rate * hours);

/** Hours until the drink reaches a temperature between the start and the room, or null if it never does. */
export function hoursTo(target: number, start: number, room: number, rate: number): number | null {
  if ((start - room) * (target - room) <= 0) return null;
  const ratio = (start - room) / (target - room);
  if (ratio <= 1) return 0;
  return Math.log(ratio) / rate;
}

export const DESIGNS = [
  { id: 'mug', name: 'Open mug', on: [] as string[] },
  { id: 'plain', name: 'Flask with a vacuum only', on: ['vacuum'] },
  { id: 'full', name: 'Full flask', on: ['vacuum', 'silver', 'stopper'] },
];

const X0 = 34;
const X1 = 290;
const Y0 = 14;
const Y1 = 140;

export function curveSvg(start: number, room: number, hours = 12): string {
  const lo = Math.min(start, room) - 5;
  const hi = Math.max(start, room) + 5;
  const x = (h: number) => X0 + (h / hours) * (X1 - X0);
  const y = (t: number) => Y1 - ((t - lo) / (hi - lo)) * (Y1 - Y0);
  const colours = ['mugline', 'plainline', 'fullline'];
  let s = `<line class="axis" x1="${X0}" y1="${Y1}" x2="${X1}" y2="${Y1}"/><line class="axis" x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1}"/>`;
  s += `<line class="room" x1="${X0}" y1="${f1(y(room))}" x2="${X1}" y2="${f1(y(room))}"/><text class="lab" x="${X1}" y="${f1(y(room) + (start > room ? -4 : 10))}" text-anchor="end">room ${room} °C</text>`;
  DESIGNS.forEach((d, i) => {
    const k = ratesFor(d.on).total;
    const pts: string[] = [];
    for (let h = 0; h <= hours + 0.01; h += 0.25) pts.push(`${f1(x(h))},${f1(y(temperature(h, start, room, k)))}`);
    s += `<path class="curve ${colours[i]}" d="M${pts.join(' L')}"/>`;
  });
  s += `<text class="lab" x="${X0}" y="${Y1 + 14}">0</text><text class="lab" x="${X1}" y="${Y1 + 14}" text-anchor="end">${hours} hours</text><text class="lab" x="6" y="10">°C</text>`;
  return s;
}
