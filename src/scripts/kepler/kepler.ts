// The moon page: three boards. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { EARTH_KG, MOONS, PLANETS, daysAround, fmt, lawSvg, massOf, massSvg, moonSvg, sci, years } from '../../lib/kepler';

const root = document.querySelector<HTMLElement>('[data-kepler]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

if (root) {
  initSoundButton(root);

  // Board 1: Kepler's third law
  const la = root.querySelector<HTMLElement>('[data-law-tool]');
  if (la) {
    const range = q<HTMLInputElement>(la, '[data-law-range]');
    const draw = () => {
      fillRange(range);
      const au = Number(range.value);
      q(la, '[data-law-out]').textContent = fmt(au, 1);
      q(la, '[data-law-g]').innerHTML = lawSvg(au);
      const near = PLANETS.reduce((a, b) => (Math.abs(b.au - au) < Math.abs(a.au - au) ? b : a));
      q(la, '[data-law-status]').textContent = `A planet ${fmt(au, 1)} astronomical units from the Sun takes ${fmt(years(au), 2)} years for one orbit, because ${fmt(years(au), 2)} squared is ${fmt(years(au) ** 2, 2)} and ${fmt(au, 1)} cubed is ${fmt(au ** 3, 2)}. The nearest real planet is ${near.name}, at ${near.au}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Board 2: weigh a planet from its moon
  const we = root.querySelector<HTMLElement>('[data-weigh-tool]');
  if (we) {
    picks(q(we, '[data-weigh-picks]'), MOONS.map((m) => m.name), 'The Moon', (v) => {
      const m = MOONS.filter((x) => x.name === v)[0];
      q(we, '[data-weigh-g]').innerHTML = moonSvg(m.name, m.planet, m.km);
      const mass = massOf(m.km, m.days);
      q(we, '[data-weigh-status]').textContent = `${m.name} is ${fmt(m.km)} kilometres from ${m.planet === 'Earth' ? 'the Earth' : m.planet} and goes round in ${m.days} days. That gives ${m.planet === 'Earth' ? 'the Earth' : m.planet} a mass of ${sci(mass)} kilograms, which is ${fmt((mass / m.known) * 100, 1)}% of the accepted value, about ${fmt(mass / EARTH_KG, 1)} ${Math.abs(mass / EARTH_KG - 1) < 0.1 ? 'Earth mass' : 'Earth masses'}.`;
    });
  }

  // Board 3: a heavier planet, a faster moon
  const ma = root.querySelector<HTMLElement>('[data-mass-tool]');
  if (ma) {
    const range = q<HTMLInputElement>(ma, '[data-mass-range]');
    const draw = () => {
      fillRange(range);
      const earths = 10 ** (Number(range.value) - 1);
      q(ma, '[data-mass-out]').textContent = earths < 10 ? fmt(earths, 2) : fmt(earths);
      q(ma, '[data-mass-g]').innerHTML = massSvg(earths);
      const d = daysAround(earths);
      q(ma, '[data-mass-status]').textContent = `A moon at 384,400 kilometres round a planet of ${earths < 10 ? fmt(earths, 2) : fmt(earths)} Earth masses takes ${d < 10 ? fmt(d, 2) : fmt(d, 1)} days to go round.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
