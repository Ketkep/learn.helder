// Stop 8: open the sluice and flood the land. The button toggles it, and a second button
// rolls the film again from the start.

import * as sound from '../sound';
import { q } from '../util';

export function initEnd(root: HTMLElement) {
  const station = root.querySelector<HTMLElement>('[data-station="end"]');
  if (!station) return;
  const scene = q<HTMLElement>(station, '[data-en]');
  const sluice = q<HTMLButtonElement>(station, '[data-en-sluice]');
  const again = q<HTMLButtonElement>(station, '[data-en-again]');
  const status = q<HTMLElement>(station, '[data-en-status]');
  const dry = status.textContent ?? '';

  let open = false;

  sluice.addEventListener('click', () => {
    open = !open;
    scene.classList.toggle('open', open);
    sluice.setAttribute('aria-pressed', String(open));
    sluice.textContent = open ? 'Close the sluice' : 'Open the sluice';
    status.textContent = open ? 'The land floods. The soldiers cannot get through. This is how the Dutch stopped the army in 1672.' : dry;
    if (open) {
      sound.play('rumble', 0.6);
      sound.play('whoosh', 0.8);
    } else {
      sound.play('pop');
    }
  });

  again.addEventListener('click', () => {
    sound.play('pop');
    const top = root.getBoundingClientRect().top + window.scrollY;
    const quiet = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: quiet ? 'auto' : 'smooth' });
  });
}
