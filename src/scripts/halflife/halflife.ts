// The rock age page: three alcoves. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { ageFrom, atomsSvg, barSvg, CLOCKS, expected, fmt, runDecay, shareAfter, sliderAge, verdict, years } from '../../lib/halflife';

const root = document.querySelector<HTMLElement>('[data-halflife]');

if (root) {
  initSoundButton(root);

  // Alcove 1: atoms that decay at random
  const de = root.querySelector<HTMLElement>('[data-decay-tool]');
  if (de) {
    const picks = de.querySelectorAll<HTMLElement>('[data-decay-size]');
    const status = q(de, '[data-decay-status]');
    const table = q(de, 'tbody');
    let n = 100;
    let step = 0;
    let seed = 11;
    let run = runDecay(n, 12, seed);
    const draw = () => {
      q(de, '[data-decay-g]').innerHTML = atomsSvg(n, run[step]);
      clear(table);
      for (let s = 0; s <= step; s++) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = String(s);
        tr.appendChild(th);
        [String(run[s]), fmt(expected(n, s), 1)].forEach((t) => {
          const td = document.createElement('td');
          td.textContent = t;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      }
      status.textContent = step === 0 ? `${fmt(n)} atoms. Press the button to pass a half-life.` : `After ${step} half-${step === 1 ? 'life' : 'lives'}: ${fmt(run[step])} ${run[step] === 1 ? 'atom' : 'atoms'} left, and the rule expects ${fmt(expected(n, step), 1)}.${run[step] === 0 ? ' None are left.' : ''}`;
    };
    const reset = (size: number) => {
      n = size;
      step = 0;
      seed += 1;
      run = runDecay(n, 12, seed);
      draw();
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        reset(Number(b.getAttribute('data-decay-size')));
      }),
    );
    q(de, '[data-decay-step]').addEventListener('click', () => {
      if (step < 12) step += 1;
      draw();
      sound.play('tick', 0.4);
    });
    q(de, '[data-decay-reset]').addEventListener('click', () => reset(n));
    draw();
  }

  // Alcove 2: read the clock
  const cl = root.querySelector<HTMLElement>('[data-clock-tool]');
  if (cl) {
    const picks = cl.querySelectorAll<HTMLElement>('[data-clock-pick]');
    const range = q<HTMLInputElement>(cl, '[data-clock-range]');
    let k = 0;
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(cl, '[data-clock-out]').textContent = String(p);
      q(cl, '[data-clock-g]').innerHTML = barSvg(p / 100);
      const c = CLOCKS[k];
      q(cl, '[data-clock-status]').textContent = p === 100 ? `All of the ${c.name.split(' (')[0].toLowerCase()} is left, so no time has passed.` : `With ${p}% of the ${c.name.split(' (')[0].toLowerCase()} left, the sample is ${years(ageFrom(p / 100, c.half))} old.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        k = Number(b.getAttribute('data-clock-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        draw();
        sound.play('tick', 0.3);
      }),
    );
    range.addEventListener('input', draw);
    draw();
  }

  // Alcove 3: the right clock
  const ri = root.querySelector<HTMLElement>('[data-right-tool]');
  if (ri) {
    const range = q<HTMLInputElement>(ri, '[data-right-range]');
    const cards = q(ri, '[data-right-cards]');
    const draw = () => {
      fillRange(range);
      const age = sliderAge(Number(range.value));
      q(ri, '[data-right-out]').textContent = years(age);
      clear(cards);
      const lines: string[] = [];
      CLOCKS.forEach((c) => {
        const v = verdict(age, c.half);
        const share = shareAfter(age, c.half);
        const word = v === 'ok' ? 'can read it' : v === 'old' ? 'too little left to measure' : 'too little has changed to tell';
        const card = document.createElement('p');
        card.className = `verdict ${v}`;
        card.textContent = `${c.name.split(' (')[0]}: ${fmt(share * 100, share < 0.01 ? 4 : 1)}% left, ${word}.`;
        cards.appendChild(card);
        lines.push(`${c.name.split(' (')[0]}: ${v === 'ok' ? 'can read it' : word}`);
      });
      q(ri, '[data-right-status]').textContent = `A sample ${years(age)} old. ${lines.join('. ')}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
