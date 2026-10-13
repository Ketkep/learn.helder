// The Thermostat page: four strip charts. This file starts each one.

import { initStrip, pct, summary } from './strip';

const root = document.querySelector<HTMLElement>('[data-thermostat]');

if (root) {
  initStrip(root, 'loop', {}, [
    { name: 'loop-set', key: 'set', show: (v) => `${v} degrees` },
    { name: 'loop-out', key: 'outside', show: (v) => `${v} degrees` },
  ], (s, r) => `You asked for ${s.set} degrees with ${s.outside} outside. ${summary(s, r)} To hold the set point the heater would need to be on ${r.needed > 1 ? 'more than all of the time' : `${pct(r.needed)} per cent of the time`}.`);
  initStrip(root, 'gap', {}, [{ name: 'gap-band', key: 'band', show: (v) => `${v.toFixed(1)} degrees` }], (s, r) => {
    const perHour = r.switches / 24;
    return `With a gap of ${s.band.toFixed(1)} degrees the room swung ${(r.max - r.min).toFixed(1)} degrees and the heater switched ${perHour < 1 ? 'less than once an hour' : `about ${Math.round(perHour)} times an hour`} (${r.switches} times in all). ${s.band < 0.8 ? 'A very small gap means a lot of clicking.' : s.band > 4 ? 'A wide gap means few switches and a big swing.' : 'A gap like this is a middle way.'}`;
  });
  initStrip(root, 'walls', {}, [{ name: 'walls-leak', key: 'leak', show: (v) => v.toFixed(2) }], (s, r) => `With a leak of ${s.leak.toFixed(2)} the heater was on ${pct(r.onShare)} per cent of the day, and it needed ${pct(r.needed)} per cent to hold the set point.${r.needed > 1 ? ' That is more than all of the time, so the heater is too small and the room cannot reach the temperature.' : ''} ${summary(s, r)}`);
  initStrip(root, 'lag', { band: 1, lag: 0.5 }, [{ name: 'lag-lag', key: 'lag', show: (v) => `${v.toFixed(1)} hours` }], (s, r) => `With a lag of ${s.lag.toFixed(1)} hours and a gap of ${s.band.toFixed(1)} degrees, the room swung from ${r.min.toFixed(1)} to ${r.max.toFixed(1)} degrees. The gap alone allows from ${(s.set - s.band / 2).toFixed(1)} to ${(s.set + s.band / 2).toFixed(1)}, so ${r.max - r.min > s.band + 0.3 ? 'the slow heater makes the room overshoot' : 'the room stays close to the gap'}.`);
}
