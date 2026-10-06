// The Primes page: a cabinet of drawers. This file turns each drawer front into a button and starts the tools.
// The first drawer starts open. A drawer can be opened with the mouse, a finger or the keyboard.

import { initSoundButton } from '../soundButton';
import * as sound from '../sound';
import { initSieve } from './sieve';
import { initRects } from './rects';
import { initEuclid } from './euclid';
import { initDensity } from './density';
import { initLock } from './lock';

const root = document.querySelector<HTMLElement>('[data-cab]');

if (root) {
  const drawers = [...root.querySelectorAll<HTMLElement>('[data-drawer]')];

  const setOpen = (drawer: HTMLElement, open: boolean, quiet = false) => {
    const button = drawer.querySelector<HTMLButtonElement>('.front-button');
    const panel = drawer.querySelector<HTMLElement>('.panel');
    if (!button || !panel) return;
    const was = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    drawer.classList.toggle('open', open);
    if (open && !was && !quiet) {
      drawer.classList.add('pulled');
      window.setTimeout(() => drawer.classList.remove('pulled'), 700);
      sound.play('whoosh', 0.4);
    }
    if (!open && was && !quiet) sound.play('thud', 0.5);
  };

  for (const drawer of drawers) {
    const front = drawer.querySelector<HTMLElement>('.front');
    const panel = drawer.querySelector<HTMLElement>('.panel');
    if (!front || !panel) continue;
    // Wrap what is inside the heading in a button, so the heading stays a heading
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'front-button';
    button.setAttribute('aria-controls', panel.id);
    while (front.firstChild) button.appendChild(front.firstChild);
    front.appendChild(button);
    button.addEventListener('click', () => setOpen(drawer, button.getAttribute('aria-expanded') !== 'true'));
    setOpen(drawer, drawer.dataset.drawer === drawers[0].dataset.drawer, true);
  }

  root.querySelector('[data-open-all]')?.addEventListener('click', () => drawers.forEach((d) => setOpen(d, true)));
  root.querySelector('[data-close-all]')?.addEventListener('click', () => drawers.forEach((d) => setOpen(d, false)));

  // "Next drawer" closes this one, opens the next and brings its front into view
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-next]')) {
    b.addEventListener('click', () => {
      const here = b.closest<HTMLElement>('[data-drawer]');
      const next = root.querySelector<HTMLElement>(`[data-drawer="${b.dataset.next}"]`);
      if (!next) return;
      if (here) setOpen(here, false, true);
      setOpen(next, true);
      next.scrollIntoView({ block: 'start' });
      next.querySelector<HTMLButtonElement>('.front-button')?.focus({ preventScroll: true });
    });
  }

  initSieve(root);
  initRects(root);
  initEuclid(root);
  initDensity(root);
  initLock(root);
  initSoundButton(root);
}
