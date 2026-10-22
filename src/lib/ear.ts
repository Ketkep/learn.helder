// Maths and drawings for the ear page. The physics is simple and computed here. The pressure numbers in the air pipe toy are made up.
// The same text is made at build time (Astro) and in the browser.

export const SPEED = 343; // metres per second in air at about 20 degrees

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// ---------- Ground floor: the canal ----------

/** A tube closed at one end (the eardrum) resonates when its length is a quarter of a wavelength. Length in millimetres. */
export const canalHz = (mm: number) => SPEED / (4 * (mm / 1000));

/** The tube drawn from the side, with the pressure of the standing wave inside it. */
export function canalSvg(mm: number): string {
  const x0 = 24;
  const len = (mm / 40) * 220;
  const x1 = x0 + len;
  const pts = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40; // 0 at the open end, 1 at the eardrum
    const amp = Math.sin((t * Math.PI) / 2);
    return `${(x0 + t * len).toFixed(1)},${(78 - amp * 26).toFixed(1)}`;
  });
  const wave = `M${x0},78 L${pts.join(' L')} L${x1.toFixed(1)},78 Z`;
  return `<rect class="tube" x="${x0}" y="52" width="${len.toFixed(1)}" height="52" rx="4"/><path class="swell" d="${wave}"/><rect class="drum" x="${(x1 - 2).toFixed(1)}" y="46" width="7" height="64" rx="3"/><text class="lab" x="${x0}" y="124">open end</text><text class="lab" x="${x1.toFixed(1)}" y="124" text-anchor="end">eardrum</text>`;
}

// ---------- First floor: the lever ----------

export const pressureGain = (area: number, lever: number) => area * lever;
export const decibels = (gain: number) => 20 * Math.log10(gain);

/** The eardrum and the oval window as two discs whose areas are in the ratio given. */
export function leverSvg(area: number): string {
  const rWin = 12;
  const rDrum = rWin * Math.sqrt(area);
  const cx = 70;
  const cy = 76;
  return `<circle class="drum-disc" cx="${cx}" cy="${cy}" r="${Math.min(rDrum, 60).toFixed(1)}"/><text class="lab" x="${cx}" y="${cy + 3}" text-anchor="middle">eardrum</text><path class="bar" d="M${cx + 66},${cy} H190"/><circle class="win-disc" cx="220" cy="${cy}" r="${rWin}"/><text class="lab" x="220" y="${cy + 30}" text-anchor="middle">oval window</text>`;
}

// ---------- Back stairs: the air pipe ----------

/** Pressure in percent of the ground level. The numbers are made up for the toy. */
export interface Air { outside: number; inside: number }

export const gap = (a: Air) => a.outside - a.inside;

/** The eardrum bulges toward the lower pressure. */
export function drumSvg(a: Air): string {
  const bulge = Math.max(-40, Math.min(40, gap(a) * -4));
  return `<rect class="wall" x="40" y="30" width="14" height="92" rx="4"/><rect class="wall" x="40" y="30" width="14" height="14" rx="4"/><path class="skin" d="M47,36 Q${(47 + bulge).toFixed(1)},76 47,116" /><text class="lab" x="40" y="18">outside</text><text class="lab" x="64" y="136">middle ear</text><path class="pipe" d="M150,112 C190,112 220,100 244,70"/><text class="lab" x="244" y="60" text-anchor="end">air pipe to the throat</text>`;
}

export function dullness(a: Air): number {
  return Math.min(1, Math.abs(gap(a)) / 10);
}

// ---------- Top floor: the cochlea ----------

/** A made up map: a smooth exponential from 20 Hz at the tip to 20,000 Hz at the base. Share along the cochlea, 0 to 1 from the tip. */
export const placeOf = (hz: number) => Math.min(1, Math.max(0, Math.log(hz / 20) / Math.log(1000)));
export const hzAt = (share: number) => 20 * 1000 ** share;

/** Slider 0 to 100 for 20 to 20,000 Hz. */
export const hzFromSlider = (i: number) => hzAt(i / 100);

/** The cochlea unrolled into a strip, with a marker at the place that answers to a frequency. */
export function stripSvg(hz: number): string {
  const share = placeOf(hz);
  const x = 20 + share * 260;
  return `<polygon class="strip" points="20,62 280,73 280,87 20,98"/><circle class="peak" cx="${x.toFixed(1)}" cy="80" r="9"/><text class="lab" x="20" y="124">tip: low notes</text><text class="lab" x="280" y="124" text-anchor="end">base: high notes</text>`;
}
