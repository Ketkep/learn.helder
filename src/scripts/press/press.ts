// The printing press page: four benches. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { fmtDays, guessFromSlider, handDays, letterCounts, lineSvg, numbers, pressDays, stepSvg, steps, timesOff } from '../../lib/press';

const root = document.querySelector<HTMLElement>('[data-press]');

if (root) {
  // Bench 1: the steps
  const st = root.querySelector<HTMLElement>('[data-steps-tool]');
  if (st) {
    let i = 0;
    const draw = () => {
      q(st, '[data-steps-g]').innerHTML = stepSvg(i);
      q(st, '[data-steps-status]').textContent = `Step ${i + 1} of ${steps.length}: ${steps[i].title}. ${steps[i].text}`;
    };
    q(st, '[data-steps-next]').addEventListener('click', () => {
      i = Math.min(i + 1, steps.length - 1);
      sound.play('tick', 0.4);
      draw();
    });
    q(st, '[data-steps-reset]').addEventListener('click', () => {
      i = 0;
      draw();
    });
    draw();
  }

  // Bench 2: set a line
  const ty = root.querySelector<HTMLElement>('[data-type-tool]');
  if (ty) {
    const input = q<HTMLInputElement>(ty, '[data-type-q]');
    const draw = () => {
      const text = input.value;
      q(ty, '[data-type-g]').innerHTML = lineSvg(text);
      const counts = letterCounts(text);
      const total = counts.reduce((n, c) => n + c.n, 0);
      q(ty, '[data-type-body]').innerHTML = counts.slice(0, 8).map((c) => `<tr><th scope="row">${c.ch}</th><td>${c.n}</td></tr>`).join('');
      q(ty, '[data-type-status]').textContent = total
        ? `The words "${text}" need ${total} pieces of type. The most used letter is ${counts[0].ch}, with ${counts[0].n}.`
        : 'Type some words to set in type.';
    };
    input.addEventListener('input', draw);
    draw();
  }

  // Bench 3: by hand or by press
  const ti = root.querySelector<HTMLElement>('[data-time-tool]');
  if (ti) {
    const range = q<HTMLInputElement>(ti, '[data-time-range]');
    const pages = 100;
    const draw = () => {
      fillRange(range);
      const c = Number(range.value);
      q(ti, '[data-time-out]').textContent = String(c);
      const [h, p] = [handDays(pages, c), pressDays(pages, c)];
      const max = Math.max(h, p);
      q<HTMLElement>(ti, '[data-time-hand]').style.width = `${(h / max) * 100}%`;
      q<HTMLElement>(ti, '[data-time-press]').style.width = `${(p / max) * 100}%`;
      q(ti, '[data-time-status]').textContent = `${c} cop${c === 1 ? 'y' : 'ies'} of a book of ${pages} pages: ${fmtDays(h)} by hand and ${fmtDays(p)} by press, in this toy. Setting the type takes ${fmtDays(pressDays(pages, 0))} once.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Bench 4: the spread
  const sp = root.querySelector<HTMLElement>('[data-spread-tool]');
  if (sp) {
    const picks = sp.querySelectorAll<HTMLElement>('[data-spread-pick]');
    const range = q<HTMLInputElement>(sp, '[data-spread-range]');
    const status = q<HTMLElement>(sp, '[data-spread-status]');
    let n = numbers[0];
    const draw = () => {
      fillRange(range);
      q(sp, '[data-spread-out]').textContent = guessFromSlider(Number(range.value)).toLocaleString('en-US');
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        n = numbers.find((x) => x.id === b.getAttribute('data-spread-pick')) || n;
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        status.textContent = `${n.name}. Slide to your guess and press check.`;
      }),
    );
    range.addEventListener('input', draw);
    q(sp, '[data-spread-check]').addEventListener('click', () => {
      const g = guessFromSlider(Number(range.value));
      const off = timesOff(g, n.real);
      status.textContent = `${n.text} You guessed ${g.toLocaleString('en-US')}, which is ${off < 1.3 ? 'very close' : `${off.toFixed(1)} times ${g > n.real ? 'too many' : 'too few'}`}.`;
      sound.play(off < 3 ? 'good' : 'thud', 0.4);
    });
    draw();
  }
}
