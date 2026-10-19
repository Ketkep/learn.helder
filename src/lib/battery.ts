// Maths and drawings for the battery page: a pile of discs, one zinc and copper cell, cells in series and in parallel, and how long a battery lasts.
// The numbers for the cells are made up unless the page says they come from a source.

const f1 = (n: number) => Math.round(n * 10) / 10;

export const DANIELL_V = 1.1; // volts, for a zinc and copper cell (from the sources)
export const PILE_V = 1.1; // toy: volts that each pair of discs adds in the pile

/** Volta's pile: a zinc disc, a copper disc and a card soaked in salt water, again and again. */
export function pileSvg(n: number): string {
  const [x, w] = [90, 120];
  // The pile is squeezed to fit when it is tall
  const step = Math.min(24, 112 / n);
  const hDisc = step / 3.6;
  const gap = (step - 3 * hDisc) / 3;
  let out = '';
  for (let i = 0; i < n; i++) {
    const y = 130 - (i + 1) * step;
    out += `<rect class="zinc" x="${x}" y="${f1(y)}" width="${w}" height="${f1(hDisc)}" rx="2"/><rect class="card" x="${x + 3}" y="${f1(y + hDisc + gap)}" width="${w - 6}" height="${f1(hDisc)}" rx="2"/><rect class="copper" x="${x}" y="${f1(y + 2 * (hDisc + gap))}" width="${w}" height="${f1(hDisc)}" rx="2"/>`;
  }
  const topY = 130 - n * step;
  return `<line class="base" x1="60" y1="132" x2="240" y2="132"/>${out}<line class="wire" x1="${x + w / 2}" y1="${f1(topY)}" x2="${x + w / 2}" y2="${f1(Math.max(6, topY - 8))}"/>`;
}

export const pileVolts = (n: number) => n * PILE_V;

export interface Step {
  title: string;
  text: string;
}

export const steps: Step[] = [
  { title: 'Two metals in two liquids', text: 'A zinc bar stands in a zinc salt solution on the left, and a copper bar in a copper salt solution on the right. A porous barrier between them lets ions through but keeps the liquids apart. Nothing happens until the circuit is closed.' },
  { title: 'Zinc gives up electrons', text: 'At the zinc bar, zinc atoms let go of two electrons each and dissolve as zinc ions. The zinc bar is the negative end, the anode.' },
  { title: 'Electrons go round the wire', text: 'The electrons cannot swim through the liquid, so they travel along the wire to the copper bar. That flow of electrons is the electric current, and it can light a bulb on the way.' },
  { title: 'Copper takes them up', text: 'At the copper bar, copper ions from the solution pick up the electrons and turn into solid copper that sticks to the bar. The copper bar is the positive end, the cathode.' },
  { title: 'Ions finish the circuit', text: 'Inside the cell, ions move through the barrier to keep the charge balanced. Electrons carry the current in the wire, and ions carry it in the liquid. The cell has turned chemical energy into electrical energy, at about 1.1 volts.' },
];

/** The picture of the Daniell cell, with the part that is active in this step. */
export function cellSvg(step: number): string {
  const liquid = (x: number, cls: string) => `<rect class="${cls}" x="${x}" y="66" width="86" height="56"/>`;
  const beakers = `${liquid(40, 'zn-liquid')}${liquid(174, 'cu-liquid')}<path class="glass" d="M40 52V124H126V52M174 52V124H260V52"/><rect class="bridge" x="124" y="84" width="52" height="14" rx="3"/>`;
  const bars = `<rect class="zn-bar${step === 1 ? ' hot' : ''}" x="72" y="40" width="14" height="70"/><rect class="cu-bar${step === 3 ? ' hot' : ''}" x="214" y="40" width="14" height="70"/>`;
  const wire = `<path class="wire${step === 2 ? ' hot' : ''}" d="M79 40V16H221V40"/>`;
  const e = step === 2 ? `<circle class="el" cx="110" cy="16" r="3"/><circle class="el" cx="150" cy="16" r="3"/><circle class="el" cx="190" cy="16" r="3"/>` : '';
  const ions = step === 4 ? `<circle class="ion" cx="140" cy="91" r="3.5"/><circle class="ion" cx="160" cy="91" r="3.5"/>` : '';
  return `${beakers}${bars}${wire}${e}${ions}<text class="lab" x="79" y="140" text-anchor="middle">zinc</text><text class="lab" x="221" y="140" text-anchor="middle">copper</text>`;
}

export const CELL = { volts: 1.5, mAh: 2000 };

export interface Layout {
  id: string;
  name: string;
  series: number;
  parallel: number;
}

export const layouts: Layout[] = [
  { id: 'series', name: 'All in a row (4 in series)', series: 4, parallel: 1 },
  { id: 'both', name: 'Two rows of two', series: 2, parallel: 2 },
  { id: 'parallel', name: 'Side by side (4 in parallel)', series: 1, parallel: 4 },
];

export function pack(l: Layout) {
  const volts = CELL.volts * l.series;
  const mAh = CELL.mAh * l.parallel;
  return { volts, mAh, wh: (volts * mAh) / 1000, cells: l.series * l.parallel };
}

export function cellsSvg(l: Layout): string {
  const h = l.parallel === 4 ? 16 : 22;
  const rowGap = l.parallel === 4 ? 24 : 40;
  const y0 = l.parallel === 1 ? 62 : 28;
  let out = '';
  for (let p = 0; p < l.parallel; p++) {
    const y = y0 + p * rowGap;
    for (let s = 0; s < l.series; s++) {
      const x = 40 + s * 62;
      out += `<rect class="aa" x="${x}" y="${y}" width="46" height="${h}" rx="4"/><rect class="tip" x="${x + 46}" y="${y + h / 2 - 5}" width="4" height="10"/><text class="lab" x="${x + 23}" y="${y + h / 2 + 4}" text-anchor="middle">1.5 V</text>`;
      if (s < l.series - 1) out += `<line class="wire" x1="${x + 50}" y1="${y + h / 2}" x2="${x + 62}" y2="${y + h / 2}"/>`;
    }
  }
  if (l.parallel > 1) {
    const xl = 34;
    const xr = 40 + (l.series - 1) * 62 + 56;
    const [ya, yb] = [y0 + h / 2, y0 + (l.parallel - 1) * rowGap + h / 2];
    out += `<line class="wire" x1="${xl}" y1="${ya}" x2="${xl}" y2="${yb}"/><line class="wire" x1="${xr}" y1="${ya}" x2="${xr}" y2="${yb}"/>`;
    for (let p = 0; p < l.parallel; p++) {
      const y = y0 + p * rowGap + h / 2;
      out += `<line class="wire" x1="${xl}" y1="${y}" x2="40" y2="${y}"/><line class="wire" x1="${40 + (l.series - 1) * 62 + 50}" y1="${y}" x2="${xr}" y2="${y}"/>`;
    }
  }
  return out;
}

export const loads = [
  { id: 'led', name: 'A small torch', watts: 0.5 },
  { id: 'radio', name: 'A radio', watts: 1 },
  { id: 'toy', name: 'A toy car', watts: 3 },
  { id: 'fan', name: 'A small fan', watts: 6 },
];

export function runtimeHours(wh: number, watts: number): number {
  return wh / watts;
}

export function fmtHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} minutes`;
  if (h < 48) return Math.abs(h - 1) < 0.05 ? '1 hour' : `${h < 10 ? h.toFixed(1) : Math.round(h)} hours`;
  return `${Math.round(h / 24)} days`;
}
