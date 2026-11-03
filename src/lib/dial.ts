// Maths and drawings for the sundial page. The hour lines of a flat dial follow tan(angle) = sin(latitude) x tan(hour angle), and the
// shadow-casting edge points at the pole of the sky, so it rises at the latitude. The equation of time is the usual approximate
// formula, so values differ a little from year to year. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Clock hours as 9:30. */
export function clock(h: number): string {
  const t = Math.round(h * 60);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

/** Angle of the sun round the sky from noon, 15 degrees an hour. */
export const hourAngle = (h: number) => 15 * (h - 12);

/** Angle of the hour line from the noon line on a flat dial, negative to the west (morning). */
export function lineAngle(lat: number, h: number): number {
  const ha = rad(hourAngle(h));
  return deg(Math.atan2(Math.sin(rad(lat)) * Math.sin(ha), Math.cos(ha)));
}

/** The time a dial reads when its edge is tilted at the wrong angle, for a true latitude and a true time. */
export function readTime(lat: number, tilt: number, h: number): number {
  const ha = rad(hourAngle(h));
  const read = Math.atan2(Math.sin(rad(tilt)) * Math.sin(ha), Math.sin(rad(lat)) * Math.cos(ha));
  return 12 + deg(read) / 15;
}

const C = [150, 150];

/** The flat dial seen from above, with the hour lines and the shadow. */
export function plateSvg(lat: number, hour: number): string {
  let o = `<rect class="stone" x="1" y="1" width="298" height="298" rx="8"/><circle class="disc" cx="${C[0]}" cy="${C[1]}" r="128"/>`;
  for (let h = 6; h <= 18; h++) {
    const a = rad(lineAngle(lat, h));
    const x = C[0] + 112 * Math.sin(a);
    const y = C[1] - 112 * Math.cos(a);
    o += `<line class="hourline" x1="${C[0]}" y1="${C[1]}" x2="${f1(x)}" y2="${f1(y)}"/>`;
    const lx = C[0] + 122 * Math.sin(a);
    const ly = C[1] - 122 * Math.cos(a);
    if (lat > 3 || h === 12) o += `<text class="lab small mid" x="${f1(lx)}" y="${f1(ly + 3)}">${h}</text>`;
  }
  const s = rad(lineAngle(lat, hour));
  o += `<line class="shadow" x1="${C[0]}" y1="${C[1]}" x2="${f1(C[0] + 108 * Math.sin(s))}" y2="${f1(C[1] - 108 * Math.cos(s))}"/>`;
  o += `<circle class="root" cx="${C[0]}" cy="${C[1]}" r="5"/>`;
  o += `<text class="lab" x="12" y="20">North</text><text class="lab small" x="12" y="290">Noon line points north (in the northern half of the world)</text>`;
  return o;
}

/** The side view: the edge, and the line to the pole of the sky. */
export function sideSvg(lat: number, tilt: number): string {
  const ox = 50;
  const oy = 190;
  const L = 170;
  let o = `<rect class="stone" x="1" y="1" width="298" height="218" rx="8"/>`;
  o += `<line class="ground" x1="20" y1="${oy}" x2="285" y2="${oy}"/>`;
  o += `<line class="axis" x1="${ox}" y1="${oy}" x2="${f1(ox + L * Math.cos(rad(lat)))}" y2="${f1(oy - L * Math.sin(rad(lat)))}"/>`;
  o += `<text class="lab small" x="${f1(ox + L * Math.cos(rad(lat)) + 4)}" y="${f1(oy - L * Math.sin(rad(lat)) + 3)}">Pole of the sky</text>`;
  o += `<line class="edge" x1="${ox}" y1="${oy}" x2="${f1(ox + 150 * Math.cos(rad(tilt)))}" y2="${f1(oy - 150 * Math.sin(rad(tilt)))}"/>`;
  o += `<circle class="root" cx="${ox}" cy="${oy}" r="4"/>`;
  o += `<text class="lab" x="12" y="20">Edge tilted ${fmt(tilt)}°, latitude ${fmt(lat)}°</text>`;
  o += `<text class="lab small" x="${ox + 60}" y="${oy + 14}">South ... North</text>`;
  return o;
}

// ---------- The equation of time ----------

/** Minutes the sundial is ahead of the clock on a day of the year (1 to 365), from the usual approximate formula. */
export function eot(day: number): number {
  const b = rad((360 / 365) * (day - 81));
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function dateOf(day: number): string {
  let d = day;
  for (let m = 0; m < 12; m++) {
    if (d <= MONTHS[m]) return `${d} ${NAMES[m]}`;
    d -= MONTHS[m];
  }
  return '31 December';
}

export function eotSvg(day: number): string {
  const gx = (d: number) => 14 + ((d - 1) / 364) * 272;
  const gy = (m: number) => 85 - m * 3.4;
  let path = '';
  for (let d = 1; d <= 365; d += 4) path += `${d === 1 ? 'M' : 'L'}${f1(gx(d))} ${f1(gy(eot(d)))} `;
  let o = `<rect class="stone" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<line class="ground" x1="14" y1="${gy(0)}" x2="286" y2="${gy(0)}"/>`;
  o += `<path class="curve" d="${path}"/>`;
  let m = 0;
  for (let i = 0; i < 12; i++) {
    o += `<line class="tick" x1="${f1(gx(m + 1))}" y1="${gy(0) - 3}" x2="${f1(gx(m + 1))}" y2="${gy(0) + 3}"/><text class="lab small mid" x="${f1(gx(m + 15))}" y="158">${NAMES[i].slice(0, 3)}</text>`;
    m += MONTHS[i];
  }
  o += `<circle class="root" cx="${f1(gx(day))}" cy="${f1(gy(eot(day)))}" r="5"/>`;
  o += `<text class="lab" x="12" y="20">Sundial minus clock, in minutes</text>`;
  o += `<text class="lab small" x="12" y="${gy(16) + 2}">+16</text><text class="lab small" x="12" y="${gy(-14) + 2}">-14</text>`;
  return o;
}
