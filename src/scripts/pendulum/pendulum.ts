// The pendulum page: three pendulums. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { PLACES, driftPerDay, exactPeriod, fmt, lengthFor, pendulumSvg, period } from '../../lib/pendulum';

const root = document.querySelector<HTMLElement>('[data-pendulum]');

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

interface Rig {
  length: number;
  deg: number;
  mass: number;
  tag: string;
  seconds: number;
}

/** A Swing button: the pendulum swings for twelve seconds, only after the button is pressed. Press again to stop. */
function swinger(host: Element, g: Element, button: HTMLButtonElement, rig: () => Rig, rest: () => void) {
  let raf = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    button.textContent = 'Swing';
    button.setAttribute('aria-pressed', 'false');
    rest();
  };
  button.addEventListener('click', () => {
    if (raf) {
      stop();
      return;
    }
    button.textContent = 'Stop';
    button.setAttribute('aria-pressed', 'true');
    const t0 = performance.now();
    let last = 0;
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      if (t > 12) {
        stop();
        return;
      }
      const r = rig();
      const phase = Math.cos((2 * Math.PI * t) / r.seconds);
      g.innerHTML = pendulumSvg(r.length, r.deg * phase, r.mass, r.tag);
      const pass = Math.floor((2 * t) / r.seconds + 0.25);
      if (pass !== last) {
        last = pass;
        sound.play('tick', 0.2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });
  void host;
  return stop;
}

if (root) {
  initSoundButton(root);

  // Pendulum 1: length and place
  const le = root.querySelector<HTMLElement>('[data-length-tool]');
  if (le) {
    let place = PLACES[0];
    const range = q<HTMLInputElement>(le, '[data-length-range]');
    const tag = () => `${fmt(Number(range.value), 2)} m on ${place.name}`;
    const rest = () => (q(le, '[data-length-g]').innerHTML = pendulumSvg(Number(range.value), 0, 0.2, tag()));
    const stop = swinger(le, q(le, '[data-length-g]'), q<HTMLButtonElement>(le, '[data-length-swing]'), () => ({ length: Number(range.value), deg: 30, mass: 0.2, tag: tag(), seconds: period(Number(range.value), place.g) }), rest);
    const draw = () => {
      fillRange(range);
      const L = Number(range.value);
      q(le, '[data-length-out]').textContent = fmt(L, 2);
      stop();
      q(le, '[data-length-status]').textContent = `A pendulum ${fmt(L, 2)} metres long on ${place.name} takes ${fmt(period(L, place.g), 2)} seconds for one full swing, which is ${fmt(60 / period(L, place.g), 1)} full swings a minute.`;
    };
    picks(q(le, '[data-length-picks]'), PLACES.map((p) => p.name), 'Earth', (v) => {
      place = PLACES.filter((p) => p.name === v)[0];
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Pendulum 2: weight and size of swing
  const sw = root.querySelector<HTMLElement>('[data-swing-tool]');
  if (sw) {
    const range = q<HTMLInputElement>(sw, '[data-swing-range]');
    const mass = q<HTMLInputElement>(sw, '[data-swing-mass]');
    const m = () => Number(mass.value) / 1000;
    const tag = () => `Swing of ${range.value} degrees, ${mass.value} g`;
    const rest = () => (q(sw, '[data-swing-g]').innerHTML = pendulumSvg(1, Number(range.value), m(), tag()));
    const stop = swinger(sw, q(sw, '[data-swing-g]'), q<HTMLButtonElement>(sw, '[data-swing-go]'), () => ({ length: 1, deg: Number(range.value), mass: m(), tag: tag(), seconds: exactPeriod(1, 9.81, Number(range.value)) }), rest);
    const draw = () => {
      [range, mass].forEach(fillRange);
      const d = Number(range.value);
      q(sw, '[data-swing-out]').textContent = String(d);
      q(sw, '[data-swing-mass-out]').textContent = mass.value;
      stop();
      const T = exactPeriod(1, 9.81, d);
      q(sw, '[data-swing-status]').textContent = `A swing of ${d} degrees takes ${fmt(T, 3)} seconds, which is ${fmt((T / period(1, 9.81) - 1) * 100, 1)}% longer than a small swing. The weight of ${mass.value} grams makes no difference.`;
    };
    [range, mass].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Pendulum 3: set a pendulum to beat seconds
  const se = root.querySelector<HTMLElement>('[data-seconds-tool]');
  if (se) {
    const range = q<HTMLInputElement>(se, '[data-seconds-range]');
    const draw = () => {
      fillRange(range);
      const L = Number(range.value);
      q(se, '[data-seconds-out]').textContent = fmt(L, 3);
      q(se, '[data-seconds-g]').innerHTML = pendulumSvg(L, 0, 0.5, `${fmt(L, 3)} m on Earth`);
      const T = period(L, 9.81);
      const d = driftPerDay(2, T);
      const target = lengthFor(2, 9.81);
      q(se, '[data-seconds-status]').textContent = `A pendulum ${fmt(L, 3)} metres long takes ${fmt(T, 3)} seconds for a full swing. ${Math.abs(d) < 5 ? 'A clock with it keeps good time.' : `A clock with it ${d > 0 ? 'gains' : 'loses'} ${fmt(Math.abs(d))} seconds in a day.`} The seconds pendulum is ${fmt(target, 3)} metres.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
