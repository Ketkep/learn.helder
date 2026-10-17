// Maths for the solar system page: planets on a scale model, trip times and a guessing game.
// Distances are mean distances from the Sun. Planets travel on ellipses, so the real distance changes during a year.

export const KM_PER_AU = 149597870.7;
export const SUN_KM = 1391400;
export const LIGHT_KM_S = 299792.458;

export interface Planet {
  name: string;
  au: number;
  km: number; // diameter
}

export const planets: Planet[] = [
  { name: 'Mercury', au: 0.39, km: 4879 },
  { name: 'Venus', au: 0.72, km: 12104 },
  { name: 'Earth', au: 1.0, km: 12742 },
  { name: 'Mars', au: 1.52, km: 6779 },
  { name: 'Jupiter', au: 5.2, km: 139820 },
  { name: 'Saturn', au: 9.58, km: 116460 },
  { name: 'Uranus', au: 19.2, km: 50724 },
  { name: 'Neptune', au: 30.05, km: 49244 },
];

export const VOYAGER_AU = 160; // about, in 2025

/** Metres in the model for every kilometre in space, when the Sun is a ball of this many centimetres. */
export function metresPerKm(sunCm: number): number {
  return sunCm / 100 / SUN_KM;
}

export function modelDistanceM(au: number, sunCm: number): number {
  return au * KM_PER_AU * metresPerKm(sunCm);
}

export function modelSizeM(km: number, sunCm: number): number {
  return km * metresPerKm(sunCm);
}

export function fmtLength(m: number): string {
  if (m < 0.01) return `${(m * 1000).toFixed(m * 1000 < 1 ? 2 : 1)} mm`;
  if (m < 1) return `${(m * 100).toFixed(1)} cm`;
  if (m < 1000) return `${m < 10 ? m.toFixed(1) : Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

export const sunPresets = [
  { id: 'pea', name: 'A pea', cm: 1 },
  { id: 'apple', name: 'An apple', cm: 8 },
  { id: 'ball', name: 'A beach ball', cm: 50 },
];

export const vehicles = [
  { id: 'walk', name: 'Walking', kmS: 5 / 3600 },
  { id: 'car', name: 'A car', kmS: 100 / 3600 },
  { id: 'jet', name: 'A jet plane', kmS: 900 / 3600 },
  { id: 'voyager', name: 'Voyager 1', kmS: 17 },
  { id: 'light', name: 'Light', kmS: LIGHT_KM_S },
];

export function fmtDuration(s: number): string {
  const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
  if (s < 90) return plural(Math.round(s), 'second');
  if (s < 90 * 60) return plural(Math.round(s / 60), 'minute');
  if (s < 48 * 3600) return plural(Math.round(s / 3600 * 10) / 10, 'hour');
  if (s < 2 * 365.25 * 86400) return plural(Math.round(s / 86400), 'day');
  const y = s / (365.25 * 86400);
  return `${y < 100 ? Math.round(y * 10) / 10 : Math.round(y).toLocaleString('en-US')} years`;
}

export function tripSeconds(au: number, kmS: number): number {
  return (au * KM_PER_AU) / kmS;
}

/** Which planets you have passed after walking this far, and what is next. */
export function whereAmI(m: number, sunCm: number): { passed: string[]; next?: Planet; toNext?: number } {
  const passed = planets.filter((p) => modelDistanceM(p.au, sunCm) <= m).map((p) => p.name);
  const next = planets.find((p) => modelDistanceM(p.au, sunCm) > m);
  return { passed, next, toNext: next ? modelDistanceM(next.au, sunCm) - m : undefined };
}

/** The guessing game: how many times off a guess is, always 1 or more. */
export function timesOff(guess: number, real: number): number {
  return guess > real ? guess / real : real / guess;
}
