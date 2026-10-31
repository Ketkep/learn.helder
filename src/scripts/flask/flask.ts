// The thermos page: three boards. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { curveSvg, DESIGNS, FEATURES, flaskSvg, fmt, halfTime, hoursTo, ratesFor, WAYS } from '../../lib/flask';

const root = document.querySelector<HTMLElement>('[data-flask]');

if (root) {
  initSoundButton(root);

  // Board 1: three ways out
  const wa = root.querySelector<HTMLElement>('[data-ways-tool]');
  if (wa) {
    const picks = wa.querySelectorAll<HTMLElement>('[data-ways-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const w = WAYS[Number(b.getAttribute('data-ways-pick'))];
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(wa, '[data-ways-status]').textContent = `${w.name}. ${w.how} ${w.stop}`;
        sound.play('tick', 0.3);
      }),
    );
  }

  // Board 2: build a flask
  const bu = root.querySelector<HTMLElement>('[data-build-tool]');
  if (bu) {
    const on = new Set<string>(FEATURES.map((f) => f.id));
    const parts = q(bu, '[data-build-parts]');
    const draw = () => {
      const list = [...on];
      q(bu, '[data-build-g]').innerHTML = flaskSvg(list);
      const r = ratesFor(list);
      const mug = ratesFor([]);
      q(bu, '[data-build-status]').textContent = `${list.length ? 'With ' + list.map((id) => FEATURES.find((f) => f.id === id)!.name.toLowerCase()).join(', ') : 'With no parts'} the toy loses ${fmt(r.total * 100, 1)}% of the gap each hour, so the gap halves in ${fmt(halfTime(r.total), 1)} hours. An open mug loses ${fmt(mug.total * 100)}%. Conduction ${fmt(r.cond * 100, 1)}%, convection ${fmt(r.conv * 100, 1)}%, radiation ${fmt(r.rad * 100, 1)}%.`;
    };
    FEATURES.forEach((f) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick';
      b.textContent = f.name;
      b.setAttribute('aria-pressed', 'true');
      b.title = f.text;
      b.addEventListener('click', () => {
        if (on.has(f.id)) on.delete(f.id);
        else on.add(f.id);
        b.setAttribute('aria-pressed', on.has(f.id) ? 'true' : 'false');
        draw();
        sound.play('tick', 0.3);
      });
      parts.appendChild(b);
    });
    draw();
  }

  // Board 3: the cooling curve
  const cu = root.querySelector<HTMLElement>('[data-curve-tool]');
  if (cu) {
    const room = q<HTMLInputElement>(cu, '[data-curve-room]');
    const target = q<HTMLInputElement>(cu, '[data-curve-target]');
    const starts = cu.querySelectorAll<HTMLElement>('[data-curve-start]');
    let start = 90;
    const draw = () => {
      [room, target].forEach(fillRange);
      const ra = Number(room.value);
      const ta = Number(target.value);
      q(cu, '[data-curve-outr]').textContent = String(ra);
      q(cu, '[data-curve-outt]').textContent = String(ta);
      q(cu, '[data-curve-g]').innerHTML = curveSvg(start, ra);
      const words = DESIGNS.map((d) => {
        const h = hoursTo(ta, start, ra, ratesFor(d.on).total);
        return h === null ? `${d.name}: never, because the drink only moves toward ${ra} °C` : h === 0 ? `${d.name}: already there` : `${d.name}: ${fmt(h, 1)} hours`;
      });
      q(cu, '[data-curve-status]').textContent = `A drink at ${start} °C in a room of ${ra} °C reaches ${ta} °C after: ${words.join('; ')}.`;
    };
    starts.forEach((b) =>
      b.addEventListener('click', () => {
        start = Number(b.getAttribute('data-curve-start'));
        starts.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        draw();
        sound.play('tick', 0.3);
      }),
    );
    room.addEventListener('input', draw);
    target.addEventListener('input', draw);
    draw();
  }
}
