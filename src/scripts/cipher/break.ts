// Try 2: break a shift cipher by counting letters.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { ALPHABET, ENGLISH, bestShift, chartHtml, counts, shift } from '../../lib/cipher';

const MESSAGES: { text: string; by: number }[] = [
  { text: 'MEET ME AT THE OLD BRIDGE WHEN THE BELLS RING NOON AND BRING THE LETTER WITH THE RED SEAL', by: 3 },
  { text: 'THE KEY IS UNDER THE BLUE STONE BESIDE THE WELL AND THE DOOR OF THE BARN IS NOT LOCKED TONIGHT', by: 11 },
  { text: 'SEND THE BOATS ACROSS THE RIVER BEFORE THE RAIN COMES AND LEAVE THE LANTERN BURNING IN THE WINDOW', by: 20 },
];

export function initBreak(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-break-tool]');
  if (!tool) return;
  const secretEl = q<HTMLElement>(tool, '[data-break-secret]');
  const chart = q(tool, '[data-break-chart]');
  const guess = q<HTMLInputElement>(tool, '[data-break-guess]');
  const plainEl = q<HTMLElement>(tool, '[data-break-plain]');
  const status = q<HTMLElement>(tool, '[data-break-status]');
  let n = 0;
  let secret = shift(MESSAGES[0].text, MESSAGES[0].by);

  function draw(note = '') {
    const g = Number(guess.value);
    fillRange(guess);
    q(tool!, '[data-break-out]').textContent = String(g);
    const plain = shift(secret, -g);
    chart.innerHTML = chartHtml(counts(plain), ENGLISH);
    plainEl.textContent = plain;
    secretEl.textContent = secret;
    const c = counts(secret);
    const tall = c.indexOf(Math.max(...c));
    const best = bestShift(secret);
    const match = g === best;
    status.textContent = `${note}The tallest bar in the secret message is ${ALPHABET[tall]}, and the tallest in English is E, which is ${(tall - 4 + 26) % 26} places before it. Turned back by ${g}, the bars ${match ? 'line up with the English ticks: this looks like English, so this is the key.' : 'do not line up with the English ticks yet.'}`;
  }

  guess.addEventListener('input', () => draw());
  q(tool, '[data-break-auto]').addEventListener('click', () => {
    guess.value = String(bestShift(secret));
    sound.play('snap', 0.5);
    draw('The computer compared the counts with English and chose this turn. ');
  });
  q(tool, '[data-break-new]').addEventListener('click', () => {
    n = (n + 1) % MESSAGES.length;
    secret = shift(MESSAGES[n].text, MESSAGES[n].by);
    guess.value = '0';
    draw('A new message. ');
  });
  draw();
}
