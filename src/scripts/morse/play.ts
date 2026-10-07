// Message 4: sending a message with the right timing, and a word to copy by ear or by lamp.

import * as sound from '../sound';
import { clear, fillRange, q, reducedMotion } from '../util';
import { segments } from './code';

const PITCH = 620;
const WORDS = ['SOS', 'SEA', 'KEY', 'SHIP', 'LAMP', 'TREE', 'TAPE', 'WIRE', 'CODE', 'MORSE', 'RADIO', 'LIGHT', 'TRAIN', 'SIGNAL'];

export function initPlay(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-play-tool]');
  if (!tool) return;
  const text = q<HTMLInputElement>(tool, '[data-play-text]');
  const wpm = q<HTMLInputElement>(tool, '[data-play-wpm]');
  const wpmOut = q<HTMLOutputElement>(tool, '[data-play-wpm-out]');
  const lamp = q<HTMLElement>(tool, '[data-play-lamp]');
  const line = q<HTMLElement>(tool, '[data-play-timeline]');
  const status = q<HTMLElement>(tool, '[data-play-status]');
  const go = q<HTMLButtonElement>(tool, '[data-play-go]');
  const guess = q<HTMLInputElement>(tool, '[data-play-guess]');
  let frame = 0;
  let cut = () => {};
  let secret = '';
  let last = '';

  const unitSeconds = () => 1.2 / Number(wpm.value); // one unit at this speed (PARIS is 50 units)

  function drawLine(message: string) {
    clear(line);
    for (const [on, n] of segments(message)) {
      const seg = document.createElement('span');
      seg.className = on ? 'seg on' : 'seg';
      seg.style.flex = `${n} 0 0`;
      line.appendChild(seg);
    }
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    cut();
    lamp.classList.remove('lit');
    for (const s of line.children) s.classList.remove('now');
    go.textContent = 'Play';
  }

  /** Plays a message. `show` says whether the timeline is drawn (the copy game hides the word, but a timeline gives it away). */
  function play(message: string, show: boolean, done?: () => void) {
    stop();
    const parts = segments(message);
    if (!parts.length) {
      status.textContent = 'There is nothing to send. Use letters and numbers.';
      return;
    }
    if (show) drawLine(message);
    else {
      clear(line);
      const mark = document.createElement('span');
      mark.className = 'seg hidden';
      mark.style.flex = '1 0 0';
      line.appendChild(mark);
    }
    const unit = unitSeconds();
    const beeps: [number, number][] = [];
    const starts: number[] = [];
    let t = 0;
    for (const [on, n] of parts) {
      starts.push(t);
      if (on) beeps.push([t, n * unit]);
      t += n * unit;
    }
    cut = sound.beeps(PITCH, beeps);
    go.textContent = 'Stop';
    const flash = !reducedMotion(); // with reduced motion the lamp stays dark and nothing moves
    const began = performance.now() + 50;
    const step = (now: number) => {
      const el = (now - began) / 1000;
      if (el >= t) {
        stop();
        done?.();
        return;
      }
      let i = starts.findIndex((s, k) => el >= s && el < (starts[k + 1] ?? t));
      if (i < 0) i = 0;
      const on = el >= 0 && parts[i][0];
      if (flash) lamp.classList.toggle('lit', on);
      if (show && flash) [...line.children].forEach((c, k) => c.classList.toggle('now', k === i));
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  function describe() {
    const message = text.value;
    const parts = segments(message);
    const n = parts.reduce((sum, s) => sum + s[1], 0);
    const seconds = n * unitSeconds();
    wpmOut.textContent = `${wpm.value} words a minute`;
    fillRange(wpm);
    status.textContent = parts.length
      ? `${message.toUpperCase().trim()} is ${n} units long. At ${wpm.value} words a minute one unit is ${Math.round(unitSeconds() * 1000)} ms, so it takes ${seconds.toFixed(1)} seconds.`
      : 'Type letters or numbers to send.';
  }

  go.addEventListener('click', () => {
    if (frame) return stop();
    describe();
    play(text.value, true);
  });
  text.addEventListener('input', () => {
    stop();
    drawLine(text.value);
    describe();
  });
  wpm.addEventListener('input', describe);

  q<HTMLButtonElement>(tool, '[data-play-word]').addEventListener('click', () => {
    let word = WORDS[Math.floor(Math.random() * WORDS.length)];
    while (word === last) word = WORDS[Math.floor(Math.random() * WORDS.length)];
    last = word;
    secret = word;
    guess.value = '';
    guess.focus();
    status.textContent = `Listen. The word has ${word.length} letters${reducedMotion() ? '' : ', and the lamp flashes too'}. Type what you heard.`;
    play(word, false, () => {
      status.textContent = 'Done. Type what you heard and press Check. Press the button again to hear another word.';
    });
  });
  const check = () => {
    if (!secret) {
      status.textContent = 'Press Give me a word first.';
      return;
    }
    const answer = guess.value.trim().toUpperCase();
    if (!answer) return;
    if (answer === secret) {
      status.textContent = `Yes, the word was ${secret}.`;
      sound.play('good');
      secret = '';
    } else {
      status.textContent = 'Not quite. Try again, or press Show the answer.';
      sound.play('bad', 0.5);
    }
  };
  q<HTMLButtonElement>(tool, '[data-play-check]').addEventListener('click', check);
  guess.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') check();
  });
  q<HTMLButtonElement>(tool, '[data-play-show]').addEventListener('click', () => {
    if (!secret) {
      status.textContent = 'Press Give me a word first.';
      return;
    }
    status.textContent = `The word was ${secret}.`;
    drawLine(secret);
    secret = '';
  });
  fillRange(wpm);
}
