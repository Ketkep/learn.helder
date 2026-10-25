// The compass page: four charts. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { dipAt, fieldSvg, fmt, missKm, needleSvg, norths, pullAt, RATES, turnBy } from '../../lib/compass';

const root = document.querySelector<HTMLElement>('[data-compass]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Chart 1: the field dips
  const di = root.querySelector<HTMLElement>('[data-dip-tool]');
  if (di) {
    const range = q<HTMLInputElement>(di, '[data-dip-range]');
    const draw = () => {
      fillRange(range);
      const lat = Number(range.value);
      q(di, '[data-dip-out]').textContent = String(lat);
      q(di, '[data-dip-g]').innerHTML = fieldSvg(lat);
      const dip = dipAt(lat);
      const place = lat === 0 ? 'on the equator' : `at ${Math.abs(lat)}° ${lat > 0 ? 'north' : 'south'}`;
      q(di, '[data-dip-status]').textContent = `${place[0].toUpperCase()}${place.slice(1)} the field ${Math.abs(dip) < 0.05 ? 'is level' : `dips ${fmt(Math.abs(dip), 1)}° ${dip > 0 ? 'below' : 'above'} the level`}, and the level part of the pull is ${fmt(pullAt(lat) * 100)}% of what it is at the equator.${Math.abs(lat) >= 80 ? ' A compass is hard to use here, because the pull on the needle is so weak.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Chart 2: two norths
  const no = root.querySelector<HTMLElement>('[data-norths-tool]');
  if (no) {
    const range = q<HTMLInputElement>(no, '[data-norths-range]');
    const walk = q<HTMLInputElement>(no, '[data-norths-walk]');
    const draw = () => {
      [range, walk].forEach(fillRange);
      const d = Number(range.value);
      const km = Number(walk.value);
      q(no, '[data-norths-decl]').textContent = String(d);
      q(no, '[data-norths-km]').textContent = String(km);
      q(no, '[data-norths-g]').innerHTML = norths(d);
      q(no, '[data-norths-status]').textContent = d === 0
        ? 'With no declination the compass north and the true north are the same, so walking by the compass leaves you on course.'
        : `With a declination of ${Math.abs(d)}° ${d > 0 ? 'east' : 'west'}, walking ${km} km by the compass leaves you ${fmt(missKm(d, km) * 1000)} m to the side of where you meant to go.`;
    };
    range.addEventListener('input', draw);
    walk.addEventListener('input', draw);
    draw();
  }

  // Chart 3: the wandering pole
  const wa = root.querySelector<HTMLElement>('[data-wander-tool]');
  if (wa) {
    const picks = wa.querySelectorAll<HTMLElement>('[data-wander-rate]');
    const range = q<HTMLInputElement>(wa, '[data-wander-range]');
    let rate = RATES[1];
    const draw = () => {
      fillRange(range);
      const y = Number(range.value);
      q(wa, '[data-wander-out]').textContent = String(y);
      q(wa, '[data-wander-status]').textContent = `At ${rate.kmPerYear} km a year the pole moves ${fmt(rate.kmPerYear * y)} km in ${y} year${y === 1 ? '' : 's'}. ${rate.name}. The speed has not been steady.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        rate = RATES.find((r) => r.id === b.getAttribute('data-wander-rate')) || rate;
        press(picks, b);
        sound.play('tick', 0.3);
        draw();
      }),
    );
    range.addEventListener('input', draw);
    draw();
  }

  // Chart 4: fooling the needle
  const fo = root.querySelector<HTMLElement>('[data-fooled-tool]');
  if (fo) {
    const range = q<HTMLInputElement>(fo, '[data-fooled-range]');
    let last = 0;
    const draw = () => {
      fillRange(range);
      const cm = Number(range.value);
      q(fo, '[data-fooled-out]').textContent = String(cm);
      q(fo, '[data-fooled-g]').innerHTML = needleSvg(cm);
      const t = turnBy(cm);
      q(fo, '[data-fooled-status]').textContent = `With the magnet at ${cm} cm the needle is turned ${t.toFixed(0)}° from north. ${t > 80 ? 'It now points almost straight at the magnet.' : t < 3 ? 'The error is small.' : 'The error is large.'} In this toy, the magnet pulls as hard as the Earth does at 20 cm. The strength is made up.`;
      if (Math.abs(t - last) > 15) sound.play('tick', 0.2);
      last = t;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
