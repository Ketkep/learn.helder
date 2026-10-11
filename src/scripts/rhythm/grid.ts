// Board 2: sixteen steps.

import * as sound from '../sound';
import { q } from '../util';
import { presets } from '../../lib/rhythm';
import { playButton, setPlaying, startLoop, stopLoop } from './clock';

const STEP_MS = 150;

export function initGrid(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-grid-tool]');
  if (!tool) return;
  const cells = [...tool.querySelectorAll<HTMLButtonElement>('[data-cell]')];
  const status = q<HTMLElement>(tool, '[data-grid-status]');
  const play = q<HTMLButtonElement>(tool, '[data-grid-play]');
  const on = cells.map((c) => c.classList.contains('on'));

  const text = () => on.map((h) => (h ? 'x' : '.')).join('');

  function draw(message: string) {
    cells.forEach((c, i) => {
      c.classList.toggle('on', on[i]);
      c.setAttribute('aria-pressed', String(on[i]));
    });
    const hits = on.filter(Boolean).length;
    status.textContent = `${message}${hits} hit${hits === 1 ? '' : 's'} in 16 steps at 100 BPM. Pattern: ${text()}`;
  }

  cells.forEach((c, i) =>
    c.addEventListener('click', () => {
      on[i] = !on[i];
      if (on[i]) sound.play(i % 4 === 0 ? 'thud' : 'tick');
      draw('');
    }),
  );
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-grid-preset]')) {
    b.addEventListener('click', () => {
      const p = presets.find((x) => x.id === b.dataset.gridPreset)!;
      p.steps.split('').forEach((ch, i) => (on[i] = ch === 'x'));
      draw(`${p.name}. `);
    });
  }
  playButton(play, () => {
    stopLoop();
    setPlaying(play, true);
    startLoop(
      STEP_MS * 16,
      cells.map((_, i) => ({
        at: i * STEP_MS,
        fn: () => {
          cells.forEach((c, j) => c.classList.toggle('now', j === i));
          if (on[i]) sound.play(i % 4 === 0 ? 'thud' : 'tick');
        },
      })),
      () => {
        setPlaying(play, false);
        cells.forEach((c) => c.classList.remove('now'));
      },
    );
  });
  draw('');
}
