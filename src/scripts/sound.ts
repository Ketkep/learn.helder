// Small sounds for the topic pages, made in the browser. There are no audio files.
// Browsers keep sound locked until the reader has touched the page once, so nothing plays
// before the first tap, click or key press. After that, sounds follow the toggle.

export type Sound =
  | 'move'
  | 'capture'
  | 'check'
  | 'mate'
  | 'good'
  | 'bad'
  | 'tick'
  | 'pop'
  | 'scrape'
  | 'rumble'
  | 'crack'
  | 'thud'
  | 'coin'
  | 'clink'
  | 'whoosh'
  | 'beam'
  | 'snap';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = true;

try {
  if (localStorage.getItem('sound') === 'off') enabled = false;
} catch {
  // Private windows can block storage. The default (on) is fine.
}

export const isSoundOn = () => enabled;

export function setSoundOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem('sound', on ? 'on' : 'off');
  } catch {
    // Not saving is fine.
  }
}

/** Call from a tap, click or key press. Safe to call many times. */
export function unlock() {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return;
  }
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);
  // One second of noise, reused for every wooden tap
  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
}

/** A short burst of filtered noise: the click of a piece on a wooden board. */
function tap(at: number, loudness: number, tone = 900, length = 0.07) {
  if (!ctx || !master || !noise || loudness <= 0) return;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = tone;
  band.Q.value = 1.1;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(loudness, at + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  src.connect(band).connect(gain).connect(master);
  src.start(at, Math.random() * 0.5, length + 0.02);
}

/** A plain tone with a quick fade in and a long fade out. */
function tone(at: number, freq: number, length: number, loudness: number, type: OscillatorType = 'sine', slideTo?: number) {
  if (!ctx || !master || loudness <= 0) return;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(loudness, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + length + 0.05);
}

/**
 * A plucked string: a note at `freq` Hz made of sine partials. `partials[0]` is the loudness of the note itself,
 * `partials[1]` of the note an octave up, and so on. The sound dies away by itself.
 * Returns how long the note lasts in seconds, or 0 when nothing played (sound off or still locked).
 */
export function pluck(freq: number, partials: number[] = [1], seconds = 1.6) {
  if (!enabled || !ctx || !master) return 0;
  if (ctx.state === 'suspended') void ctx.resume();
  const total = partials.reduce((a, b) => a + b, 0);
  if (total <= 0) return 0;
  const t = ctx.currentTime + 0.005;
  partials.forEach((level, i) => {
    const f = freq * (i + 1);
    if (level <= 0 || f > 9000) return;
    // Higher partials fade faster, like a real string
    tone(t, f, seconds / (1 + i * 0.35), (0.26 * level) / Math.max(total, 1.5), 'sine');
  });
  return seconds;
}

/**
 * A held tone, like a telegraph key being pressed. It starts at once and goes on until the returned function is called.
 * Returns nothing to call when sound is off or still locked.
 */
export function hold(freq: number) {
  if (!enabled || !ctx || !master) return () => {};
  if (ctx.state === 'suspended') void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.2, t + 0.006);
  osc.connect(gain).connect(master);
  osc.start(t);
  return () => {
    if (!ctx) return;
    const end = ctx.currentTime;
    gain.gain.cancelScheduledValues(end);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), end);
    gain.gain.exponentialRampToValueAtTime(0.0001, end + 0.01);
    osc.stop(end + 0.03);
  };
}

/**
 * A row of beeps scheduled ahead of time, for a message. Each beep is `[start, length]` in seconds from now.
 * Call the returned function to cut the rest off.
 */
export function beeps(freq: number, list: [number, number][]) {
  if (!enabled || !ctx || !master) return () => {};
  if (ctx.state === 'suspended') void ctx.resume();
  const group = ctx.createGain();
  group.connect(master);
  const t0 = ctx.currentTime + 0.05;
  for (const [start, length] of list) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0 + start);
    g.gain.exponentialRampToValueAtTime(0.2, t0 + start + 0.006);
    g.gain.setValueAtTime(0.2, t0 + start + Math.max(length - 0.01, 0.007));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + length);
    osc.connect(g).connect(group);
    osc.start(t0 + start);
    osc.stop(t0 + start + length + 0.02);
  }
  return () => {
    if (ctx) group.disconnect();
  };
}

/** `power` is 0 to 1 and scales the loudness (and, for a rumble, how long it lasts). */
export function play(kind: Sound, power = 1) {
  if (!enabled || !ctx || !master) return;
  if (ctx.state === 'suspended') void ctx.resume();
  const t = ctx.currentTime + 0.005;

  switch (kind) {
    case 'move':
      tap(t, 0.5, 850, 0.07);
      tone(t, 150, 0.09, 0.16);
      break;
    case 'capture':
      tap(t, 0.7, 700, 0.08);
      tap(t + 0.06, 0.55, 950, 0.07);
      tone(t, 120, 0.12, 0.2);
      break;
    case 'check':
      tap(t, 0.55, 850, 0.07);
      tone(t, 150, 0.09, 0.16);
      tone(t + 0.07, 880, 0.18, 0.1, 'triangle');
      break;
    case 'mate':
      tap(t, 0.6, 800, 0.08);
      tone(t + 0.05, 196, 1.5, 0.16, 'triangle');
      tone(t + 0.05, 247, 1.5, 0.12, 'triangle');
      tone(t + 0.05, 294, 1.5, 0.1, 'triangle');
      break;
    case 'good':
      tone(t, 523, 0.18, 0.12, 'triangle');
      tone(t + 0.1, 784, 0.32, 0.12, 'triangle');
      break;
    case 'bad':
      tone(t, 140, 0.4, 0.22, 'triangle', 70);
      break;
    case 'tick':
      tap(t, 0.25, 2800, 0.02);
      break;
    case 'pop':
      tone(t, 420, 0.1, 0.1, 'sine', 640);
      break;
    case 'scrape':
      // A brush on dry earth: short, dry, high noise
      tap(t, 0.16 * power, 3200, 0.09);
      break;
    case 'rumble':
      // Low noise and a deep tone, for an earthquake
      tap(t, 0.5 * power, 110, 1.2 + 1.6 * power);
      tone(t, 48, 1.2 + 1.6 * power, 0.22 * power, 'sine', 34);
      break;
    case 'crack':
      tap(t, 0.8, 1500, 0.12);
      tone(t, 260, 0.14, 0.14, 'triangle', 90);
      break;
    case 'thud':
      tone(t, 95, 0.2, 0.3, 'sine', 52);
      tap(t, 0.2, 200, 0.08);
      break;
    case 'coin':
      // A small ring of metal
      tone(t, 1320, 0.5, 0.09, 'sine');
      tone(t + 0.01, 1980, 0.35, 0.05, 'sine');
      break;
    case 'clink':
      tone(t, 1760, 0.18, 0.07, 'sine');
      tone(t + 0.03, 2350, 0.14, 0.04, 'sine');
      break;
    case 'whoosh':
      tap(t, 0.22 * power, 900, 0.5);
      break;
    case 'beam':
      // A soft rising hum, for a beam switching on
      tone(t, 180, 0.3, 0.08 * power, 'sine', 300);
      break;
    case 'snap':
      tap(t, 0.3 * power, 2400, 0.03);
      break;
  }
}
