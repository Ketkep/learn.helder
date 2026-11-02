// The retrograde page: three seats under a dome. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { MARS, PLANETS, backwards, distance, fmt, graphSvg, longitude, loop, orbitSvg, reach, storiesSvg, window as around } from '../../lib/retro';

const root = document.querySelector<HTMLElement>('[data-retro]');

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

const named = (n: string) => PLANETS.filter((p) => p.name === n)[0];

/** Sets the ends of a day slider for a planet and keeps the day inside them. */
function span(range: HTMLInputElement, name: string, graph = false) {
  const r = graph ? around(named(name)) : reach(named(name));
  range.min = String(-r);
  range.max = String(r);
  range.value = String(Math.max(-r, Math.min(r, Number(range.value))));
}

if (root) {
  initSoundButton(root);

  // The tabs: one seat at a time
  const seats = Array.from(root.querySelectorAll<HTMLElement>('[data-seat]'));
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const show = (id: string, focus: boolean) => {
    seats.forEach((s) => (s.hidden = s.dataset.seat !== id));
    tabs.forEach((t) => {
      const on = t.dataset.tab === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => {
      show(t.dataset.tab as string, false);
      sound.play('tick', 0.3);
    });
    t.addEventListener('keydown', (e) => {
      const k = e.key;
      if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return;
      e.preventDefault();
      const n = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      show(tabs[n].dataset.tab as string, true);
    });
  });
  show('orbit', false);

  // Seat 1: Earth overtakes a planet
  const or = root.querySelector<HTMLElement>('[data-orbit-tool]');
  if (or) {
    let name = 'Mars';
    const range = q<HTMLInputElement>(or, '[data-orbit-range]');
    const draw = () => {
      fillRange(range);
      const p = named(name);
      const t = Number(range.value);
      q(or, '[data-orbit-out]').textContent = String(t);
      q(or, '[data-orbit-g]').innerHTML = orbitSvg(p, t);
      const d = distance(p, t);
      q(or, '[data-orbit-status]').textContent = `${name} on day ${t}: it is ${fmt(d, 2)} astronomical units from the Earth, and its direction in the sky is ${fmt(longitude(p, t))} degrees from where it was on day 0. ${backwards(p, t) ? `${name} seems to be moving backwards now.` : `${name} is moving forwards, as usual.`}`;
    };
    picks(q(or, '[data-orbit-picks]'), PLANETS.map((p) => p.name), name, (v) => {
      name = v;
      span(range, name);
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Seat 2: the direction day by day
  const gr = root.querySelector<HTMLElement>('[data-graph-tool]');
  if (gr) {
    let name = 'Mars';
    const range = q<HTMLInputElement>(gr, '[data-graph-range]');
    const draw = () => {
      fillRange(range);
      const p = named(name);
      const t = Number(range.value);
      q(gr, '[data-graph-out]').textContent = String(t);
      q(gr, '[data-graph-g]').innerHTML = graphSvg(p, t);
      const l = loop(p);
      q(gr, '[data-graph-status]').textContent = `In this simplified model ${name} goes backwards for ${fmt(l.days)} days and moves back about ${fmt(l.back)} degrees, about ${fmt(l.back / 0.5)} times the width of the full Moon. On day ${t} it is ${backwards(p, t) ? 'moving backwards' : 'moving forwards'}.`;
    };
    picks(q(gr, '[data-graph-picks]'), PLANETS.map((p) => p.name), name, (v) => {
      name = v;
      span(range, name, true);
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Seat 3: two stories, one sky
  const st = root.querySelector<HTMLElement>('[data-stories-tool]');
  if (st) {
    const range = q<HTMLInputElement>(st, '[data-stories-range]');
    const draw = () => {
      fillRange(range);
      const t = Number(range.value);
      q(st, '[data-stories-out]').textContent = String(t);
      q(st, '[data-stories-g]').innerHTML = storiesSvg(t);
      q(st, '[data-stories-status]').textContent = `Day ${t}: both pictures point at Mars in the same direction, ${fmt(longitude(MARS, t))} degrees from where it was on day 0. Mars is ${fmt(distance(MARS, t), 2)} astronomical units away in this model and ${backwards(MARS, t) ? 'seems to be going backwards' : 'is moving forwards'}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
