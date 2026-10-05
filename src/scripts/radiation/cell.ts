// Scene 4: time your shot. A marker goes round the cell cycle. Firing when the cell is dividing
// (the M phase) does the most damage, and firing in the S phase the least. The numbers are an
// idea, not measurements.

import * as sound from '../sound';
import { clamp, fillRange, q, reducedMotion } from '../util';
import { whenActive } from './active';
import { fill, readUi } from './ui';

interface Phase {
  id: string;
  label: string;
  name: string;
  from: number;
  to: number;
  damage: number;
  words: string;
}

const NS = 'http://www.w3.org/2000/svg';
const PERIOD = 10000;

export function initCell(root: HTMLElement) {
  const ui = readUi(root).cell;
  const sec = root.querySelector<HTMLElement>('[data-scene="cell"]');
  if (!sec) return;
  const art = q<SVGElement>(sec, '[data-cell-art]');
  const hand = q<SVGCircleElement>(sec, '[data-hand]');
  const shot = q<SVGGElement>(sec, '[data-shot]');
  const sparks = q<SVGGElement>(sec, '[data-sparks]');
  const slider = q<HTMLInputElement>(sec, '[data-phase-input]');
  const playButton = q<HTMLButtonElement>(sec, '[data-play]');
  const fireButton = q<HTMLButtonElement>(sec, '[data-fire]');
  const log = q<HTMLElement>(sec, '[data-log]');
  const status = q<HTMLElement>(sec, '[data-cl-status]');
  const phases: Phase[] = JSON.parse(art.dataset.phases ?? '[]');

  let phi = 0.1;
  let playing = !reducedMotion();
  let active = false;
  let raf = 0;
  let last = 0;
  let shots: { phase: Phase }[] = [];

  const phaseAt = (f: number) => phases.find((p) => f >= p.from && f < p.to) ?? phases[phases.length - 1];

  function show() {
    const p = phaseAt(phi);
    art.setAttribute('data-phase', p.id);
    const a = phi * Math.PI * 2;
    hand.setAttribute('cx', (400 + 330 * Math.sin(a)).toFixed(1));
    hand.setAttribute('cy', (400 - 330 * Math.cos(a)).toFixed(1));
    slider.value = String(Math.round(phi * 100));
    fillRange(slider);
    playButton.textContent = playing ? ui.pause : ui.play;
    playButton.setAttribute('aria-pressed', String(playing));
  }

  function loop(t: number) {
    if (!active || !playing) {
      raf = 0;
      return;
    }
    phi = (phi + (t - last) / PERIOD) % 1;
    last = t;
    show();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (raf || !active || !playing) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function fire() {
    const p = phaseAt(phi);
    sound.play('beam');
    // The ray crosses the picture for a moment and the nucleus shows how much damage it took
    shot.style.transition = 'none';
    shot.setAttribute('opacity', '1');
    window.setTimeout(() => {
      shot.style.transition = 'opacity 0.6s';
      shot.setAttribute('opacity', '0');
    }, 120);
    while (sparks.firstChild) sparks.removeChild(sparks.firstChild);
    const count = Math.round(p.damage * 12);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + i;
      const r = 40 + ((i * 37) % 70);
      const s = document.createElementNS(NS, 'path');
      const x = 400 + r * Math.cos(a);
      const y = 400 + r * Math.sin(a);
      s.setAttribute('d', `M${x - 11} ${y}L${x + 11} ${y}M${x} ${y - 11}L${x} ${y + 11}`);
      s.setAttribute('stroke', '#ffb27a');
      s.setAttribute('stroke-width', '5');
      s.setAttribute('stroke-linecap', 'round');
      sparks.appendChild(s);
    }
    window.setTimeout(() => {
      while (sparks.firstChild) sparks.removeChild(sparks.firstChild);
    }, 1800);

    shots = [{ phase: p }, ...shots].slice(0, 4);
    const level = (d: number) => (d >= 0.99 ? ui.levels.most : d >= 0.7 ? ui.levels.lot : d >= 0.4 ? ui.levels.some : ui.levels.little);
    log.innerHTML = shots.map((s) => `<li class="${s.phase.damage >= 0.75 ? 'big' : ''}">${s.phase.label}: ${level(s.phase.damage)}</li>`).join('');
    status.innerHTML = fill(ui.fired, { label: p.label, name: p.name, words: p.words });
  }

  playButton.addEventListener('click', () => {
    playing = !playing;
    show();
    start();
  });
  slider.addEventListener('input', () => {
    playing = false;
    phi = clamp(Number(slider.value) / 100, 0, 0.9999);
    show();
  });
  fireButton.addEventListener('click', fire);

  whenActive(sec, (on) => {
    active = on;
    if (on) start();
  });

  show();
  status.textContent = ui.start;
}
