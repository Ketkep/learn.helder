// Shot 2: a wall in Lima. Switch between bricks laid flat and bricks on end, and give it a shove.

import * as sound from '../sound';
import { reducedMotion, q } from './util';

const TEXT = {
  flat: 'Bricks laid flat in rows, like most walls. A hard, solid wall.',
  end: 'Bricks stood on end with small gaps, like books on a shelf. The wall can give a little and settle back.',
  shoveFlat: 'The whole wall moved as one block. A stiff wall like this can crack when the ground moves a lot.',
  shoveEnd: 'The bricks rocked one by one, then settled. Nothing came apart.',
};

export function initWall(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-wall-tool]');
  if (!tool) return;
  const status = q<HTMLElement>(root, '[data-wall-status]');
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode-btn]')];
  const shove = q<HTMLButtonElement>(root, '[data-wall-nudge]');
  let mode: 'flat' | 'end' = 'flat';
  let timer = 0;

  const set = (next: 'flat' | 'end') => {
    mode = next;
    tool.dataset.mode = next;
    for (const b of buttons) b.setAttribute('aria-checked', String(b.dataset.modeBtn === next));
    status.textContent = TEXT[next];
    sound.play('pop');
  };

  for (const b of buttons) b.addEventListener('click', () => set(b.dataset.modeBtn === 'end' ? 'end' : 'flat'));

  shove.addEventListener('click', () => {
    clearTimeout(timer);
    tool.classList.remove('shove');
    void tool.getBoundingClientRect(); // restart the animation
    tool.classList.add('shove');
    sound.play('rumble', 0.25);
    status.textContent = mode === 'flat' ? TEXT.shoveFlat : TEXT.shoveEnd;
    timer = window.setTimeout(() => tool.classList.remove('shove'), reducedMotion() ? 0 : 2600);
  });
}
