// The alphabet page: four drawers. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { ALPHABETS, glyphSvg, LETTERS, STAGES, stageOf, STEPS } from '../../lib/alpha';

const root = document.querySelector<HTMLElement>('[data-alpha]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Drawer 1: turn the ox
  const ox = root.querySelector<HTMLElement>('[data-ox-tool]');
  if (ox) {
    const range = q<HTMLInputElement>(ox, '[data-ox-range]');
    let last = 0;
    const draw = () => {
      fillRange(range);
      const t = Number(range.value) / 300;
      const s = stageOf(t);
      q(ox, '[data-ox-g]').innerHTML = glyphSvg(t);
      q(ox, '[data-ox-out]').textContent = String(s + 1);
      q(ox, '[data-ox-status]').textContent = `${STAGES[s].name}. ${STAGES[s].text}`;
      ox.querySelectorAll('.log li').forEach((li, i) => li.classList.toggle('on', i === s));
      if (s !== last) sound.play('tick', 0.3);
      last = s;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Drawer 2: what the names meant
  const na = root.querySelector<HTMLElement>('[data-names-tool]');
  if (na) {
    const picks = na.querySelectorAll<HTMLElement>('[data-names-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const l = LETTERS[Number(b.getAttribute('data-names-pick'))];
        press(picks, b);
        q(na, '[data-names-status]').textContent = `${l.name} meant ${l.meaning}. The Greeks called it ${l.greek}, and it became our ${l.latin}. ${l.note}`;
        sound.play('tick', 0.3);
      }),
    );
  }

  // Drawer 3: how many letters
  const co = root.querySelector<HTMLElement>('[data-count-tool]');
  if (co) {
    const picks = co.querySelectorAll<HTMLElement>('[data-count-pick]');
    const mark = (i: number) => co.querySelectorAll('[data-bar]').forEach((li) => li.classList.toggle('on', Number(li.getAttribute('data-bar')) === i));
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const i = Number(b.getAttribute('data-count-pick'));
        press(picks, b);
        mark(i);
        q(co, '[data-count-status]').textContent = `${ALPHABETS[i].name} has ${ALPHABETS[i].letters} letters. ${ALPHABETS[i].note}`;
        sound.play('tick', 0.3);
      }),
    );
    mark(4);
  }

  // Drawer 4: the chain
  const ch = root.querySelector<HTMLElement>('[data-chain-tool]');
  if (ch) {
    const items = ch.querySelectorAll<HTMLElement>('[data-step]');
    let n = 0;
    const draw = () => {
      items.forEach((li, i) => {
        li.classList.toggle('shown', i <= n);
        li.classList.toggle('now', i === n);
      });
      const s = STEPS[n];
      q(ch, '[data-chain-status]').textContent = `Step ${n + 1} of ${STEPS.length}: ${s.name}, ${s.when}, ${s.letters}. ${s.text}`;
    };
    q(ch, '[data-chain-next]').addEventListener('click', () => {
      n = Math.min(n + 1, STEPS.length - 1);
      sound.play('tick', 0.4);
      draw();
    });
    q(ch, '[data-chain-reset]').addEventListener('click', () => {
      n = 0;
      draw();
    });
    ch.classList.add('stepper');
    draw();
  }
}
