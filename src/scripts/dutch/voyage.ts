// Stop 4: the voyage. The month slider moves the ship along the route and removes dots from the
// crew. The shares of people lost are the real averages; spreading them evenly over the months
// is pretend, and the page says so.

import * as sound from '../sound';
import { fillRange, q, reducedMotion, watchVisible } from '../util';

interface ShipKind {
  id: string;
  label: string;
  lost: number;
}

export function initVoyage(root: HTMLElement) {
  const station = root.querySelector<HTMLElement>('[data-station="voyage"]');
  if (!station) return;
  const scene = q<HTMLElement>(station, '[data-vy]');
  const path = q<SVGPathElement>(station, '[data-vy-route]');
  const shipG = q<SVGGElement>(station, '[data-vy-ship]');
  const slider = q<HTMLInputElement>(station, '[data-vy-month]');
  const out = q<HTMLOutputElement>(station, '[data-vy-out]');
  const sail = q<HTMLButtonElement>(station, '[data-vy-sail]');
  const status = q<HTMLElement>(station, '[data-vy-status]');
  const live = q<HTMLElement>(station, '[data-vy-live]');
  const buttons = [...station.querySelectorAll<HTMLButtonElement>('[data-vy-ship-btn]')];
  const dots = [...station.querySelectorAll<SVGCircleElement>('.vy-dot')];

  const months = Number(scene.dataset.months);
  const marks: { at: number; where: string }[] = JSON.parse(scene.dataset.landmarks ?? '[]');
  const kinds: ShipKind[] = JSON.parse(scene.dataset.ships ?? '[]');
  const length = path.getTotalLength();

  let kind = 1;
  // The month is kept here, with decimals. A slider with step 0.1 would round every small step away.
  let month = 0;
  let lastDead = 0;
  let lastTick = 0;
  let playing = false;

  const state = () => {
    const f = month / months;
    const dead = Math.round((kinds[kind].lost * f * 100) / 100);
    const mark = [...marks].reverse().find((m) => m.at <= f + 1e-6) ?? marks[0];
    return { month, f, dead, where: mark.where };
  };

  function render() {
    const { f, dead, where } = state();
    slider.value = month.toFixed(1);
    fillRange(slider);
    out.textContent = month.toFixed(1);
    const p = path.getPointAtLength(f * length);
    shipG.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    dots.forEach((d) => d.classList.toggle('dead', Number(d.dataset.rank) < dead));
    const people = dead === 1 ? '1 of the 100 has' : `${dead} of the 100 have`;
    status.innerHTML = `<strong>Month ${month.toFixed(1)}:</strong> ${where}. ${dead === 0 ? 'All 100 are alive.' : `${people} died.`}`;
    const now = performance.now();
    if (dead > lastDead && now - lastTick > 60) {
      sound.play('tick');
      lastTick = now;
    }
    lastDead = dead;
  }

  /** The same sentence for screen readers, but only once the slider rests. */
  function announce() {
    live.textContent = status.textContent;
  }

  function stop() {
    playing = false;
    sail.textContent = 'Sail';
  }

  sail.addEventListener('click', () => {
    if (playing) {
      stop();
      announce();
      return;
    }
    if (month >= months) month = 0;
    if (reducedMotion()) {
      month = months;
      render();
      announce();
      return;
    }
    playing = true;
    sail.textContent = 'Stop';
    let last = performance.now();
    const step = (t: number) => {
      if (!playing) return;
      month = Math.min(months, month + (Math.max(0, t - last) / 1000) * 0.55);
      last = t;
      render();
      if (month >= months) {
        stop();
        sound.play('good');
        announce();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  slider.addEventListener('input', () => {
    if (playing) stop();
    month = Number(slider.value);
    render();
  });
  slider.addEventListener('change', announce);

  buttons.forEach((b, i) => {
    b.addEventListener('click', () => {
      kind = i;
      buttons.forEach((o, k) => o.setAttribute('aria-pressed', String(k === i)));
      lastDead = state().dead;
      render();
      announce();
    });
  });

  // A ship that is off screen should not keep sailing
  watchVisible(station, (visible) => {
    if (!visible && playing) stop();
  });

  render();
}
