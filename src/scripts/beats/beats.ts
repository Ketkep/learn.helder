// The beats page: three movements. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { addSvg, beatRate, every, fmt, gaugeSvg, heard, zonesSvg } from '../../lib/beats';

const root = document.querySelector<HTMLElement>('[data-beats]');

let stop: () => void = () => {};
let timer = 0;

/** Plays two steady notes for a few seconds. Pressing again, or any other Listen, cuts the first off. */
function listen(a: number, b: number, seconds = 3) {
  stop();
  window.clearTimeout(timer);
  const s1 = sound.hold(a);
  const s2 = sound.hold(b);
  stop = () => {
    s1();
    s2();
  };
  timer = window.setTimeout(stop, seconds * 1000);
}

if (root) {
  initSoundButton(root);

  // Movement 1: where the swells come from
  const ad = root.querySelector<HTMLElement>('[data-add-tool]');
  if (ad) {
    const range = q<HTMLInputElement>(ad, '[data-add-range]');
    const draw = () => {
      fillRange(range);
      const b = Number(range.value);
      q(ad, '[data-add-out]').textContent = String(b);
      q(ad, '[data-add-g]').innerHTML = addSvg(b - 220);
      const r = beatRate(220, b);
      q(ad, '[data-add-status]').textContent = `220 and ${b} hertz: ${every(r)}. You hear a note of ${fmt(heard(220, b), 1).replace('.0', '')} hertz.${r > 0 ? ` The picture shows two swells, which take ${fmt(2 / r, 1)} seconds.` : ' The two notes are the same, so the sum is steady and twice as big.'}`;
    };
    range.addEventListener('input', draw);
    q(ad, '[data-add-listen]').addEventListener('click', () => listen(220, Number(range.value)));
    draw();
  }

  // Movement 2: tune a string by ear
  const tu = root.querySelector<HTMLElement>('[data-tune-tool]');
  if (tu) {
    const starts = [9, -6, 3.5, -12, 7];
    let n = 0;
    const range = q<HTMLInputElement>(tu, '[data-tune-range]');
    const base = () => 440 + starts[n % starts.length];
    const diff = () => base() + Number(range.value) - 440;
    const draw = () => {
      fillRange(range);
      q(tu, '[data-tune-out]').textContent = fmt(Number(range.value), 1).replace('.0', '');
      const d = diff();
      q(tu, '[data-tune-g]').innerHTML = gaugeSvg(d);
      const r = Math.abs(d);
      q(tu, '[data-tune-status]').textContent =
        r <= 0.25 ? 'No swells: the string matches the reference note. It is in tune.' : `The string is ${fmt(r, 1).replace('.0', '')} hertz ${d > 0 ? 'too high' : 'too low'}: ${every(r)}. ${d > 0 ? 'Turn the peg down.' : 'Turn the peg up.'}`;
    };
    range.addEventListener('input', draw);
    q(tu, '[data-tune-listen]').addEventListener('click', () => listen(440, base() + Number(range.value)));
    q(tu, '[data-tune-new]').addEventListener('click', () => {
      n += 1;
      range.value = '0';
      draw();
      sound.play('pop', 0.25);
    });
    draw();
  }

  // Movement 3: when the swells turn rough
  const ro = root.querySelector<HTMLElement>('[data-rough-tool]');
  if (ro) {
    const range = q<HTMLInputElement>(ro, '[data-rough-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(ro, '[data-rough-out]').textContent = String(d);
      q(ro, '[data-rough-g]').innerHTML = zonesSvg(d);
      const what = d === 0 ? 'the same note, so there are no swells' : d <= 10 ? `${d} swells a second, which you can follow` : d <= 20 ? 'a flutter that is too fast to count' : 'roughness, and at the far end two separate notes';
      q(ro, '[data-rough-status]').textContent = `Two notes of 440 and ${440 + d} hertz: ${what}. The zones are rough guides, because sources disagree on where they start.`;
    };
    range.addEventListener('input', draw);
    q(ro, '[data-rough-listen]').addEventListener('click', () => listen(440, 440 + Number(range.value)));
    draw();
  }
}
