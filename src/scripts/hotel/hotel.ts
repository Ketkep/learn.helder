// The infinite hotel page: four floors. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { busSvg, COUNTED, cells, diagonalFlip, evenRoom, fmt, fractionsSvg, LEN, makeList, oddRoom, placeOf, shiftSvg } from '../../lib/hotel';

const root = document.querySelector<HTMLElement>('[data-hotel]');

const whole = (input: HTMLInputElement) => Math.min(Number(input.max), Math.max(1, Math.floor(Number(input.value)) || 1));

if (root) {
  initSoundButton(root);

  // Floor 1: one more guest
  const sh = root.querySelector<HTMLElement>('[data-shift-tool]');
  if (sh) {
    const range = q<HTMLInputElement>(sh, '[data-shift-range]');
    const draw = () => {
      fillRange(range);
      const k = Number(range.value);
      q(sh, '[data-shift-out]').textContent = String(k);
      q(sh, '[data-shift-g]').innerHTML = shiftSvg(k);
      q(sh, '[data-shift-status]').textContent =
        k === 1
          ? 'One new guest arrives. Everyone moves one door along, so the guest in room 1 goes to room 2, and room 1 is free.'
          : `${k} new guests arrive. Everyone moves ${k} doors along, so the guest in room 1 goes to room ${1 + k}, and rooms 1 to ${k} are free.`;
    };
    range.addEventListener('input', () => {
      draw();
      sound.play('tick', 0.3);
    });
    draw();
  }

  // Floor 2: a bus with infinitely many seats
  const bu = root.querySelector<HTMLElement>('[data-bus-tool]');
  if (bu) {
    const steps = bu.querySelectorAll<HTMLElement>('[data-bus-step]');
    const num = q<HTMLInputElement>(bu, '[data-bus-num]');
    const says = [
      'The hotel is full. Every room holds one guest.',
      'Every guest has doubled their room number. Only even rooms are taken, and every odd room is free.',
      'The bus has boarded. Passenger m takes room 2m minus 1, so the odd rooms are full as well.',
    ];
    let stage = 2;
    const draw = () => {
      q(bu, '[data-bus-g]').innerHTML = busSvg(stage);
      steps.forEach((b) => b.setAttribute('aria-pressed', Number(b.getAttribute('data-bus-step')) === stage ? 'true' : 'false'));
      const n = whole(num);
      q(bu, '[data-bus-status]').textContent = `${says[stage]} Guest ${fmt(n)} moves to room ${fmt(evenRoom(n))}. Passenger ${fmt(n)} takes room ${fmt(oddRoom(n))}.`;
    };
    steps.forEach((b) =>
      b.addEventListener('click', () => {
        stage = Number(b.getAttribute('data-bus-step'));
        draw();
        sound.play('tick', 0.3);
      }),
    );
    num.addEventListener('input', draw);
    draw();
  }

  // Floor 3: counting the fractions
  const fr = root.querySelector<HTMLElement>('[data-frac-tool]');
  if (fr) {
    const range = q<HTMLInputElement>(fr, '[data-frac-range]');
    const pIn = q<HTMLInputElement>(fr, '[data-frac-p]');
    const qIn = q<HTMLInputElement>(fr, '[data-frac-q]');
    const byOrder = cells().filter((c) => c.order > 0);
    const drawWalk = () => {
      fillRange(range);
      const k = Number(range.value);
      q(fr, '[data-frac-out]').textContent = String(k);
      q(fr, '[data-frac-g]').innerHTML = fractionsSvg(k);
      if (k > 0) {
        const c = byOrder[k - 1];
        q(fr, '[data-frac-status]').textContent = `Place ${k} on the list is ${c.p}/${c.q}.`;
      }
    };
    const ask = () => {
      const p = whole(pIn);
      const d = whole(qIn);
      const { place, lowest } = placeOf(p, d);
      q(fr, '[data-frac-status]').textContent =
        lowest[0] === p && lowest[1] === d
          ? `${p}/${d} is in lowest terms. It has place ${fmt(place)} on the list.`
          : `${p}/${d} is the same number as ${lowest[0]}/${lowest[1]}, so it is skipped. ${lowest[0]}/${lowest[1]} has place ${fmt(place)}.`;
    };
    range.addEventListener('input', () => {
      drawWalk();
      sound.play('tick', 0.25);
    });
    [pIn, qIn].forEach((i) => i.addEventListener('input', ask));
    drawWalk();
    q(fr, '[data-frac-status]').textContent = `Every fraction in lowest terms gets one place. The first is 1/1, the second is 1/2 and the third is 2/1. The staircase holds ${COUNTED} places.`;
  }

  // Floor 4: a list that always misses
  const li = root.querySelector<HTMLElement>('[data-list-tool]');
  if (li) {
    const body = q(li, 'tbody');
    let seed = 7;
    let list = makeList(seed);
    const row = (label: string, cls = '') => {
      const tr = document.createElement('tr');
      if (cls) tr.className = cls;
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = label;
      tr.appendChild(th);
      return tr;
    };
    const draw = () => {
      clear(body);
      list.forEach((digits, k) => {
        const tr = row(`Line ${k + 1}`);
        digits.forEach((d, j) => {
          const td = document.createElement('td');
          if (j === k) td.className = 'diag';
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'bit';
          b.textContent = String(d);
          b.setAttribute('aria-label', `Line ${k + 1}, place ${j + 1}, digit ${d}. Flip it.`);
          b.addEventListener('click', () => {
            list[k][j] = 1 - list[k][j];
            draw();
            const again = body.querySelector<HTMLElement>(`tr:nth-child(${k + 1}) td:nth-child(${j + 2}) button`);
            if (again) again.focus();
            sound.play('tick', 0.3);
          });
          td.appendChild(b);
          tr.appendChild(td);
        });
        body.appendChild(tr);
      });
      const flip = diagonalFlip(list);
      const nr = row('New', 'new');
      flip.forEach((d) => {
        const td = document.createElement('td');
        td.textContent = String(d);
        nr.appendChild(td);
      });
      body.appendChild(nr);
      q(li, '[data-list-status]').textContent = `The new string is ${flip.join('')}. It differs from line 1 at place 1, from line 2 at place 2 and so on down to line ${LEN}, so it is not on the list.`;
    };
    q(li, '[data-list-new]').addEventListener('click', () => {
      seed += 1;
      list = makeList(seed);
      draw();
      sound.play('tick', 0.4);
    });
    draw();
  }
}
