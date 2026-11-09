// The Monty Hall page: three acts. This file starts each one. Nothing is saved or sent anywhere.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { HOSTS, casesSvg, chances, doorsSvg, fmt, pct, stay, swap } from '../../lib/monty';

const root = document.querySelector<HTMLElement>('[data-monty]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

const ordinal = (n: number, of: number) => `${fmt(n)} of ${fmt(of)}`;

if (root) {
  initSoundButton(root);

  // Act 1: play the game
  const pl = root.querySelector<HTMLElement>('[data-play-tool]');
  if (pl) {
    const host = q(pl, '[data-play-doors]');
    const stayBtn = q<HTMLButtonElement>(pl, '[data-play-stay]');
    const swapBtn = q<HTMLButtonElement>(pl, '[data-play-switch]');
    const again = q<HTMLButtonElement>(pl, '[data-play-again]');
    const status = q(pl, '[data-play-status]');
    const score = { stay: [0, 0], swap: [0, 0] };
    let car = 0;
    let pick = -1;
    let opened = -1;
    let phase: 'pick' | 'choose' | 'done' = 'pick';
    const doors: HTMLButtonElement[] = [];
    for (let i = 0; i < 3; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'door-btn';
      b.innerHTML = `<span class="num">${i + 1}</span><span class="what"></span>`;
      b.setAttribute('aria-label', `Door ${i + 1}`);
      b.addEventListener('click', () => choose(i));
      host.appendChild(b);
      doors.push(b);
    }
    const label = (i: number, text: string) => {
      q(doors[i], '.what').textContent = text;
      doors[i].setAttribute('aria-label', `Door ${i + 1}${text ? `: ${text}` : ''}`);
    };
    const drawScore = () => {
      q(pl, '[data-play-score]').textContent = `Stayed: ${ordinal(score.stay[0], score.stay[1])}. Switched: ${ordinal(score.swap[0], score.swap[1])}.`;
    };
    const reset = () => {
      car = Math.floor(Math.random() * 3);
      pick = -1;
      opened = -1;
      phase = 'pick';
      doors.forEach((d, i) => {
        d.className = 'door-btn';
        d.disabled = false;
        label(i, '');
      });
      stayBtn.disabled = true;
      swapBtn.disabled = true;
      again.disabled = true;
      status.textContent = 'Pick a door.';
    };
    const choose = (i: number) => {
      if (phase !== 'pick') return;
      pick = i;
      const others = [0, 1, 2].filter((x) => x !== pick && x !== car);
      opened = others[Math.floor(Math.random() * others.length)];
      phase = 'choose';
      doors[pick].classList.add('mine');
      doors[opened].classList.add('open');
      label(opened, 'Goat');
      doors.forEach((d) => (d.disabled = true));
      stayBtn.disabled = false;
      swapBtn.disabled = false;
      const other = [0, 1, 2].filter((x) => x !== pick && x !== opened)[0];
      status.textContent = `You picked door ${pick + 1}. The host opens door ${opened + 1}: a goat. Stay with door ${pick + 1} or switch to door ${other + 1}?`;
      sound.play('tick', 0.3);
    };
    const finish = (switched: boolean) => {
      if (phase !== 'choose') return;
      phase = 'done';
      const other = [0, 1, 2].filter((x) => x !== pick && x !== opened)[0];
      const final = switched ? other : pick;
      const won = final === car;
      const s = switched ? score.swap : score.stay;
      s[1] += 1;
      if (won) s[0] += 1;
      doors.forEach((d, i) => {
        d.classList.add('open');
        label(i, i === car ? 'Car' : 'Goat');
      });
      doors[final].classList.add('mine');
      stayBtn.disabled = true;
      swapBtn.disabled = true;
      again.disabled = false;
      again.focus();
      drawScore();
      status.textContent = `You ${switched ? 'switched to' : 'stayed with'} door ${final + 1}. The car was behind door ${car + 1}. ${won ? 'You win the car.' : 'You win a goat.'}`;
      sound.play(won ? 'good' : 'bad', 0.3);
    };
    stayBtn.addEventListener('click', () => finish(false));
    swapBtn.addEventListener('click', () => finish(true));
    again.addEventListener('click', reset);
    reset();
    drawScore();
  }

  // Act 2: more doors
  const dr = root.querySelector<HTMLElement>('[data-doors-tool]');
  if (dr) {
    const range = q<HTMLInputElement>(dr, '[data-doors-range]');
    const status = q(dr, '[data-doors-status]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(dr, '[data-doors-out]').textContent = String(n);
      const d = doorsSvg(n);
      q(dr, '[data-doors-g]').innerHTML = d.svg;
      q(dr, '[data-doors-svg]').setAttribute('viewBox', `0 0 420 ${d.h}`);
      status.textContent = `With ${n} doors, staying wins 1 time in ${n} (${pct(stay(n))}) and switching wins ${n - 1} in ${n} (${pct(swap(n))}).`;
    };
    q(dr, '[data-doors-run]').addEventListener('click', () => {
      const n = Number(range.value);
      let stays = 0;
      let swaps = 0;
      const games = 1000;
      for (let g = 0; g < games; g++) {
        // You pick a door. The host leaves one other door shut, the car's if you missed it, any other if you hit.
        const carDoor = Math.floor(Math.random() * n);
        const mine = Math.floor(Math.random() * n);
        if (mine === carDoor) stays += 1;
        else swaps += 1;
      }
      status.textContent = `${fmt(games)} games with ${n} doors: staying won ${fmt(stays)} and switching won ${fmt(swaps)}. The chances say about ${fmt(stay(n) * games)} and ${fmt(swap(n) * games)}.`;
      sound.play('tick', 0.3);
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Act 3: what the host does
  const ho = root.querySelector<HTMLElement>('[data-host-tool]');
  if (ho) {
    const show = (id: string) => {
      const h = HOSTS.filter((x) => x.id === id)[0];
      const c = chances(id);
      const d = casesSvg(id);
      q(ho, '[data-host-g]').innerHTML = d.svg;
      q(ho, '[data-host-svg]').setAttribute('viewBox', `0 0 420 ${d.h}`);
      q(ho, '[data-host-svg]').setAttribute('aria-label', `Every case when you pick door 1 and the host is: ${h.name.toLowerCase()}.`);
      q(ho, '[data-host-status]').textContent = `${h.note} When you are offered a switch, staying wins ${pct(c.stay)} of the time and switching wins ${pct(c.swap)}.`;
    };
    picks(q(ho, '[data-host-picks]'), HOSTS.map((h) => h.name), HOSTS[0].name, (v) => show(HOSTS.filter((h) => h.name === v)[0].id));
  }
}
