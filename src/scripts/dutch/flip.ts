// Stop 7: flip the coin. The coin turns over (a quick squeeze sideways and back), the text swaps,
// and the sky behind the whole film goes dark for the other side.

import * as sound from '../sound';
import { q, reducedMotion } from '../util';

const BRIGHT = { sky: '#bcd6ec', layers: '1' };
const DARK = { sky: '#262b38', layers: '0.25' };

export function initFlip(root: HTMLElement) {
  const found = root.querySelector<HTMLElement>('[data-station="flip"]');
  if (!found) return;
  const station: HTMLElement = found;
  const coin = q<HTMLButtonElement>(station, '[data-fl-coin]');
  const turn = q<HTMLElement>(station, '[data-fl-turn]');
  const faces = [...station.querySelectorAll<HTMLElement>('[data-fl-face]')];
  const sidesEl = [...station.querySelectorAll<HTMLElement>('[data-fl-side]')];
  const hint = station.querySelector<HTMLElement>('.fl-hint');

  let dark = false;
  let busy = false;

  function show(isDark: boolean) {
    dark = isDark;
    faces.forEach((f) => {
      f.hidden = f.dataset.flFace !== (dark ? 'dark' : 'bright');
    });
    sidesEl.forEach((s) => {
      s.hidden = s.dataset.flSide !== (dark ? 'dark' : 'bright');
    });
    coin.setAttribute('aria-label', `Flip the coin. It shows the ${dark ? 'other' : 'bright'} side.`);
    if (hint) hint.textContent = dark ? 'Tap to flip back' : 'Tap the coin';

    // The sky: the film reads it from the station
    const look = dark ? DARK : BRIGHT;
    station.dataset.sky = look.sky;
    station.dataset.layers = look.layers;
    station.style.setProperty('--sky', look.sky);
    station.dispatchEvent(new CustomEvent('skychange', { bubbles: true }));
  }

  coin.addEventListener('click', () => {
    if (busy) return;
    sound.play('coin');
    if (reducedMotion()) {
      show(!dark);
      return;
    }
    busy = true;
    const start = performance.now();
    let swapped = false;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 520);
      // squeeze to a thin edge at the middle, swap faces there, open up again
      turn.style.transform = `scaleX(${Math.max(0.02, Math.abs(Math.cos(k * Math.PI))).toFixed(3)})`;
      if (k >= 0.5 && !swapped) {
        swapped = true;
        show(!dark);
      }
      if (k < 1) {
        requestAnimationFrame(step);
      } else {
        turn.style.transform = '';
        busy = false;
      }
    };
    requestAnimationFrame(step);
  });

  show(false);
}
