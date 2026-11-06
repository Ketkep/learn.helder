// Maths and drawings for the ocean waves page. In deep water a wave goes faster the longer it is: speed is the square root of gravity
// times the wavelength over 2 pi. In shallow water, which for a tsunami means almost everywhere, speed is the square root of gravity times
// the depth. The beach in the last tool is made up, and the height of the wave in the drawing is not to scale. The same text is made at
// build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

const G = 9.81;

/** Speed in metres a second of a deep-water wave of a given wavelength in metres. */
export const deepSpeed = (length: number) => Math.sqrt((G * length) / (2 * Math.PI));

/** Speed in metres a second of a long wave in water of a given depth in metres. */
export const shallowSpeed = (depth: number) => Math.sqrt(G * depth);

export const kmh = (ms: number) => ms * 3.6;

/** Time in seconds for a wave to cross a stretch of sea. */
export function clock(seconds: number): string {
  if (seconds >= 3600) return `${fmt(seconds / 3600, 1)} hours`;
  if (seconds >= 120) return `${fmt(seconds / 60)} minutes`;
  return `${fmt(seconds)} seconds`;
}

/** A wave of a given wavelength in a window 200 metres wide. */
export function deepSvg(length: number): string {
  let d = '';
  const amp = Math.min(26, Math.max(4, length / 14));
  for (let i = 0; i <= 276; i++) {
    const x = (i / 276) * 200;
    d += `${i ? 'L' : 'M'}${f1(12 + i)} ${f1(80 - amp * Math.sin((2 * Math.PI * x) / length))} `;
  }
  let o = `<rect class="sea" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<path class="water" d="${d} L288 150 L12 150 Z"/>`;
  o += `<path class="crest" d="${d}"/>`;
  o += `<line class="ruler" x1="12" y1="158" x2="288" y2="158"/><text class="lab small" x="12" y="150">The picture shows 200 metres of sea</text>`;
  o += `<text class="lab" x="12" y="18">Wavelength ${fmt(length)} m: speed ${fmt(deepSpeed(length), 1)} m/s</text>`;
  return o;
}

/** The sea floor at a depth, with a long wave on top. */
export function shallowSvg(depth: number): string {
  let o = `<rect class="sea" x="1" y="1" width="298" height="168" rx="8"/>`;
  const top = 44;
  const floor = Math.max(top + 12, 146 - Math.min(100, Math.sqrt(depth / 4000) * 100) + 0);
  o += `<path class="water" d="M12 ${top} Q80 ${top - 12} 150 ${top} T288 ${top} L288 ${f1(floor)} L12 ${f1(floor)} Z"/>`;
  o += `<path class="crest" d="M12 ${top} Q80 ${top - 12} 150 ${top} T288 ${top}"/>`;
  o += `<path class="floor" d="M12 ${f1(floor)} H288 V156 H12 Z"/>`;
  o += `<line class="ruler" x1="296" y1="${top}" x2="296" y2="${f1(floor)}"/>`;
  o += `<text class="lab" x="12" y="18">Depth ${fmt(depth)} m: speed ${fmt(shallowSpeed(depth), 1)} m/s, ${fmt(kmh(shallowSpeed(depth)))} km/h</text>`;
  o += `<text class="lab small" x="12" y="166">Depth drawn on a square root scale</text>`;
  return o;
}

// ---------- A made-up beach ----------

export const OPEN = 4000; // metres of water at the far edge
export const SPAN = 200000; // metres from the far edge to the shore

/** The depth at a place along the beach, sloping evenly to the shore. */
export const depthAt = (x: number) => Math.max(1, OPEN * (1 - x / SPAN));

/** Seconds for a long wave to go from the far edge to a place on the beach. */
export function travelTime(x: number): number {
  let t = 0;
  const step = 500;
  for (let a = 0; a < x; a += step) t += step / shallowSpeed(depthAt(a + step / 2));
  return t;
}

/** The beach with the wave at one place along it. The height of the wave is not to scale. */
export function beachSvg(x: number): string {
  let o = `<rect class="sea" x="1" y="1" width="298" height="168" rx="8"/>`;
  let floor = '';
  for (let i = 0; i <= 60; i++) floor += `L${f1(12 + (i / 60) * 276)} ${f1(150 - (depthAt((i / 60) * SPAN) / OPEN) * 100)} `;
  const px = 12 + (x / SPAN) * 276;
  const d = depthAt(x);
  const h = 4 + 26 * Math.pow(1 - d / OPEN, 2);
  const seabed = 150 - (d / OPEN) * 100;
  o += `<path class="water" d="M12 56 H288 V150 H12 Z"/>`;
  o += `<path class="floor" d="M12 150 ${floor} L288 150 Z"/>`;
  o += `<path class="crest" d="M${f1(px - 28)} 56 Q${f1(px - 12)} ${f1(56 - h)} ${f1(px)} ${f1(56 - h)} T${f1(px + 28)} 56"/>`;
  o += `<line class="ruler" x1="${f1(px)}" y1="${f1(56 - h)}" x2="${f1(px)}" y2="${f1(seabed)}"/>`;
  o += `<text class="lab" x="12" y="18">Depth ${fmt(d)} m: speed ${fmt(kmh(shallowSpeed(d)))} km/h</text>`;
  o += `<text class="lab small" x="12" y="164">Made-up beach. The height of the wave is not to scale.</text>`;
  return o;
}
