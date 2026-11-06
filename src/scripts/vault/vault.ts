// The password page: three locks. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { ATTACKS, HABITS, SETS, barSvg, bits, bitsOfWords, dialsSvg, fmt, seconds, span } from '../../lib/vault';

const root = document.querySelector<HTMLElement>('[data-vault]');

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

const times = (b: number) => ATTACKS.map((a) => `${a.name.toLowerCase()}: ${span(seconds(b, a.rate))}`).join('; ');

if (root) {
  initSoundButton(root);

  // Lock 1: every extra place multiplies the tries
  const le = root.querySelector<HTMLElement>('[data-length-tool]');
  if (le) {
    let set = SETS[1];
    const range = q<HTMLInputElement>(le, '[data-length-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(le, '[data-length-out]').textContent = String(n);
      q(le, '[data-length-g]').innerHTML = dialsSvg(set.size, n);
      const b = bits(set.size, n);
      q(le, '[data-length-status]').textContent = `${n} random characters from a set of ${set.size} (${set.name.toLowerCase()}) give ${fmt(b, 1)} bits. Average time to hit it, at made-up speeds: ${times(b)}.`;
    };
    picks(q(le, '[data-length-picks]'), SETS.map((s) => s.name), SETS[1].name, (v) => {
      set = SETS.filter((s) => s.name === v)[0];
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Lock 2: words against characters
  const wo = root.querySelector<HTMLElement>('[data-words-tool]');
  if (wo) {
    const w = q<HTMLInputElement>(wo, '[data-words-w]');
    const c = q<HTMLInputElement>(wo, '[data-words-c]');
    const draw = () => {
      [w, c].forEach(fillRange);
      const nw = Number(w.value);
      const nc = Number(c.value);
      q(wo, '[data-words-w-out]').textContent = String(nw);
      q(wo, '[data-words-c-out]').textContent = String(nc);
      const bw = bitsOfWords(nw);
      const bc = bits(94, nc);
      q(wo, '[data-words-g]').innerHTML = barSvg([
        { name: `${nw} random ${nw === 1 ? 'word' : 'words'}`, bits: bw },
        { name: `${nc} random characters from 94`, bits: bc },
      ]);
      q(wo, '[data-words-status]').textContent = `${nw} random ${nw === 1 ? 'word gives' : 'words give'} ${fmt(bw, 1)} bits and ${nc} random characters give ${fmt(bc, 1)} bits. ${Math.abs(bw - bc) < 3 ? 'About the same.' : bw > bc ? 'The words are stronger.' : 'The characters are stronger.'}`;
    };
    [w, c].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Lock 3: a habit is not random
  const ha = root.querySelector<HTMLElement>('[data-habit-tool]');
  if (ha) {
    picks(q(ha, '[data-habit-picks]'), HABITS.map((h) => h.name), '', (v) => {
      const h = HABITS.filter((x) => x.name === v)[0];
      q(ha, '[data-habit-status]').textContent = `${h.name}: ${fmt(h.bits, 1)} bits. ${h.note} At the speed of a stolen file with a fast hash, made up, it takes on average ${span(seconds(h.bits, ATTACKS[2].rate))}.`;
    });
  }
}
