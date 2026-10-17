// The solar system page: four stops. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { fmtDuration, fmtLength, modelDistanceM, modelSizeM, planets, sunPresets, timesOff, tripSeconds, vehicles, whereAmI } from '../../lib/scale';

const root = document.querySelector<HTMLElement>('[data-scale]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Stop 1: shrink the Sun
  const shrink = root.querySelector<HTMLElement>('[data-shrink-tool]');
  if (shrink) {
    const picks = shrink.querySelectorAll<HTMLElement>('[data-shrink-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const cm = Number(b.getAttribute('data-shrink-pick'));
        const name = sunPresets.find((s) => s.cm === cm)?.name.toLowerCase() || 'a ball';
        press(picks, b);
        q(shrink, '[data-shrink-body]').innerHTML = planets.map((p) => `<tr><th scope="row">${p.name}</th><td>${fmtLength(modelDistanceM(p.au, cm))}</td><td>${fmtLength(modelSizeM(p.km, cm))}</td></tr>`).join('');
        q(shrink, '[data-shrink-status]').textContent = `With the Sun ${name} (${cm} cm), the Earth is ${fmtLength(modelSizeM(12742, cm))} wide and ${fmtLength(modelDistanceM(1, cm))} from the Sun. Neptune is ${fmtLength(modelDistanceM(30.05, cm))} away.`;
      }),
    );
  }

  // Stop 2: walk the road
  const walk = root.querySelector<HTMLElement>('[data-walk-tool]');
  if (walk) {
    const range = q<HTMLInputElement>(walk, '[data-walk-range]');
    const you = q<SVGCircleElement>(walk, '[data-walk-you]');
    const cm = 8;
    const draw = () => {
      fillRange(range);
      const m = Number(range.value);
      q(walk, '[data-walk-out]').textContent = `${m} m`;
      you.setAttribute('cx', String(14 + (272 * m) / Number(range.max)));
      const w = whereAmI(m, cm);
      const time = fmtDuration(m / 1.4);
      q(walk, '[data-walk-status]').textContent = m === 0
        ? 'You stand at the Sun, an apple 8 cm across. Slide along the road.'
        : `After ${m} m, about ${time} of walking, you have passed ${w.passed.join(', ') || 'no planets'}. ${w.next ? `Next is ${w.next.name}, ${fmtLength(w.toNext || 0)} further on.` : 'You are past Neptune.'}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Stop 3: guess
  const guess = root.querySelector<HTMLElement>('[data-guess-tool]');
  if (guess) {
    const picks = guess.querySelectorAll<HTMLElement>('[data-guess-pick]');
    const range = q<HTMLInputElement>(guess, '[data-guess-range]');
    const status = q<HTMLElement>(guess, '[data-guess-status]');
    let name = 'Saturn';
    const draw = () => {
      fillRange(range);
      q(guess, '[data-guess-out]').textContent = `${range.value} m`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        name = b.getAttribute('data-guess-pick') || name;
        press(picks, b);
        status.textContent = `The Sun is an apple, 8 cm across. How far from the Sun, in metres, is ${name}? Slide to your guess and press check.`;
      }),
    );
    range.addEventListener('input', draw);
    q(guess, '[data-guess-check]').addEventListener('click', () => {
      const p = planets.find((x) => x.name === name)!;
      const real = modelDistanceM(p.au, 8);
      const g = Number(range.value);
      const off = timesOff(g, real);
      const dir = g > real ? 'too far' : 'too near';
      status.textContent = off < 1.15
        ? `Very close. ${name} is ${fmtLength(real)} from the Sun in this model, and you guessed ${g} m.`
        : `${name} is ${fmtLength(real)} from the Sun in this model. Your guess of ${g} m was ${off.toFixed(1)} times ${dir}.`;
      sound.play(off < 1.5 ? 'good' : 'thud', 0.4);
    });
    draw();
  }

  // Stop 4: trip times
  const trip = root.querySelector<HTMLElement>('[data-trip-tool]');
  if (trip) {
    const picks = trip.querySelectorAll<HTMLElement>('[data-trip-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const p = planets.find((x) => x.name === b.getAttribute('data-trip-pick'))!;
        press(picks, b);
        q(trip, '[data-trip-head]').textContent = `Sun to ${p.name}`;
        q(trip, '[data-trip-body]').innerHTML = vehicles.map((v) => `<tr><th scope="row">${v.name}</th><td>${fmtDuration(tripSeconds(p.au, v.kmS))}</td></tr>`).join('');
        q(trip, '[data-trip-status]').textContent = `From the Sun to ${p.name}, ${p.au} AU: light takes ${fmtDuration(tripSeconds(p.au, vehicles[4].kmS))} and Voyager 1 would need ${fmtDuration(tripSeconds(p.au, vehicles[3].kmS))}.`;
      }),
    );
  }
}
