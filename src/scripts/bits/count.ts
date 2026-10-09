// Reading 3: counting with carries, and wrapping round at 255.

import * as sound from '../sound';
import { q } from '../util';
import { bits, getByte, setByte, watch } from './byte';

export function initCount(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-count-tool]');
  if (!tool) return;
  const odo = q<HTMLElement>(tool, '[data-count-odo]');
  const status = q<HTMLElement>(tool, '[data-count-status]');
  let note = '';

  watch(() => {
    const v = getByte();
    odo.textContent = bits(v).split('').join(' ');
    if (note) {
      status.textContent = note;
      note = '';
    }
  });

  function act(kind: string) {
    const v = getByte();
    if (kind === 'inc') {
      // The number of switches that turn over is the run of ones at the right, plus the one that turns on
      let carries = 0;
      while (carries < 8 && ((v >> carries) & 1) === 1) carries++;
      if (v === 255) {
        note = '255 + 1 does not fit in eight switches. Every switch turns off, and the last carry is lost. The byte has wrapped round to 0.';
        sound.play('thud');
      } else {
        note = `${v} + 1 = ${v + 1}. ${carries === 0 ? 'The right-hand switch was off, so it just turned on.' : `The ${carries} right-hand switch${carries === 1 ? ' was' : 'es were'} on, so ${carries === 1 ? 'it turned' : 'they turned'} off and the carry went on to the next one, which turned on.`}`;
        sound.play(carries > 2 ? 'snap' : 'tick');
      }
      setByte((v + 1) % 256);
    } else if (kind === 'dec') {
      if (v === 0) {
        note = '0 − 1 wraps round the other way, to 255: every switch turns on.';
        sound.play('thud');
      } else note = `${v} − 1 = ${v - 1}.`;
      setByte(v === 0 ? 255 : v - 1);
    } else if (kind === 'double') {
      const lost = v >= 128;
      note = lost ? `${v} doubled is ${v * 2}, which does not fit. Every switch moved one place left and the top one fell off, so the byte is ${(v * 2) % 256}.` : `${v} doubled is ${v * 2}. Every switch moved one place to the left.`;
      setByte((v * 2) % 256);
      sound.play('whoosh', 0.3);
    } else {
      note = `${v} halved is ${Math.floor(v / 2)}. Every switch moved one place to the right${v % 2 ? ', and the last one fell off, so the half is rounded down' : ''}.`;
      setByte(Math.floor(v / 2));
      sound.play('whoosh', 0.3);
    }
  }
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-count-do]')) b.addEventListener('click', () => act(b.dataset.countDo!));
}
