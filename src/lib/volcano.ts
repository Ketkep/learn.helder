// Maths and drawings for the volcano page: how sticky magma is, what the gas does, why bubbles grow, how volcanoes form and the VEI scale.
// The sliders and the scoring are toys. The facts come from the sources, and the page says which is which.

const f1 = (n: number) => Math.round(n * 10) / 10;

export function magmaType(silica: number): { name: string; rock: string } {
  if (silica < 52) return { name: 'basalt', rock: 'basaltic' };
  if (silica < 63) return { name: 'andesite', rock: 'andesitic' };
  if (silica < 69) return { name: 'dacite', rock: 'dacitic' };
  return { name: 'rhyolite', rock: 'rhyolitic' };
}

/** Toy: the log of the viscosity in pascal seconds, from tens for hot basalt to over a billion for cool rhyolite. */
export function logViscosity(silica: number): number {
  return 1.5 + ((silica - 45) / 30) * 7.8;
}

/** Toy: rhyolitic magma is several hundred degrees cooler than basaltic magma. */
export function tempC(silica: number): number {
  return Math.round((1150 - (silica - 45) * 13) / 10) * 10;
}

export function fmtViscosity(silica: number): string {
  const e = logViscosity(silica);
  if (e < 3) return `about ${Math.round(10 ** e / 10) * 10} pascal seconds`;
  if (e < 6) return `about ${Math.round(10 ** e / 1000)} thousand pascal seconds`;
  if (e < 9) return `about ${Math.round(10 ** (e - 6))} million pascal seconds`;
  return `over a billion pascal seconds`;
}

/** Toy: 0 is a quiet flow and 1 is a huge blast. Sticky magma and a lot of dissolved gas push it up. */
export function explosiveness(silica: number, gasPct: number): number {
  const v = (logViscosity(silica) - 1.5) / 7.8;
  const g = (gasPct - 0.5) / 5.5;
  return Math.max(0, Math.min(1, v * 0.7 + g * 0.3));
}

export function style(e: number): { name: string; text: string } {
  if (e < 0.3) return { name: 'a quiet flow', text: 'The gas escapes easily and the lava flows out.' };
  if (e < 0.55) return { name: 'a fountain', text: 'Some gas is trapped, so the lava is thrown up in a fountain.' };
  if (e < 0.8) return { name: 'an explosion', text: 'The gas is trapped in sticky magma and blows it apart into ash.' };
  return { name: 'a huge explosion', text: 'A great deal of gas is locked in very sticky magma. It blows with great force.' };
}

/** The cone, and either lava on its sides or a column of ash above it. */
export function coneSvg(e: number): string {
  const cone = `<path class="cone" d="M60 130L120 62H180L240 130Z"/><path class="crater" d="M120 62Q150 74 180 62Z"/>`;
  if (e < 0.3) return `${cone}<path class="lava" d="M132 64Q128 96 108 124M168 64Q172 100 192 126"/><circle class="glow" cx="150" cy="62" r="7"/>`;
  const h = 10 + e * 34;
  const w = 10 + e * 30;
  const col = `<path class="ash" d="M${150 - 8} 62Q${150 - w} ${62 - h * 0.6} ${150 - w * 0.7} ${f1(62 - h)}Q150 ${f1(62 - h - 14)} ${150 + w * 0.7} ${f1(62 - h)}Q${150 + w} ${62 - h * 0.6} ${150 + 8} 62Z"/>`;
  const rocks = e > 0.3 ? `<circle class="rock" cx="${110 - e * 10}" cy="${f1(62 - h * 0.7)}" r="3"/><circle class="rock" cx="${190 + e * 10}" cy="${f1(62 - h * 0.5)}" r="3"/>` : '';
  return `${col}${rocks}${cone}<circle class="glow" cx="150" cy="62" r="6"/>`;
}

/** Pressure in megapascals at a depth in kilometres, from the weight of rock (about 2,500 kg for every cubic metre). */
export function pressureMPa(depthKm: number): number {
  return (2500 * 9.81 * depthKm * 1000) / 1e6;
}

