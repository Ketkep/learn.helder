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
