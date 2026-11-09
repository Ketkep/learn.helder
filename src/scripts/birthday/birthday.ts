// The birthday page: three rooms. This file starts each one. Nothing is saved or sent anywhere.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { DAYS, chartSvg, fmt, pAny, pYou, pairs, pct, yearSvg } from '../../lib/birthday';

const root = document.querySelector<HTMLElement>('[data-birthday]');

if (root) {
  initSoundButton(root);

  // Room 1: guests arrive
  const pa = root.querySelector<HTMLElement>('[data-party-tool]');
  if (pa) {
    let days: number[] = [];
    let matched = false;
    const status = q(pa, '[data-party-status]');
    const draw = () => {
      const d = yearSvg(days);
      q(pa, '[data-party-g]').innerHTML = d.svg;
      q(pa, '[data-party-svg]').setAttribute('viewBox', `0 0 420 ${d.h}`);
    };
    q(pa, '[data-party-next]').addEventListener('click', () => {
      const day = Math.floor(Math.random() * DAYS);
      const hit = days.indexOf(day) >= 0;
      days.push(day);
      draw();
      if (hit && !matched) {
        matched = true;
        status.textContent = `Guest ${days.length} shares a birthday with an earlier guest. The first match came with ${days.length} guests. Keep adding guests or start again.`;
        sound.play('good', 0.35);
      } else {
        status.textContent = matched ? `${days.length} guests.` : `${days.length} ${days.length === 1 ? 'guest' : 'guests'}, and no shared birthday yet.`;
        sound.play('tick', 0.25);
      }
    });
    q(pa, '[data-party-reset]').addEventListener('click', () => {
      days = [];
      matched = false;
      draw();
      status.textContent = 'An empty room. Press Next guest.';
    });
    q(pa, '[data-party-run]').addEventListener('click', () => {
      const firsts: number[] = [];
      for (let p = 0; p < 1000; p++) {
        const seen: Record<number, true> = {};
        let n = 0;
        for (;;) {
          const day = Math.floor(Math.random() * DAYS);
          n += 1;
          if (seen[day]) break;
          seen[day] = true;
        }
        firsts.push(n);
      }
      firsts.sort((a, b) => a - b);
      const avg = firsts.reduce((a, b) => a + b, 0) / firsts.length;
      status.textContent = `In 1,000 parties the first match came after ${firsts[0]} to ${firsts[firsts.length - 1]} guests. On average after ${fmt(avg, 1)} guests, and in half of the parties by guest ${firsts[499]}.`;
      sound.play('tick', 0.3);
    });
  }

  // Room 2: why it grows so fast
  const od = root.querySelector<HTMLElement>('[data-odds-tool]');
  if (od) {
    const range = q<HTMLInputElement>(od, '[data-odds-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(od, '[data-odds-out]').textContent = String(n);
      const c = chartSvg(100, n, ['any']);
      q(od, '[data-odds-g]').innerHTML = c.svg;
      q(od, '[data-odds-svg]').setAttribute('viewBox', `0 0 420 ${c.h}`);
      q(od, '[data-odds-status]').textContent = `With ${n} people there are ${fmt(pairs(n))} ${pairs(n) === 1 ? 'pair' : 'pairs'}, and the chance of a shared birthday is ${pct(pAny(n))}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Room 3: a match with you
  const yo = root.querySelector<HTMLElement>('[data-you-tool]');
  if (yo) {
    const range = q<HTMLInputElement>(yo, '[data-you-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(yo, '[data-you-out]').textContent = String(n);
      const c = chartSvg(365, n, ['any', 'you']);
      q(yo, '[data-you-g]').innerHTML = c.svg;
      q(yo, '[data-you-svg]').setAttribute('viewBox', `0 0 420 ${c.h}`);
      q(yo, '[data-you-status]').textContent = `With ${n} people in the room, you included, the chance that some two of them match is ${pct(pAny(n))}. The chance that ${n === 2 ? 'the other person matches' : `one of the other ${n - 1} matches`} you is ${pct(pYou(n - 1))}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
