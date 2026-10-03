// Stop 2: the sawmill race. The wind slider sets how fast the mill saws, the day slider is the
// clock, and Race plays the clock forward. The two days (5 and 120) are the real numbers;
// the wind setting is pretend, so the page says so.

import * as sound from '../sound';
import { clamp, fillRange, group, q, reducedMotion, watchVisible } from '../util';

export function initWind(root: HTMLElement) {
  const station = root.querySelector<HTMLElement>('[data-station="wind"]');
  if (!station) return;
  const scene = q<HTMLElement>(station, '[data-wind-scene]');
  const windInput = q<HTMLInputElement>(station, '[data-wind]');
  const dayInput = q<HTMLInputElement>(station, '[data-day]');
  const windOut = q<HTMLOutputElement>(station, '[data-wind-out]');
  const dayOut = q<HTMLOutputElement>(station, '[data-day-out]');
  const race = q<HTMLButtonElement>(station, '[data-race]');
  const millCount = q<HTMLElement>(station, '[data-mill-count]');
  const handCount = q<HTMLElement>(station, '[data-hand-count]');
  const status = q<HTMLElement>(station, '[data-wind-status]');
  const mill = [...station.querySelectorAll<SVGElement>('.beam.m')];
  const hand = [...station.querySelectorAll<SVGElement>('.beam.h')];
  const blades = q<SVGGElement>(station, '.blades');

  const beams = Number(scene.dataset.beams);
  const millDays = Number(scene.dataset.millDays);
  const handDays = Number(scene.dataset.handDays);
  const cx = blades.dataset.cx;
  const cy = blades.dataset.cy;

  let angle = 14;
  // The clock is kept here, with decimals. A slider with step 1 would round every small step away.
  let day = 0;
  let lastMill = 0;
  let lastTick = 0;
  let racing = false;

  const sawn = () => {
    const pct = Number(windInput.value);
    const days = millDays / (pct / 100);
    return {
      day,
      pct,
      days,
      m: Math.min(beams, Math.floor((beams * day) / days + 1e-9)),
      h: Math.min(beams, Math.floor((beams * day) / handDays + 1e-9)),
    };
  };

  function render() {
    const { day, pct, m, h } = sawn();
    dayInput.value = String(Math.round(day));
    fillRange(windInput);
    fillRange(dayInput);
    windOut.textContent = `${pct}%`;
    dayOut.textContent = String(Math.round(day));
    mill.forEach((el, i) => el.classList.toggle('on', i < m));
    hand.forEach((el, i) => el.classList.toggle('on', i < h));
    millCount.textContent = String(m);
    handCount.textContent = String(h);
    if (reducedMotion()) angle = 14 + pct * 0.8;
    blades.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);

    // A tick for every few beams that fall off the mill, but not too often
    const now = performance.now();
    if (m > lastMill && now - lastTick > 70) {
      sound.play('tick');
      lastTick = now;
    }
    lastMill = m;
  }

  /** The sentence for screen readers, and for everyone once the clock stops. */
  function say() {
    const { day, days, m, h } = sawn();
    const d = Math.round(day);
    if (d >= handDays) {
      status.innerHTML = `At this wind the mill needs <strong>${days.toFixed(days % 1 ? 1 : 0)} days</strong> for ${beams} beams. By hand it takes <strong>${handDays}</strong>.`;
    } else {
      status.innerHTML = `Day <strong>${d}</strong>: the mill has sawn <strong>${group(m)}</strong> beams. By hand: <strong>${group(h)}</strong>.`;
    }
  }

  function stop() {
    racing = false;
    scene.classList.remove('racing');
    race.textContent = 'Race';
  }

  function run() {
    let last = performance.now();
    const step = (t: number) => {
      if (!racing) return;
      day = clamp(day + (Math.max(0, t - last) / 1000) * 13, 0, handDays);
      last = t;
      render();
      if (day >= handDays) {
        const { m } = sawn();
        if (m >= beams) sound.play('good');
        stop();
        say();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  race.addEventListener('click', () => {
    if (racing) {
      stop();
      say();
      return;
    }
    if (day >= handDays) day = 0;
    lastMill = 0;
    if (reducedMotion()) {
      day = handDays;
      render();
      say();
      return;
    }
    racing = true;
    scene.classList.add('racing');
    race.textContent = 'Stop';
    run();
  });

  dayInput.addEventListener('input', () => {
    if (racing) stop();
    day = Number(dayInput.value);
    render();
  });
  dayInput.addEventListener('change', say);
  windInput.addEventListener('input', render);
  windInput.addEventListener('change', say);

  // The blades turn faster in more wind, but only while someone can see them
  if (!reducedMotion()) {
    let visible = false;
    let spinning = false;
    const spin = (t: number, last: number) => {
      if (!visible) {
        spinning = false;
        return;
      }
      angle = (angle + (t - last) * 0.0024 * Number(windInput.value)) % 360;
      blades.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);
      requestAnimationFrame((n) => spin(n, t));
    };
    watchVisible(station, (v) => {
      visible = v;
      if (v && !spinning) {
        spinning = true;
        requestAnimationFrame((t) => spin(t, t));
      }
    });
  }

  render();
}
