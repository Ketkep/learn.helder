// The musical scale page: four keys. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { drift, equalCents, fifthNote, fmt, freqAt, freqOf, gaps, justCents, KINDS, keysSvg, nameOf, notesOf, ratioAt } from '../../lib/keys';

const root = document.querySelector<HTMLElement>('[data-keys]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement | null) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

/** Plays a list of notes (semitones from C4) one after the other. */
function playRun(notes: number[]) {
  notes.forEach((n, i) => window.setTimeout(() => sound.pluck(freqOf(n), [1, 0.3], 0.9), i * 380));
}

if (root) {
  initSoundButton(root);

  // Key 1: build a scale
  const bu = root.querySelector<HTMLElement>('[data-build-tool]');
  if (bu) {
    const roots = bu.querySelectorAll<HTMLElement>('[data-build-root]');
    const kinds = bu.querySelectorAll<HTMLElement>('[data-build-kind]');
    let r = 0;
    let kind = KINDS[0];
    const draw = () => {
      const notes = notesOf(kind, r);
      q(bu, '[data-build-g]').innerHTML = keysSvg(notes, r);
      q(bu, '[data-build-status]').textContent = `${nameOf(r).replace(/\d/, '')} ${kind.name.toLowerCase()}: ${notes.map((n) => nameOf(n)).join(', ')}. Gaps: ${gaps(kind).join(' ')}.`;
    };
    roots.forEach((b) =>
      b.addEventListener('click', () => {
        r = Number(b.getAttribute('data-build-root'));
        press(roots, b);
        draw();
        sound.pluck(freqOf(r), [1, 0.3], 0.9);
      }),
    );
    kinds.forEach((b) =>
      b.addEventListener('click', () => {
        kind = KINDS.find((k) => k.id === b.getAttribute('data-build-kind')) || kind;
        press(kinds, b);
        draw();
      }),
    );
    q(bu, '[data-build-play]').addEventListener('click', () => {
      sound.unlock();
      playRun(notesOf(kind, r));
    });
    draw();
  }

  // Key 2: twelve equal steps
  const tw = root.querySelector<HTMLElement>('[data-twelve-tool]');
  if (tw) {
    const range = q<HTMLInputElement>(tw, '[data-twelve-range]');
    const body = q(tw, '[data-twelve-body]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(tw, '[data-twelve-out]').textContent = String(n);
      body.querySelectorAll('tr').forEach((tr, i) => tr.classList.toggle('on', i === n));
      q(tw, '[data-twelve-status]').textContent = n === 0
        ? 'A is 440.00 hertz. Each step multiplies by 1.0595, and twelve of them double the frequency.'
        : `${n} step${n === 1 ? '' : 's'} up from A: times ${fmt(ratioAt(n), 4)}, which is ${fmt(freqAt(n), 2)} hertz.${n === 12 ? ' Exactly double, the A one octave up.' : ''}`;
    };
    range.addEventListener('input', draw);
    q(tw, '[data-twelve-play]').addEventListener('click', () => {
      sound.unlock();
      sound.pluck(freqAt(Number(range.value)), [1, 0.3], 1.2);
    });
    draw();
  }

  // Key 3: stacking fifths
  const fi = root.querySelector<HTMLElement>('[data-fifths-tool]');
  if (fi) {
    const range = q<HTMLInputElement>(fi, '[data-fifths-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(fi, '[data-fifths-out]').textContent = String(n);
      fi.querySelectorAll('tbody tr').forEach((tr, i) => tr.classList.toggle('on', i === n - 1));
      q(fi, '[data-fifths-status]').textContent = `After ${n} fifth${n === 1 ? '' : 's'} from C you reach ${fifthNote(n)}. The pure stack is ${fmt(justCents(n), 2)} cents above C and the equal note is ${fmt(equalCents(n))}. The gap is ${fmt(drift(n), 2)} cents.${n === 12 ? ' Back on C, but the pure stack is too high by the Pythagorean comma.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Key 4: major or minor
  const qz = root.querySelector<HTMLElement>('[data-quiz-tool]');
  if (qz) {
    const guesses = qz.querySelectorAll<HTMLElement>('[data-quiz-guess]');
    let answer: 'major' | 'minor' | '' = '';
    let right = 0;
    let wrong = 0;
    q(qz, '[data-quiz-play]').addEventListener('click', () => {
      sound.unlock();
      if (!answer) answer = Math.random() < 0.5 ? 'major' : 'minor';
      const rootNote = Math.floor(Math.random() * 12) - 3;
      press(guesses, null);
      playRun(notesOf(KINDS[answer === 'major' ? 0 : 1], rootNote));
      q(qz, '[data-quiz-status]').textContent = 'Listen, then choose major or minor.';
    });
    guesses.forEach((b) =>
      b.addEventListener('click', () => {
        if (!answer) {
          q(qz, '[data-quiz-status]').textContent = 'Press play first.';
          return;
        }
        const g = b.getAttribute('data-quiz-guess');
        press(guesses, b);
        if (g === answer) {
          right++;
          q(qz, '[data-quiz-status]').textContent = `Yes, it was ${answer}. Press play for another.`;
          sound.play('good', 0.3);
        } else {
          wrong++;
          q(qz, '[data-quiz-status]').textContent = `No, it was ${answer}. Press play for another.`;
          sound.play('bad', 0.3);
        }
        answer = '';
        q(qz, '[data-quiz-score]').textContent = `Right ${right}, wrong ${wrong}.`;
      }),
    );
  }
}
