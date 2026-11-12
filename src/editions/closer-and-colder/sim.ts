// The experiment of "Closer to the Sun, colder outside": a day slider, three places and two switches.
// Each change redraws the four pictures with the same code the server used (draw.ts), and reports a
// goal to the edition (flow.ts) when the reader has done one of the things on the list.
// Nothing moves by itself, so there is nothing to stop for reduced motion.

import { EARTH, PLACES, distance, hoursLabel, noonHeight, type World } from './model';
import { beamView, dayBar, readouts, sideView, yearChart } from './draw';
import { fillRange } from '../../scripts/util';

const sim = document.querySelector<HTMLElement>('[data-cc-sim]');
if (sim) start(sim);

function start(sim: HTMLElement) {
  const $ = <T extends Element>(s: string) => sim.querySelector<T>(s);
  const input = $<HTMLInputElement>('[data-cc-day]');
  if (!input) return;

  let day = Number(sim.dataset.start) || 316;
  let place: (typeof PLACES)[number] = PLACES[0];
  const w: World = { tilt: EARTH.tilt, distance: true };
  // Months visited in Amsterdam, for the "compare June with December" goal
  const seen = new Set<string>();

  const goal = (id: string) => sim.dispatchEvent(new CustomEvent('learndle:goal', { detail: id, bubbles: true }));
  const short = () => place.name.split(',')[0];
  const put = (sel: string, html: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.innerHTML = html;
  };
  const text = (sel: string, t: string) => {
    const el = $<HTMLElement>(sel);
    if (el) el.textContent = t;
  };

  let sayTimer = 0;
  function say() {
    // One summary for screen readers once the reader stops moving, not one per slider step
    window.clearTimeout(sayTimer);
    sayTimer = window.setTimeout(() => {
      const r = readouts(place.lat, day, w);
      text('[data-cc-say]', `${r.date} in ${short()}: ${r.height === 'below the horizon' ? 'the Sun stays below the horizon' : `the Sun is ${r.height} up at noon`}, ${hoursLabel(r.daylight)} of daylight, ${r.energy.toFixed(1)} kWh of sunlight per square metre.`);
    }, 500);
  }

  function draw() {
    const r = readouts(place.lat, day, w);
    put('[data-cc-side]', sideView(place.lat, day, w, short()));
    put('[data-cc-beam]', beamView(noonHeight(place.lat, day, w)));
    put('[data-cc-daybar]', dayBar(r.daylight));
    put('[data-cc-year]', yearChart(place.lat, day, w));
    put('[data-cc-year-narrow]', yearChart(place.lat, day, w, true));
    text('[data-cc-r-daylight]', hoursLabel(r.daylight));
    text('[data-cc-r-date]', r.date);
    text('[data-cc-r-distance]', w.distance ? `${distance(day).toFixed(1)} million km` : `${EARTH.a.toFixed(1)} million km, kept the same`);
    text('[data-cc-r-height]', r.height);
    text('[data-cc-r-energy]', `${r.energy.toFixed(1)} kWh per m²`);
    text('[data-cc-day-out]', r.date);
    text('[data-cc-place-name]', short());
    input!.value = String(day);
    fillRange(input!);
    sim.querySelectorAll<HTMLButtonElement>('[data-cc-jump]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.ccJump) === day)));
    if (place.id === 'amsterdam') {
      seen.add(r.date.split(' ')[1]);
      if (seen.has('Jun') && seen.has('Dec')) goal('compared');
    }
  }

  input.addEventListener('input', () => {
    day = Number(input.value);
    draw();
    say();
  });

  sim.querySelectorAll<HTMLButtonElement>('[data-cc-jump]').forEach((b) =>
    b.addEventListener('click', () => {
      day = Number(b.dataset.ccJump);
      draw();
      say();
    }),
  );

  sim.querySelectorAll<HTMLButtonElement>('[data-cc-place]').forEach((b) =>
    b.addEventListener('click', () => {
      place = PLACES.find((p) => p.id === b.dataset.ccPlace) ?? PLACES[0];
      sim.querySelectorAll('[data-cc-place]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      draw();
      say();
    }),
  );

  sim.querySelectorAll<HTMLButtonElement>('[data-cc-switch]').forEach((b) =>
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-checked') !== 'true';
      b.setAttribute('aria-checked', String(on));
      const state = b.querySelector('[data-cc-sw-state]');
      if (b.dataset.ccSwitch === 'distance') {
        w.distance = on;
        if (state) state.textContent = on ? 'On, as in real life' : 'Off: always the average distance';
        if (!on) goal('distance-off');
      } else {
        w.tilt = on ? EARTH.tilt : 0;
        if (state) state.textContent = on ? 'On, 23.4°' : 'Off: the axis stands straight up';
        if (!on) goal('tilt-off');
      }
      draw();
      say();
    }),
  );

  draw();
}
