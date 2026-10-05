// Scene 6: three kinds of rays and three walls. A ray leaves the atom and either gets through the
// wall, goes through weaker, or is stopped. Alpha is stopped by paper, beta by thin metal, and
// gamma rays (and X-rays) need thick concrete or lead.

import * as sound from '../sound';
import { q, reducedMotion } from '../util';
import { rayResults } from '../../data/radiation/results';
import { fill, readUi } from './ui';

const NS = 'http://www.w3.org/2000/svg';
const START = 470;
const END = 780;
/** Where each wall begins. */
const FRONT = 590;
const SPEED: Record<string, number> = { alpha: 240, beta: 520, gamma: 1100 };

export function initRays(root: HTMLElement) {
  const { rays: ui, rayKinds, walls } = readUi(root);
  const sec = root.querySelector<HTMLElement>('[data-scene="rays"]');
  if (!sec) return;
  const art = q<SVGElement>(sec, '[data-rays-art]');
  const layer = q<SVGGElement>(sec, '[data-ray]');
  const rayButtons = [...sec.querySelectorAll<HTMLButtonElement>('[data-ray-btn]')];
  const wallButtons = [...sec.querySelectorAll<HTMLButtonElement>('[data-wall-btn]')];
  const send = q<HTMLButtonElement>(sec, '[data-send]');
  const status = q<HTMLElement>(sec, '[data-ry-status]');

  let ray = 0;
  let wall = 0;
  let raf = 0;
  const wallIds = ['paper', 'metal', 'concrete'];

  function pick() {
    rayButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === ray)));
    wallButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === wall)));
    art.setAttribute('data-wall', wallIds[wall]);
  }

  /** One shape for each kind: a big slow ball, a small fast ball, a wavy line. */
  function shape(kind: string, x: number, faded: boolean) {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('opacity', faded ? '0.4' : '1');
    if (kind === 'alpha') {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', '400');
      c.setAttribute('r', '17');
      c.setAttribute('fill', '#ff7a45');
      c.setAttribute('stroke', '#ffe0cf');
      c.setAttribute('stroke-width', '4');
      g.appendChild(c);
    } else if (kind === 'beta') {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', '400');
      c.setAttribute('r', '8');
      c.setAttribute('fill', '#7fd0ff');
      g.appendChild(c);
    } else {
      let d = '';
      for (let i = 0; i <= 70; i += 3) d += `${i === 0 ? 'M' : 'L'}${x - 70 + i} ${400 + Math.sin(i / 5) * 12}`;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', '#fff27a');
      p.setAttribute('stroke-width', '5');
      p.setAttribute('stroke-linecap', 'round');
      g.appendChild(p);
    }
    return g;
  }

  function clearLayer() {
    while (layer.firstChild) layer.removeChild(layer.firstChild);
  }

  function say(result: string) {
    const kind = rayKinds[ray];
    const values = { wall: walls[wall].name };
    const line = fill(result === 'stopped' ? ui.stopped : result === 'weaker' ? ui.weaker : ui.through, values);
    status.innerHTML = `${line} ${kind.use}`;
  }

  function fire() {
    const kind = rayKinds[ray].id;
    const result = rayResults[kind][wall];
    cancelAnimationFrame(raf);
    clearLayer();
    sound.play(kind === 'gamma' ? 'beam' : 'snap');

    // The ray stops at the wall, or goes on and ends at the edge of the picture
    const stopAt = result === 'stopped' ? FRONT - 4 : END;
    if (reducedMotion()) {
      layer.appendChild(shape(kind, stopAt, result === 'weaker'));
      say(result);
      return;
    }
    let x = START;
    let last = performance.now();
    const step = (t: number) => {
      x = Math.min(stopAt, x + ((t - last) / 1000) * SPEED[kind]);
      last = t;
      clearLayer();
      layer.appendChild(shape(kind, x, result === 'weaker' && x > FRONT));
      if (x < stopAt) {
        raf = requestAnimationFrame(step);
      } else {
        if (result === 'stopped') sound.play('thud');
        say(result);
      }
    };
    raf = requestAnimationFrame(step);
  }

  rayButtons.forEach((b, i) =>
    b.addEventListener('click', () => {
      ray = i;
      pick();
      sound.play('pop');
    }),
  );
  wallButtons.forEach((b, i) =>
    b.addEventListener('click', () => {
      wall = i;
      pick();
      sound.play('pop');
    }),
  );
  send.addEventListener('click', fire);

  pick();
  status.textContent = ui.start;
}
