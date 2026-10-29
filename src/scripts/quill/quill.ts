// The punctuation page: three spreads. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, q } from '../util';
import { COMMAS, judge, meaningOf, PUZZLES, sentence, STAGES } from '../../lib/quill';

const root = document.querySelector<HTMLElement>('[data-quill]');

if (root) {
  initSoundButton(root);

  // Spread 1: words run together
  const ru = root.querySelector<HTMLElement>('[data-run-tool]');
  if (ru) {
    const input = q<HTMLInputElement>(ru, '[data-run-input]');
    const picks = ru.querySelectorAll<HTMLElement>('[data-run-pick]');
    const status = q(ru, '[data-run-status]');
    let k = 0;
    const found = new Set<number>();
    const choose = (n: number) => {
      k = n;
      found.clear();
      picks.forEach((p) => p.setAttribute('aria-pressed', Number(p.getAttribute('data-run-pick')) === n ? 'true' : 'false'));
      q(ru, '[data-run-line]').textContent = PUZZLES[n].run;
      input.value = '';
      status.textContent = PUZZLES[n].readings.length > 1 ? 'Type the letters again with spaces between the words. This line has more than one reading.' : 'Type the letters again with spaces between the words.';
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        choose(Number(b.getAttribute('data-run-pick')));
        sound.play('tick', 0.3);
      }),
    );
    input.addEventListener('input', () => {
      const p = PUZZLES[k];
      const v = judge(p, input.value);
      if (!input.value.trim()) return;
      if (v.kind === 'letters') status.textContent = 'The letters are not the same as the line above. Keep them in order and only add spaces.';
      else if (v.kind === 'other') status.textContent = `The letters are right, with ${v.spaces} ${v.spaces === 1 ? 'space' : 'spaces'}, but that is not a reading the page knows. Try other places for the spaces.`;
      else {
        found.add(v.index);
        status.textContent = `Yes: ${p.readings[v.index]}.${p.readings.length > 1 ? ` You have found ${found.size} of ${p.readings.length} readings.${found.size < p.readings.length ? ' Look for another.' : ' With no spaces, the writer’s meaning cannot be told.'}` : ''}`;
        sound.play('good', 0.4);
      }
    });
    q(ru, '[data-run-show]').addEventListener('click', () => {
      status.textContent = `The readings: ${PUZZLES[k].readings.join(' or ')}.`;
    });
    choose(0);
  }

  // Spread 2: a comma changes the meaning
  const co = root.querySelector<HTMLElement>('[data-comma-tool]');
  if (co) {
    const picks = co.querySelectorAll<HTMLElement>('[data-comma-pick]');
    const holder = q(co, '[data-comma-switches]');
    let k = 0;
    let mask = '';
    const draw = () => {
      const item = COMMAS[k];
      q(co, '[data-comma-line]').textContent = sentence(item, mask);
      q(co, '[data-comma-status]').textContent = `${meaningOf(item, mask)} ${item.more}`;
    };
    const build = () => {
      const item = COMMAS[k];
      mask = item.slots.map(() => '0').join('');
      clear(holder);
      item.slots.forEach((slot, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pick';
        b.setAttribute('aria-pressed', 'false');
        b.textContent = `Comma after “${item.words[slot]}”`;
        b.addEventListener('click', () => {
          const on = mask[i] !== '1';
          mask = mask.slice(0, i) + (on ? '1' : '0') + mask.slice(i + 1);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          draw();
          sound.play('tick', 0.35);
        });
        holder.appendChild(b);
      });
      draw();
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        k = Number(b.getAttribute('data-comma-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        build();
      }),
    );
    build();
  }

  // Spread 3: one sentence through time
  const ti = root.querySelector<HTMLElement>('[data-time-tool]');
  if (ti) {
    const picks = ti.querySelectorAll<HTMLElement>('[data-time-pick]');
    const show = (n: number) => {
      picks.forEach((p) => p.setAttribute('aria-pressed', Number(p.getAttribute('data-time-pick')) === n ? 'true' : 'false'));
      q(ti, '[data-time-line]').innerHTML = STAGES[n].html;
      q(ti, '[data-time-status]').textContent = `${STAGES[n].when}. ${STAGES[n].note}`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        show(Number(b.getAttribute('data-time-pick')));
        sound.play('tick', 0.35);
      }),
    );
    show(3);
  }
}
