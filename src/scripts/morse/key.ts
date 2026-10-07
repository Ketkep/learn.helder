// Message 1: a key you hold. A press shorter than two beats is a dot, longer is a dash.
// A pause of three beats ends the letter, and seven beats ends the word.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { decode } from './code';

const PITCH = 620;

export function initKey(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-key-tool]');
  if (!tool) return;
  const press = q<HTMLButtonElement>(tool, '[data-key-press]');
  const signs = q<HTMLElement>(tool, '[data-key-signs]');
  const letters = q<HTMLElement>(tool, '[data-key-letters]');
  const status = q<HTMLElement>(tool, '[data-key-status]');
  const unitInput = q<HTMLInputElement>(tool, '[data-key-unit]');
  const unitOut = q<HTMLOutputElement>(tool, '[data-key-unit-out]');

  let unit = 120;
  let current = ''; // the dots and dashes of the letter being tapped
  let done: string[] = []; // finished letters ("" is a word space)
  let down = 0;
  let stopTone = () => {};
  let letterTimer = 0;
  let wordTimer = 0;

  const dots = (code: string) => [...code].map((c) => (c === '-' ? '−' : '·')).join('');

  function render() {
    const text = done.map((d) => d || ' ').join('');
    const unknown = current && !decode(current) && current.length >= 5;
    signs.textContent = current ? dots(current) : ' ';
    letters.textContent = [...text].join(' ') || ' ';
    status.textContent = current
      ? `You have tapped ${dots(current)}${decode(current) ? `, which is ${decode(current)}` : unknown ? ', which is not a letter' : ''}. Pause to finish the letter.`
      : done.length
        ? `Your message so far: ${text.trim() || '(only spaces)'}.`
        : 'Press the key to make your own message.';
  }

  function endLetter() {
    window.clearTimeout(letterTimer);
    if (!current) return;
    done.push(decode(current) || '?');
    current = '';
    render();
  }
  function endWord() {
    endLetter();
    if (done.length && done[done.length - 1] !== '') done.push('');
    render();
  }

  function add(sign: string) {
    window.clearTimeout(letterTimer);
    window.clearTimeout(wordTimer);
    current += sign;
    render();
    // After a pause of 3 beats the letter ends, after 7 the word ends
    letterTimer = window.setTimeout(endLetter, unit * 3);
    wordTimer = window.setTimeout(endWord, unit * 7);
  }

  function start() {
    if (down) return;
    // A new press cancels the pause timers: the letter goes on
    window.clearTimeout(letterTimer);
    window.clearTimeout(wordTimer);
    down = performance.now();
    stopTone = sound.hold(PITCH);
    press.classList.add('is-down');
  }
  function stop() {
    if (!down) return;
    const length = performance.now() - down;
    down = 0;
    stopTone();
    press.classList.remove('is-down');
    add(length < unit * 2 ? '.' : '-');
  }

  press.addEventListener('pointerdown', (e) => {
    press.setPointerCapture(e.pointerId);
    sound.unlock();
    start();
  });
  press.addEventListener('pointerup', stop);
  press.addEventListener('pointercancel', stop);
  // The space bar works as the key, and does not scroll the page
  press.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!e.repeat) start();
    }
  });
  press.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      stop();
    }
  });

  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-key-add]')) {
    b.addEventListener('click', () => {
      const v = b.dataset.keyAdd!;
      window.clearTimeout(letterTimer);
      window.clearTimeout(wordTimer);
      if (v === '|') endLetter();
      else if (v === ' ') endWord();
      else {
        current += v;
        sound.beeps(PITCH, [[0, (v === '-' ? 3 : 1) * 0.1]]);
        render();
      }
    });
  }
  q<HTMLButtonElement>(tool, '[data-key-clear]').addEventListener('click', () => {
    current = '';
    done = [];
    window.clearTimeout(letterTimer);
    window.clearTimeout(wordTimer);
    status.textContent = 'Cleared. Press the key to make your own message.';
    signs.textContent = ' ';
    letters.textContent = ' ';
  });
  unitInput.addEventListener('input', () => {
    unit = Number(unitInput.value);
    unitOut.textContent = `${unit} ms`;
    fillRange(unitInput);
  });
  fillRange(unitInput);
  signs.textContent = '··· −−− ···';
}