/** How many times bigger a gas bubble gets when it rises from a depth to the surface, if the temperature stays the same. */
export function growth(depthKm: number): number {
  return (pressureMPa(depthKm) + 0.1) / 0.1;
}

export function bubbleSvg(depthKm: number): string {
  const r0 = 4;
  const r1 = Math.min(36, r0 * Math.cbrt(growth(depthKm)));
  const cy = f1(36 + r1);
  return `<line class="surface" x1="14" y1="30" x2="286" y2="30"/><text class="lab" x="16" y="22">surface</text><circle class="bub" cx="210" cy="${cy}" r="${f1(r1)}"/><text class="lab" x="210" y="${f1(36 + r1 * 2 + 14)}" text-anchor="middle">at the surface</text><circle class="bub" cx="60" cy="110" r="${r0}"/><text class="lab" x="60" y="130" text-anchor="middle">at ${depthKm} km</text><path class="rise" d="M68 104Q120 ${cy} ${f1(210 - r1 - 4)} ${cy}"/>`;
}

export const settings = [
  { id: 'subduction', name: 'One plate sinks under another', magma: 'Water from the sinking plate lowers the melting point of the rock above it by about 60 to 100 degrees Celsius, so it melts. The magma rises.', example: 'The Pacific Ring of Fire has many of these.' },
  { id: 'rift', name: 'Two plates pull apart', magma: 'Rock rises to fill the gap, loses pressure and melts, and magma escapes through cracks. This happens along ridges in the sea floor.', example: 'The mid-ocean ridges are a long line of such volcanoes.' },
  { id: 'hotspot', name: 'A hot spot under a plate', magma: 'A column of very hot rock, a mantle plume, rises from deep down. The hot spot stays in place while the plate moves over it, so it leaves a chain of volcanoes.', example: 'Hawaii is the classic chain.' },
  { id: 'transform', name: 'Two plates slide past each other', magma: 'There is little magma at this kind of boundary, so volcanoes are not typical here.', example: 'Earthquakes are common at such boundaries, but volcanoes are not.' },
];

export function settingsSvg(id: string): string {
  const ground = `<rect class="land" x="12" y="60" width="276" height="60"/>`;
  const plates: Record<string, string> = {
    subduction: `<path class="slab" d="M12 60L150 60L250 118L250 120L12 120Z"/><path class="slab2" d="M150 60L288 60L288 120L250 120Z"/><path class="mag" d="M205 110L205 76"/><path class="cone" d="M190 60L205 40L220 60Z"/>`,
    rift: `<path class="slab" d="M12 60L130 60L130 120L12 120Z"/><path class="slab2" d="M170 60L288 60L288 120L170 120Z"/><path class="mag" d="M150 120L150 62"/><path class="mag" d="M135 60L165 60"/>`,
    hotspot: `<path class="mag" d="M110 120Q110 90 110 62"/><circle class="plume" cx="110" cy="105" r="14"/><path class="cone" d="M96 60L110 38L124 60Z"/><path class="cone old" d="M180 60L192 44L204 60Z"/><path class="cone old" d="M236 60L246 48L256 60Z"/><path class="arrow" d="M150 52L260 52"/>`,
    transform: `<path class="slab" d="M12 60L150 60L150 120L12 120Z"/><path class="slab2" d="M150 60L288 60L288 120L150 120Z"/><path class="arrow" d="M70 90L110 90"/><path class="arrow" d="M230 100L190 100"/>`,
  };
  return `${ground}${plates[id] || ''}`;
}

export const VEI_MAX = 8;

/** Each step on the VEI scale is roughly ten times more than the one before. */
export function veiRatio(vei: number, base = 2): number {
  return 10 ** (vei - base);
}

export function fmtTimes(r: number): string {
  if (r === 1) return 'the same size as';
  if (r > 1) return `${r >= 1e6 ? `${(r / 1e6).toFixed(1)} million` : Math.round(r).toLocaleString('en-US')} times as big as`;
  return `${(1 / r).toLocaleString('en-US')} times smaller than`;
}
