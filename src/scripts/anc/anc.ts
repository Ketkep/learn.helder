// The noise cancelling page: three parts. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { fmt, graphSvg, left, leftFromPhase, micro, reduction, wavesSvg } from '../../lib/anc';

const root = document.querySelector<HTMLElement>('[data-anc]');

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

/** What a change in loudness is, in words. */
const change = (share: number) => {
  const r = reduction(share);
  return r >= 0 ? `${fmt(r, 1)} decibels quieter` : `${fmt(-r, 1)} decibels louder`;
};

if (root) {
  initSoundButton(root);

  // Part 1: an upside down copy
  const ca = root.querySelector<HTMLElement>('[data-cancel-tool]');
  if (ca) {
    const hz = q<HTMLInputElement>(ca, '[data-cancel-hz]');
    const ms = q<HTMLInputElement>(ca, '[data-cancel-ms]');
    const draw = () => {
      [hz, ms].forEach(fillRange);
      const f = Number(hz.value);
      const d = Number(ms.value);
      q(ca, '[data-cancel-hz-out]').textContent = String(f);
      q(ca, '[data-cancel-ms-out]').textContent = fmt(d, 2);
      q(ca, '[data-cancel-g]').innerHTML = wavesSvg(f, d);
      const s = left(f, d);
      q(ca, '[data-cancel-status]').textContent = `A ${f} hertz noise with a copy ${fmt(d, 2)} milliseconds late leaves ${fmt(s * 100)}% of the noise, which is ${s < 1e-3 ? 'silence' : change(s)}.${s > 1 ? ' The copy is so late that it makes the noise worse.' : ''}`;
    };
    [hz, ms].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Part 2: a small delay and the pitch of the noise
  const de = root.querySelector<HTMLElement>('[data-delay-tool]');
  if (de) {
    const range = q<HTMLInputElement>(de, '[data-delay-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(de, '[data-delay-out]').textContent = fmt(d, 2);
      q(de, '[data-delay-g]').innerHTML = graphSvg(d);
      const flip = 1 / (6 * (d / 1000));
      q(de, '[data-delay-status]').textContent = `With a delay of ${fmt(d, 2)} milliseconds, the copy helps up to about ${fmt(flip)} hertz. Above that it is mostly worse, and comes and goes at pitches where the delay is a whole number of periods. At 100 hertz it is ${change(left(100, d))}, and at 1000 hertz ${change(left(1000, d))}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Part 3: how exact the timing must be
  const ex = root.querySelector<HTMLElement>('[data-exact-tool]');
  if (ex) {
    let hz = 1000;
    const range = q<HTMLInputElement>(ex, '[data-exact-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(ex, '[data-exact-out]').textContent = fmt(d, 1);
      const s = leftFromPhase(d);
      q(ex, '[data-exact-status]').textContent = `A phase error of ${fmt(d, 1)} degrees leaves ${fmt(s * 100, 1)}% of the noise, which is ${s < 1e-3 ? 'silence' : change(s)}. At ${fmt(hz)} hertz it takes ${fmt(micro(d, hz), hz >= 1000 ? 1 : 0)} millionths of a second.`;
    };
    picks(q(ex, '[data-exact-picks]'), ['100 Hz', '500 Hz', '1000 Hz', '2000 Hz'], '1000 Hz', (v) => {
      hz = Number(v.replace(' Hz', ''));
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }
}
