// Maths and drawings for the nerve page. The voltages come from the sources. The timings are rounded and made up for the page.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const REST = -70; // millivolts
export const THRESHOLD = -55;
export const PEAK = 35; // sources give about +30 to +40
export const UNDERSHOOT = -80;

// Made up timings, in milliseconds, for the shape of the spike and the two refractory periods
export const RISE = 0.5;
export const FALL = 1.5;
export const BACK = 4;
export const ABSOLUTE_MS = 2;
export const RELATIVE_MS = 5;

/** The voltage t milliseconds after a spike begins at the threshold. */
export function spikeAt(t: number): number {
  if (t < 0) return THRESHOLD;
  if (t < RISE) return THRESHOLD + (PEAK - THRESHOLD) * (t / RISE);
  if (t < FALL) return PEAK + (UNDERSHOOT - PEAK) * ((t - RISE) / (FALL - RISE));
  if (t < BACK) return UNDERSHOOT + (REST - UNDERSHOOT) * ((t - FALL) / (BACK - FALL));
  return REST;
}

// ---------- A chart of voltage against time ----------

const X0 = 34;
const X1 = 290;
const Y0 = 14;
const Y1 = 150;

function chart(tmax: number, body: (x: (t: number) => number, y: (v: number) => number) => string): string {
  const x = (t: number) => X0 + (t / tmax) * (X1 - X0);
  const y = (v: number) => Y0 + ((PEAK + 10 - v) / (PEAK + 10 - (UNDERSHOOT - 5))) * (Y1 - Y0);
  let s = '';
  for (const v of [PEAK, 0, REST, UNDERSHOOT]) s += `<line class="grid" x1="${X0}" y1="${f1(y(v))}" x2="${X1}" y2="${f1(y(v))}"/><text class="lab" x="${X0 - 3}" y="${f1(y(v) + 3)}" text-anchor="end">${v}</text>`;
  s += `<line class="thr" x1="${X0}" y1="${f1(y(THRESHOLD))}" x2="${X1}" y2="${f1(y(THRESHOLD))}"/><text class="lab thr" x="${X1}" y="${f1(y(THRESHOLD) - 3)}" text-anchor="end">threshold ${THRESHOLD}</text>`;
  s += `<text class="lab" x="${X0}" y="${Y1 + 14}">0</text><text class="lab" x="${X1}" y="${Y1 + 14}" text-anchor="end">${tmax} ms</text><text class="lab" x="6" y="10">mV</text>`;
  return s + body(x, y);
}

const path = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join(' ');

// ---------- Part 1: the threshold ----------

/** The voltage trace after a push of this many millivolts at 1 ms: it either fades or becomes a spike. */
export const fires = (push: number) => REST + push >= THRESHOLD;

export function pushSvg(push: number): string {
  const tmax = 10;
  return chart(tmax, (x, y) => {
    const pts: [number, number][] = [];
    for (let t = 0; t <= tmax + 0.001; t += 0.1) {
      let v = REST;
      if (t >= 1) v = fires(push) ? spikeAt(t - 1) : REST + push * Math.exp(-(t - 1) / 1.5);
      pts.push([x(t), y(v)]);
    }
    return `<path class="trace" d="${path(pts)}"/>`;
  });
}

// ---------- Part 2: a stronger push, more spikes ----------

const TAU = 10; // ms, how fast the membrane leaks back toward rest

/** Spike times in a window, for a steady push of this many millivolts. After a spike the membrane stays low for the absolute refractory period. */
export function spikeTrain(push: number, window = 100): number[] {
  const out: number[] = [];
  let v = REST;
  let hold = 0;
  const dt = 0.05;
  for (let t = 0; t < window; t += dt) {
    if (hold > 0) {
      hold -= dt;
      continue;
    }
    v += (dt / TAU) * (-(v - REST) + push);
    if (v >= THRESHOLD) {
      out.push(t);
      v = UNDERSHOOT;
      hold = ABSOLUTE_MS;
    }
  }
  return out;
}

export function trainSvg(push: number): string {
  const tmax = 100;
  const spikes = spikeTrain(push, tmax);
  return chart(tmax, (x, y) => {
    let s = '';
    spikes.forEach((t) => (s += `<line class="spike" x1="${f1(x(t))}" y1="${f1(y(THRESHOLD))}" x2="${f1(x(t))}" y2="${f1(y(PEAK))}"/>`));
    return s + `<line class="trace" x1="${X0}" y1="${f1(y(REST))}" x2="${X1}" y2="${f1(y(REST))}" style="opacity:.35"/>`;
  });
}

// ---------- Part 3: the refractory periods ----------

export type Second = 'blocked' | 'harder' | 'fires' | 'fades';

/** What happens to a second push of a given size, a number of milliseconds after the first spike began. */
export function secondPush(gap: number, push: number): Second {
  const need = THRESHOLD - REST; // the push that reaches the threshold from rest
  if (gap < ABSOLUTE_MS) return 'blocked';
  if (gap < RELATIVE_MS) return push >= 2.5 * need ? 'fires' : 'harder';
  return push >= need ? 'fires' : 'fades';
}

export function twoSvg(gap: number, push: number): string {
  const tmax = 14;
  const second = secondPush(gap, push);
  return chart(tmax, (x, y) => {
    const pts: [number, number][] = [];
    for (let t = 0; t <= tmax + 0.001; t += 0.1) {
      let v = t >= 1 ? spikeAt(t - 1) : REST;
      const t2 = 1 + gap;
      if (t >= t2) {
        if (second === 'fires') v = Math.max(spikeAt(t - t2), v > REST ? v : REST);
        else v = Math.max(v, Math.min(v + push * Math.exp(-(t - t2) / 1.5), -56));
      }
      pts.push([x(t), y(v)]);
    }
    return `<path class="trace" d="${path(pts)}"/><line class="mark" x1="${f1(x(1))}" y1="${Y0}" x2="${f1(x(1))}" y2="${Y1}"/><line class="mark" x1="${f1(x(1 + gap))}" y1="${Y0}" x2="${f1(x(1 + gap))}" y2="${Y1}"/>`;
  });
}

// ---------- Part 4: how fast ----------

export const SLOW = 1; // metres a second, an unmyelinated fibre (sources give 0.5 to 2)
export const FAST = 100; // a myelinated fibre (sources give 70 to 120)

/** Milliseconds for a signal to travel a length in metres at a speed in metres a second. */
export const travelMs = (metres: number, speed: number) => (metres / speed) * 1000;

export function raceSvg(metres: number): string {
  const slow = travelMs(metres, SLOW);
  const fast = travelMs(metres, FAST);
  const top = Math.max(slow, 1);
  const w = (ms: number) => 8 + (ms / top) * 250;
  return `<text class="lab" x="12" y="24">without myelin: ${fmt(slow)} ms</text><rect class="bar slow" x="12" y="30" width="${f1(w(slow))}" height="22" rx="4"/><text class="lab" x="12" y="82">with myelin: ${fmt(fast, fast < 10 ? 1 : 0)} ms</text><rect class="bar fast" x="12" y="88" width="${f1(w(fast))}" height="22" rx="4"/>`;
}
