// The reaction time page: three tests. This file starts each one. Nothing is saved or sent anywhere.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { SPEEDS, distanceSvg, fmt, mean, metres, ruler, triesSvg } from '../../lib/react';

const root = document.querySelector<HTMLElement>('[data-react]');

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

/** A random wait between one and four and a half seconds. */
const wait = () => 1000 + Math.random() * 3500;

if (root) {
  initSoundButton(root);

  // Test 1: time your own reaction
  const te = root.querySelector<HTMLElement>('[data-test-tool]');
  if (te) {
    const times: number[] = [];
    const box = q<HTMLButtonElement>(te, '[data-test-signal]');
    const text = q(te, '[data-test-text]');
    const status = q(te, '[data-test-status]');
    const start = q<HTMLButtonElement>(te, '[data-test-start]');
    let state: 'idle' | 'wait' | 'go' = 'idle';
    let timer = 0;
    let t0 = 0;
    const draw = () => {
      q(te, '[data-test-g]').innerHTML = triesSvg(times);
    };
    const arm = () => {
      state = 'wait';
      box.classList.remove('go');
      text.textContent = 'Wait...';
      status.textContent = 'Wait for the box to say Now.';
      timer = window.setTimeout(() => {
        state = 'go';
        t0 = performance.now();
        box.classList.add('go');
        text.textContent = 'Now';
      }, wait());
    };
    const press = () => {
      if (state === 'wait') {
        window.clearTimeout(timer);
        state = 'idle';
        text.textContent = 'Too soon';
        status.textContent = 'Too soon. That try does not count. Press Start to try again.';
        return;
      }
      if (state !== 'go') return;
      const ms = Math.round(performance.now() - t0);
      state = 'idle';
      box.classList.remove('go');
      times.push(ms);
      if (times.length > 5) times.shift();
      text.textContent = `${ms} ms`;
      draw();
      status.textContent = `${ms} milliseconds. ${times.length > 1 ? `The average of your last ${times.length} tries is ${fmt(mean(times))} milliseconds.` : 'Press Start for another try.'}`;
      sound.play('tick', 0.25);
    };
    start.addEventListener('click', () => {
      if (state === 'idle') arm();
    });
    box.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      press();
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        press();
      }
    });
    draw();
  }

  // Test 2: how far in that time
  const fa = root.querySelector<HTMLElement>('[data-far-tool]');
  if (fa) {
    let kmh = 100;
    const range = q<HTMLInputElement>(fa, '[data-far-range]');
    const draw = () => {
      fillRange(range);
      const ms = Number(range.value);
      q(fa, '[data-far-out]').textContent = String(ms);
      q(fa, '[data-far-g]').innerHTML = distanceSvg(kmh, ms);
      q(fa, '[data-far-status]').textContent = `At ${kmh} kilometres an hour, something goes ${fmt(metres(kmh, ms), 1)} metres in ${ms} milliseconds. A ruler falls ${fmt(ruler(ms))} centimetres in that time.`;
    };
    picks(q(fa, '[data-far-picks]'), SPEEDS.map((s) => `${s.name}, ${s.kmh} km/h`), 'A car on a motorway, 100 km/h', (v) => {
      kmh = SPEEDS.filter((s) => `${s.name}, ${s.kmh} km/h` === v)[0].kmh;
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Test 3: a simple reaction and a choice
  const ch = root.querySelector<HTMLElement>('[data-choice-tool]');
  if (ch) {
    const times: number[] = [];
    let wrong = 0;
    let state: 'idle' | 'wait' | 'go' = 'idle';
    let side = 'Left';
    let timer = 0;
    let t0 = 0;
    const box = q(ch, '[data-choice-signal]');
    const text = q(ch, '[data-choice-text]');
    const status = q(ch, '[data-choice-status]');
    const arm = () => {
      state = 'wait';
      box.classList.remove('go');
      text.textContent = 'Wait...';
      status.textContent = 'Wait for the box to say Left or Right.';
      timer = window.setTimeout(() => {
        state = 'go';
        side = Math.random() < 0.5 ? 'Left' : 'Right';
        t0 = performance.now();
        box.classList.add('go');
        text.textContent = side;
      }, wait());
    };
    const press = (which: string) => {
      if (state === 'wait') {
        window.clearTimeout(timer);
        state = 'idle';
        text.textContent = 'Too soon';
        status.textContent = 'Too soon. That try does not count. Press Start to try again.';
        return;
      }
      if (state !== 'go') return;
      const ms = Math.round(performance.now() - t0);
      state = 'idle';
      box.classList.remove('go');
      if (which !== side) {
        wrong += 1;
        text.textContent = 'Wrong side';
        status.textContent = `Wrong side. That try does not count. ${wrong} wrong so far. Press Start to try again.`;
        return;
      }
      times.push(ms);
      if (times.length > 5) times.shift();
      text.textContent = `${ms} ms`;
      status.textContent = `${ms} milliseconds. The average of your last ${times.length} ${times.length === 1 ? 'try' : 'tries'} is ${fmt(mean(times))} milliseconds. Compare it with your average in the first test.`;
      sound.play('tick', 0.25);
    };
    q(ch, '[data-choice-start]').addEventListener('click', () => {
      if (state === 'idle') arm();
    });
    q(ch, '[data-choice-left]').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      press('Left');
    });
    q(ch, '[data-choice-right]').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      press('Right');
    });
    for (const [id, which] of [['[data-choice-left]', 'Left'], ['[data-choice-right]', 'Right']]) {
      q(ch, id).addEventListener('keydown', (e) => {
        const k = (e as KeyboardEvent).key;
        if (k === ' ' || k === 'Enter') {
          e.preventDefault();
          press(which);
        }
      });
    }
    ch.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === 'ArrowLeft') press('Left');
      if (k === 'ArrowRight') press('Right');
    });
  }
}
