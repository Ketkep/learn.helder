// Message 2: walking down the Morse tree.

import * as sound from '../sound';
import { q } from '../util';
import { decode } from './code';

const dots = (code: string) => [...code].map((c) => (c === '-' ? '−' : '·')).join(' ');

export function initTree(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-tree-tool]');
  if (!tool) return;
  const cells = [...tool.querySelectorAll<HTMLElement>('[data-path]')];
  const pathEl = q<HTMLElement>(tool, '[data-tree-path]');
  const status = q<HTMLElement>(tool, '[data-tree-status]');
  let path = '';

  function draw() {
    for (const c of cells) {
      const p = c.dataset.path!;
      c.classList.toggle('on', p.length <= path.length && path.startsWith(p));
      c.classList.toggle('here', p === path);
    }
    const letter = decode(path);
    pathEl.textContent = path ? `${dots(path)}${letter ? `  =  ${letter}` : ''}` : ' ';
    status.textContent = !path
      ? 'You are at the top. Take a dot to go left or a dash to go right.'
      : letter
        ? `${dots(path)} spells ${letter}.${path.length < 4 ? ' You can go on to longer codes.' : ' This is the end of the tree.'}`
        : `${dots(path)} is not a letter. Go back, or take another step.`;
  }

  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-tree-step]')) {
    b.addEventListener('click', () => {
      if (path.length >= 4) {
        status.textContent = 'This is the end of the tree. Go back or start again.';
        sound.play('bad', 0.5);
        return;
      }
      path += b.dataset.treeStep;
      draw();
      sound.beeps(620, [[0, path.endsWith('-') ? 0.3 : 0.1]]);
    });
  }
  q<HTMLButtonElement>(tool, '[data-tree-back]').addEventListener('click', () => {
    path = path.slice(0, -1);
    draw();
    sound.play('tick');
  });
  q<HTMLButtonElement>(tool, '[data-tree-reset]').addEventListener('click', () => {
    path = '';
    draw();
    sound.play('pop');
  });
  draw();
}
