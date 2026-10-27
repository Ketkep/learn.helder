// The muscle page: four boards. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { chainSvg, countIn, CYCLE, cycleSvg, fmt, headsInReach, HEADS, REST, sarcomereSvg, STATES, strokesNeeded, STEP_NM, switchSvg } from '../../lib/muscle';

const root = document.querySelector<HTMLElement>('[data-muscle]');

if (root) {
  initSoundButton(root);

  // Board 1: the length of a sarcomere
  const le = root.querySelector<HTMLElement>('[data-length-tool]');
  if (le) {
    const range = q<HTMLInputElement>(le, '[data-length-range]');
    const draw = () => {
      fillRange(range);
      const L = Number(range.value) / 100;
      q(le, '[data-length-out]').textContent = L.toFixed(2);
      q(le, '[data-length-g]').innerHTML = sarcomereSvg(L);
      const n = headsInReach(L);
      const where = L < 2.05 ? ' Below 2.05 micrometres the thin filaments meet in the middle, and real force falls. The toy does not draw that.' : L >= 3.65 ? ' The filaments no longer overlap, so no head can pull.' : Math.abs(L - REST) < 0.06 ? ' This is about the resting length.' : '';
      q(le, '[data-length-status]').textContent = `At ${L.toFixed(2)} micrometres, ${n} of the ${HEADS} drawn heads can reach a thin filament.${where}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Board 2: one pull of one head
  const cy = root.querySelector<HTMLElement>('[data-cycle-tool]');
  if (cy) {
    let state = 0;
    let strokes = 0;
    const draw = () => {
      q(cy, '[data-cycle-g]').innerHTML = cycleSvg(state, strokes);
      const c = CYCLE[state];
      const pulled = strokes > 0 ? ` Pulls so far: ${strokes}, about ${fmt(strokes * STEP_NM)} nanometres in all, if each is 11. To shorten a resting sarcomere by 10 per cent one head would need about ${strokesNeeded(0.1)}.` : '';
      q(cy, '[data-cycle-status]').textContent = `Step ${state + 1}, ${c.name.toLowerCase()}. ${c.text}${pulled}`;
    };
    q(cy, '[data-cycle-next]').addEventListener('click', () => {
      state = (state + 1) % 4;
      if (state === 2) strokes += 1;
      draw();
      sound.play(state === 2 ? 'pop' : 'tick', 0.4);
    });
    q(cy, '[data-cycle-reset]').addEventListener('click', () => {
      state = 0;
      strokes = 0;
      draw();
    });
    draw();
  }

  // Board 3: thousands in a row
  const ch = root.querySelector<HTMLElement>('[data-chain-tool]');
  if (ch) {
    const range = q<HTMLInputElement>(ch, '[data-chain-range]');
    const draw = () => {
      fillRange(range);
      const p = Number(range.value);
      q(ch, '[data-chain-out]').textContent = String(p);
      q(ch, '[data-chain-g]').innerHTML = chainSvg(p / 100);
      const mm = 10 * (1 - p / 100);
      q(ch, '[data-chain-status]').textContent = `One centimetre holds about ${fmt(countIn(1))} sarcomeres. With each one ${p}% shorter, the centimetre becomes ${mm.toFixed(1)} millimetres, ${(10 - mm).toFixed(1)} ${p === 10 ? 'millimetre' : 'millimetres'} shorter. That is ${fmt((REST * p) / 100, 2)} micrometres from each sarcomere.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Board 4: the signal and ATP
  const sw = root.querySelector<HTMLElement>('[data-switch-tool]');
  if (sw) {
    const picks = sw.querySelectorAll<HTMLElement>('[data-switch-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const k = Number(b.getAttribute('data-switch-pick'));
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(sw, '[data-switch-g]').innerHTML = switchSvg(k);
        q(sw, '[data-switch-status]').textContent = STATES[k].text;
        sound.play(k === 2 ? 'bad' : 'tick', 0.35);
      }),
    );
  }
}
