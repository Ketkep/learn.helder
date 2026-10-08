// Experiment 4: the three doors puzzle. The host always opens an empty door and always offers the switch.

import * as sound from '../sound';
import { q } from '../util';
import { pct, pick } from './stats';

type Plan = 'stay' | 'switch';

export function initDoors(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-doors-tool]');
  if (!tool) return;
  const doors = [...tool.querySelectorAll<HTMLButtonElement>('[data-door]')];
  const choice = q<HTMLElement>(tool, '[data-doors-choice]');
  const status = q<HTMLElement>(tool, '[data-doors-status]');
  const tally = { stay: { n: 0, w: 0 }, switch: { n: 0, w: 0 } };

  let prize = 0;
  let first = 0;
  let opened = 0;
  let phase: 'pick' | 'offer' | 'done' = 'pick';

  const face = (d: HTMLButtonElement) => q<HTMLElement>(d, '[data-face]');
  const door = (n: number) => doors[n - 1];

  function show() {
    for (const p of ['stay', 'switch'] as Plan[]) {
      const t = tally[p];
      q<HTMLElement>(tool!, `[data-tally="${p}-n"]`).textContent = t.n.toLocaleString('en-US');
      q<HTMLElement>(tool!, `[data-tally="${p}-w"]`).textContent = t.w.toLocaleString('en-US');
      q<HTMLElement>(tool!, `[data-tally="${p}-p"]`).textContent = t.n ? pct(t.w / t.n) : '-';
    }
  }

  function newGame() {
    prize = pick(3);
    first = 0;
    opened = 0;
    phase = 'pick';
    for (const d of doors) {
      d.disabled = false;
      d.className = 'door';
      face(d).textContent = '';
      d.removeAttribute('aria-pressed');
    }
    choice.hidden = true;
    status.textContent = 'A prize is behind one of three doors. Pick a door.';
  }

  function reveal(final: number) {
    phase = 'done';
    for (const d of doors) {
      const n = Number(d.dataset.door);
      d.disabled = true;
      d.classList.add('open');
      face(d).textContent = n === prize ? 'Prize' : 'Empty';
      d.classList.toggle('prize', n === prize);
      d.classList.toggle('chosen', n === final);
    }
    choice.hidden = true;
  }

  for (const d of doors) {
    d.addEventListener('click', () => {
      if (phase !== 'pick') return;
      first = Number(d.dataset.door);
      // The host opens an empty door that is not the one you picked
      const options = [1, 2, 3].filter((n) => n !== first && n !== prize);
      opened = options[Math.floor(Math.random() * options.length)];
      const o = door(opened);
      o.classList.add('open');
      o.disabled = true;
      face(o).textContent = 'Empty';
      d.classList.add('chosen');
      for (const x of doors) x.disabled = true;
      phase = 'offer';
      choice.hidden = false;
      const other = [1, 2, 3].find((n) => n !== first && n !== opened)!;
      q<HTMLElement>(tool, '[data-doors-stay]').textContent = `Stay with door ${first}`;
      q<HTMLElement>(tool, '[data-doors-switch]').textContent = `Switch to door ${other}`;
      status.textContent = `You picked door ${first}. The host opens door ${opened}: it is empty. Do you stay with door ${first} or switch to door ${other}?`;
      sound.play('pop');
    });
  }

  function decide(plan: Plan) {
    if (phase !== 'offer') return;
    const other = [1, 2, 3].find((n) => n !== first && n !== opened)!;
    const final = plan === 'stay' ? first : other;
    const win = final === prize;
    tally[plan].n++;
    if (win) tally[plan].w++;
    reveal(final);
    show();
    status.textContent = `You ${plan === 'stay' ? `stayed with door ${first}` : `switched to door ${other}`}. The prize was behind door ${prize}. ${win ? 'You win.' : 'You lose.'}`;
    sound.play(win ? 'good' : 'bad', 0.7);
  }
  q<HTMLButtonElement>(tool, '[data-doors-stay]').addEventListener('click', () => decide('stay'));
  q<HTMLButtonElement>(tool, '[data-doors-switch]').addEventListener('click', () => decide('switch'));
  q<HTMLButtonElement>(tool, '[data-doors-again]').addEventListener('click', () => {
    newGame();
    sound.play('tick');
  });

  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-doors-auto]')) {
    b.addEventListener('click', () => {
      const plan = b.dataset.doorsAuto as Plan;
      let wins = 0;
      for (let i = 0; i < 1000; i++) {
        const p = pick(3);
        const f = pick(3);
        // Staying wins when the first pick has the prize. Switching wins when it does not, because the host removes the other empty door.
        const win = plan === 'stay' ? f === p : f !== p;
        if (win) wins++;
      }
      tally[plan].n += 1000;
      tally[plan].w += wins;
      show();
      status.textContent = `You played 1,000 games and always ${plan === 'stay' ? 'stayed' : 'switched'}: ${wins} wins (${pct(wins / 1000)}). Over many games ${plan === 'stay' ? 'staying wins about 1 time in 3' : 'switching wins about 2 times in 3'}.`;
      sound.play('whoosh', 0.5);
    });
  }
  q<HTMLButtonElement>(tool, '[data-doors-clear]').addEventListener('click', () => {
    tally.stay = { n: 0, w: 0 };
    tally.switch = { n: 0, w: 0 };
    show();
    newGame();
    sound.play('pop');
  });

  newGame();
  show();
}
