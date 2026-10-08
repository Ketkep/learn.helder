// The air and water maths for the water cycle page. Plain functions, temperatures in degrees Celsius.

/** The most water vapour a cubic metre of air can hold at temperature `t`, in grams (the Magnus formula). */
export function capacity(t: number) {
  const hPa = 6.1094 * Math.exp((17.625 * t) / (t + 243.04));
  return ((hPa * 100) / (461.5 * (t + 273.15))) * 1000;
}

/** The temperature at which `grams` of vapour in a cubic metre of air would be the most it can hold. */
export function dewPoint(grams: number) {
  // Search for the temperature whose capacity matches. Capacity grows with temperature, so a bisection works.
  let lo = -60;
  let hi = 60;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (capacity(mid) < grams) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Dry air cools about this much for every kilometre it rises (degrees). */
export const DRY_RATE = 9.8;
/** Air that is making cloud cools more slowly, because making cloud gives off heat. A typical value. */
export const WET_RATE = 6.5;

/**
 * Air starting at the foot of a mountain at `t0` degrees with relative humidity `rh` (0 to 1) is pushed up over
 * a mountain `height` km high and down the other side. Returns what happens at the foot, the top and the far foot.
 */
export function overMountain(t0: number, rh: number, height: number) {
  const vapour = capacity(t0) * rh;
  const dew = dewPoint(vapour);
  // The height where the rising air gets cool enough for cloud: about 1/ (dry rate - dew point drop) km per degree
  const base = Math.max(0, (t0 - dew) / (DRY_RATE - 1.8)); // km; the dew point itself falls about 1.8 degrees per km
  const cloudy = height > base;
  const topT = cloudy ? t0 - DRY_RATE * base - WET_RATE * (height - base) : t0 - DRY_RATE * height;
  const left = cloudy ? Math.min(vapour, capacity(topT)) : vapour; // vapour still in the air at the top
  const rain = vapour - left;
  const farT = topT + DRY_RATE * height; // it comes down dry, so it warms at the dry rate
  return { vapour, dew, base, cloudy, topT, rain, farT, farRh: left / capacity(farT), startRh: rh };
}

/** Grams of water in one million litres of the world's water, for a share given in per cent. */
export const litres = (percent: number) => percent * 10_000;
