// Shot 3: the stamps on the Moche bricks. Pick a stamp to light up every brick that has it.

import * as sound from '../sound';
import { q } from './util';

export function initMarks(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-marks-tool]');
  if (!tool) return;
  const bricks = [...tool.querySelectorAll<SVGGElement>('[data-brick]')];
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-mark-btn]')];
  const status = q<HTMLElement>(root, '[data-marks-status]');
  const startText = status.textContent ?? '';
  const names = new Map(buttons.map((b) => [b.dataset.markBtn!, b.querySelector('span')?.textContent ?? '']));
  const tried = new Set<string>();
  let picked: string | null = null;

  // How many columns of the wall each stamp appears in, to say if it sits in one place
  const columns = (mark: string) => new Set(bricks.filter((b) => b.dataset.mark === mark).map((b) => bricks.indexOf(b) % 8)).size;

  function pick(mark: string | null) {
    picked = mark === picked ? null : mark;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.markBtn === picked));
    for (const b of bricks) {
      b.classList.toggle('on', picked !== null && b.dataset.mark === picked);
      b.classList.toggle('dim', picked !== null && b.dataset.mark !== picked);
    }
    if (!picked) {
      status.textContent = startText;
      return;
    }
    tried.add(picked);
    sound.play('thud');
    const n = bricks.filter((b) => b.dataset.mark === picked).length;
    const where = columns(picked) <= 3 ? 'They sit together in one part of the wall.' : 'They show up in a few parts of the wall.';
    let text = `${names.get(picked)}: ${n} of ${bricks.length} bricks. ${where}`;
    if (tried.size === buttons.length) text += ' You have found all six stamps. The real pyramid has more than 100.';
    status.textContent = text;
  }

  for (const b of buttons) b.addEventListener('click', () => pick(b.dataset.markBtn ?? null));
  for (const b of bricks) b.addEventListener('click', () => pick(b.dataset.mark ?? null));
}
