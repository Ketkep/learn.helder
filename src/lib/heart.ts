// Maths and drawings for the heart page: the route of the blood, litres a minute, beats in a lifetime and the valves.
// The pictures are simple drawings, not anatomy. The sums are plain arithmetic worked out for the page.

export interface Stop {
  id: string;
  name: string;
  text: string;
  oxygen: boolean;
}

export const route: Stop[] = [
  { id: 'body', name: 'The body', text: 'Blood that has given up some of its oxygen comes back from the body in the veins.', oxygen: false },
  { id: 'ra', name: 'Right atrium', text: 'The blood arrives in the right atrium, the upper right chamber.', oxygen: false },
  { id: 'rv', name: 'Right ventricle', text: 'The right atrium squeezes it down into the right ventricle, the lower right chamber.', oxygen: false },
  { id: 'lungs', name: 'The lungs', text: 'The right ventricle pushes it to the lungs, where it picks up oxygen.', oxygen: false },
  { id: 'la', name: 'Left atrium', text: 'Blood with oxygen comes back from the lungs into the left atrium, the upper left chamber.', oxygen: true },
  { id: 'lv', name: 'Left ventricle', text: 'The left atrium squeezes it into the left ventricle, the lower left chamber.', oxygen: true },
  { id: 'aorta', name: 'The aorta', text: 'The left ventricle pushes it out through the aorta, the biggest artery.', oxygen: true },
  { id: 'out', name: 'The body again', text: 'The aorta and its branches carry the blood to every part of the body, and the trip starts again.', oxygen: true },
];

const pos: Record<string, [number, number]> = {
  body: [150, 14],
  ra: [104, 62],
  rv: [104, 110],
  lungs: [30, 85],
  la: [196, 62],
  lv: [196, 110],
  aorta: [262, 62],
  out: [262, 20],
};

/** A flat drawing of the four chambers with the stop of the route marked. */
export function heartSvg(step: number): string {
  const chamber = (id: string, x: number, y: number, w: number, h: number, label: string) =>
    `<rect class="chamber${route[step].id === id ? ' on' : ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/><text class="lab" x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle">${label}</text>`;
  const chambers = chamber('ra', 64, 42, 80, 40, 'right atrium') + chamber('rv', 64, 88, 80, 44, 'right ventricle') + chamber('la', 156, 42, 80, 40, 'left atrium') + chamber('lv', 156, 88, 80, 44, 'left ventricle');
  const lungs = `<ellipse class="lung${route[step].id === 'lungs' ? ' on' : ''}" cx="30" cy="86" rx="20" ry="34"/><text class="lab" x="30" y="136" text-anchor="middle">lungs</text>`;
  const body = `<rect class="body${route[step].id === 'body' || route[step].id === 'out' ? ' on' : ''}" x="100" y="6" width="100" height="22" rx="8"/><text class="lab" x="150" y="21" text-anchor="middle">body</text>`;
  const aorta = `<path class="aorta${route[step].id === 'aorta' ? ' on' : ''}" d="M236 100H262V30"/>`;
  const [x, y] = pos[route[step].id];
  const dot = `<circle class="drop ${route[step].oxygen ? 'ox' : 'low'}" cx="${x}" cy="${y}" r="7"/>`;
  return `${lungs}${body}${aorta}${chambers}${dot}`;
}

export const SOURCE = { hrLow: 60, hrHigh: 100, svLow: 60, svHigh: 100 };

/** Litres a minute from beats a minute and millilitres a beat. */
export function output(hr: number, sv: number): number {
  return (hr * sv) / 1000;
}

export const beatsPerDay = (hr: number) => hr * 60 * 24;
export const litresPerDay = (hr: number, sv: number) => output(hr, sv) * 60 * 24;

export function beatsInLife(hr: number, years: number): number {
  return hr * 60 * 24 * 365.25 * years;
}

export function fmtBig(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  return Math.round(n).toLocaleString('en-US');
}

export interface Phase {
  id: string;
  name: string;
  inlet: boolean; // valves between atria and ventricles are open
  outlet: boolean; // valves at the exits are open
  text: string;
}

export const phases: Phase[] = [
  { id: 'fill', name: 'Relax and fill', inlet: true, outlet: false, text: 'The chambers relax and blood flows in. The valves between the atria and the ventricles are open. The valves at the exits are shut, so blood cannot flow back from the arteries.' },
  { id: 'squeeze', name: 'Squeeze', inlet: false, outlet: true, text: 'The ventricles squeeze. The valves between the atria and the ventricles shut, so blood cannot flow back into the atria. The valves at the exits open and the blood goes out to the lungs and the body.' },
];

export function valvesSvg(p: Phase): string {
  const vent = (x: number) => `<rect class="chamber ${p.outlet ? 'push' : 'fillc'}" x="${x}" y="62" width="64" height="58" rx="12"/>`;
  const atr = (x: number) => `<rect class="chamber ${p.inlet ? 'fillc' : ''}" x="${x}" y="8" width="64" height="40" rx="12"/>`;
  const inlet = (x: number) => `<rect class="valve ${p.inlet ? 'open' : 'shut'}" x="${x + 12}" y="49" width="40" height="8" rx="3"/>`;
  const outlet = (x: number) => `<rect class="valve ${p.outlet ? 'open' : 'shut'}" x="${x + 12}" y="122" width="40" height="8" rx="3"/>`;
  return `${atr(78)}${atr(158)}${vent(78)}${vent(158)}${inlet(78)}${inlet(158)}${outlet(78)}${outlet(158)}<text class="lab" x="150" y="148" text-anchor="middle">${p.outlet ? 'blood goes out' : 'blood comes in'}</text>`;
}
