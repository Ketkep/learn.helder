// Maths and drawings for the time zone page: the Sun against the clock, clocks in different places and flights across zones.
// Offsets are standard (winter) time. Summer time is a switch on one panel, for Europe and the United States.

const f1 = (n: number) => Math.round(n * 10) / 10;

export interface City {
  id: string;
  name: string;
  lon: number; // degrees east
  off: number; // standard time, hours from UTC
  summer: boolean; // moves one hour forward in northern summer
}

export const cities: City[] = [
  { id: 'ams', name: 'Amsterdam', lon: 4.9, off: 1, summer: true },
  { id: 'lon', name: 'London', lon: -0.1, off: 0, summer: true },
  { id: 'nyc', name: 'New York', lon: -74, off: -5, summer: true },
  { id: 'hnl', name: 'Honolulu', lon: -157.9, off: -10, summer: false },
  { id: 'tyo', name: 'Tokyo', lon: 139.7, off: 9, summer: false },
  { id: 'per', name: 'Perth', lon: 115.9, off: 8, summer: false },
  { id: 'pek', name: 'Beijing', lon: 116.4, off: 8, summer: false },
  { id: 'ccu', name: 'Kolkata', lon: 88.4, off: 5.5, summer: false },
];

export const cityById = (id: string) => cities.find((c) => c.id === id)!;

export function offsetOf(c: City, summer: boolean): number {
  return c.off + (summer && c.summer ? 1 : 0);
}

/** Hours of clock time the zone is ahead of the Sun. The Sun is highest at noon when the zone matches the longitude. */
export function clockAheadMin(c: City, summer = false): number {
  return Math.round((offsetOf(c, summer) - c.lon / 15) * 60);
}

export function fmtClock(hours: number): string {
  const m = Math.round(((hours % 24) + 24) % 24 * 60) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function dayShift(hours: number): number {
  return Math.floor(hours / 24);
}

export function dayWord(shift: number): string {
  return shift === 0 ? 'the same day' : shift > 0 ? (shift === 1 ? 'the next day' : `${shift} days later`) : shift === -1 ? 'the day before' : `${-shift} days earlier`;
}

export function fmtOffset(off: number): string {
  const sign = off < 0 ? '-' : '+';
  const a = Math.abs(off);
  const h = Math.floor(a);
  const m = Math.round((a - h) * 60);
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
}

export function subsolarLon(utcHour: number): number {
  const lon = (12 - utcHour) * 15;
  return ((lon + 540) % 360) - 180;
}

/** A flat map of the world as a strip: day and night, the hourly zones and the cities. */
export function worldSvg(utcHour: number, highlight = ''): string {
  const [x0, w, top, h] = [10, 280, 18, 70];
  const X = (lon: number) => x0 + ((lon + 180) / 360) * w;
  const sun = subsolarLon(utcHour);
  // Daylight is a band 180 degrees wide centred on the Sun. It can wrap round the edge of the map.
  const a = sun - 90;
  const b = sun + 90;
  const rect = (l0: number, l1: number) => `<rect class="day" x="${f1(X(l0))}" y="${top}" width="${f1(X(l1) - X(l0))}" height="${h}"/>`;
  let day = '';
  if (a < -180) day = rect(-180, b) + rect(a + 360, 180);
  else if (b > 180) day = rect(a, 180) + rect(-180, b - 360);
  else day = rect(a, b);
  const stripes = Array.from({ length: 25 }, (_, i) => `<line class="zone" x1="${f1(X(-187.5 + i * 15))}" y1="${top}" x2="${f1(X(-187.5 + i * 15))}" y2="${top + h}"/>`).join('');
  const hours = Array.from({ length: 24 }, (_, i) => {
    const off = i - 12 + (i >= 12 ? 0 : 0);
    const z = off; // zone number from -12 to +11
    const clock = (((utcHour + z) % 24) + 24) % 24;
    return `<text class="hr" x="${f1(X(z * 15))}" y="${top + h + 12}" text-anchor="middle">${Math.floor(clock)}</text>`;
  }).join('');
  // The dots sit at their longitude. Cities close together are moved up or down so the names do not touch.
  const yShift: Record<string, number> = { ams: 10, lon: -10, nyc: 0, hnl: 0, tyo: -14, per: 14, pek: -2, ccu: 8 };
  const dots = cities
    .map((c) => {
      const y = top + h / 2 + (yShift[c.id] ?? 0);
      const on = c.id === highlight;
      return `<circle class="${on ? 'city on' : 'city'}" cx="${f1(X(c.lon))}" cy="${y}" r="${on ? 5 : 3.5}"/><text class="cn" x="${f1(X(c.lon))}" y="${y - 6}" text-anchor="middle">${c.name.slice(0, 3)}</text>`;
    })
    .join('');
  const sunDot = `<circle class="sun" cx="${f1(X(sun))}" cy="${top - 6}" r="6"/>`;
  return `<rect class="night" x="${x0}" y="${top}" width="${w}" height="${h}"/>${day}${stripes}${dots}${sunDot}${hours}`;
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  label: string;
}

export const trips: Trip[] = [
  { id: 'a', from: 'ams', to: 'nyc', label: 'Amsterdam to New York' },
  { id: 'b', from: 'tyo', to: 'hnl', label: 'Tokyo to Honolulu' },
  { id: 'c', from: 'hnl', to: 'tyo', label: 'Honolulu to Tokyo' },
  { id: 'd', from: 'lon', to: 'ccu', label: 'London to Kolkata' },
];

/** Leave at a local clock time in the first city, fly for some hours, and read the clock in the second city. */
export function arrive(t: Trip, departHour: number, flightHours: number, summer: boolean) {
  const [a, b] = [cityById(t.from), cityById(t.to)];
  const utc = departHour - offsetOf(a, summer) + flightHours;
  const local = utc + offsetOf(b, summer);
  const shift = Math.floor(local / 24) - Math.floor(departHour / 24);
  return { local, clock: fmtClock(local), shift, diff: offsetOf(b, summer) - offsetOf(a, summer) };
}
