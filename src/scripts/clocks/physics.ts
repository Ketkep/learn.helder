// The clock maths. Plain functions, no page code.

export const G = 9.80665;

/** Time for one full swing of a pendulum of length `lengthM`, with a swing of `angleDeg` each way. */
export function period(lengthM: number, angleDeg = 0) {
  const small = 2 * Math.PI * Math.sqrt(lengthM / G);
  const a = (angleDeg * Math.PI) / 180;
  // The first correction for a wide swing: the period grows by about a sixteenth of the angle squared
  return small * (1 + (a * a) / 16);
}

/** Length for a full swing of exactly 2 seconds: L = g / pi squared, about 0.994 m. */
export const SECONDS_LENGTH = G / Math.PI ** 2;

/** How many seconds a clock built for a 2 second swing gains (+) or loses (-) in one hour, if its pendulum takes `t` seconds. */
export const driftPerHour = (t: number) => (2 / t - 1) * 3600;

/** A rate in hertz as words: 32768 gives "32,768 times a second". */
export const perSecond = (hz: number) => (hz >= 1 ? `${hz.toLocaleString('en-US')} ${hz === 1 ? 'time' : 'times'} a second` : `once every ${Math.round(1 / hz)} seconds`);

/** Seconds a clock gains or loses in a day, if its rate is off by `ppm` parts per million. */
export const driftPerDay = (ppm: number) => (ppm * 1e-6) * 86400;
