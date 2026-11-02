// The lighthouse page: three rooms. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { seeded } from '../../lib/rand';
import { LIGHTS, WEATHER, fmt, horizonSvg, lampSvg, lensSvg, lit, glassShare, period, seen, sees, stripSvg, thickest, KM_PER_NM } from '../../lib/lighthouse';

const root = document.querySelector<HTMLElement>('[data-lighthouse]');

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

  // Room 1: how far the light goes
  const ra = root.querySelector<HTMLElement>('[data-range-tool]');
  if (ra) {
    let weather = WEATHER[0];
    const light = q<HTMLInputElement>(ra, '[data-range-light]');
    const eye = q<HTMLInputElement>(ra, '[data-range-eye]');
    const dist = q<HTMLInputElement>(ra, '[data-range-dist]');
    const draw = () => {
      [light, eye, dist].forEach(fillRange);
      const L = Number(light.value);
      const E = Number(eye.value);
      const D = Number(dist.value);
      q(ra, '[data-range-light-out]').textContent = String(L);
      q(ra, '[data-range-eye-out]').textContent = String(E);
      q(ra, '[data-range-dist-out]').textContent = String(D);
      q(ra, '[data-range-g]').innerHTML = horizonSvg(L, E, weather.lamp, D);
      const s = seen(L, E, weather.lamp);
      const v = sees(L, E, weather.lamp, D);
      q(ra, '[data-range-status]').textContent = `A light ${L} m up, seen from an eye ${E} m up: the curve allows ${fmt(s.geo, 1)} nautical miles (${fmt(s.geo * KM_PER_NM, 1)} km). With the weather set to ${weather.label.toLowerCase()}, the made up lamp range is ${weather.lamp}. You can use ${fmt(s.range, 1)}, limited by ${s.limit}. A ship ${D} nautical miles away ${v.ok ? 'can see the light.' : `cannot see it. ${v.why}`}`;
    };
    const host = q(ra, '[data-range-weather]');
    picks(host, WEATHER.map((w) => w.label), weather.label, (l) => {
      weather = WEATHER.filter((w) => w.label === l)[0];
      draw();
    });
    [light, eye, dist].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Room 2: how a lamp becomes a beam
  const le = root.querySelector<HTMLElement>('[data-lens-tool]');
  if (le) {
    const range = q<HTMLInputElement>(le, '[data-lens-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(le, '[data-lens-out]').textContent = String(n);
      q(le, '[data-lens-g]').innerHTML = lensSvg(n);
      q(le, '[data-lens-status]').textContent = `With ${n} ${n === 1 ? 'ring' : 'rings'} the toy lens uses ${fmt(glassShare(n) * 100)}% of the glass of a solid lens, and its thickest part is ${fmt(thickest(n) * 100)}% of its width.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Room 3: how a light says who it is
  const pa = root.querySelector<HTMLElement>('[data-pattern-tool]');
  if (pa) {
    let cur = LIGHTS[1];
    let timer = 0;
    const lamp = q(pa, '[data-pattern-lamp]');
    const watch = q<HTMLButtonElement>(pa, '[data-pattern-watch]');
    const show = () => {
      q(pa, '[data-pattern-g]').innerHTML = stripSvg(cur, true);
      q(pa, '[data-pattern-status]').textContent = `${cur.name}: ${cur.words} The pattern repeats every ${period(cur)} seconds.`;
    };
    const stop = () => {
      cancelAnimationFrame(timer);
      timer = 0;
      watch.textContent = 'Watch the lamp';
      lamp.innerHTML = lampSvg(false);
    };
    lamp.innerHTML = lampSvg(false);
    picks(q(pa, '[data-pattern-picks]'), LIGHTS.map((l) => l.name), cur.name, (n) => {
      cur = LIGHTS.filter((l) => l.name === n)[0];
      stop();
      show();
    });
    watch.addEventListener('click', () => {
      if (timer) {
        stop();
        return;
      }
      watch.textContent = 'Stop';
      const t0 = performance.now();
      let was = false;
      const tick = (now: number) => {
        const t = (now - t0) / 1000;
        if (t > 30) {
          stop();
          return;
        }
        const on = lit(cur, t);
        if (on && !was) sound.play('tick', 0.25);
        if (on !== was) lamp.innerHTML = lampSvg(on);
        was = on;
        timer = requestAnimationFrame(tick);
      };
      timer = requestAnimationFrame(tick);
    });
    show();

    // Name that light
    const quizG = q(pa, '[data-quiz-g]');
    const choices = q(pa, '[data-quiz-choices]');
    const status = q(pa, '[data-quiz-status]');
    let count = 0;
    let right = 0;
    let tries = 0;
    let target = LIGHTS[0];
    let done = true;
    const next = () => {
      const r = seeded(count * 7 + 11);
      count += 1;
      target = LIGHTS[Math.floor(r() * LIGHTS.length)];
      const others = LIGHTS.filter((l) => l !== target).sort(() => r() - 0.5).slice(0, 3);
      const list = others.concat(target).sort(() => r() - 0.5);
      quizG.innerHTML = stripSvg(target, false);
      clear(choices);
      done = false;
      list.forEach((l) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pick';
        b.textContent = l.name;
        b.addEventListener('click', () => {
          if (done) return;
          done = true;
          tries += 1;
          const ok = l === target;
          if (ok) right += 1;
          sound.play(ok ? 'pop' : 'tick', 0.3);
          status.textContent = `${ok ? 'Right.' : `Not quite. It was ${target.name}.`} ${target.words} Score: ${right} of ${tries}.`;
        });
        choices.appendChild(b);
      });
      status.textContent = 'Which code matches this strip?';
    };
    q(pa, '[data-quiz-next]').addEventListener('click', next);
    next();
  }
}
