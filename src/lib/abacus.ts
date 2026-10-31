// Maths and drawings for the abacus page. The bead layouts come from the sources. The addition steps are worked out here.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number) => n.toLocaleString('en-US');

export interface Design {
  id: string;
  name: string;
  up: number; // beads above the beam, each worth five
  low: number; // beads below the beam, each worth one
  where: string;
}

export const SOROBAN: Design = { id: 'soroban', name: 'Soroban (one above, four below)', up: 1, low: 4, where: 'The Japanese abacus of today. The Roman hand abacus had the same layout.' };
export const SUANPAN: Design = { id: 'suanpan', name: 'Suanpan (two above, five below)', up: 2, low: 5, where: 'The Chinese abacus, with the extra beads that were used for carrying and for a unit of 16.' };
export const DESIGNS = [SOROBAN, SUANPAN];

export const RODS = 7;

/** A rod is the number of beads pushed to the beam above and below it. Its value is five for each upper bead plus one for each lower bead. */
export interface Rod {
  up: number;
  low: number;
}

export const rodValue = (r: Rod) => r.up * 5 + r.low;

/** The usual way to show a digit on a soroban: one upper bead for five, and the rest below. */
export const rodFor = (digit: number): Rod => ({ up: digit >= 5 ? 1 : 0, low: digit % 5 });

/** Rods for a number, as many as the abacus has, units on the right. */
export function rodsOf(n: number, count = RODS): Rod[] {
  const digits = String(n).padStart(count, '0').slice(-count).split('').map(Number);
  return digits.map(rodFor);
}

export const valueOf = (rods: Rod[]) => rods.reduce((sum, r) => sum * 10 + rodValue(r), 0);

/** Ways to show a digit with this design: the number of choices of upper and lower beads that add up to it. */
export function waysToShow(digit: number, d: Design): { up: number; low: number }[] {
  const out: { up: number; low: number }[] = [];
  for (let u = 0; u <= d.up; u++) {
    const l = digit - 5 * u;
    if (l >= 0 && l <= d.low) out.push({ up: u, low: l });
  }
  return out;
}

export const largestRod = (d: Design) => d.up * 5 + d.low;

// ---------- Addition, step by step ----------

export interface Step {
  text: string;
  value: number; // what the abacus reads after this step
}

/** Adds b to a on a soroban, one rod at a time from the units, carrying when a rod would pass nine. */
export function addSteps(a: number, b: number): Step[] {
  const steps: Step[] = [{ text: `Set ${fmt(a)} on the rods.`, value: a }];
  const digits = String(b).split('').reverse().map(Number);
  let value = a;
  let carry = 0;
  const names = ['units', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
  for (let i = 0; i < digits.length || carry; i++) {
    const add = (digits[i] ?? 0) + carry;
    carry = 0;
    if (add === 0) continue;
    const place = 10 ** i;
    const current = Math.floor(value / place) % 10;
    const total = current + add;
    const name = names[i] ?? 'next';
    if (total <= 9) {
      value += add * place;
      steps.push({ text: `Add ${add} on the ${name} rod. It holds ${total}.`, value });
    } else {
      value += add * place - 10 * place;
      carry = 1;
      steps.push({ text: `Add ${add} on the ${name} rod. ${current} and ${add} make ${total}, which is more than nine. The rod keeps ${total - 10} and one is carried to the next rod.`, value });
    }
  }
  steps.push({ text: `The rods read ${fmt(a + b)}.`, value: a + b });
  return steps;
}

// ---------- A drawing for the page without a script ----------

/** A soroban drawn as SVG for a number. Beads at the beam are counted. */
export function abacusSvg(n: number, count = RODS): string {
  const rods = rodsOf(n, count);
  const w = 300;
  const gap = (w - 40) / count;
  const beamY = 52;
  let s = `<rect class="frame" x="14" y="10" width="${w - 28}" height="124" rx="6"/><line class="beam" x1="14" y1="${beamY}" x2="${w - 14}" y2="${beamY}"/>`;
  rods.forEach((r, i) => {
    const x = 20 + gap * i + gap / 2;
    s += `<line class="rod" x1="${f1(x)}" y1="12" x2="${f1(x)}" y2="132"/>`;
    const upY = r.up ? beamY - 10 : 22;
    s += `<ellipse class="bead${r.up ? ' on' : ''}" cx="${f1(x)}" cy="${upY}" rx="${f1(gap * 0.4)}" ry="8"/>`;
    for (let k = 0; k < 4; k++) {
      const on = k < r.low;
      const y = on ? beamY + 10 + k * 17 : 132 - 10 - (3 - k) * 17;
      s += `<ellipse class="bead${on ? ' on' : ''}" cx="${f1(x)}" cy="${y}" rx="${f1(gap * 0.4)}" ry="8"/>`;
    }
  });
  return s;
}
