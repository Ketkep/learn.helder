// Maths and drawings for the ice page. A floating thing sinks until the water it pushes aside weighs as much as it does, so the share
// below the surface is its density over the density of the water. The densities of ice, fresh water and sea water come from the sources.
// The lake stages are typical values and the bottle is a toy. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const ICE = 917;

export const FLUIDS = [
  { name: 'Fresh water', rho: 1000 },
  { name: 'Sea water', rho: 1025 },
];

/** The share of a floating thing that is below the surface, from 0 to 1. Above 1 it sinks. */
export const below = (object: number, fluid: number) => object / fluid;

/** A block in a tank of water, floating or lying on the bottom. */
export function floatSvg(object: number, fluid: number): string {
  const r = below(object, fluid);
  const sink = r >= 1;
  const size = 70;
  const level = 70; // y of the water surface
  const bottom = 150;
  const top = sink ? bottom - size : level - size * (1 - Math.min(r, 1));
  let o = `<rect class="tank" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<rect class="water" x="40" y="${level}" width="220" height="${bottom - level}"/>`;
  o += `<line class="surface" x1="40" y1="${level}" x2="260" y2="${level}"/>`;
  o += `<rect class="${sink ? 'block sunk' : 'block'}" x="115" y="${f1(top)}" width="${size}" height="${size}" rx="3"/>`;
  o += `<text class="lab" x="12" y="20">${sink ? 'It sinks' : `${fmt(r * 100, 1)}% below the surface`}</text>`;
  o += `<text class="lab small" x="12" y="162">Block ${fmt(object)} kg per cubic metre, water ${fmt(fluid)}</text>`;
  return o;
}

export const STAGES = [
  { name: 'Warm summer', layers: ['Warm, about 20 °C', 'Cooler, about 12 °C', 'Cold, about 6 °C'], says: 'In summer the sun warms the top, and warm water is lighter, so it stays on top. The bottom stays cold.' },
  { name: 'Autumn', layers: ['4 °C or more', '4 °C or more', '4 °C'], says: 'In autumn the top cools. Cooler water is heavier and sinks, and the lake turns over, until all of it is near 4 °C, the temperature at which fresh water is heaviest.' },
  { name: 'Winter cold', layers: ['Under 4 °C, lighter', 'About 2 °C', 'Near 4 °C, heaviest'], says: 'Once the top is colder than 4 °C it is lighter than the water below, so it stays on top and cools further, and the heaviest water stays at the bottom.' },
  { name: 'Ice on top', layers: ['Ice', '0 °C, just under the ice', 'Near 4 °C at the bottom'], says: 'At 0 °C the top freezes. Ice is lighter than water, so it floats and forms a lid. Under it the lake does not freeze through, and the water at the bottom stays near 4 °C.' },
];

/** The lake in layers, with the stage in a second colour. */
export function lakeSvg(stage: number): string {
  const s = STAGES[stage];
  const cols = [
    ['#e9a14a', '#8fb7d9', '#3d6e9c'],
    ['#6ea4cf', '#5f97c6', '#4f8bbf'],
    ['#7fb0d8', '#5b92c2', '#3f78ad'],
    ['#eaf4fb', '#7fb0d8', '#3f78ad'],
  ][stage];
  let o = `<rect class="tank" x="1" y="1" width="298" height="168" rx="8"/>`;
  s.layers.forEach((t, i) => {
    o += `<rect x="30" y="${34 + i * 38}" width="240" height="38" fill="${cols[i]}" stroke="#0b2236" stroke-width="1"/>`;
    o += `<text class="lab small dark" x="38" y="${f1(58 + i * 38)}">${t}</text>`;
  });
  o += `<text class="lab" x="12" y="20">${s.name}</text>`;
  return o;
}

/** Ice takes up more room than the water it came from. */
export const ICE_VOLUME = 1000 / ICE;

export function bottleSvg(fill: number): string {
  const ice = fill * ICE_VOLUME;
  const fits = ice <= 100;
  let o = `<rect class="tank" x="1" y="1" width="298" height="168" rx="8"/>`;
  const draw = (x: number, label: string, v: number, cls: string) => {
    const h = (Math.min(v, 120) / 100) * 104;
    let r = `<rect class="glass" x="${x}" y="36" width="70" height="104" rx="6"/>`;
    r += `<rect class="${cls}" x="${x + 3}" y="${f1(140 - Math.min(h, 101))}" width="64" height="${f1(Math.min(h, 101))}"/>`;
    if (v > 100) r += `<rect class="over" x="${x + 3}" y="26" width="64" height="10"/>`;
    r += `<text class="lab small mid" x="${x + 35}" y="158">${label}</text>`;
    return r;
  };
  o += draw(50, 'Water', fill, 'water');
  o += draw(180, fits ? 'Ice' : 'Ice, too much', ice, 'icefill');
  o += `<text class="lab" x="12" y="20">${fmt(fill)}% full of water becomes ${fmt(ice, 1)}% of the bottle as ice</text>`;
  return o;
}
